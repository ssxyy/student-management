package com.example.students.dto;

import com.example.students.entity.Student;

import java.util.List;

public record StudentResponse(Long id, String firstName, String lastName, String email, List<CourseResponse> courses) {
    public static StudentResponse from(Student s) {
        return new StudentResponse(s.getId(), s.getFirstName(), s.getLastName(), s.getEmail(), s.getCourses().stream()
                .map(CourseResponse::from)
                .sorted(java.util.Comparator.comparing(CourseResponse::id)).toList());
    }
}
