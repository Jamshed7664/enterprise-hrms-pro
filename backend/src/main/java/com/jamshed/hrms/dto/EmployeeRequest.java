package com.jamshed.hrms.dto;
import jakarta.validation.constraints.*; import java.time.LocalDate;
public record EmployeeRequest(@NotBlank String employeeCode,@NotBlank String firstName,@NotBlank String lastName,@Email @NotBlank String email,String phone,String jobTitle,String location,LocalDate joinDate,Long departmentId,String status,String gender,LocalDate dateOfBirth,String address,String managerName){}
