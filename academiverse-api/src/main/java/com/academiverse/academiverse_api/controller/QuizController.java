package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.request.QuizSaveRequest;
import com.academiverse.academiverse_api.dto.request.QuizSubmitRequest;
import com.academiverse.academiverse_api.dto.request.QuizUpdateRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/quiz")
@RequiredArgsConstructor
@Validated
public class QuizController {
    private final QuizService quizService;

    @GetMapping("/{instructId}")
    public ResponseEntity<BaseResponse> getQuizzes(@PathVariable Long instructId, @RequestParam Long userId){
        return ResponseEntity.ok().body(quizService.getQuizzes(instructId, userId));
    }

    @GetMapping("/questions/{quizId}")
    public ResponseEntity<BaseResponse> getQuestions(@PathVariable Long quizId){
        return ResponseEntity.ok().body(quizService.getQuestions(quizId));
    }

    @GetMapping("/stuquestions/{quizId}")
    public ResponseEntity<BaseResponse> getStudentQuestions(@PathVariable Long quizId){
        return ResponseEntity.ok().body(quizService.getStudentQuestions(quizId));
    }

    @PostMapping("/")
    public ResponseEntity<BaseResponse> saveQuiz(@RequestBody QuizSaveRequest quizSaveRequest){
        return ResponseEntity.ok().body(quizService.saveQuiz(quizSaveRequest));
    }

    @PostMapping("/active/{quizId}")
    public ResponseEntity<BaseResponse> inactiveQuiz(@PathVariable long quizId){
        return ResponseEntity.ok().body(quizService.inactiveQuiz(quizId));
    }

    @PutMapping("/")
    public ResponseEntity<BaseResponse> updateQuiz(@RequestBody QuizUpdateRequest quizUpdateRequest){
        return ResponseEntity.ok().body(quizService.updateQuiz(quizUpdateRequest));
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<BaseResponse> deleteQuiz(@PathVariable Long quizId){
        return ResponseEntity.ok().body(quizService.deleteQuiz(quizId));
    }

    @PostMapping("/submit")
    public ResponseEntity<BaseResponse> submitQuiz(@RequestBody QuizSubmitRequest quizSubmitRequest){
        return ResponseEntity.ok().body(quizService.submitQuiz(quizSubmitRequest));
    }
}
