import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


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
import { DndModule } from 'ng2-dnd';
import { SharedService } from './services/shared-service/shared.service';
import { DragulaModule } from 'ng2-dragula';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule, 
    ReactiveFormsModule, 
    HttpModule,
    HttpClientModule,
    MultiselectDropdownModule,
    KanbanBoardModule,
    DndModule.forRoot()
  ],
  providers: [
    AuthService, 
    AuthGuard,
    KanbanBoardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
