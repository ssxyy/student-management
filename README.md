# Student Management — Full Stack Take-Home Assignment

A two-tab student and course manager with Angular 19, Java 21, Spring Boot 3.3, Spring Data JPA, and an embedded H2 database. Students may enroll in multiple courses; both resources support full CRUD. Includes reactive forms, shared RxJS state, routing, modal delete confirmations, service-layer transactions, validation, error handling, and backend JUnit/Mockito tests.

## Prerequisites
- Java 21
- Maven 3.9+ (or use your IDE's bundled Maven)
- Node.js 20.11+ or 22+ and npm

## Run locally

**Terminal 1 — backend**
```bash
cd backend
mvn spring-boot:run
```
REST API: http://localhost:8080/api/students and http://localhost:8080/api/courses

H2 console: http://localhost:8080/h2-console. JDBC URL: `jdbc:h2:file:./data/studentdb` (relative to the `backend` working directory), user `sa`, blank password. The embedded database starts automatically with Spring Boot; no separate database server is required.

**Terminal 2 — frontend**
```bash
cd frontend
npm install
npm start
```
Visit **http://localhost:4200**. Start by creating courses, then add students and select their courses. The H2 data is persisted in `backend/data/`; delete that directory while the backend is stopped to reset data.

## Verify the response format

Try `curl -i http://localhost:8080/api/courses` after starting Spring Boot. All responses, including DELETE, return a JSON body. To see validation errors, try creating a course with an empty name.

## Run backend tests
```bash
cd backend
mvn test
```

## Build production frontend
```bash
cd frontend
npm run build
```

## API
| Method | URL | Action |
|---|---|---|
| GET | `/api/students` | List students including enrolled courses |
| GET | `/api/students/{id}` | Find student |
| POST | `/api/students` | Create student |
| PUT | `/api/students/{id}` | Update student and enrollments |
| DELETE | `/api/students/{id}` | Delete student (200, JSON envelope) |
| GET | `/api/courses` | List courses |
| GET | `/api/courses/{id}` | Find course |
| POST | `/api/courses` | Create course |
| PUT | `/api/courses/{id}` | Update course |
| DELETE | `/api/courses/{id}` | Delete course and its enrollments (200, JSON envelope) |

Student request example:
```json
{"firstName":"Alex","lastName":"Lee","email":"alex@example.com","courseIds":[1,2]}
```
Course request example:
```json
{"name":"Introduction to Programming","code":"CS101","description":"Fundamentals"}
```
All endpoints return a consistent JSON envelope: `success`, `message`, `data` (on success), `timestamp`, and optional `errors` (on validation failure). Successful DELETE calls return HTTP 200 with a JSON envelope, rather than 204 (which cannot have a body). A global `@RestControllerAdvice` handles validation errors (400), invalid JSON (400), missing resources (404), conflicts (409), and unexpected errors (500). No internal stack traces are exposed to the client.

Example success (`GET /api/courses`):
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": [],
  "timestamp": "2026-11-02T12:00:00Z"
}
```

Example validation error (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "timestamp": "2026-11-02T12:00:00Z",
  "errors": {"code": "must not be blank"}
}
```

Validation failures return 400 with field messages, missing resources return 404, and duplicate emails/course codes return 409. CORS allows `localhost:4200`.

## Design choices
- **Many-to-many relationship:** student_courses join table; course deletion clears enrollments within a transaction.
- **Frontend state:** BehaviorSubject-based RxJS observables shared between pages via ApiService. HttpClient reads the common API envelope and publishes only `response.data` to the component state. Forms use Angular Reactive Forms; child modal communicates with parent through EventEmitter.
- **RestTemplate:** Spring RestTemplate bean provided in WebConfig for outbound HTTP clients, as requested. This self-contained app does not call an external service; the frontend talks to REST controllers through Angular HttpClient.
- **H2:** embedded, file-backed database for zero-setup local development. `ddl-auto=update` is suitable for a coding exercise, not production migrations.

## Publish to a public GitHub repo
```bash
git init
git add .
git commit -m "Build Student Management app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/student-management.git
git push -u origin main
```
Create the empty public repository on GitHub before pushing. This ZIP does not automatically publish to GitHub.

## Assignment checklist
- [x] Angular 18+ (19)
- [x] Student and course CRUD and many-to-many enrollments
- [x] Router tabs, modal confirmation, multi-component communication
- [x] Reactive forms, RxJS state, error handling
- [x] Java Spring REST, H2, backend validation, transactions
- [x] JUnit/Mockito backend tests
- [x] Local setup and GitHub instructions
