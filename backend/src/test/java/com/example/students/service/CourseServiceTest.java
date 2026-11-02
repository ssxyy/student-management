package com.example.students.service;

import com.example.students.dto.CourseRequest;
import com.example.students.exception.ConflictException;
import com.example.students.exception.NotFoundException;
import com.example.students.repository.CourseRepository;
import com.example.students.repository.StudentRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class CourseServiceTest {
    CourseRepository courses = mock(CourseRepository.class);
    StudentRepository students = mock(StudentRepository.class);
    CourseService service = new CourseService(courses, students);

    @Test
    void duplicateCourseCodeRejected() {
        when(courses.existsByCodeIgnoreCase("CS101")).thenReturn(true);
        assertThrows(ConflictException.class, () -> service.create(new CourseRequest("Intro", "CS101", null)));
    }

    @Test
    void missingCourseRejected() {
        when(courses.findById(42L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> service.get(42L));
    }

    @Test
    void deletionCleansEnrollments() {
        var c = new com.example.students.entity.Course("Intro", "CS101", null);
        when(courses.findById(4L)).thenReturn(Optional.of(c));
        service.delete(4L);
        verify(students).removeCourseEnrollments(4L);
        verify(courses).deleteById(4L);
    }
}
