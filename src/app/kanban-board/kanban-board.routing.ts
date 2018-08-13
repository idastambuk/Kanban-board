import { Routes, RouterModule } from '@angular/router';
import { KanbanBoardComponent } from './kanban-board.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { AuthGuard } from '../auth/auth-guard.service';
import { KanbanAllComponent } from './kanban-all/kanban-all.component';


const routes: Routes = [
	{
		path: 'kanban-board',
		component: KanbanBoardComponent,
		canActivate: [AuthGuard],
		canActivateChild: [AuthGuard],
		children: [ 
			{ path: '', pathMatch: 'full', redirectTo: 'all'},
			{ path: 'all', component: KanbanAllComponent},
			{ path: 'add', component: AddTaskComponent },
			{ path: ':id/edit', component: EditTaskComponent }
		],
	},
];

export const routing = RouterModule.forChild(routes);
