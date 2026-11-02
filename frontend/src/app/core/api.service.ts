import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, map, switchMap, tap } from "rxjs";
import {
  Course,
  CoursePayload,
  Student,
  StudentPayload,
} from "../models/models";
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  errors?: Record<string, string>;
}
@Injectable({ providedIn: "root" })
export class ApiService {
  private readonly base = "http://localhost:8080/api";
  private readonly studentsSubject = new BehaviorSubject<Student[]>([]);
  private readonly coursesSubject = new BehaviorSubject<Course[]>([]);
  readonly students$ = this.studentsSubject.asObservable();
  readonly courses$ = this.coursesSubject.asObservable();
  constructor(private readonly http: HttpClient) {}
  loadStudents(): Observable<ApiResponse<Student[]>> {
    return this.http
      .get<ApiResponse<Student[]>>(`${this.base}/students`)
      .pipe(tap((response) => this.studentsSubject.next(response.data)));
  }
  loadCourses(): Observable<ApiResponse<Course[]>> {
    return this.http
      .get<ApiResponse<Course[]>>(`${this.base}/courses`)
      .pipe(tap((response) => this.coursesSubject.next(response.data)));
  }
  saveStudent(
    payload: StudentPayload,
    id?: number
  ): Observable<ApiResponse<Student>> {
    const request$ =
      id === undefined
        ? this.http.post<ApiResponse<Student>>(`${this.base}/students`, payload)
        : this.http.put<ApiResponse<Student>>(
            `${this.base}/students/${id}`,
            payload
          );
    return request$.pipe(
      switchMap((response) => this.loadStudents().pipe(map(() => response)))
    );
  }
  saveCourse(
    payload: CoursePayload,
    id?: number
  ): Observable<ApiResponse<Course>> {
    const request$ =
      id === undefined
        ? this.http.post<ApiResponse<Course>>(`${this.base}/courses`, payload)
        : this.http.put<ApiResponse<Course>>(
            `${this.base}/courses/${id}`,
            payload
          );
    return request$.pipe(
      switchMap((response) =>
        this.loadCourses().pipe(
          switchMap(() => this.loadStudents().pipe(map(() => response)))
        )
      )
    );
  }
  deleteStudent(id: number): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.base}/students/${id}`)
      .pipe(
        switchMap((response) => this.loadStudents().pipe(map(() => response)))
      );
  }
  deleteCourse(id: number): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.base}/courses/${id}`)
      .pipe(
        switchMap((response) =>
          this.loadCourses().pipe(
            switchMap(() => this.loadStudents().pipe(map(() => response)))
          )
        )
      );
  }
}
