package com.comp301.ecommerce.dao;

import com.comp301.ecommerce.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin("htpp://localhost:4200")
@RepositoryRestResource
public interface StateRepository extends JpaRepository<State, Integer> {List<State> findByCountryCode(@Param("code") String code);
}