import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from "../../core/api.service";
import { Course } from "../../models/models";
import { ConfirmDialogComponent } from "../../shared/confirm-dialog.component";
import { errorMessage } from "../../shared/error";
@Component({
  selector: "app-courses",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  template: `
    <div class="page-title">
      <div>
        <span class="eyebrow">ADMINISTRATION</span>
        <h1>Courses</h1>
        <p>Create courses students can enroll in.</p>
      </div>
      <button (click)="openCreate()">+ Add course</button>
    </div>
    <div class="notice error" *ngIf="error">
      {{ error }} <button class="link" (click)="error = ''">Dismiss</button>
    </div>
    <section class="panel">
      <div class="panel-bar">
        <strong>Course catalog</strong
        ><span class="count"
          >{{ (api.courses$ | async)?.length || 0 }} courses</span
        >
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>CODE</th>
              <th>COURSE NAME</th>
              <th>DESCRIPTION</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of api.courses$ | async">
              <td>
                <span class="pill">{{ c.code }}</span>
              </td>
              <td>
                <strong>{{ c.name }}</strong>
              </td>
              <td>{{ c.description || "—" }}</td>
              <td>
                <button class="link" (click)="openEdit(c)">Edit</button
                ><button class="link danger-text" (click)="pendingDelete = c">
                  Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="(api.courses$ | async)?.length === 0">
              <td colspan="4" class="empty">
                No courses yet. Create your first course.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <div class="overlay" *ngIf="showForm">
      <section
        class="dialog wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-title"
      >
        <div class="modal-head">
          <h2 id="course-title">
            {{ editingId === undefined ? "Add course" : "Edit course" }}
          </h2>
          <button class="close" (click)="showForm = false" aria-label="Close">
            ×
          </button>
        </div>
        <form [formGroup]="form" (ngSubmit)="save()">
          <label
            >Course name<input
              formControlName="name"
              placeholder="Introduction to Computer Science"
            /><small
              class="invalid"
              *ngIf="form.controls.name.touched && form.controls.name.invalid"
              >Required</small
            ></label
          ><label
            >Course code<input
              formControlName="code"
              placeholder="CS101"
            /><small
              class="invalid"
              *ngIf="form.controls.code.touched && form.controls.code.invalid"
              >Required (max 20 characters)</small
            ></label
          ><label
            >Description<textarea
              formControlName="description"
              rows="3"
              placeholder="Brief course summary"
            ></textarea>
          </label>
          <div class="notice error" *ngIf="formError">{{ formError }}</div>
          <div class="actions">
            <button class="secondary" type="button" (click)="showForm = false">
              Cancel</button
            ><button type="submit" [disabled]="saving">
              {{ saving ? "Saving…" : "Save course" }}
            </button>
          </div>
        </form>
      </section>
    </div>
    <app-confirm-dialog
      *ngIf="pendingDelete"
      [message]="
        'Delete ' +
        pendingDelete.code +
        '? Existing student enrollments in this course will also be removed.'
      "
      (cancel)="pendingDelete = null"
      (confirm)="delete()"
    />
  `,
})
export class CoursesComponent implements OnInit {
  error = "";
  formError = "";
  saving = false;
  showForm = false;
  editingId: number | undefined;
  pendingDelete: Course | null = null;
  form = this.fb.nonNullable.group({
    name: ["", [Validators.required, Validators.maxLength(100)]],
    code: ["", [Validators.required, Validators.maxLength(20)]],
    description: ["", [Validators.maxLength(500)]],
  });
  constructor(public api: ApiService, private fb: FormBuilder) {}
  ngOnInit() {
    this.refresh();
  }
  refresh() {
    this.api
      .loadCourses()
      .subscribe({ error: (e) => (this.error = errorMessage(e)) });
  }
  openCreate() {
    this.editingId = undefined;
    this.form.reset();
    this.formError = "";
    this.showForm = true;
  }
  openEdit(c: Course) {
    this.editingId = c.id;
    this.form.setValue({
      name: c.name,
      code: c.code,
      description: c.description || "",
    });
    this.formError = "";
    this.showForm = true;
  }
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.formError = "";
    this.api.saveCourse(this.form.getRawValue(), this.editingId).subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.refresh();
      },
      error: (e) => {
        this.saving = false;
        this.formError = errorMessage(e);
      },
    });
  }
  delete() {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.id;
    this.pendingDelete = null;
    this.api.deleteCourse(id).subscribe({
      next: () => this.refresh(),
      error: (e) => (this.error = errorMessage(e)),
    });
  }
}
