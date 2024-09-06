package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {

}
