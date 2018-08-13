import { Component, OnInit, OnDestroy } from '@angular/core';
import { KanbanBoardService } from '../../services/kanban-board-service/kanban-board.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/forkJoin';
import { SharedService } from '../../services/shared-service/shared.service';
 



@Component({
	selector: 'nga-kanban-all',
	templateUrl: './kanban-all.html',
})

export class KanbanAllComponent implements OnInit{
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private sharedService: SharedService
	) {
	}

	private tasks;

	ngOnInit() {
		this.sharedService.taskHandler();
		this.sharedService.tasksSubject$
			.subscribe(
				res => {
					this.tasks = res;
				}
			)
	};

	onAddTask() {
		this.router.navigate(['../add'], {relativeTo: this.route});
	}

	onEditTask(id) {
		this.router.navigate(['../', id, 'edit'], {relativeTo: this.route});
	}
}
