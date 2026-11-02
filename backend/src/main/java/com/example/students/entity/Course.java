package com.example.students.entity;
import jakarta.persistence.*;
@Entity @Table(name="courses",uniqueConstraints=@UniqueConstraint(columnNames="code"))
public class Course {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=100) private String name;
 @Column(nullable=false,length=20) private String code;
 @Column(length=500) private String description;
 protected Course() {}
 public Course(String name,String code,String description) { this.name=name;this.code=code;this.description=description; }
 public Long getId(){return id;} public String getName(){return name;} public String getCode(){return code;} public String getDescription(){return description;}
 public void update(String name,String code,String description){this.name=name;this.code=code;this.description=description;}
}
