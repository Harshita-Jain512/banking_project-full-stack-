package com.example.banking.service;

import java.util.List;

import com.example.banking.dto.AccountDto;
import com.example.banking.entity.Account;


public interface AccountService {

    AccountDto creatAccount(AccountDto accountDto); //add account creation method

    // get account by id method can be added here
    AccountDto getAcountById(Long id);

    // deposite method can be added here
    AccountDto deposit(Long id, double amount);

    // withdraw method can be added here
    AccountDto withdraw(Long id, double amount);

    //get list of all accounts
    List<AccountDto> getAllAccounts();
}
