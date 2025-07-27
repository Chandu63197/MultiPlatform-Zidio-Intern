package com.example.Multi_Platform.student.repository;

import com.example.Multi_Platform.Student.entity.Application;
import com.example.Multi_Platform.recruter.DTO.RecruiterApplicationsResponseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

  List<Application> findByStudentEmail(String studentEmail);

  boolean existsByJobIdAndStudentEmail(Long jobId, String studentEmail);

  int deleteByIdAndStudentEmail(Long id, String studentEmail);

  List<Application> findByJobIdIn(List<Long> jobIds);
  Optional<Application> findById(Long id);
  List<Application> findByJobId(Long jobId);
  @Query("SELECT a FROM Application a WHERE " +
          "(UPPER(a.type) = 'JOB' AND a.jobId IN :jobIds) OR " +
          "(UPPER(a.type) = 'INTERNSHIP' AND a.jobId IN :internshipIds)")
  List<Application> findByRecruiterJobsAndInternships(
          @Param("jobIds") List<Long> jobIds,
          @Param("internshipIds") List<Long> internshipIds
  );

  @Query("""
    SELECT a FROM Application a
    WHERE a.jobId IN (
        SELECT j.id FROM Job j WHERE j.recruiterEmail = :recruiterEmail
    )
    OR a.jobId IN (
        SELECT i.id FROM Internship i WHERE i.recruiterEmail = :recruiterEmail
    )
""")


  List<Application> findAllByRecruiterEmail(@Param("recruiterEmail") String recruiterEmail);

}
