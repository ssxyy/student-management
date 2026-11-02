import { Routes } from '@angular/router';
import { StudentsComponent } from './pages/students/students.component';
import { CoursesComponent } from './pages/courses/courses.component';
export const routes: Routes = [{ path: 'students', component: StudentsComponent }, { path: 'courses', component: CoursesComponent }, { path: '', pathMatch: 'full', redirectTo: 'students' }, { path: '**', redirectTo: 'students' }];

