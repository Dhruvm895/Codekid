import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';  // ✅ import RouterModule and Router

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],  // ✅ Add RouterModule here
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  sidebarOpen: boolean = false;
  progress: number = 48;

  constructor(private router: Router) {}  // ✅ Inject Router

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  onLevelClick(level: string): void {
    console.log(`Selected level: ${level}`);
  }

  onProfileClick(): void {
    console.log('Profile clicked');
  }

  onLoginClick(): void {
    console.log('Login clicked');
    this.router.navigate(['/auth']);  // ✅ Navigate to /auth route
  }
}
