import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country [] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService) { }

  ngOnInit(): void {
    // ... (existing code)

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  // ... (existing methods)

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      const shippingAddressValue = this.checkoutFormGroup.controls['shippingAddress'].value;
      this.checkoutFormGroup.controls['billingAddress'].setValue(shippingAddressValue);

      this.billingAddressStates = this.shippingAddressStates;
    } 
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log("Handling the submit button");

    const customerValue = this.checkoutFormGroup.get('customer')?.value;
    if (customerValue) {
      console.log(customerValue);
      console.log("The email address is " + customerValue.email);

      console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
      console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
    }

    // Call the handleMonthsAndYears function
    this.handleMonthsAndYears();
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current year equals the selected year, then start with the current month
    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );
  }

  getStates (FormGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(FormGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${FormGroupName} country code: ${countryCode}`);
    console.log(`${FormGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {

        if (FormGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }
}
