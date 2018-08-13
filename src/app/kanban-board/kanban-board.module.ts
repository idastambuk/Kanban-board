import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { routing } from './kanban-board.routing';
import { KanbanBoardComponent } from './kanban-board.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { KanbanAllComponent } from './kanban-all/kanban-all.component';
import { SharedService } from '../services/shared-service/shared.service';
import { DragulaModule, DragulaService } from '../../../node_modules/ng2-dragula';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		routing, 
		MultiselectDropdownModule, 
		DragulaModule
	],
	declarations: [
		KanbanBoardComponent, 
		KanbanAllComponent,
		AddTaskComponent,
		EditTaskComponent
	], 
	providers: [
		SharedService,
		DragulaService
	]
})
export class KanbanBoardModule {}
