package com.comp301.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name ="state")
@Data
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="id")
    private int id;
    // host
    @Column(name ="name")
    private String name;

    @ManyToOne
    @JoinColumn(name ="country_id")
    private Country country;
}