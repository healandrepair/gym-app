import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Workout, Exercise, WorkoutHistory } from '../models/exercise.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly WORKOUTS_KEY = 'gym-app-workouts';
  private readonly EXERCISES_KEY = 'gym-app-exercises';
  
  private workoutsSubject = new BehaviorSubject<Workout[]>([]);
  private exercisesSubject = new BehaviorSubject<Exercise[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
      this.initializeDefaultExercises();
    }
  }

  get workouts$(): Observable<Workout[]> {
    return this.workoutsSubject.asObservable();
  }

  get exercises$(): Observable<Exercise[]> {
    return this.exercisesSubject.asObservable();
  }

  private loadData(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const savedWorkouts = localStorage.getItem(this.WORKOUTS_KEY);
    const savedExercises = localStorage.getItem(this.EXERCISES_KEY);

    if (savedWorkouts) {
      const workouts = JSON.parse(savedWorkouts);
      workouts.forEach((workout: any) => {
        workout.date = new Date(workout.date);
      });
      this.workoutsSubject.next(workouts);
    }

    if (savedExercises) {
      this.exercisesSubject.next(JSON.parse(savedExercises));
    }
  }

  private saveWorkouts(workouts: Workout[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.WORKOUTS_KEY, JSON.stringify(workouts));
    }
    this.workoutsSubject.next(workouts);
  }

  private saveExercises(exercises: Exercise[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.EXERCISES_KEY, JSON.stringify(exercises));
    }
    this.exercisesSubject.next(exercises);
  }

  addWorkout(workout: Workout): void {
    const currentWorkouts = this.workoutsSubject.value;
    currentWorkouts.push(workout);
    this.saveWorkouts(currentWorkouts);
  }

  updateWorkout(updatedWorkout: Workout): void {
    const currentWorkouts = this.workoutsSubject.value;
    const index = currentWorkouts.findIndex(w => w.id === updatedWorkout.id);
    if (index !== -1) {
      currentWorkouts[index] = updatedWorkout;
      this.saveWorkouts(currentWorkouts);
    }
  }

  deleteWorkout(workoutId: string): void {
    const currentWorkouts = this.workoutsSubject.value;
    const filteredWorkouts = currentWorkouts.filter(w => w.id !== workoutId);
    this.saveWorkouts(filteredWorkouts);
  }

  copyWorkout(workoutId: string, newDate?: Date): void {
    const currentWorkouts = this.workoutsSubject.value;
    const workoutToCopy = currentWorkouts.find(w => w.id === workoutId);
    
    if (workoutToCopy) {
      const targetDate = newDate || new Date();
      const copiedWorkout: Workout = {
        id: this.generateWorkoutId(),
        name: this.generateWorkoutName(targetDate, workoutToCopy.exercises),
        date: targetDate,
        exercises: workoutToCopy.exercises.map(exercise => ({
          ...exercise,
          sets: exercise.sets.map(set => ({
            ...set,
            id: this.generateSetId(),
            completed: false
          }))
        })),
        duration: 0,
        notes: ''
      };
      
      this.addWorkout(copiedWorkout);
    }
  }

  renameWorkout(workoutId: string, newName: string): void {
    const currentWorkouts = this.workoutsSubject.value;
    const workoutIndex = currentWorkouts.findIndex(w => w.id === workoutId);
    
    if (workoutIndex !== -1) {
      currentWorkouts[workoutIndex].name = newName;
      this.saveWorkouts(currentWorkouts);
    }
  }

  createTodaysWorkout(): Workout {
    const today = new Date();
    const newWorkout: Workout = {
      id: this.generateWorkoutId(),
      name: this.generateWorkoutName(today),
      date: today,
      exercises: [],
      duration: 0,
      notes: ''
    };
    
    this.addWorkout(newWorkout);
    return newWorkout;
  }

  private generateWorkoutId(): string {
    return 'workout_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateSetId(): string {
    return 'set_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateWorkoutName(date: Date, exercises?: any[]): string {
    const dateStr = date.toLocaleDateString();
    
    if (exercises && exercises.length > 0) {
      const bodyParts = exercises
        .map(ex => ex.exercise?.category)
        .filter((category, index, arr) => arr.indexOf(category) === index)
        .slice(0, 2);
      
      if (bodyParts.length > 0) {
        return `${dateStr} - ${bodyParts.join(' + ')}`;
      }
    }
    
    return `Workout ${dateStr}`;
  }

  addExercise(exercise: Exercise): void {
    const currentExercises = this.exercisesSubject.value;
    currentExercises.push(exercise);
    this.saveExercises(currentExercises);
  }

  private initializeDefaultExercises(): void {
    // What this does is it saves the exercises into local storage, so if you add new exercises it will stick.
    if (this.exercisesSubject.value.length === 0) {
      const defaultExercises: Exercise[] = [
        // Chest
        { id: '1', name: 'Bench Press', category: 'Chest', equipmentType: 'barbell' },
        { id: '2', name: 'Dumbbell Bench Press', category: 'Chest', equipmentType: 'dumbbell' },
        { id: '3', name: 'Incline Bench Press', category: 'Chest', equipmentType: 'barbell' },
        { id: '4', name: 'Incline Dumbbell Press', category: 'Chest', equipmentType: 'dumbbell' },
        { id: '5', name: 'Decline Bench Press', category: 'Chest', equipmentType: 'barbell' },
        { id: '6', name: 'Dumbbell Flyes', category: 'Chest', equipmentType: 'dumbbell' },
        { id: '7', name: 'Push-ups', category: 'Chest', equipmentType: 'bodyweight' },
        { id: '8', name: 'Chest Dips', category: 'Chest', equipmentType: 'bodyweight' },
        { id: '9', name: 'Cable Crossover', category: 'Chest', equipmentType: 'cable' },
        { id: '10', name: 'Pec Deck', category: 'Chest', equipmentType: 'machine' },

        // Shoulders
        { id: '11', name: 'Overhead Press', category: 'Shoulders', equipmentType: 'barbell' },
        { id: '12', name: 'Dumbbell Shoulder Press', category: 'Shoulders', equipmentType: 'dumbbell' },
        { id: '13', name: 'Lateral Raises', category: 'Shoulders', equipmentType: 'dumbbell' },
        { id: '14', name: 'Front Raises', category: 'Shoulders', equipmentType: 'dumbbell' },
        { id: '15', name: 'Rear Delt Flyes', category: 'Shoulders', equipmentType: 'dumbbell' },
        { id: '16', name: 'Arnold Press', category: 'Shoulders', equipmentType: 'dumbbell' },
        { id: '17', name: 'Pike Push-ups', category: 'Shoulders', equipmentType: 'bodyweight' },
        { id: '18', name: 'Cable Lateral Raises', category: 'Shoulders', equipmentType: 'cable' },
        { id: '19', name: 'Face Pulls', category: 'Shoulders', equipmentType: 'cable' },
        { id: '20', name: 'Shoulder Press Machine', category: 'Shoulders', equipmentType: 'machine' },

        // Back
        { id: '21', name: 'Deadlift', category: 'Back', equipmentType: 'barbell' },
        { id: '22', name: 'Barbell Rows', category: 'Back', equipmentType: 'barbell' },
        { id: '23', name: 'Dumbbell Rows', category: 'Back', equipmentType: 'dumbbell' },
        { id: '24', name: 'Pull-ups', category: 'Back', equipmentType: 'bodyweight' },
        { id: '25', name: 'Chin-ups', category: 'Back', equipmentType: 'bodyweight' },
        { id: '26', name: 'Lat Pulldown', category: 'Back', equipmentType: 'cable' },
        { id: '27', name: 'Seated Cable Row', category: 'Back', equipmentType: 'cable' },
        { id: '28', name: 'T-Bar Row', category: 'Back', equipmentType: 'barbell' },
        { id: '29', name: 'Romanian Deadlift', category: 'Back', equipmentType: 'barbell' },
        { id: '30', name: 'Hyperextensions', category: 'Back', equipmentType: 'bodyweight' },

        // Biceps
        { id: '31', name: 'Barbell Curls', category: 'Biceps', equipmentType: 'barbell' },
        { id: '32', name: 'Dumbbell Curls', category: 'Biceps', equipmentType: 'dumbbell' },
        { id: '33', name: 'Hammer Curls', category: 'Biceps', equipmentType: 'dumbbell' },
        { id: '34', name: 'Preacher Curls', category: 'Biceps', equipmentType: 'barbell' },
        { id: '35', name: 'Cable Curls', category: 'Biceps', equipmentType: 'cable' },
        { id: '36', name: 'Concentration Curls', category: 'Biceps', equipmentType: 'dumbbell' },
        { id: '37', name: 'Incline Dumbbell Curls', category: 'Biceps', equipmentType: 'dumbbell' },
        { id: '38', name: 'Chin-ups', category: 'Biceps', equipmentType: 'bodyweight' },
        { id: '39', name: '21s', category: 'Biceps', equipmentType: 'barbell' },
        { id: '40', name: 'Zottman Curls', category: 'Biceps', equipmentType: 'dumbbell' },

        // Triceps
        { id: '41', name: 'Close-Grip Bench Press', category: 'Triceps', equipmentType: 'barbell' },
        { id: '42', name: 'Tricep Dips', category: 'Triceps', equipmentType: 'bodyweight' },
        { id: '43', name: 'Overhead Tricep Extension', category: 'Triceps', equipmentType: 'dumbbell' },
        { id: '44', name: 'Tricep Pushdown', category: 'Triceps', equipmentType: 'cable' },
        { id: '45', name: 'Skull Crushers', category: 'Triceps', equipmentType: 'barbell' },
        { id: '46', name: 'Diamond Push-ups', category: 'Triceps', equipmentType: 'bodyweight' },
        { id: '47', name: 'Kickbacks', category: 'Triceps', equipmentType: 'dumbbell' },
        { id: '48', name: 'French Press', category: 'Triceps', equipmentType: 'barbell' },
        { id: '49', name: 'Rope Pushdowns', category: 'Triceps', equipmentType: 'cable' },
        { id: '50', name: 'Bench Dips', category: 'Triceps', equipmentType: 'bodyweight' },

        // Legs
        { id: '51', name: 'Squat', category: 'Legs', equipmentType: 'barbell' },
        { id: '52', name: 'Front Squat', category: 'Legs', equipmentType: 'barbell' },
        { id: '53', name: 'Goblet Squat', category: 'Legs', equipmentType: 'dumbbell' },
        { id: '54', name: 'Bulgarian Split Squat', category: 'Legs', equipmentType: 'dumbbell' },
        { id: '55', name: 'Lunges', category: 'Legs', equipmentType: 'dumbbell' },
        { id: '56', name: 'Leg Press', category: 'Legs', equipmentType: 'machine' },
        { id: '57', name: 'Leg Extension', category: 'Legs', equipmentType: 'machine' },
        { id: '58', name: 'Leg Curls', category: 'Legs', equipmentType: 'machine' },
        { id: '59', name: 'Calf Raises', category: 'Legs', equipmentType: 'bodyweight' },
        { id: '60', name: 'Romanian Deadlift', category: 'Legs', equipmentType: 'barbell' },
        { id: '61', name: 'Stiff Leg Deadlift', category: 'Legs', equipmentType: 'dumbbell' },
        { id: '62', name: 'Walking Lunges', category: 'Legs', equipmentType: 'dumbbell' },
        { id: '63', name: 'Wall Sit', category: 'Legs', equipmentType: 'bodyweight' },
        { id: '64', name: 'Jump Squats', category: 'Legs', equipmentType: 'bodyweight' }
      ];
      this.saveExercises(defaultExercises);
    }
  }

  getWorkoutHistory(): WorkoutHistory {
    return { workouts: this.workoutsSubject.value };
  }

  refreshDefaultExercises(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Clear existing exercises from localStorage
      localStorage.removeItem(this.EXERCISES_KEY);
      
      // Reset the subject to empty array
      this.exercisesSubject.next([]);
      
      // Reinitialize with fresh default exercises
      this.initializeDefaultExercises();
    }
  }

  clearAllData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.WORKOUTS_KEY);
      localStorage.removeItem(this.EXERCISES_KEY);
      this.workoutsSubject.next([]);
      this.exercisesSubject.next([]);
      this.initializeDefaultExercises();
    }
  }

  getExerciseCount(): number {
    return this.exercisesSubject.value.length;
  }

  getWorkoutCount(): number {
    return this.workoutsSubject.value.length;
  }
}