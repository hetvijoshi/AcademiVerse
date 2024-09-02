package com.academiverse.academiverse_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class AcademiverseApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(AcademiverseApiApplication.class, args);
	}

}
