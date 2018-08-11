import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { routing } from './kanban-board.routing';
import { KanbanBoardComponent } from './kanban-board.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { KanbanBoardService } from '../services/kanban-board-service/kanban-board.service';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		routing
	],
	declarations: [
		KanbanBoardComponent, 
		AddTaskComponent,
		EditTaskComponent
	]
})
export class KanbanBoardModule {}
