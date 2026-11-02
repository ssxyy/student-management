export interface Course {
  id: number;
  name: string;
  code: string;
  description: string | null;
}
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  courses: Course[];
}
export interface CoursePayload {
  name: string;
  code: string;
  description: string | null;
}
export interface StudentPayload {
  firstName: string;
  lastName: string;
  email: string;
  courseIds: number[];
}
