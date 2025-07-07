import { Component, AfterViewInit, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent implements AfterViewInit {

  @ViewChild('bladeTrail', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.canvasRef?.nativeElement) {
      const canvas = this.canvasRef.nativeElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(10, 10, 100, 100);
      }
    }
  }

  onLoginSuccess(): void {
    if (this.isBrowser) {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
}
