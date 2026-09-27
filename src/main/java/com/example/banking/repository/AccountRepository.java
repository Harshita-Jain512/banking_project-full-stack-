package com.example.banking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.banking.entity.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {
    
}
