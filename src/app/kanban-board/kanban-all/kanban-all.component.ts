import { Component, OnInit, OnDestroy } from '@angular/core';
import { KanbanBoardService } from '../../services/kanban-board-service/kanban-board.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/forkJoin';
import { SharedService } from '../../services/shared-service/shared.service';
import { DragulaService } from '../../../../node_modules/ng2-dragula';
import { DragulaOptions } from '../../../../node_modules/@types/dragula';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
 



@Component({
	selector: 'nga-kanban-all',
	templateUrl: './kanban-all.html',
	styleUrls: ['./kanban-all.scss']
})

export class KanbanAllComponent implements OnInit, OnDestroy{
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private sharedService: SharedService,
		private dragulaService: DragulaService, 
		private toastr: ToastrService,
		private boardService: KanbanBoardService
	) {

		const group: any = this.dragulaService.find('ITEMS');
		if (group !== undefined ) this.dragulaService.destroy('ITEMS');
		dragulaService.createGroup('ITEMS', {
			accepts: (el) => {
				let isTrue = (el.attributes['blocked'].value === 'true'); 
				this.toastr.toastrConfig.preventDuplicates = true;
				if(isTrue) this.toastr.error('Task cannot be moved. Make sure it is not blocked by any other tasks');
				return !isTrue;
			},
		});

		this.subs.add(dragulaService.dropModel(this.ITEMS)
			.subscribe(({ target, item }) => {
				let dataToSend = {...item};
				let newStatus = target.attributes['code'].value;
				this.updateTask(dataToSend, newStatus);
			})
		);

	}

	private tasks;

	subs = new Subscription();

	//Dragula options

	private to_do: Object[] = [];
	private in_progress: Object[] = [];
	private done: Object[] = [];

	ITEMS = 'ITEMS';

	public groups:Array<any> = [
		{
		  name: 'To Do',
		  code: 'TODO',
		  items: this.to_do
		},
		{
			name: 'In Progress',
			code: 'IN_PROGRESS',
			items: this.in_progress,
		},
		{
			name: 'Done',
			code: 'DONE',
			items: this.done,
		}
	  ];

	options: DragulaOptions = {
		revertOnSpill: true,
	}
		

	private fnRun = false;

	private subscription: Subscription;

	ngOnInit() {
		this.subscription = this.sharedService.tasksSubject$
			.subscribe(
				res => {
					this.tasks = res;
					this.taskColumnsFn();
				}
			);
		this.sharedService.taskHandler();		
	};

	taskColumnsFn() {
		if(this.fnRun === false) {
			for (let task of this.tasks) {
				for(let b of task.blockedBy) {
					if(b['status'] !== "DONE") {
						task['blocked'] = true;
					}
				}
				switch (task.status) {
					case "TODO":
						this.to_do.push(task);
						break;
					case "IN_PROGRESS":
						this.in_progress.push(task);
						break;
					case "DONE":
						this.done.push(task);
						break;
					default:
							break;
				}
			}
			this.fnRun = true;
		}
	}

	updateTask(data, status) {

		let blocked = [];
		let tags = [];

		let dataToSend = {...data};

		data.assignee ? dataToSend['assignee'] = data.assignee.id : dataToSend['assignee'] = '';
		dataToSend['reporter'] = data.reporter.id;
		dataToSend['status'] = status;
		delete dataToSend['blocked'];

		for(let tag of data.tags) {
			tags.push(tag.id);}
		dataToSend['tags'] = tags;

		for(let b of data.blockedBy) {
			blocked.push(b.id);}
		dataToSend['blockedBy'] = blocked;


		//Send updated task
		this.boardService.updateTask(data.id, dataToSend)
			.subscribe(
				res => {
					this.toastr.success('Task successfully updated')
				},
				error => {
					this.toastr.error(error);
				}
			)
	}

	onAddTask() {
		this.router.navigate(['../add'], {relativeTo: this.route});
	}

	onEditTask(id) {
		this.router.navigate(['../', id, 'edit'], {relativeTo: this.route});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
