export interface Exercise {
  id: string;
  name: string;
  category: string;
  equipmentType?: 'barbell' | 'dumbbell' | 'machine' | 'bodyweight' | 'cable' | 'other';
  description?: string;
}

export interface Set {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: Set[];
  notes?: string;
}

export interface Workout {
  id: string;
  date: Date;
  name: string;
  exercises: WorkoutExercise[];
  duration?: number;
  notes?: string;
}

export interface WorkoutHistory {
  workouts: Workout[];
}