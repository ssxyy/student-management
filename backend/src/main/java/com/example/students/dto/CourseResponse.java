package com.example.students.dto;

import com.example.students.entity.Course;

public record CourseResponse(Long id, String name, String code, String description) {
    public static CourseResponse from(Course c) {
        return new CourseResponse(c.getId(), c.getName(), c.getCode(), c.getDescription());
    }
}
