import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth-guard.service';
import { routing } from './app.routing';
import { AuthComponent } from './auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from "@angular/common/http"
import { HttpModule } from '@angular/http';
import { KanbanBoardModule } from './kanban-board/kanban-board.module';
import { KanbanBoardService } from './services/kanban-board-service/kanban-board.service';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    routing,
    FormsModule, 
    ReactiveFormsModule, 
    HttpModule,
    HttpClientModule,
    MultiselectDropdownModule,
    KanbanBoardModule,
    ToastrModule.forRoot({ 
      timeOut: 3500,
  }),
  ],
  providers: [
    AuthService, 
    AuthGuard,
    KanbanBoardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
