import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutTrackerComponent } from './components/workout-tracker/workout-tracker.component';
import { WorkoutHistoryComponent } from './components/workout-history/workout-history.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, WorkoutTrackerComponent, WorkoutHistoryComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gym-app';
  activeTab = 'tracker';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}