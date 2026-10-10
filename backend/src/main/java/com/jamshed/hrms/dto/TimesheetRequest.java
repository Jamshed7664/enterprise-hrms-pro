package com.jamshed.hrms.dto; import java.time.LocalDate; import jakarta.validation.constraints.*;
public record TimesheetRequest(@NotNull Long employeeId,@NotNull LocalDate weekStart,@NotNull @Positive Double hours,@NotBlank String projectName,String notes){}
