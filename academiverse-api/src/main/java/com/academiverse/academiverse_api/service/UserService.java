package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.request.UserSaveRequest;
import com.academiverse.academiverse_api.dto.request.UserUpdateRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.model.Degree;
import com.academiverse.academiverse_api.model.Department;
import com.academiverse.academiverse_api.repository.DegreeRepository;
import com.academiverse.academiverse_api.repository.DepartmentRepository;
import com.academiverse.academiverse_api.repository.UserRepository;
import com.academiverse.academiverse_api.util.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.academiverse.academiverse_api.model.User;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DegreeRepository degreeRepository;

    public BaseResponse<List<User>> getAllUsers(){
        List<User> userList = userRepository.findAll();
        BaseResponse<List<User>> response = new BaseResponse<>();
        response.data = userList;
        response.message = "List of all users.";
        response.isError = false;
        return response;
    }

    public BaseResponse<User> getUserById(Long id){
        Optional<User> optionalUser = userRepository.findById(id);
        BaseResponse<User> response = new BaseResponse<>();
        if(optionalUser.isPresent()){
            response.data = optionalUser.get();
            response.message = "List of all users.";
            response.isError = false;
        }else{
            response.data = null;
            response.message = MessageFormat.format("User with id {0} not found.",id);
            response.isError = true;
        }
        return response;
    }

    public BaseResponse<User> getUserByEmail(String email){
        User user = userRepository.findByUserEmail(email);
        BaseResponse<User> response = new BaseResponse<>();
        if(user != null){
            response.data = user;
            response.message = "List of all users.";
            response.isError = false;
        }else{
            response.data = null;
            response.message = MessageFormat.format("User with email {0} not found.",email);
            response.isError = true;
        }
        return response;
    }

    public BaseResponse<User> saveUser (UserSaveRequest UserRequest){
        Optional<Department> department = departmentRepository.findByDepartmentCode(UserRequest.departmentCode);
        if(department.isPresent()){
            User u = new User();
            u.setName(UserRequest.name);
            u.setUserEmail(UserRequest.userEmail);
            u.setRole(getRole(UserRequest.role));
            u.setCreatedAt(LocalDateTime.now());
            u.setUpdatedAt(LocalDateTime.now());
            u.setUpdatedBy(UserRequest.updatedBy);
            u.setCreatedBy(UserRequest.createdBy);
            u.setDepartment(department.get());
            Optional<Degree> degree = degreeRepository.findByDegreeName(UserRequest.degreeName);
            if(degree.isPresent()){
                u.setDegree(degree.get());
            }
            User savedUser = userRepository.save(u);
            log.info("User with id: {0} saved successfully", savedUser.getUserId());
            BaseResponse<User> response = new BaseResponse<>();
            response.data = savedUser;
            response.isError = false;
            response.message = MessageFormat.format("User with id: {0} saved successfully", savedUser.getUserId());
            return response;
        }else{
            BaseResponse<User> response = new BaseResponse<>();
            response.data = null;
            response.isError = true;
            response.message = MessageFormat.format("Department: {0} or Degree code: {1} does not exist.", UserRequest.departmentCode, UserRequest.degreeName);
            return response;
        }


    }

    public BaseResponse<User> updateUser (UserUpdateRequest userRequest) {
        Optional<User> existingUser = userRepository.findById(userRequest.id);
        if(existingUser.isPresent()){
            Optional<Department> department = departmentRepository.findById(userRequest.departmentId);
            Optional<Degree> degree = degreeRepository.findById(userRequest.degreeId);
            if(department.isPresent() && degree.isPresent()){
                User u = existingUser.get();
                u.setName(userRequest.name);
                u.setUserEmail(userRequest.userEmail);
                u.setRole(u.getRole());
                u.setCreatedAt(u.getCreatedAt());
                u.setUpdatedAt(LocalDateTime.now());
                u.setUpdatedBy(userRequest.updatedBy);
                u.setCreatedBy(u.getCreatedBy());
                u.setDepartment(department.get());
                u.setDegree(degree.get());
                User savedUser = userRepository.save(u);

                BaseResponse<User> response = new BaseResponse<>();
                response.data = savedUser;
                response.isError = false;
                response.message = MessageFormat.format("User with id: {0} updated successfully", savedUser.getUserId());
                return response;
            }else{
                BaseResponse<User> response = new BaseResponse<>();
                response.data = null;
                response.isError = true;
                response.message = MessageFormat.format("Department: {0} or degree: {1} does not exist.", userRequest.departmentId, userRequest.degreeId);
                return response;
            }
        }else{
            BaseResponse<User> response = new BaseResponse<>();
            response.data = null;
            response.isError = true;
            response.message = MessageFormat.format("User with id {0} does not exist.", userRequest.id);
            return response;
        }
    }

    public BaseResponse deleteUserById (Long id) {
        Optional<User> existingUser = userRepository.findById(id);
        BaseResponse response = new BaseResponse<>();
        response.data = null;
        if(existingUser.isPresent()){
            userRepository.deleteById(id);
            response.isError = false;
            response.message = MessageFormat.format("User with id {0} is deleted.", id);
        }else{
            response.isError = true;
            response.message = MessageFormat.format("User with id {0} not found.", id);
        }
        return response;
    }

    private String getRole(String role){
        if(role.toLowerCase().equals(UserRole.PROFESSOR.getRole())){
            return UserRole.PROFESSOR.getRole();
        } else if (role.toLowerCase().equals(UserRole.ADMIN.getRole())) {
            return UserRole.ADMIN.getRole();
        } else if (role.toLowerCase().equals(UserRole.STUDENT.getRole())) {
            return UserRole.STUDENT.getRole();
        }else{
            return null;
        }
    }
}
