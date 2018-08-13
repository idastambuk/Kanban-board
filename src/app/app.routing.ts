import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './auth/auth-guard.service';
import { AuthComponent } from './auth/auth.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';

export const routes: Routes = [
  { path: 'register', component: AuthComponent },
  { path: 'login', component: AuthComponent },

  { path: 'kanban-board', component: KanbanBoardComponent},

  { path: '', redirectTo: 'kanban-board', pathMatch: 'full' },
  { path: '**', redirectTo: 'kanban-board' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
