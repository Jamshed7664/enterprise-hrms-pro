package com.jamshed.hrms.dto; import jakarta.validation.constraints.*;
public record CandidateRequest(@NotBlank String name,@Email @NotBlank String email,String phone,@NotBlank String position,String stage,Integer experienceYears,String source){}
