package com.academiverse.academiverse_api.dto.response;

public class BaseResponse<T> {
    public boolean isError;
    public String message;
    public T data;
}