package com.example.students.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Map;

/** A consistent response envelope for both successful and failed API requests. */
public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        Instant timestamp,
        @JsonInclude(JsonInclude.Include.NON_NULL) Map<String, String> errors
) {
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, Instant.now(), null);
    }

    public static ApiResponse<Void> failure(String message) {
        return new ApiResponse<>(false, message, null, Instant.now(), null);
    }

    public static ApiResponse<Void> failure(String message, Map<String, String> errors) {
        return new ApiResponse<>(false, message, null, Instant.now(), errors);
    }
}
