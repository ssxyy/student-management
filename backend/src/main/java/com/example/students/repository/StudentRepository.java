package com.example.students.repository;
import com.example.students.entity.Student;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;
public interface StudentRepository extends JpaRepository<Student,Long>{
 boolean existsByEmailIgnoreCase(String email);
 boolean existsByEmailIgnoreCaseAndIdNot(String email,Long id);
 @EntityGraph(attributePaths="courses") @Query("select distinct s from Student s") List<Student> findAllWithCourses();
 @EntityGraph(attributePaths="courses") @Query("select s from Student s where s.id = :id") Optional<Student> findByIdWithCourses(@Param("id") Long id);
 @Modifying @Query(value="delete from student_courses where course_id=:courseId",nativeQuery=true) void removeCourseEnrollments(@Param("courseId") Long courseId);
}
