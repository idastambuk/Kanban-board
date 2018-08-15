import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import { DragulaOptions } from 'dragula';
import { ToastrService } from 'ngx-toastr';
import * as _ from "lodash";

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
				this.updateTaskHelper(dataToSend, newStatus);
			})
		);

	}

	////  General task list variables ////

	title = "Kanban board";
	subs = new Subscription();

	private tasks;

	private fnRun = false;

	//////////////

	////Visualization directive variables /////

	//tag groupings

	group1 = ["frontend", "backend", "system"];
	group2 = ["feature", "bug"];

	////////////////////////


	/////Dragula variables/////

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

	////////////////////////

	////Filtering variables/////

	//For checking if new filtered c. is the same as previous

	private tasks_helper = [];

	private subscription: Subscription;

	private tasksWithTags = [];

	////////////////////////
	

	ngOnInit() {
		this.subscription = this.sharedService.tasksSubject$
			.subscribe(
				res => {
					this.tasks = res;
					if(this.fnRun === false) this.taskColumnsFn(this.tasks);
					this.visualizedDataCompiler(this.tasks);	
				}
			);
		this.sharedService.taskHandler();
	};

	/////Dragula helper methods/////

	//Generate arrays to be attached to status columns

	taskColumnsFn(tasks) {
		this.tasks_helper = [...tasks];
		for (let task of tasks) {
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

	
	//////Filter methods ////////

	filterUsers(terms) {
			if(terms.target.value.includes(':')) {
			let index = terms.target.value.indexOf(":"); 
			let attr =  terms.target.value.substr(0, index).toLowerCase().split(' ').join('');
			let value = terms.target.value.substr(index + 1).split(' ').join('');

				if(terms.target.value.includes(",") ) {
					let lastIndex = terms.target.value.lastIndexOf(","); 
					let lastValue = terms.target.value.substr(lastIndex + 1).split(' ').join('');
					this.emptyIfNew(attr, lastValue, false);

				} 
				else this.emptyIfNew(attr, value, true);
			}

			//If user searched, but deleted the entire query
			else if(terms.target.value.length === 0) this.filterAttr('any', '');
	}

	emptyIfNew(attr, value, isNew) {
		if(isNew) {
			let arr = this.filterAttr(attr, value);
			this.renderNew(arr);
		}
		else {
			let arr = this.filterAttr(attr, value);
			this.pushToExisting(arr);
		}
	}
	
	
	filterAttr(attribute, value) {
		let newArr = [...this.tasks];
		if(attribute === 'any') {
			//Reset items in the task list from previous search
			return this.tasks;
		}
		else {
			let filteredArr = newArr.filter((element) => {
				if(element[attribute] && element[attribute] instanceof Array) {
					let doesContain = false;
					element[attribute].forEach((el)=> {
						if(el.name &&  el.name.toLowerCase().includes(value.toLowerCase())) {
							doesContain = true;
						}
					})
					return doesContain;
				}
				else if(element[attribute] && typeof element[attribute] === 'object') {
					if (element[attribute].name.toLowerCase().includes(value.toLowerCase()))
					return true;
				}
				else if(element[attribute] &&  element[attribute].toLowerCase().includes(value.toLowerCase()))
				return true;
			})

			return filteredArr;
		}
	}

	renderNew(newArray) {
			//Reset items in the task list
	
			this.to_do.length = 0;
			this.in_progress.length = 0;
			this.done.length = 0;
			
			//Update the model for dragula
			this.taskColumnsFn(newArray);
			
	}

	pushToExisting(array) {
		//Dont push items if new query has the same results as the previous one
		if(!this.isArrayEqual(this.tasks_helper, array)) {
			this.taskColumnsFn(array);
		}
	}
                
		//Check if rendered content and new content are the same

	isArrayEqual(oldArr, newArr) {
		return _(oldArr).differenceWith(newArr, _.isEqual).isEmpty();
	};
	

	//// Visualisation helper methods //////

		//Method for generating data to be passed into the visualisation.directive

	visualizedDataCompiler(tasks) {
		this.tasksWithTags = []; 
		tasks.forEach(element => {
			let tags = element.tags.map(el => el.name);
			this.tasksWithTags.push(tags);
		});
	}

	///API (and api helper) methods /////

	updateTaskHelper(data, status) {

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

		this.updateTask(data.id, dataToSend);
	}


		//Send updated task
	updateTask(id, dataToSend) {
		this.boardService.updateTask(id, dataToSend)
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

	onLogout() {
		localStorage.clear();
		this.router.navigate(['/login']);
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
