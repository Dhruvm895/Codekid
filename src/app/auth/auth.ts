import { Component, Inject, PLATFORM_ID, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent implements AfterViewInit, OnDestroy {

  @ViewChild('bladeTrail', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private animationFrameId: any;
  isBrowser: boolean;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.startBladeTrail();
    }
  }

  startBladeTrail(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const trail: { x: number, y: number }[] = [];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'cyan';
      ctx.lineWidth = 4;

      ctx.beginPath();
      for (let i = 0; i < trail.length - 1; i++) {
        ctx.moveTo(trail[i].x, trail[i].y);
        ctx.lineTo(trail[i + 1].x, trail[i + 1].y);
      }
      ctx.stroke();

      if (trail.length > 20) trail.shift();
      this.animationFrameId = requestAnimationFrame(draw);
    };

    canvas.addEventListener('mousemove', (e) => {
      trail.push({ x: e.clientX, y: e.clientY });
    });

    draw();
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
