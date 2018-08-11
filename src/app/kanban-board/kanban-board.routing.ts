import { Routes, RouterModule } from '@angular/router';
import { KanbanBoardComponent } from './kanban-board.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';


const routes: Routes = [
	{
		path: 'kanban-board',
		component: KanbanBoardComponent,
		children: [
			{ path: 'add', component: AddTaskComponent },
			{ path: ':id/edit', component: EditTaskComponent }
		],
	},
];

export const routing = RouterModule.forChild(routes);
