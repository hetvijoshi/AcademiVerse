package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.request.QuizSaveRequest;
import com.academiverse.academiverse_api.dto.request.QuizSubmitRequest;
import com.academiverse.academiverse_api.dto.request.QuizUpdateRequest;
import com.academiverse.academiverse_api.dto.request.SubmitQuestion;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.dto.response.OpenAIResponse;
import com.academiverse.academiverse_api.dto.response.QuizResponse;
import com.academiverse.academiverse_api.dto.response.QuizSubmitResponse;
import com.academiverse.academiverse_api.model.*;
import com.academiverse.academiverse_api.repository.*;
import com.academiverse.academiverse_api.util.TextExtract;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizService {
    private final QuizRepository  quizRepository;
    private final QuestionRepository questionRepository;
    private final InstructRepository instructRepository;
    private final GradeRepository gradeRepository;
    private final EnrolmentRepository enrolmentRepository;

    public BaseResponse<List<Quiz>> getProfQuizzes(long instructId){
        BaseResponse<List<Quiz>> res = new BaseResponse<>();
        List<Quiz> quizList = quizRepository.findByInstructInstructId(instructId);

        res.data = quizList;
        res.message = "List of all quizzes.";
        res.isError = false;
        return res;
    }

    public BaseResponse<List<QuizResponse>> getQuizzes(long instructId, long userId){
        BaseResponse<List<QuizResponse>> res = new BaseResponse<>();
        List<Quiz> quizList = quizRepository.findByInstructInstructId(instructId);
        List<Long> submittedQuizzes = gradeRepository.findByUserIdAndQuizIn(userId, quizList)
                .stream()
                .map((g)-> g.getQuiz().getQuizId())
                .toList();

        res.data = quizList.stream().map((q)-> {
           QuizResponse response = new QuizResponse();
           response.quiz = q;
           response.submitted = submittedQuizzes.contains(q.getQuizId());
           return response;
        }).toList();

        res.message = "List of all quizzes.";
        res.isError = false;
        return res;
    }

    public BaseResponse<Quiz> getQuiz(long quizId){
        Optional<Quiz> quiz = quizRepository.findById(quizId);
        if(quiz.isPresent()){
            BaseResponse<Quiz> response = new BaseResponse<>();
            response.data = quiz.get();
            response.message = "Detail of quiz.";
            response.isError = false;
            return response;
        }else{
            BaseResponse<Quiz> response = new BaseResponse<>();
            response.data = null;
            response.message = "Quiz not found.";
            response.isError = true;
            return response;
        }
    }

    public BaseResponse<List<Question>> getStudentQuestions(long quizId){
        Optional<Quiz> quiz = quizRepository.findById(quizId);
        if(quiz.isPresent()){
            List<Question> questions = questionRepository.findByQuizQuizId(quizId);
            BaseResponse<List<Question>> response = new BaseResponse<>();
            questions.forEach((q)->{
                q.setAnswer(null);
            });
            response.data = questions;
            response.message = "Quiz questions.";
            response.isError = false;
            return response;
        }else{
            BaseResponse<List<Question>> response = new BaseResponse<>();
            response.data = null;
            response.message = "Quiz not found.";
            response.isError = true;
            return response;
        }
    }

    public BaseResponse<List<Question>> getQuestions(long quizId){
        Optional<Quiz> quiz = quizRepository.findById(quizId);
        if(quiz.isPresent()){
            List<Question> questions = questionRepository.findByQuizQuizId(quizId);
            BaseResponse<List<Question>> response = new BaseResponse<>();
            response.data = questions;
            response.message = "Quiz questions.";
            response.isError = false;
            return response;
        }else{
            BaseResponse<List<Question>> response = new BaseResponse<>();
            response.data = null;
            response.message = "Quiz not found.";
            response.isError = true;
            return response;
        }
    }

    public BaseResponse<Quiz> saveQuiz(QuizSaveRequest quizSaveRequest){
        Optional<Instruct> instruct = instructRepository.findById(quizSaveRequest.instructId);
        if(instruct.isPresent()){
            //Save quiz detail
            Quiz q = new Quiz();
            q.setInstruct(instruct.get());
            q.setQuizName(quizSaveRequest.quizName);
            q.setQuizDescription(quizSaveRequest.quizDescription);
            q.setQuizWeightage(quizSaveRequest.quizWeightage);
            q.setQuizDescription(quizSaveRequest.quizDescription);
            q.setActive(quizSaveRequest.isActive);
            q.setQuizDueDate(quizSaveRequest.quizDueDate);
            q.setTotalMarks(quizSaveRequest.totalMarks);
            q.setCreatedAt(LocalDateTime.now());
            q.setUpdatedAt(LocalDateTime.now());
            q.setCreatedBy(quizSaveRequest.createdBy);
            q.setUpdatedBy(quizSaveRequest.updatedBy);
            Quiz savedQuiz = quizRepository.save(q);

            //Save question detail
            List<Question> questionList = new ArrayList<>();
            quizSaveRequest.questions.forEach((question) -> {
                Question que = new Question();
                que.setQuiz(savedQuiz);
                que.setQuizQuestionText(question.questionText);
                que.setQOptions(new ArrayList<>());
                que.setMarks((float) quizSaveRequest.totalMarks /quizSaveRequest.questions.size());
                question.options.forEach((option) -> {
                    QOption op = new QOption();
                    op.setQuestion(que);
                    op.setOptionText(option);
                    op.setCreatedAt(LocalDateTime.now());
                    op.setUpdatedAt(LocalDateTime.now());
                    op.setCreatedBy(quizSaveRequest.createdBy);
                    op.setUpdatedBy(quizSaveRequest.createdBy);
                    que.getQOptions().add(op);
                    if(option.equals(question.answer)){
                        que.setAnswer(op);
                    }
                });
                que.setCreatedBy(quizSaveRequest.createdBy);
                que.setUpdatedBy(quizSaveRequest.createdBy);
                que.setCreatedAt(LocalDateTime.now());
                que.setUpdatedAt(LocalDateTime.now());
                questionList.add(que);
            });
            List<Question> savedQuestionList = questionRepository.saveAll(questionList);

            BaseResponse<Quiz> response = new BaseResponse<>();
            response.data = q;
            response.message = "Quiz saved successfully.";
            response.isError = false;
            return response;
        }else{
            BaseResponse<Quiz> response = new BaseResponse<>();
            response.data = null;
            response.message = "Instruct not found.";
            response.isError = true;
            return response;
        }
    }

    public BaseResponse<Quiz> updateQuiz(QuizUpdateRequest quizUpdateRequest){
        Optional<Quiz> quiz = quizRepository.findById(quizUpdateRequest.quizId);
        if(quiz.isPresent()){
            //Save quiz detail
            Quiz q = quiz.get();
            q.setInstruct(q.getInstruct());
            q.setQuizName(quizUpdateRequest.quizName);
            q.setQuizDescription(quizUpdateRequest.quizDescription);
            q.setQuizWeightage(quizUpdateRequest.quizWeightage);
            q.setQuizDescription(quizUpdateRequest.quizDescription);
            q.setActive(quizUpdateRequest.isActive);
            q.setQuizDueDate(quizUpdateRequest.quizDueDate);
            q.setTotalMarks(quizUpdateRequest.totalMarks);
            q.setCreatedAt(q.getCreatedAt());
            q.setUpdatedAt(LocalDateTime.now());
            q.setCreatedBy(q.getCreatedBy());
            q.setUpdatedBy(quizUpdateRequest.updatedBy);
            Quiz savedQuiz = quizRepository.save(q);

            //Save question detail
            questionRepository.deleteByQuizQuizId(quizUpdateRequest.quizId);
            List<Question> questionList = new ArrayList<>();
            quizUpdateRequest.questions.forEach((question) -> {
                Question que = new Question();
                que.setQuiz(savedQuiz);
                que.setQuizQuestionText(question.questionText);
                que.setMarks((float) quizUpdateRequest.totalMarks /quizUpdateRequest.questions.size());
                que.setQOptions(new ArrayList<>());
                question.options.forEach((option) -> {
                    QOption op = new QOption();
                    op.setQuestion(que);
                    op.setOptionText(option);
                    op.setCreatedAt(LocalDateTime.now());
                    op.setUpdatedAt(LocalDateTime.now());
                    op.setCreatedBy(quizUpdateRequest.updatedBy);
                    op.setUpdatedBy(quizUpdateRequest.updatedBy);
                    que.getQOptions().add(op);
                    if(option.equals(question.answer)){
                        que.setAnswer(op);
                    }
                });
                que.setCreatedBy(quizUpdateRequest.updatedBy);
                que.setUpdatedBy(quizUpdateRequest.updatedBy);
                que.setCreatedAt(LocalDateTime.now());
                que.setUpdatedAt(LocalDateTime.now());
                questionList.add(que);
            });
            List<Question> savedQuestionList = questionRepository.saveAll(questionList);

            BaseResponse<Quiz> response = new BaseResponse<>();
            response.data = q;
            response.message = "Quiz saved successfully.";
            response.isError = false;
            return response;
        }else{
            BaseResponse<Quiz> response = new BaseResponse<>();
            response.data = null;
            response.message = "Quiz not found.";
            response.isError = true;
            return response;
        }
    }

    public BaseResponse<Quiz> inactiveQuiz(long quizId){
        Optional<Quiz> quiz = quizRepository.findById(quizId);
        if(quiz.isPresent()){
            Quiz q = quiz.get();
            q.setActive(!q.isActive());
            Quiz savedQuiz = quizRepository.save(q);

            BaseResponse<Quiz> response = new BaseResponse<>();
            response.data = savedQuiz;
            response.message = "Quiz saved successfully.";
            response.isError = false;
            return response;
        }else{
            BaseResponse<Quiz> response = new BaseResponse<>();
            response.data = null;
            response.message = "Quiz not found.";
            response.isError = true;
            return response;
        }
    }

    public BaseResponse deleteQuiz(long quizId){
        Optional<Quiz> quiz = quizRepository.findById(quizId);
        if(quiz.isPresent()){
            Optional<List<Grade>> grades = gradeRepository.findByQuizQuizId(quizId);
            if(grades.get().size() > 0){
                BaseResponse<Quiz> response = new BaseResponse<>();
                response.data = null;
                response.message = "Quiz can not be deleted as it is already been taken by 1 or more students.";
                response.isError = true;
                return response;
            }else{
                questionRepository.deleteByQuizQuizId(quizId);
                quizRepository.delete(quiz.get());
                BaseResponse<Quiz> response = new BaseResponse<>();
                response.data = null;
                response.message = "Quiz deleted successfully.";
                response.isError = false;
                return response;
            }

        }else{
            BaseResponse<Quiz> response = new BaseResponse<>();
            response.data = null;
            response.message = "Quiz not found.";
            response.isError = true;
            return response;
        }
    }

    public BaseResponse<QuizSubmitResponse> submitQuiz(QuizSubmitRequest quizSubmitRequest){
        Optional<Quiz> q = quizRepository.findById(quizSubmitRequest.quizId);
        if(q.isPresent()){

            Optional<Enrolment> el = enrolmentRepository.findByInstructInstructIdAndUserUserIdAndIsActive(q.get().getInstruct().getInstructId(), quizSubmitRequest.userId, true);
            if(!el.isPresent()){
                BaseResponse<QuizSubmitResponse> response = new BaseResponse<>();
                response.data = null;
                response.message = MessageFormat.format("You are not enrolled in {0}.", q.get().getInstruct().getCourse().getCourseCode());
                response.isError = true;
                return response;
            }

            Optional<Grade> eg = gradeRepository.findByQuizQuizIdAndUserId(quizSubmitRequest.quizId, quizSubmitRequest.userId);
            if(!eg.isPresent()){
                List<Question> questions = questionRepository.findByQuizQuizId(quizSubmitRequest.quizId);
                QuizSubmitResponse quizSubmitResponse = new QuizSubmitResponse();
                quizSubmitResponse.incorrect = 0;
                quizSubmitResponse.unattended = 0;
                quizSubmitResponse.totalMarks = q.get().getTotalMarks();
                quizSubmitResponse.obtainedMarks = 0;
                questions.forEach((question)->{
                    Optional<SubmitQuestion> sq = quizSubmitRequest.submission.stream().filter((s)-> s.questionId == question.getQuestionId()).findFirst();
                    if(sq.isPresent()){
                        if(sq.get().optionId == question.getAnswer().getOptionId()){
                            quizSubmitResponse.obtainedMarks = (int) (quizSubmitResponse.obtainedMarks + question.getMarks());
                        }else{
                            quizSubmitResponse.incorrect++;
                        }
                    }else{
                        quizSubmitResponse.unattended++;
                    }
                });

                //Insert into grades table
                Grade g = new Grade();
                g.setGradeTitle(q.get().getQuizName());
                g.setObtainedMarks(quizSubmitResponse.obtainedMarks);
                g.setTotalMarks(quizSubmitResponse.totalMarks);
                g.setUserId(quizSubmitRequest.userId);
                g.setQuiz(q.get());
                g.setCreatedBy(quizSubmitRequest.userId);
                g.setUpdatedBy(quizSubmitRequest.userId);
                g.setCreatedAt(LocalDateTime.now());
                g.setUpdatedAt(LocalDateTime.now());
                Grade sg = gradeRepository.save(g);

                BaseResponse<QuizSubmitResponse> response = new BaseResponse<>();
                response.data = quizSubmitResponse;
                response.message = "Quiz submitted successfully.";
                response.isError = false;
                return response;
            }else{
                BaseResponse<QuizSubmitResponse> response = new BaseResponse<>();
                response.data = null;
                response.message = "Quiz already submitted.";
                response.isError = true;
                return response;
            }
        }else{
            BaseResponse<QuizSubmitResponse> response = new BaseResponse<>();
            response.data = null;
            response.message = "Quiz not found.";
            response.isError = true;
            return response;
        }
    }

    public BaseResponse<List<com.academiverse.academiverse_api.dto.request.Question>> generateQuiz(MultipartFile quizFile, QuizSaveRequest quizSaveRequest) throws IOException {
        String extractedText = TextExtract.extractTextFromPDF(quizFile.getInputStream());
        extractedText = extractedText.replaceAll("\\s+", " ").trim();

        String apiUrl = "https://api.openai.com/v1/chat/completions";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer ");

        String prompt = "Using provided text, extract questions, options, and answers from the following text and format them as JSON objects: [{'questionText': '', 'options': ['', '', '', ''], 'answer': ''}]. " +
                "Text:" + extractedText + ". Also make sure the json is valid. No special characters like ), (, ' or any such string which will make parsing json invalid.";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4");
        requestBody.put("messages", Collections.singletonList(
                Map.of("role", "user", "content", prompt)
        ));
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonRequest = objectMapper.writeValueAsString(requestBody);

        HttpEntity<String> request = new HttpEntity<>(jsonRequest, headers);

        String response = restTemplate.postForEntity(apiUrl, request, String.class).getBody();
        response = response.replaceAll("\\s+", " ").trim();



        //Extract JSON from response, generate Question array and assign it to quizSaveRequest.questions
        objectMapper = new ObjectMapper();
        OpenAIResponse formattedResponse = objectMapper.readValue(response, OpenAIResponse.class);
        String formattedQuestions = formattedResponse.choices.get(0).message.content;
        formattedQuestions = formattedQuestions.replaceAll("\\s+", " ").trim();
        formattedQuestions = formattedQuestions.replaceAll("'", "\"");

        objectMapper = new ObjectMapper();
        List<com.academiverse.academiverse_api.dto.request.Question> questions = objectMapper.readValue(formattedQuestions, new TypeReference<>() {});

        BaseResponse<List<com.academiverse.academiverse_api.dto.request.Question>> res = new BaseResponse<>();
        res.isError=false;
        res.data = questions;
        res.message = "Questions extracted successfully.";
        return res;
    }
}
