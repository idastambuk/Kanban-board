import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import { DragulaOptions } from 'dragula';
import { ToastrService } from 'ngx-toastr';

import { SharedService } from '../../services';
import { KanbanBoardService } from '../../services';


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

	title = "Kanban board";

	subs = new Subscription();

	//Visualization directive tag groupings

	group1 = ["frontend", "backend", "system"];
	group2 = ["feature", "bug"];

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

	private tasksWithTags = [];

	ngOnInit() {
		this.subscription = this.sharedService.tasksSubject$
			.subscribe(
				res => {
					this.tasks = res;
					this.taskColumnsFn();
					this.visualizedDataCompiler(this.tasks);	
				}
			);
		this.sharedService.taskHandler();
	};

	//Generate arrays to be attached to status columns

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

	//Method for generating data to be passed into the visualisation.directive

	visualizedDataCompiler(tasks) {
		this.tasksWithTags = []; 
		tasks.forEach(element => {
			let tags = element.tags.map(el => el.name);
			this.tasksWithTags.push(tags);
		});
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
