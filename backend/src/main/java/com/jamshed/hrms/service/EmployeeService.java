package com.jamshed.hrms.service;
import com.jamshed.hrms.dto.EmployeeRequest; import com.jamshed.hrms.entity.*; import com.jamshed.hrms.exception.*; import com.jamshed.hrms.repository.*; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import java.util.*;
@Service @Transactional
public class EmployeeService {
 private final EmployeeRepository employees; private final DepartmentRepository departments;
 public EmployeeService(EmployeeRepository e,DepartmentRepository d){employees=e;departments=d;}
 public List<Employee> all(){return employees.findAll().stream().filter(e->!"ARCHIVED".equals(e.getStatus())).toList();}
 public Employee one(Long id){return employees.findById(id).orElseThrow(()->new ResourceNotFoundException("Employee not found: "+id));}
 public Employee create(EmployeeRequest r){if(employees.findByEmail(r.email()).isPresent()) throw new BusinessException("An employee with this email already exists");return save(new Employee(),r);}
 public Employee update(Long id,EmployeeRequest r){return save(one(id),r);}
 private Employee save(Employee e,EmployeeRequest r){e.setEmployeeCode(r.employeeCode());e.setFirstName(r.firstName());e.setLastName(r.lastName());e.setEmail(r.email());e.setPhone(r.phone());e.setJobTitle(r.jobTitle());e.setLocation(r.location());e.setJoinDate(r.joinDate());e.setStatus(r.status()==null?"ACTIVE":r.status());e.setGender(r.gender());e.setDateOfBirth(r.dateOfBirth());e.setAddress(r.address());e.setManagerName(r.managerName());if(r.departmentId()!=null)e.setDepartment(departments.findById(r.departmentId()).orElseThrow(()->new ResourceNotFoundException("Department not found: "+r.departmentId())));return employees.save(e);}
 public void delete(Long id){Employee e=one(id);e.setStatus("ARCHIVED");employees.save(e);}
 public Employee status(Long id,String status){if(!List.of("ACTIVE","INACTIVE","ON_LEAVE","ARCHIVED").contains(status))throw new BusinessException("Invalid employee status");Employee e=one(id);e.setStatus(status);return employees.save(e);}
 public Employee setProfileImage(Long id,String url,String name){Employee e=one(id);e.setProfileImageUrl(url);e.setProfileImageName(name);return employees.save(e);}
 public Employee saveProfile(Employee e){return employees.save(e);}
}
