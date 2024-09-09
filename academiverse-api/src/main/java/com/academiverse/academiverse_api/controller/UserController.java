package com.academiverse.academiverse_api.controller;

import lombok.RequiredArgsConstructor;
import com.academiverse.academiverse_api.dto.User;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.academiverse.academiverse_api.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Validated
public class UserController {
    private final UserService userService;

    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok().body(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id)
    {
        return ResponseEntity.ok().body(userService.getUserById(id));
    }

    @PostMapping("/")
    public ResponseEntity<User> saveUser(@RequestBody User user)
    {
        return ResponseEntity.ok().body(userService.saveUser(user));
    }

    @PutMapping("/")
    public ResponseEntity<User> updateUser(@RequestBody User user)
    {
        return ResponseEntity.ok().body(userService.updateUser(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserById(@PathVariable String id)
    {
        userService.deleteUserById(id);
        return ResponseEntity.ok().body("Deleted employee successfully");
    }
}
