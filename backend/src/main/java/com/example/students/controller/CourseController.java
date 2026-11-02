package com.example.students.controller;

import com.example.students.dto.ApiResponse;
import com.example.students.dto.CourseRequest;
import com.example.students.dto.CourseResponse;
import com.example.students.service.CourseService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<CourseResponse>> list() {
        return ApiResponse.success("Courses retrieved successfully", service.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<CourseResponse> get(@PathVariable Long id) {
        return ApiResponse.success("Course retrieved successfully", service.get(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CourseResponse>> create(@Valid @RequestBody CourseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Course created successfully", service.create(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<CourseResponse> update(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        return ApiResponse.success("Course updated successfully", service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.success("Course deleted successfully", null);
    }
}
