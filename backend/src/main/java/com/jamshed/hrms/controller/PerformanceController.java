package com.jamshed.hrms.controller;
import com.jamshed.hrms.entity.*;import com.jamshed.hrms.exception.*;import com.jamshed.hrms.repository.*;
import org.springframework.web.bind.annotation.*;import java.time.LocalDate;import java.util.*;
@RestController @RequestMapping("/api/performance") public class PerformanceController {
 private final PerformanceReviewRepository r;private final EmployeeRepository employees;
 public PerformanceController(PerformanceReviewRepository r,EmployeeRepository employees){this.r=r;this.employees=employees;}
 public record Input(Long employeeId,String cycle,Double rating,String feedback,String goal,Integer progress,LocalDate dueDate){}
 @GetMapping public List<PerformanceReview> all(){return r.findAll();}
 @PostMapping public PerformanceReview add(@RequestBody Input request){
   if(request.employeeId()==null || request.rating()==null || request.rating()<0 || request.rating()>5 || request.progress()==null || request.progress()<0 || request.progress()>100)throw new BusinessException("Valid employee, rating (0-5) and progress (0-100) are required");
   Employee employee=employees.findById(request.employeeId()).orElseThrow(()->new ResourceNotFoundException("Employee not found"));
   return r.save(PerformanceReview.builder().employee(employee).cycle(request.cycle()).rating(request.rating()).feedback(request.feedback()).goal(request.goal()).progress(request.progress()).dueDate(request.dueDate()).build());
 }
 @PatchMapping("/{id}/progress") public PerformanceReview progress(@PathVariable Long id,@RequestParam int value){if(value<0||value>100)throw new BusinessException("Progress must be 0-100");PerformanceReview p=r.findById(id).orElseThrow(()->new ResourceNotFoundException("Review not found"));p.setProgress(value);return r.save(p);}
 @DeleteMapping("/{id}") public void delete(@PathVariable Long id){if(!r.existsById(id))throw new ResourceNotFoundException("Review not found");r.deleteById(id);}
}
