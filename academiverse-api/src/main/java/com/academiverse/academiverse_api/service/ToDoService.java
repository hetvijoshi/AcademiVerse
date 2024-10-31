package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.model.Enrolment;
import com.academiverse.academiverse_api.model.Instruct;
import com.academiverse.academiverse_api.model.ToDo;
import com.academiverse.academiverse_api.model.User;
import com.academiverse.academiverse_api.repository.EnrolmentRepository;
import com.academiverse.academiverse_api.repository.InstructRepository;
import com.academiverse.academiverse_api.repository.ToDoRepository;
import com.academiverse.academiverse_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ToDoService {
    private final EnrolmentRepository enrolmentRepository;
    private final InstructRepository instructRepository;
    private final UserRepository userRepository;
    private final ToDoRepository toDoRepository;

    public BaseResponse<List<ToDo>> getUserToDosByInstruct(Long instructId, Long userId){
        Optional<Instruct> instruct = instructRepository.findById(instructId);
        Optional<User> user = userRepository.findById(userId);

        if(user.isPresent() && instruct.isPresent()){
            List<ToDo> toDoList = toDoRepository.findByInstructInstructIdAndUserUserIdAndIsComplete(instructId,userId, false);
            BaseResponse<List<ToDo>> res = new BaseResponse<>();
            res.data=toDoList;
            res.isError=false;
            res.message = "Todos retrieved successfully.";
            return res;
        }else{
            BaseResponse<List<ToDo>> res = new BaseResponse<>();
            res.data=null;
            res.isError=true;
            res.message = "User or instruct not found.";
            return res;
        }

    }

    public BaseResponse markAsDone(Long todoId){
        Optional<ToDo> todo = toDoRepository.findById(todoId);
        if(todo.isPresent()){
            ToDo td = todo.get();
            td.setComplete(true);
            td.setUpdatedBy(td.getCreatedBy());
            td.setUpdatedAt(LocalDateTime.now());
            td = toDoRepository.save(td);

            BaseResponse res = new BaseResponse<>();
            res.data=null;
            res.isError=false;
            res.message = "Todo marked done.";
            return res;
        }else{
            BaseResponse res = new BaseResponse<>();
            res.data=null;
            res.isError=true;
            res.message = "Todo not found.";
            return res;
        }
    }

    public BaseResponse<List<ToDo>> generateToDoForInstruct(Long instructId, String title, LocalDateTime dueDate){
        Optional<Instruct> instruct = instructRepository.findById(instructId);
        if(instruct.isPresent()){
            List<Enrolment> enrolments = enrolmentRepository.findByInstructInstructId(instructId);
            List<ToDo> toDoList = new ArrayList<>();
            enrolments.forEach((e)->{
                ToDo td = new ToDo();
                td.setInstruct(instruct.get());
                td.setToDoTitle(title);
                td.setComplete(false);
                td.setUser(e.getUser());
                td.setToDoDueDate(dueDate);
                td.setCreatedAt(LocalDateTime.now());
                td.setUpdatedAt(LocalDateTime.now());
                td.setCreatedBy((long) -1);
                td.setUpdatedBy((long) -1);
                toDoList.add(td);
            });

            List<ToDo> resList = toDoRepository.saveAll(toDoList);

            BaseResponse<List<ToDo>> res = new BaseResponse<>();
            res.isError = false;
            res.data = resList;
            res.message = "Todos generated successfully.";
            return res;
        }else{
            BaseResponse<List<ToDo>> res = new BaseResponse<>();
            res.isError = true;
            res.data = null;
            res.message = "Instruct not found.";
            return res;
        }
    }
}
