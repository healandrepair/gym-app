import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { Workout, Exercise, WorkoutExercise, Set } from '../../models/exercise.model';

@Component({
  selector: 'app-workout-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-history.component.html',
  styleUrls: ['./workout-history.component.css']
})
export class WorkoutHistoryComponent implements OnInit {
  workouts: Workout[] = [];
  selectedWorkout: Workout | null = null;
  editingWorkout: Workout | null = null;
  originalWorkout: Workout | null = null;
  exercises: Exercise[] = [];
  
  // Exercise selection for editing
  selectedBodyPart: string = '';
  selectedEquipmentType: string = '';
  bodyParts: string[] = ['Chest', 'Shoulders', 'Back', 'Biceps', 'Triceps', 'Legs'];
  equipmentTypes: string[] = ['barbell', 'dumbbell', 'machine', 'bodyweight', 'cable', 'other'];
  
  // Rename functionality
  renamingWorkoutId: string | null = null;
  renameWorkoutName: string = '';

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.storageService.workouts$.subscribe(workouts => {
      this.workouts = workouts.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
    
    this.storageService.exercises$.subscribe(exercises => {
      this.exercises = exercises;
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

  // Edit mode methods
  startEditingWorkout(workout: Workout): void {
    this.originalWorkout = JSON.parse(JSON.stringify(workout)); // Deep copy
    this.editingWorkout = JSON.parse(JSON.stringify(workout)); // Deep copy
    this.selectedBodyPart = '';
    this.selectedEquipmentType = '';
  }

  cancelEditingWorkout(): void {
    this.editingWorkout = null;
    this.originalWorkout = null;
    this.selectedBodyPart = '';
    this.selectedEquipmentType = '';
  }

  saveEditedWorkout(): void {
    if (this.editingWorkout) {
      this.storageService.updateWorkout(this.editingWorkout);
      this.editingWorkout = null;
      this.originalWorkout = null;
      this.selectedBodyPart = '';
      this.selectedEquipmentType = '';
    }
  }

  isEditingWorkout(workoutId: string): boolean {
    return this.editingWorkout?.id === workoutId;
  }

  // Exercise management in edit mode
  addExerciseToEditingWorkout(exercise: Exercise): void {
    if (this.editingWorkout) {
      const workoutExercise: WorkoutExercise = {
        exercise: exercise,
        sets: []
      };
      this.editingWorkout.exercises.push(workoutExercise);
      this.selectedBodyPart = '';
      this.selectedEquipmentType = '';
    }
  }

  removeExerciseFromEditingWorkout(exerciseIndex: number): void {
    if (this.editingWorkout) {
      this.editingWorkout.exercises.splice(exerciseIndex, 1);
    }
  }

  // Set management in edit mode
  addSetToExercise(exerciseIndex: number): void {
    if (this.editingWorkout) {
      const newSet: Set = {
        id: this.generateId(),
        reps: 0,
        weight: 0,
        completed: false
      };
      this.editingWorkout.exercises[exerciseIndex].sets.push(newSet);
    }
  }

  removeSetFromExercise(exerciseIndex: number, setIndex: number): void {
    if (this.editingWorkout) {
      this.editingWorkout.exercises[exerciseIndex].sets.splice(setIndex, 1);
    }
  }

  toggleSetCompleted(exerciseIndex: number, setIndex: number): void {
    if (this.editingWorkout) {
      this.editingWorkout.exercises[exerciseIndex].sets[setIndex].completed = 
        !this.editingWorkout.exercises[exerciseIndex].sets[setIndex].completed;
    }
  }

  // Exercise filtering for edit mode
  getFilteredExercises(): Exercise[] {
    let filtered = this.exercises;

    if (this.selectedBodyPart) {
      filtered = filtered.filter(exercise => exercise.category === this.selectedBodyPart);
    }

    if (this.selectedEquipmentType) {
      filtered = filtered.filter(exercise => exercise.equipmentType === this.selectedEquipmentType);
    }

    return filtered;
  }

  selectBodyPart(bodyPart: string): void {
    this.selectedBodyPart = bodyPart;
    this.selectedEquipmentType = '';
  }

  selectEquipmentType(equipmentType: string): void {
    this.selectedEquipmentType = this.selectedEquipmentType === equipmentType ? '' : equipmentType;
  }

  clearFilters(): void {
    this.selectedBodyPart = '';
    this.selectedEquipmentType = '';
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Copy workout functionality
  copyWorkout(workout: Workout): void {
    const shouldCopyToToday = confirm('Copy this workout to today? Click OK for today, Cancel to copy with original date.');
    if (shouldCopyToToday) {
      this.storageService.copyWorkout(workout.id);
    } else {
      this.storageService.copyWorkout(workout.id, workout.date);
    }
  }

  // Create today's workout
  createTodaysWorkout(): void {
    const newWorkout = this.storageService.createTodaysWorkout();
    this.selectedWorkout = newWorkout;
  }

  // Rename workout functionality
  startRenamingWorkout(workout: Workout): void {
    this.renamingWorkoutId = workout.id;
    this.renameWorkoutName = workout.name;
  }

  isRenamingWorkout(workoutId: string): boolean {
    return this.renamingWorkoutId === workoutId;
  }

  saveWorkoutRename(workout: Workout): void {
    if (this.renameWorkoutName.trim()) {
      this.storageService.renameWorkout(workout.id, this.renameWorkoutName.trim());
    }
    this.cancelWorkoutRename();
  }

  cancelWorkoutRename(): void {
    this.renamingWorkoutId = null;
    this.renameWorkoutName = '';
  }
}