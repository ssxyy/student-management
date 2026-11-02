package com.example.students.dto;
import jakarta.validation.constraints.*;
import java.util.Set;
public record StudentRequest(@NotBlank @Size(max=100) String firstName,@NotBlank @Size(max=100) String lastName,@NotBlank @Email @Size(max=255) String email,@NotNull Set<@NotNull Long> courseIds) {}
