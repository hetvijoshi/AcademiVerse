package com.academiverse.academiverse_api.util;

public enum UserRole {
    ADMIN("admin"),
    STUDENT("student"),
    PROFESSOR("professor");

    private String role;

    UserRole(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }
}
