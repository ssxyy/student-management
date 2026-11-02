package com.example.students.service;

import com.example.students.dto.CourseRequest;
import com.example.students.dto.CourseResponse;
import com.example.students.entity.Course;
import com.example.students.exception.ConflictException;
import com.example.students.exception.NotFoundException;
import com.example.students.repository.CourseRepository;
import com.example.students.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CourseService {
    private final CourseRepository courses;
    private final StudentRepository students;

    public CourseService(CourseRepository courses, StudentRepository students) {
        this.courses = courses;
        this.students = students;
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> list() {
        return courses.findAll().stream().map(CourseResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public CourseResponse get(Long id) {
        return CourseResponse.from(find(id));
    }

    @Transactional
    public CourseResponse create(CourseRequest req) {
        if (courses.existsByCodeIgnoreCase(req.code())) throw new ConflictException("Course code already exists");
        return CourseResponse.from(courses.save(new Course(req.name().trim(), req.code().trim(), req.description())));
    }

    @Transactional
    public CourseResponse update(Long id, CourseRequest req) {
        Course c = find(id);
        if (courses.existsByCodeIgnoreCaseAndIdNot(req.code(), id))
            throw new ConflictException("Course code already exists");
        c.update(req.name().trim(), req.code().trim(), req.description());
        return CourseResponse.from(c);
    }

    @Transactional
    public void delete(Long id) {
        find(id);
        students.removeCourseEnrollments(id);
        courses.deleteById(id);
    }

    private Course find(Long id) {
        return courses.findById(id).orElseThrow(() -> new NotFoundException("Course not found: " + id));
    }
}
