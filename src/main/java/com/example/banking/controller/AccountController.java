package com.example.banking.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.banking.dto.AccountDto;
import com.example.banking.service.AccountService;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private AccountService accountService;


    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    //Add account creation endpoint here
    @PostMapping
    public ResponseEntity<AccountDto> addAccount(@RequestBody AccountDto accountDto) {
        return new ResponseEntity<>(accountService.creatAccount(accountDto), HttpStatus.CREATED);
    }   

    //Add get account by id endpoint here
    @GetMapping("/{id}")
    public ResponseEntity<AccountDto> getAccountById(@PathVariable Long id) {
        AccountDto accountDto = accountService.getAcountById(id);
        return ResponseEntity.ok(accountDto);
    }

    //add deposit endpoint here

    @PutMapping("/{id}/deposit")
    public ResponseEntity<AccountDto> deposite(@PathVariable Long id , @RequestBody Map<String, Double> request){
        double ammount = request.get("ammount");
        AccountDto accountDto = accountService.deposit(id, ammount);
        return ResponseEntity.ok(accountDto);
    }

    //add withdraw endpoint here
    @PutMapping("/{id}/withdraw")
    public ResponseEntity<AccountDto> withdraw(@PathVariable Long id, @RequestBody Map<String, Double> request){
        double ammount = request.get("ammount");
        AccountDto accountDto = accountService.withdraw(id, ammount);
        return ResponseEntity.ok(accountDto);
    }   

    //get list of all accounts
    @GetMapping("/getAll")
    public ResponseEntity<java.util.List<AccountDto>> getAllAccounts() {
        java.util.List<AccountDto> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }   


}
