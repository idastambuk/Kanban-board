import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { DragulaModule, DragulaService } from 'ng2-dragula';

import { KanbanBoardComponent } from './kanban-board.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { KanbanAllComponent } from './kanban-all/kanban-all.component';

import { routing } from './kanban-board.routing';

import { KanbanVisualizeDirective } from '../directives';
import { SharedService } from '../services';


@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		routing, 
		MultiselectDropdownModule, 
		DragulaModule,
	],
	declarations: [
		KanbanBoardComponent, 
		KanbanAllComponent,
		AddTaskComponent,
		EditTaskComponent,
		KanbanVisualizeDirective
	], 
	providers: [
		SharedService,
		DragulaService
	]
})
export class KanbanBoardModule {}
