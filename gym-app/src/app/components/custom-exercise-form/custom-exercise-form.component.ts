import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Exercise } from '../../models/exercise.model';

@Component({
  selector: 'app-custom-exercise-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-exercise-form.component.html',
  styleUrls: ['./custom-exercise-form.component.css']
})
export class CustomExerciseFormComponent {
  @Output() exerciseCreated = new EventEmitter<Exercise>();
  @Output() cancelled = new EventEmitter<void>();

  exerciseName: string = '';
  selectedBodyPart: string = '';
  selectedEquipmentType: string = '';
  exerciseDescription: string = '';

  bodyParts: string[] = ['Chest', 'Shoulders', 'Back', 'Biceps', 'Triceps', 'Legs'];
  equipmentTypes: {value: string, label: string, icon: string}[] = [
    { value: 'barbell', label: 'Barbell', icon: '🏋️' },
    { value: 'dumbbell', label: 'Dumbbell', icon: '💪' },
    { value: 'machine', label: 'Machine', icon: '⚙️' },
    { value: 'bodyweight', label: 'Bodyweight', icon: '🤸' },
    { value: 'cable', label: 'Cable', icon: '🔗' },
    { value: 'other', label: 'Other', icon: '🏃' }
  ];

  isValid(): boolean {
    return this.exerciseName.trim().length > 0 && 
           this.selectedBodyPart.length > 0 && 
           this.selectedEquipmentType.length > 0;
  }

  createExercise(): void {
    if (!this.isValid()) {
      return;
    }

    const newExercise: Exercise = {
      id: this.generateExerciseId(),
      name: this.exerciseName.trim(),
      category: this.selectedBodyPart,
      equipmentType: this.selectedEquipmentType as any,
      description: this.exerciseDescription.trim() || undefined
    };

    this.exerciseCreated.emit(newExercise);
    this.resetForm();
  }

  cancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  private resetForm(): void {
    this.exerciseName = '';
    this.selectedBodyPart = '';
    this.selectedEquipmentType = '';
    this.exerciseDescription = '';
  }

  private generateExerciseId(): string {
    return 'custom_exercise_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}