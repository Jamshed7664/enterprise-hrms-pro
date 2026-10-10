package com.jamshed.hrms.service;
import com.jamshed.hrms.entity.AuditEntry;
import com.jamshed.hrms.repository.AuditEntryRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
@Service public class AuditService {
 private final AuditEntryRepository repo;
 public AuditService(AuditEntryRepository repo){this.repo=repo;}
 public void record(String actor,String module,String action,String details){repo.save(AuditEntry.builder().time(LocalDateTime.now()).actor(actor).module(module).action(action).details(details).build());}
}
