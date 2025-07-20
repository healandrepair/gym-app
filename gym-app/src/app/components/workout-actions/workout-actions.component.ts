import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Workout } from '../../models/exercise.model';

@Component({
  selector: 'app-workout-actions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-actions.component.html',
  styleUrls: ['./workout-actions.component.css']
})
export class WorkoutActionsComponent {
  @Input() workout!: Workout;
  @Input() isEditing: boolean = false;
  @Input() isRenaming: boolean = false;
  
  @Output() copyWorkout = new EventEmitter<Workout>();
  @Output() startRenaming = new EventEmitter<Workout>();
  @Output() startEditing = new EventEmitter<Workout>();
  @Output() deleteWorkout = new EventEmitter<Workout>();
  @Output() saveEditing = new EventEmitter<void>();
  @Output() cancelEditing = new EventEmitter<void>();
  @Output() saveRename = new EventEmitter<{workout: Workout, newName: string}>();
  @Output() cancelRename = new EventEmitter<void>();

  renameWorkoutName: string = '';

  onCopyWorkout(event: Event): void {
    event.stopPropagation();
    this.copyWorkout.emit(this.workout);
  }

  onStartRenaming(event: Event): void {
    event.stopPropagation();
    this.renameWorkoutName = this.workout.name;
    this.startRenaming.emit(this.workout);
  }

  onStartEditing(event: Event): void {
    event.stopPropagation();
    this.startEditing.emit(this.workout);
  }

  onDeleteWorkout(event: Event): void {
    event.stopPropagation();
    this.deleteWorkout.emit(this.workout);
  }

  onSaveEditing(event: Event): void {
    event.stopPropagation();
    this.saveEditing.emit();
  }

  onCancelEditing(event: Event): void {
    event.stopPropagation();
    this.cancelEditing.emit();
  }

  onSaveRename(event: Event): void {
    event.stopPropagation();
    if (this.renameWorkoutName.trim()) {
      this.saveRename.emit({
        workout: this.workout,
        newName: this.renameWorkoutName.trim()
      });
    }
  }

  onCancelRename(event: Event): void {
    event.stopPropagation();
    this.cancelRename.emit();
  }

  onRenameKeyUp(event: KeyboardEvent): void {
    event.stopPropagation();
    if (event.key === 'Enter') {
      this.onSaveRename(event);
    } else if (event.key === 'Escape') {
      this.onCancelRename(event);
    }
  }

  onRenameInputClick(event: Event): void {
    event.stopPropagation();
  }
}