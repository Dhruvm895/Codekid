import { Component, Inject, PLATFORM_ID, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bladeTrail', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  private animationFrameId: any;
  private ctx!: CanvasRenderingContext2D;
  private points: TrailPoint[] = [];
  private maxPoints = 25;
  private lastMouseTime = Date.now();
  private width = 0;
  private height = 0;

  isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Initialize reactive form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  navigateToSignup() {
    this.router.navigate(['/auth/signup']);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.setupCanvas();
      this.addEventListeners();
      this.startBladeTrail();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.removeEventListeners();
  }

  private setupCanvas(): void {
    if (!this.isBrowser) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.updateCanvasSize();
  }

  private updateCanvasSize(): void {
    if (!this.isBrowser) return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = this.width;
    canvas.height = this.height;
  }

  private addEventListeners(): void {
    if (!this.isBrowser) return;

    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mouseout', this.onMouseOut.bind(this));
  }

  private removeEventListeners(): void {
    if (!this.isBrowser) return;

    window.removeEventListener('resize', this.onResize.bind(this));
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('mouseout', this.onMouseOut.bind(this));
  }

  private onResize(): void {
    this.updateCanvasSize();
  }

  private onMouseMove(e: MouseEvent): void {
    this.lastMouseTime = Date.now();
    this.points.push({ x: e.clientX, y: e.clientY, alpha: 1 });

    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }
  }

  private onMouseOut(): void {
    this.lastMouseTime = Date.now() - 2000;
  }

  startBladeTrail(): void {
    if (!this.isBrowser) return;

    const drawTrail = () => {
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
        this.ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
        this.ctx.lineWidth = lineWidth;
        this.ctx.shadowColor = "white";
        this.ctx.shadowBlur = 15;
        this.ctx.stroke();
        this.ctx.closePath();

        p1.alpha *= 0.92;
      }

      while (this.points.length && this.points[0].alpha < 0.05) {
        this.points.shift();
      }

      this.animationFrameId = requestAnimationFrame(drawTrail);
    };

    drawTrail();
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password, rememberMe } = this.loginForm.value;

      // Simulate API call
      setTimeout(() => {
        try {
          console.log('Login attempt:', { email, password, rememberMe });

          // Simulate successful login
          if (email && password) {
            if (rememberMe) {
              localStorage.setItem('authToken', 'demo-token-' + Date.now());
            }

            // Navigate to dashboard or home
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'Invalid credentials';
          }
        } catch (error) {
          this.errorMessage = 'Login failed. Please try again.';
        } finally {
          this.isLoading = false;
        }
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }


  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getter methods for form validation
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get rememberMe() { return this.loginForm.get('rememberMe'); }
}
