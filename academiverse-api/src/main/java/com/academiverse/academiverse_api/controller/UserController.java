package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.request.UserSaveRequest;
import com.academiverse.academiverse_api.dto.request.UserUpdateRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.academiverse.academiverse_api.service.UserService;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Validated
public class UserController {
    private final UserService userService;

    @GetMapping("")
    public ResponseEntity<BaseResponse> getAllUsers(){
        return ResponseEntity.ok().body(userService.getAllUsers());
    }

    @GetMapping("/")
    public ResponseEntity<BaseResponse> getUserByEmail(@RequestParam String email){
        return ResponseEntity.ok().body(userService.getUserByEmail(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getUserById(@PathVariable Long id)
    {
        return ResponseEntity.ok().body(userService.getUserById(id));
    }

    @PostMapping("/")
    public ResponseEntity<BaseResponse> saveUser(@RequestBody UserSaveRequest user)
    {
        return ResponseEntity.ok().body(userService.saveUser(user));
    }

    @PutMapping("/")
    public ResponseEntity<BaseResponse> updateUser(@RequestBody UserUpdateRequest user)
    {
        return ResponseEntity.ok().body(userService.updateUser(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse> deleteUserById(@PathVariable Long id)
    {
        return ResponseEntity.ok().body(userService.deleteUserById(id));
    }
}
