package com.example.students.controller;

import com.example.students.exception.ApiExceptionHandler;
import com.example.students.exception.NotFoundException;
import com.example.students.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class StudentControllerTest {
    private final StudentService service = mock(StudentService.class);
    private final LocalValidatorFactoryBean validator = validator();
    private final MockMvc mvc = MockMvcBuilders.standaloneSetup(new StudentController(service))
            .setControllerAdvice(new ApiExceptionHandler())
            .setValidator(validator)
            .build();

    private static LocalValidatorFactoryBean validator() {
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        return validator;
    }

    @Test
    void listUsesResponseEnvelope() throws Exception {
        when(service.list()).thenReturn(java.util.List.of());
        mvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    void invalidEmailGetsFieldErrors() throws Exception {
        mvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"firstName\":\"Alex\",\"lastName\":\"Lee\",\"email\":\"bad-email\",\"courseIds\":[]}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errors.email").exists());
    }

    @Test
    void invalidJsonGets400Envelope() throws Exception {
        mvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{not-json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid JSON request body"));
    }

    @Test
    void missingStudentGets404Envelope() throws Exception {
        when(service.get(55L)).thenThrow(new NotFoundException("Student not found: 55"));
        mvc.perform(get("/api/students/55"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Student not found: 55"));
    }
}
