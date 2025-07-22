import { Component, Inject, PLATFORM_ID, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, LoginCredentials } from '../services/auth.service';

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
  successMessage = '';

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
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Initialize reactive form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Check authentication status after initialization
    // This is done after construction to avoid circular dependency
    setTimeout(() => {
      this.authService.checkAuthStatus();
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/dashboard']);
      }
    }, 0);
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

  // Add methods to control form state
  private enableForm(): void {
    this.loginForm.enable();
  }

  private disableForm(): void {
    this.loginForm.disable();
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
      this.successMessage = '';
      this.disableForm(); // Disable entire form during loading

      const { email, password, rememberMe } = this.loginForm.value;
      const credentials: LoginCredentials = { email, password };

      // Add detailed logging
      console.log('🔍 Login attempt started');
      console.log('📧 Email:', email);
      console.log('🌐 API URL: http://localhost:8080/api/auth/login');
      console.log('📤 Sending request...');

      // Real API call to your MySQL database via localhost:8080
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('✅ Response received:', response);
          console.log('📊 Response status: SUCCESS');

          if (response.success) {
            this.successMessage = `Welcome back, ${response.user?.name || 'Coder'}!`;

            // Handle remember me functionality
            if (rememberMe && response.token) {
              localStorage.setItem('rememberMe', 'true');
              console.log('💾 Remember me enabled - Token stored');
            }

            // Brief delay to show success message
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1500);
          } else {
            this.errorMessage = response.message || 'Login failed';
            this.isLoading = false;
            this.enableForm(); // Re-enable form on error
          }
        },
        error: (error) => {
          console.error('❌ Request failed with error:', error);
          console.log('📊 Error status:', error.status);
          console.log('📊 Error message:', error.message);

          // Handle different error types from MySQL/backend
          if (error.status === 0) {
            console.log('🚫 CORS or Network Error - Backend not reachable');
            this.errorMessage = 'Cannot connect to server. Please ensure backend is running on localhost:8080';
          } else if (error.status === 401) {
            this.errorMessage = 'Invalid email or password. Please check your credentials.';
          } else if (error.status === 404) {
            this.errorMessage = 'User not found in database. Please register first.';
          } else if (error.status === 500) {
            this.errorMessage = 'Database connection error. Please try again later.';
          } else {
            this.errorMessage = error.error?.message || 'Login failed. Please try again.';
          }

          this.isLoading = false;
          this.enableForm(); // Re-enable form after error
        },
        complete: () => {
          // Only reset loading state if not successful (success case is handled in next())
          if (this.errorMessage) {
            this.isLoading = false;
            this.enableForm();
          }
        }
      });
    } else {
      console.log('⚠️ Form is invalid or already loading');
      this.markFormGroupTouched();
    }
  }

  onForgotPassword(): void {
    const email = this.loginForm.get('email')?.value;

    if (email && this.email?.valid) {
      this.isLoading = true;
      this.disableForm(); // Disable form during forgot password request

      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          console.log('📧 Password reset email request sent:', response);
          this.successMessage = 'Password reset instructions sent to your email.';
          this.isLoading = false;
          this.enableForm(); // Re-enable form
        },
        error: (error) => {
          console.error('❌ Forgot password failed:', error);
          this.errorMessage = 'Failed to send password reset email. Please try again.';
          this.isLoading = false;
          this.enableForm(); // Re-enable form on error
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid email address first.';
      this.loginForm.get('email')?.markAsTouched();
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
