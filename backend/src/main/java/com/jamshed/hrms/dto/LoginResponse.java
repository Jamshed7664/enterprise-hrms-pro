package com.jamshed.hrms.dto;
public record LoginResponse(String token,String email,String role,Long employeeId,String name){}
