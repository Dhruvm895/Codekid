// beginner.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Level {
  id: number;
  title: string;
  description: string;
  path: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  completed: boolean;
}

@Component({
  selector: 'app-beginner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './beginner.html',
  styleUrls: ['./beginner.css']
})
export class BeginnerComponent {
  levels: Level[] = [
    {
      id: 1,
      title: 'Level 1',
      description: 'Learn what HTML is and create your first webpage with basic structure',
      path: '/lesson/1',
      difficulty: 'easy',
      topics: ['HTML Basics', 'Document Structure', '<html>', '<head>', '<body>'],
      completed: false
    },
    {
      id: 2,
      title: 'Level 2',
      description: 'Master headings and paragraphs to organize your content',
      path: '/lesson/2',
      difficulty: 'easy',
      topics: ['Headings', 'Paragraphs', '<h1>-<h6>', '<p>'],
      completed: false
    },
    {
      id: 3,
      title: 'Level 3',
      description: 'Add style to your text with formatting tags',
      path: '/lesson/3',
      difficulty: 'easy',
      topics: ['Text Formatting', '<strong>', '<em>', '<u>', '<br>'],
      completed: false
    },
    {
      id: 4,
      title: 'Level 4',
      description: 'Organize information using different types of lists',
      path: '/lesson/4',
      difficulty: 'medium',
      topics: ['Lists', '<ul>', '<ol>', '<li>', 'Nested Lists'],
      completed: false
    },
    {
      id: 5,
      title: 'Level 5',
      description: 'Add images and links to make your webpage interactive',
      path: '/lesson/5',
      difficulty: 'medium',
      topics: ['Images', 'Links', '<img>', '<a>', 'Attributes'],
      completed: false
    },
    {
      id: 6,
      title: 'Level 6',
      description: 'Create tables to display data in rows and columns',
      path: '/lesson/6',
      difficulty: 'medium',
      topics: ['Tables', '<table>', '<tr>', '<td>', '<th>'],
      completed: false
    },
    {
      id: 7,
      title: 'Level 7',
      description: 'Build forms to collect user input and information',
      path: '/lesson/7',
      difficulty: 'hard',
      topics: ['Forms', '<form>', '<input>', '<button>', 'Form Controls'],
      completed: false
    },
    {
      id: 8,
      title: 'Level 8',
      description: 'Learn semantic HTML and create a complete webpage',
      path: '/lesson/8',
      difficulty: 'hard',
      topics: ['Semantic HTML', '<header>', '<nav>', '<main>', '<footer>'],
      completed: false
    }
  ];
selectedLevel: any;

  trackByLevelId(index: number, level: Level): number {
    return level.id;
  }

  selectLevel(level: Level) {
    if (this.isLevelLocked(level)) {
      alert('🔒 This level is locked! Complete the previous levels first.');
      return;
    }
    
    console.log('Navigating to', level.path);
    // In your routing setup, navigate to the level
    // this.router.navigate([level.path]);
  }

  isLevelLocked(level: Level): boolean {
    if (level.id === 1) return false; // First level is always unlocked
    
    // Check if previous level is completed
    const previousLevel = this.levels.find(l => l.id === level.id - 1);
    return previousLevel ? !previousLevel.completed : true;
  }

  getCompletedCount(): number {
    return this.levels.filter(level => level.completed).length;
  }

  getProgressPercentage(): number {
    return Math.round((this.getCompletedCount() / this.levels.length) * 100);
  }

  // Method to mark a level as completed (call this when user completes a level)
  markLevelCompleted(levelId: number) {
    const level = this.levels.find(l => l.id === levelId);
    if (level) {
      level.completed = true;
    }
  }
}