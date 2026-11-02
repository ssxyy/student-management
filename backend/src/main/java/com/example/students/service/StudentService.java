package com.example.students.service;

import com.example.students.dto.StudentRequest;
import com.example.students.dto.StudentResponse;
import com.example.students.entity.Course;
import com.example.students.entity.Student;
import com.example.students.exception.ConflictException;
import com.example.students.exception.NotFoundException;
import com.example.students.repository.CourseRepository;
import com.example.students.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StudentService {
    private final StudentRepository students;
    private final CourseRepository courses;

    public StudentService(StudentRepository students, CourseRepository courses) {
        this.students = students;
        this.courses = courses;
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> list() {
        return students.findAllWithCourses().stream().map(StudentResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public StudentResponse get(Long id) {
        return StudentResponse.from(find(id));
    }

    @Transactional
    public StudentResponse create(StudentRequest req) {
        if (students.existsByEmailIgnoreCase(req.email())) throw new ConflictException("Student email already exists");
        Student s = new Student(req.firstName().trim(), req.lastName().trim(), req.email().trim());
        s.setCourses(resolveCourses(req.courseIds()));
        return StudentResponse.from(students.save(s));
    }

    @Transactional
    public StudentResponse update(Long id, StudentRequest req) {
        Student s = find(id);
        if (students.existsByEmailIgnoreCaseAndIdNot(req.email(), id))
            throw new ConflictException("Student email already exists");
        s.update(req.firstName().trim(), req.lastName().trim(), req.email().trim());
        s.setCourses(resolveCourses(req.courseIds()));
        return StudentResponse.from(s);
    }

    @Transactional
    public void delete(Long id) {
        Student s = find(id);
        s.getCourses().clear();
        students.delete(s);
    }

    private Student find(Long id) {
        return students.findByIdWithCourses(id).orElseThrow(() -> new NotFoundException("Student not found: " + id));
    }

    private Set<Course> resolveCourses(Set<Long> ids) {
        if (ids.isEmpty()) return new HashSet<>();
        List<Course> found = courses.findAllById(ids);
        if (found.size() != ids.size()) {
            Set<Long> foundIds = found.stream().map(Course::getId).collect(Collectors.toSet());
            Set<Long> missing = new HashSet<>(ids);
            missing.removeAll(foundIds);
            throw new NotFoundException("Courses not found: " + missing);
        }
        return new HashSet<>(found);
    }
}
