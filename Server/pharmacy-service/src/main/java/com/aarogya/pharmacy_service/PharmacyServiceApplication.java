package com.aarogya.pharmacy_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class PharmacyServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PharmacyServiceApplication.class, args);
	}

}
