import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  exerciseCount = 0;
  workoutCount = 0;
  showConfirmRefresh = false;
  showConfirmClear = false;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.updateStats();
    
    // Subscribe to changes to keep stats updated
    this.storageService.exercises$.subscribe(() => {
      this.exerciseCount = this.storageService.getExerciseCount();
    });
    
    this.storageService.workouts$.subscribe(() => {
      this.workoutCount = this.storageService.getWorkoutCount();
    });
  }

  updateStats(): void {
    this.exerciseCount = this.storageService.getExerciseCount();
    this.workoutCount = this.storageService.getWorkoutCount();
  }

  confirmRefreshExercises(): void {
    this.showConfirmRefresh = true;
  }

  refreshDefaultExercises(): void {
    this.storageService.refreshDefaultExercises();
    this.showConfirmRefresh = false;
    this.updateStats();
  }

  cancelRefreshExercises(): void {
    this.showConfirmRefresh = false;
  }

  confirmClearAllData(): void {
    this.showConfirmClear = true;
  }

  clearAllData(): void {
    this.storageService.clearAllData();
    this.showConfirmClear = false;
    this.updateStats();
  }

  cancelClearAllData(): void {
    this.showConfirmClear = false;
  }

  getAngularVersion(): string {
    return '19.x';
  }
}