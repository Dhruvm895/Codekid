// home.component.ts
import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface CodeSymbol {
  char: string;
  x: number;
  delay: number;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  // A property to control the visibility of the video player overlay
  isPlayerVisible: boolean = false;

  codeSymbols: CodeSymbol[] = [
    { char: '<>', x: 10, delay: 0 },
    { char: '{{ "{}" }}', x: 20, delay: 1 },
    { char: '[]', x: 30, delay: 2 },
    { char: '()', x: 40, delay: 3 },
    { char: ';;', x: 50, delay: 4 },
    { char: '//', x: 60, delay: 5 },
    { char: '**', x: 70, delay: 0.5 },
    { char: '++', x: 80, delay: 1.5 },
    { char: '--', x: 90, delay: 2.5 },
    { char: '&&', x: 15, delay: 3.5 },
    { char: '||', x: 25, delay: 4.5 },
    { char: '==', x: 35, delay: 5.5 }
  ];

  features: Feature[] = [
    {
      icon: '🎮',
      title: 'Game-Based Learning',
      description: 'Learn programming through fun, interactive games that make coding feel like play!'
    },
    {
      icon: '👨‍🏫',
      title: 'Expert Teachers',
      description: 'Learn from experienced instructors who know how to make coding concepts easy to understand.'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Code anywhere, anytime! Our platform works perfectly on all devices.'
    },
    {
      icon: '🏆',
      title: 'Achievements',
      description: 'Earn badges and certificates as you complete challenges and master new skills.'
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Join a supportive community of young coders and share your amazing projects!'
    },
    {
      icon: '🚀',
      title: 'Real Projects',
      description: 'Build real websites, apps, and games that you can share with friends and family.'
    }
  ];

  private isBrowser: boolean = false;
  private scrollListener?: () => void;
  private mouseMoveListener?: (e: MouseEvent) => void;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Initialize animations after view is ready
    setTimeout(() => {
      this.initializeAnimations();
    }, 500);

    // Add scroll listener for parallax effect
    this.scrollListener = this.onScroll.bind(this);
    window.addEventListener('scroll', this.scrollListener);

    // Add mouse move listener for hero parallax
    this.mouseMoveListener = this.onMouseMove.bind(this);
    document.addEventListener('mousemove', this.mouseMoveListener);
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      if (this.scrollListener) {
        window.removeEventListener('scroll', this.scrollListener);
      }
      if (this.mouseMoveListener) {
        document.removeEventListener('mousemove', this.mouseMoveListener);
      }
    }
  }

  private initializeAnimations(): void {
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
      (card as HTMLElement).style.animationDelay = (index * 0.2) + 's';
      card.classList.add('animate-in');
    });
  }

  private onScroll(): void {
    const scrolled = window.pageYOffset;
    const symbols = document.querySelectorAll('.code-symbol');
    symbols.forEach((symbol, index) => {
      const speed = 0.5 + index * 0.05;
      (symbol as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
    });
  }

  private onMouseMove(e: MouseEvent): void {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    const hero = document.querySelector('.hero-section');
    if (hero) {
      const moveX = (mouseX - 0.5) * 20;
      const moveY = (mouseY - 0.5) * 20;
      (hero as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  }

  startLearning(): void {
    if (!this.isBrowser) return;
    
    console.log('🎬 Starting video player...');
    this.isPlayerVisible = true;

    // Use setTimeout to allow Angular to render the video elements first
    setTimeout(() => {
      const video1 = document.getElementById('introVideo1') as HTMLVideoElement;
      const video2 = document.getElementById('introVideo2') as HTMLVideoElement;

      console.log('🎬 Video elements found:', { video1: !!video1, video2: !!video2 });

      if (video1 && video2) {
        // Add error handling for video loading
        video1.onerror = (e) => {
          console.error('❌ Error loading first video:', e);
          alert('Error loading video. Please check if the video file exists.');
        };

        video2.onerror = (e) => {
          console.error('❌ Error loading second video:', e);
        };

        // Add load event to ensure video is ready
        video1.onloadeddata = () => {
          console.log('✅ First video loaded successfully');
        };

        video2.onloadeddata = () => {
          console.log('✅ Second video loaded successfully');
        };

        // Start playing the first video
        video1.play().then(() => {
          console.log('🎬 First video started playing');
        }).catch((error) => {
          console.error('❌ Error playing first video:', error);
          // Show user-friendly error message
          alert('Unable to play video. Please try again or check your browser settings.');
        });

        // Listen for when the first video ends
        video1.onended = () => {
          console.log('🎬 First video ended, starting second video');
          // Hide the first video and show the second one
          video1.style.display = 'none';
          video2.style.display = 'block';
          
          // Play the second video
          video2.play().then(() => {
            console.log('🎬 Second video started playing');
          }).catch((error) => {
            console.error('❌ Error playing second video:', error);
          });
        };

        // When the second video ends, close the player
        video2.onended = () => {
          console.log('🎬 Both videos finished, closing player');
          this.closePlayer();
        };
      } else {
        console.error('❌ Video elements not found in DOM');
        alert('Video player not available. Please refresh the page and try again.');
      }
    }, 100); // Increased timeout to ensure DOM is ready
  }

  // Method to close the video player
  closePlayer(): void {
    console.log('🎬 Closing video player');
    this.isPlayerVisible = false;
    
    // Reset video states when closing
    if (this.isBrowser) {
      setTimeout(() => {
        const video1 = document.getElementById('introVideo1') as HTMLVideoElement;
        const video2 = document.getElementById('introVideo2') as HTMLVideoElement;
        
        if (video1) {
          video1.pause();
          video1.currentTime = 0;
          video1.style.display = 'block';
        }
        
        if (video2) {
          video2.pause();
          video2.currentTime = 0;
          video2.style.display = 'none';
        }
      }, 100);
    }
  }

  // Helper method to get safe animation delay
  getAnimationDelay(index: number): string {
    return `${index * 0.2}s`;
  }
}
