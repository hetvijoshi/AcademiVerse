package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.service.ToDoService;
import com.academiverse.academiverse_api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/todo")
@RequiredArgsConstructor
@Validated
public class ToDoController {
    private final ToDoService toDoService;
    @GetMapping("/{instructId}")
    public ResponseEntity<BaseResponse> getTodosByInstructUserId(@PathVariable Long instructId, @RequestParam Long userId){
        return ResponseEntity.ok().body(toDoService.getUserToDosByInstruct(instructId, userId));
    }

    @PostMapping("/{todoId}")
    public ResponseEntity<BaseResponse> markComplete(@PathVariable Long todoId){
        return ResponseEntity.ok().body(toDoService.markAsDone(todoId));
    }

}
