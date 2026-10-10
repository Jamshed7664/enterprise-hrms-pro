package com.jamshed.hrms.exception;
import com.jamshed.hrms.dto.ApiError; import jakarta.servlet.http.HttpServletRequest; import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.time.LocalDateTime; import org.slf4j.Logger; import org.slf4j.LoggerFactory; import java.util.*;
@RestControllerAdvice
public class GlobalExceptionHandler {
 private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
 private ResponseEntity<ApiError> build(HttpStatus s,String msg,HttpServletRequest r,Map<String,String> v){ return ResponseEntity.status(s).body(new ApiError(LocalDateTime.now(),s.value(),s.getReasonPhrase(),msg,r.getRequestURI(),v)); }
 @ExceptionHandler(ResourceNotFoundException.class) ResponseEntity<ApiError> notFound(ResourceNotFoundException e,HttpServletRequest r){return build(HttpStatus.NOT_FOUND,e.getMessage(),r,null);}
 @ExceptionHandler(BusinessException.class) ResponseEntity<ApiError> business(BusinessException e,HttpServletRequest r){return build(HttpStatus.CONFLICT,e.getMessage(),r,null);}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ApiError> validation(MethodArgumentNotValidException e,HttpServletRequest r){Map<String,String> m=new LinkedHashMap<>();e.getBindingResult().getFieldErrors().forEach(x->m.put(x.getField(),x.getDefaultMessage()));return build(HttpStatus.BAD_REQUEST,"Validation failed",r,m);}
 @ExceptionHandler(org.springframework.web.server.ResponseStatusException.class) ResponseEntity<ApiError> status(org.springframework.web.server.ResponseStatusException e,HttpServletRequest r){return build(HttpStatus.valueOf(e.getStatusCode().value()),e.getReason(),r,null);}
 @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
 ResponseEntity<ApiError> malformed(org.springframework.http.converter.HttpMessageNotReadableException e,HttpServletRequest r){return build(HttpStatus.BAD_REQUEST,"Invalid request body",r,null);}
 @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
 ResponseEntity<ApiError> uploadTooLarge(org.springframework.web.multipart.MaxUploadSizeExceededException e,HttpServletRequest r){return build(HttpStatus.PAYLOAD_TOO_LARGE,"Maximum upload size is 5 MB",r,null);}
 @ExceptionHandler(Exception.class) ResponseEntity<ApiError> generic(Exception e,HttpServletRequest r){log.error("Unexpected API error on {}",r.getRequestURI(), e);return build(HttpStatus.INTERNAL_SERVER_ERROR,"An unexpected error occurred. Please contact support.",r,null);}
}
