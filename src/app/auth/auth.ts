import { Component, AfterViewInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Point {
  x: number;
  y: number;
  alpha: number;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent implements AfterViewInit {

  @ViewChild('bladeTrail', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private points: Point[] = [];
  private readonly maxPoints: number = 25;
  private lastMouseTime: number = Date.now();

  credentials = {
    email: '',
    password: ''
  };

  error: string = '';

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Canvas context not available.');
      return;
    }

    this.ctx = context;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    this.resizeCanvas();

    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseout', () => this.lastMouseTime = Date.now() - 2000);

    this.drawTrail();
    }
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = this.width;
    canvas.height = this.height;
  }

  private onMouseMove(event: MouseEvent): void {
    this.lastMouseTime = Date.now();
    this.points.push({ x: event.clientX, y: event.clientY, alpha: 1 });

    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }
  }

  private drawTrail(): void {
    const now = Date.now();

    if (now - this.lastMouseTime > 1000) {
      this.points.length = 0;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.points.length - 1; i++) {
      const p1 = this.points[i];
      const p2 = this.points[i + 1];
      const opacity = p1.alpha;
      const lineWidth = 12 * (1 - i / this.maxPoints) + 1;

      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      this.ctx.lineWidth = lineWidth;
      this.ctx.shadowColor = 'white';
      this.ctx.shadowBlur = 15;
      this.ctx.stroke();
      this.ctx.closePath();

      p1.alpha *= 0.92;
    }

    while (this.points.length && this.points[0].alpha < 0.05) {
      this.points.shift();
    }

    requestAnimationFrame(() => this.drawTrail());
  }

  onSubmit(): void {
    const email = this.credentials.email.trim();
    const password = this.credentials.password.trim();

    if (!email || !password) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter both email and password.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Store login info (Note: Don't store passwords in real applications)
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);

    Swal.fire({
      title: 'Login Successful!',
      text: `Welcome, ${email}!`,
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      this.router.navigate(['/home']);
    });
  }
}
