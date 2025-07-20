import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { Workout } from '../../models/exercise.model';

@Component({
  selector: 'app-workout-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workout-history.component.html',
  styleUrls: ['./workout-history.component.css']
})
export class WorkoutHistoryComponent implements OnInit {
  workouts: Workout[] = [];
  selectedWorkout: Workout | null = null;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.storageService.workouts$.subscribe(workouts => {
      this.workouts = workouts.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  }

  selectWorkout(workout: Workout): void {
    this.selectedWorkout = this.selectedWorkout?.id === workout.id ? null : workout;
  }

  deleteWorkout(workout: Workout): void {
    if (confirm('Are you sure you want to delete this workout?')) {
      this.storageService.deleteWorkout(workout.id);
      if (this.selectedWorkout?.id === workout.id) {
        this.selectedWorkout = null;
      }
    }
  }

  getTotalSets(workout: Workout): number {
    return workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  }

  getCompletedSets(workout: Workout): number {
    return workout.exercises.reduce((total, exercise) => 
      total + exercise.sets.filter(set => set.completed).length, 0
    );
  }

  getTotalWeight(workout: Workout): number {
    return workout.exercises.reduce((total, exercise) => 
      total + exercise.sets.reduce((setTotal, set) => 
        set.completed ? setTotal + (set.weight * set.reps) : setTotal, 0
      ), 0
    );
  }

  getExerciseProgress(exerciseName: string): { weight: number; reps: number; date: Date }[] {
    const progress: { weight: number; reps: number; date: Date }[] = [];
    
    this.workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.exercise.name === exerciseName) {
          exercise.sets.forEach(set => {
            if (set.completed) {
              progress.push({
                weight: set.weight,
                reps: set.reps,
                date: workout.date
              });
            }
          });
        }
      });
    });
    
    return progress.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getEquipmentIcon(equipmentType: string): string {
    const icons: { [key: string]: string } = {
      'barbell': '🏋️',
      'dumbbell': '💪',
      'machine': '⚙️',
      'bodyweight': '🤸',
      'cable': '🔗',
      'other': '🏃'
    };
    return icons[equipmentType] || '💪';
  }
}