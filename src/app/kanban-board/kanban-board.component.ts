import { Component, OnInit } from '@angular/core';
import { KanbanBoardService } from '../services/kanban-board-service/kanban-board.service';

@Component({
	selector: 'nga-kanban-board',
	templateUrl: './kanban-board.html',
})

export class KanbanBoardComponent implements OnInit{
	constructor(
		private boardService: KanbanBoardService
	) { }

	private tasks;

	ngOnInit() {
		this.boardService.getAllTasks()
			.subscribe(
				response => this.tasks = response.data
			)
	}
}
