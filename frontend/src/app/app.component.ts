import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `<header class="top">
      <div class="brand">
        <span class="logo">SM</span>
        <div>
          <strong>Student Management</strong
          ><small>Academic administration</small>
        </div>
      </div>
      <nav aria-label="Main navigation">
        <a routerLink="/students" routerLinkActive="active">Students</a
        ><a routerLink="/courses" routerLinkActive="active">Courses</a>
      </nav>
    </header>
    <main class="container"><router-outlet /></main>
    <footer>Student Management · Angular + Spring Boot</footer>`,
})
export class AppComponent {}
