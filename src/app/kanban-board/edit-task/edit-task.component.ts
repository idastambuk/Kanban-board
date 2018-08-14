import { Component } from "@angular/core";
import { OnInit, OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";
import { ActivatedRoute } from "@angular/router";
import { KanbanBoardService } from "../../services/kanban-board-service/kanban-board.service";
import { Subject, Subscription } from "rxjs";
import 'rxjs/add/operator/takeUntil';
import { SharedService } from "../../services/shared-service/shared.service";


@Component({
	selector: 'nga-edit-task',
	templateUrl: './edit-task.html',
	styleUrls: ['./edit-task.scss'],
})


export class EditTaskComponent implements OnInit, OnDestroy {

    constructor(
		private route: ActivatedRoute,
		private sharedService: SharedService 
		
		) {
		}

	id;
	all_tasks = [];
	task;

	private subscription: Subscription;
	


	ngOnInit() {
		this.route.params.subscribe(params =>{
			this.id = params['id'];
			this.sharedService.taskHandler();
			this.subscription = this.sharedService.tasksSubject$.subscribe(
				response => {
					this.all_tasks = response;
					this.getTask();
				}
			)
		});

	}

	getTask() {
		for (let t of this.all_tasks) {
			if(t.id == this.id) {
				let tag_ids = [];
				if(t.tags.length > 0) {
					for(let tag of t.tags) {
						tag_ids.push(tag.id)
					}
					t.tags = tag_ids;
					this.task = t;
				}
			}
		}
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}	
}
