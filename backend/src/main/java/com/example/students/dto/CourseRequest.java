package com.example.students.dto;
import jakarta.validation.constraints.*;
public record CourseRequest(@NotBlank @Size(max=100) String name,@NotBlank @Size(max=20) String code,@Size(max=500) String description) {}
