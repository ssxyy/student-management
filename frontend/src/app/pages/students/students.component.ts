import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Student, Course } from '../../models/models';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { errorMessage } from '../../shared/error';
@Component({ selector: 'app-students', standalone: true, imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent], template: `
<div class="page-title"><div><span class="eyebrow">ADMINISTRATION</span><h1>Students</h1><p>Manage student profiles and course enrollments.</p></div><button (click)="openCreate()">+ Add student</button></div>
<div class="notice error" *ngIf="error">{{error}} <button class="link" (click)="error=''">Dismiss</button></div>
<section class="panel"><div class="panel-bar"><strong>All students</strong><span class="count">{{(api.students$|async)?.length||0}} students</span></div>
<div class="table-scroll"><table><thead><tr><th>STUDENT</th><th>EMAIL</th><th>ENROLLED COURSES</th><th>ACTIONS</th></tr></thead><tbody>
<tr *ngFor="let s of api.students$|async"><td><strong>{{s.firstName}} {{s.lastName}}</strong></td><td>{{s.email}}</td><td><span class="pill" *ngFor="let c of s.courses">{{c.code}}</span><span class="muted" *ngIf="!s.courses.length">None</span></td><td><button class="link" (click)="openEdit(s)">Edit</button><button class="link danger-text" (click)="pendingDelete=s">Delete</button></td></tr>
<tr *ngIf="(api.students$|async)?.length===0"><td colspan="4" class="empty">No students yet. Add your first student.</td></tr></tbody></table></div></section>
<div class="overlay" *ngIf="showForm"><section class="dialog wide" role="dialog" aria-modal="true" aria-labelledby="student-title"><div class="modal-head"><h2 id="student-title">{{editingId===undefined?'Add student':'Edit student'}}</h2><button class="close" (click)="showForm=false" aria-label="Close">×</button></div>
<form [formGroup]="form" (ngSubmit)="save()"><div class="two"><label>First name<input formControlName="firstName" placeholder="Alex"><small class="invalid" *ngIf="form.controls.firstName.touched&&form.controls.firstName.invalid">Required</small></label><label>Last name<input formControlName="lastName" placeholder="Lee"><small class="invalid" *ngIf="form.controls.lastName.touched&&form.controls.lastName.invalid">Required</small></label></div><label>Email<input type="email" formControlName="email" placeholder="alex@example.com"><small class="invalid" *ngIf="form.controls.email.touched&&form.controls.email.invalid">Enter a valid email</small></label><label>Course enrollment</label><div class="course-options"><label class="check" *ngFor="let c of courses"><input type="checkbox" [checked]="selectedCourses.has(c.id)" (change)="toggleCourse(c.id,$event)">{{c.code}} · {{c.name}}</label><p class="muted" *ngIf="courses.length===0">No courses available. Create courses in the Courses tab.</p></div><div class="notice error" *ngIf="formError">{{formError}}</div><div class="actions"><button class="secondary" type="button" (click)="showForm=false">Cancel</button><button type="submit" [disabled]="saving">{{saving?'Saving…':'Save student'}}</button></div></form></section></div>
<app-confirm-dialog *ngIf="pendingDelete" [message]="'Delete '+pendingDelete.firstName+' '+pendingDelete.lastName+'? This cannot be undone.'" (cancel)="pendingDelete=null" (confirm)="delete()"/>
` })
export class StudentsComponent implements OnInit {
    error = '';
    formError = '';
    saving = false;
    showForm = false;
    editingId: number | undefined;
    pendingDelete: Student | null = null;
    courses: Course[] = [];
    selectedCourses = new Set<number>();
    form = this.fb.nonNullable.group({ firstName: ['', [Validators.required, Validators.maxLength(100)]], lastName: ['', [Validators.required, Validators.maxLength(100)]], email: ['', [Validators.required, Validators.email]] });
    constructor(public api: ApiService, private fb: FormBuilder) { }
    ngOnInit() { this.refresh(); this.api.courses$.subscribe(cs => this.courses = cs); }
    refresh() { this.api.loadStudents().subscribe({ error: e => this.error = errorMessage(e) }); this.api.loadCourses().subscribe({ error: e => this.error = errorMessage(e) }); }
    openCreate() { this.editingId = undefined; this.form.reset(); this.selectedCourses.clear(); this.formError = ''; this.showForm = true; }
    openEdit(s: Student) { this.editingId = s.id; this.form.setValue({ firstName: s.firstName, lastName: s.lastName, email: s.email }); this.selectedCourses = new Set(s.courses.map(c => c.id)); this.formError = ''; this.showForm = true; }
    toggleCourse(id: number, e: Event) { if ((e.target as HTMLInputElement).checked)
        this.selectedCourses.add(id);
    else
        this.selectedCourses.delete(id); }
    save() { if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
    } this.saving = true; this.formError = ''; this.api.saveStudent({ ...this.form.getRawValue(), courseIds: [...this.selectedCourses] }, this.editingId).subscribe({ next: () => { this.saving = false; this.showForm = false; this.refresh(); }, error: e => { this.saving = false; this.formError = errorMessage(e); } }); }
    delete() { if (!this.pendingDelete)
        return; const id = this.pendingDelete.id; this.pendingDelete = null; this.api.deleteStudent(id).subscribe({ next: () => this.refresh(), error: e => this.error = errorMessage(e) }); }
}

