package com.example.banking.entity;

import org.springframework.context.annotation.EnableAspectJAutoProxy;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter // getter method ko lombok se generate karne ke liye
@Setter // Lombok annotations to generate boilerplate code
@NoArgsConstructor // Lombok annotations to generate boilerplate code
@AllArgsConstructor // Lombok annotations to generate boilerplate code
@Table(name = "accounts") // Map this entity to the "accounts" table in the database
@Entity // Indicate that this class is a JPA entity
public class Account {
    @Id   // Primary key of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generate the ID value
    private Long id;

    @Column(name = "account_holder_name")
    private String accountHolderName;
    private Double balance;
} 