package com.jamshed.hrms.dto; import java.time.LocalDate; import jakarta.validation.constraints.*;
public record LeaveRequestDto(@NotNull Long employeeId,@NotBlank String leaveType,@NotNull LocalDate startDate,@NotNull LocalDate endDate,@NotBlank String reason){}
