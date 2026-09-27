package com.example.banking.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.banking.dto.AccountDto;
import com.example.banking.entity.Account;
import com.example.banking.mapper.AccountMapper;
import com.example.banking.repository.AccountRepository;
import com.example.banking.service.AccountService;

@Service // Indicate that this class is a service component in Spring
public class AccountServiceImpl implements AccountService {

    private AccountRepository accountRepository; // Repository for account data access
    // Constructor-based dependency injection
    @Autowired
    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public AccountDto creatAccount(AccountDto accountDto) {
        // Implementation logic to create an account
        Account account = AccountMapper.mapToAccount(accountDto);
        Account savedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public AccountDto getAcountById(Long id) {
        // Implementation logic to get an account by ID
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return AccountMapper.mapToAccountDto(account);
    } 

    @Override
    public AccountDto deposit(Long id, double amount) {
        // Implementation logic to deposit amount into an account
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        double total = account.getBalance() + amount;
        account.setBalance(total);
        Account updatedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(updatedAccount);
    }
  
    @Override
    public AccountDto withdraw(Long id, double amount) {
        // Implementation logic to withdraw amount from an account
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }
        double total = account.getBalance() - amount;
        account.setBalance(total);
        Account updatedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(updatedAccount);
    }

    //get list of all accounts
    @Override
    public List<AccountDto> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        return accounts.stream()
                .map(AccountMapper::mapToAccountDto)
                .toList();
    }
}
