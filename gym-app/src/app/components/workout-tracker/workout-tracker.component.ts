import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { Exercise, Workout, WorkoutExercise, Set } from '../../models/exercise.model';

@Component({
  selector: 'app-workout-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-tracker.component.html',
  styleUrls: ['./workout-tracker.component.css']
})
export class WorkoutTrackerComponent implements OnInit {
  exercises: Exercise[] = [];
  currentWorkout: Workout = this.createNewWorkout();
  isWorkoutActive = false;
  selectedExercise: Exercise | null = null;
  
  // Body part and equipment filtering
  selectedBodyPart: string = '';
  selectedEquipmentType: string = '';
  bodyParts: string[] = ['Chest', 'Shoulders', 'Back', 'Biceps', 'Triceps', 'Legs'];
  equipmentTypes: string[] = ['barbell', 'dumbbell', 'machine', 'bodyweight', 'cable', 'other'];
  
  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.storageService.exercises$.subscribe(exercises => {
      this.exercises = exercises;
    });
  }

  createNewWorkout(): Workout {
    return {
      id: this.generateId(),
      date: new Date(),
      name: `Workout ${new Date().toLocaleDateString()}`,
      exercises: [],
      duration: 0
    };
  }

  startWorkout(): void {
    this.isWorkoutActive = true;
    this.currentWorkout = this.createNewWorkout();
  }

  addExerciseToWorkout(exercise: Exercise): void {
    const workoutExercise: WorkoutExercise = {
      exercise: exercise,
      sets: []
    };
    this.currentWorkout.exercises.push(workoutExercise);
  }

  addSet(exerciseIndex: number): void {
    const newSet: Set = {
      id: this.generateId(),
      reps: 0,
      weight: 0,
      completed: false
    };
    this.currentWorkout.exercises[exerciseIndex].sets.push(newSet);
  }

  removeSet(exerciseIndex: number, setIndex: number): void {
    this.currentWorkout.exercises[exerciseIndex].sets.splice(setIndex, 1);
  }

  removeExercise(exerciseIndex: number): void {
    this.currentWorkout.exercises.splice(exerciseIndex, 1);
  }

  toggleSetComplete(exerciseIndex: number, setIndex: number): void {
    this.currentWorkout.exercises[exerciseIndex].sets[setIndex].completed = 
      !this.currentWorkout.exercises[exerciseIndex].sets[setIndex].completed;
  }

  saveWorkout(): void {
    if (this.currentWorkout.exercises.length > 0) {
      this.storageService.addWorkout(this.currentWorkout);
      this.finishWorkout();
    }
  }

  finishWorkout(): void {
    this.isWorkoutActive = false;
    this.currentWorkout = this.createNewWorkout();
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

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
    this.selectedEquipmentType = ''; // Reset equipment filter when changing body part
  }

  selectEquipmentType(equipmentType: string): void {
    this.selectedEquipmentType = this.selectedEquipmentType === equipmentType ? '' : equipmentType;
  }

  clearFilters(): void {
    this.selectedBodyPart = '';
    this.selectedEquipmentType = '';
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