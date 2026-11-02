package com.example.students.service;
import com.example.students.dto.*;
import com.example.students.entity.*;
import com.example.students.exception.*;
import com.example.students.repository.*;
import org.junit.jupiter.api.*;
import org.mockito.*;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class StudentServiceTest {
 StudentRepository students=mock(StudentRepository.class);CourseRepository courses=mock(CourseRepository.class);
 StudentService service=new StudentService(students,courses);
 @Test void duplicateEmailIsRejected(){when(students.existsByEmailIgnoreCase("a@example.com")).thenReturn(true);assertThrows(ConflictException.class,()->service.create(new StudentRequest("Alex","Lee","a@example.com",Set.of())));}
 @Test void missingStudentReturnsNotFound(){when(students.findByIdWithCourses(42L)).thenReturn(Optional.empty());assertThrows(NotFoundException.class,()->service.get(42L));}
 @Test void missingCourseReturnsNotFound(){when(students.existsByEmailIgnoreCase("a@example.com")).thenReturn(false);when(courses.findAllById(Set.of(99L))).thenReturn(List.of());assertThrows(NotFoundException.class,()->service.create(new StudentRequest("Alex","Lee","a@example.com",Set.of(99L))));}
 @Test void emptyEnrollmentCanBeSaved(){when(students.save(any(Student.class))).thenAnswer(i->i.getArgument(0));StudentResponse result=service.create(new StudentRequest("Alex","Lee","a@example.com",Set.of()));assertEquals("Alex",result.firstName());assertTrue(result.courses().isEmpty());}
}
