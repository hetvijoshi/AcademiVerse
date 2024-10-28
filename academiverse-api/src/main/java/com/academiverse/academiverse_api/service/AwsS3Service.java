package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.response.BaseResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;


@Service
@Slf4j
public class AwsS3Service {

    private final S3Client s3Client;

    @Value("${s3.bucket.name}")
    private String bucketName;

    public AwsS3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public BaseResponse<String> uploadFile(MultipartFile file) {
        try{
            String key = file.getOriginalFilename();

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl("public-read")
                    .build();

            s3Client.putObject(putObjectRequest, software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes()));
            BaseResponse<String> response = new BaseResponse<>();
            response.data = String.format("https://%s.s3.amazonaws.com/%s", bucketName, key);
            response.message = "Image returned successfully";
            response.isError = false;
            return response;
        }
        catch(IOException e){
            BaseResponse<String> response = new BaseResponse<>();
            response.data = String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR);
            response.message = "File upload failed";
            response.isError = true;
            return response;
        }

    }
}
