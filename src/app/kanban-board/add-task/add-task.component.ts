import { Component, Input } from "@angular/core";
import { OnInit, OnChanges, OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";

import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";

import { STATUS } from '../../services';
import { SharedService } from '../../services';
import { KanbanBoardService } from '../../services';





@Component({
	selector: 'nga-add-edit-task',
	templateUrl: './add-task.html',
	styleUrls: ['./add-task.scss'],
})


export class AddTaskComponent implements OnInit, OnChanges, OnDestroy {

    constructor(
		private formBuilder: FormBuilder,
		private boardService: KanbanBoardService, 
		private sharedService: SharedService,
		private route: ActivatedRoute,
		private router: Router, 
		private toastr: ToastrService
		) {
	}

	@Input() singleTask;

	assignee: Object = {};

	title; 

	private isNew = true;

	private status = [...STATUS];
	private users: Array<Object>;
	private taskForm: FormGroup;

	private all_tags: any;
	private all_tasks;
	private reporter:any = {name: '', id: ''};

	private subscriptionTags: Subscription;
	private subscriptionTasks: Subscription;
	private subscriptionUsers: Subscription;

	//Multiselect options

	private myTexts: IMultiSelectTexts = {
        searchPlaceholder: 'Search tasks',
        searchEmptyResult: 'No tasks match your query',
		defaultTitle: 'Add task',
		checkAll: 'Select all',
   		uncheckAll: 'Remove all',
	};

	private dropdownSettings: IMultiSelectSettings = {
        enableSearch: true,
        checkedStyle: 'fontawesome',
        buttonClasses: 'btn btn-add',
        dynamicTitleMaxItems: 10,
        fixedTitle: true,
        closeOnClickOutside: true,
        selectionLimit: 0,
        autoUnselect: true,
		containerClasses: 'dropdown-members', 
		showCheckAll: true,
		showUncheckAll: true,
		selectAddedValues: true, 
		maxHeight: '250px',
		loadViewDistance: 1,
		stopScrollPropagation: true,
		ignoreLabels: true,
    };

	ngOnInit() {

		this.taskForm = this.formBuilder.group ({
			'name': [null, Validators.required],
			'reporter': ['', {disabled: true}],
			'description': [null, Validators.minLength(15)], 
			'status': [this.status[0].code],
			'assignee': [null,Validators.required],
			'tags': this.formBuilder.array([]),
			'blockedBy': [[]]
		  });
		
		this.getReporter();

		this.sharedService.taskHandler();

		this.subscriptionTags = this.sharedService.tagsSubject$.subscribe(
			response => this.all_tags = response
		);

		this.subscriptionTasks = this.sharedService.tasksSubject$.subscribe(
			response => this.all_tasks = response
		);

		this.subscriptionUsers = this.sharedService.usersSubject$.subscribe(
			response => this.users = response
		);

		this.route.url.subscribe(route => {
			this.isNew = route[route.length - 1].path === 'add';
			this.title = this.isNew ? 'Add task': 'Edit Task';
		});
	}

	ngOnChanges() {
		if(this.singleTask) {
			this.reporter = this.singleTask.reporter;
			this.taskForm.value.reporter = this.reporter;
		} else this.getReporter();

		if(this.singleTask && this.all_tags) {
			let tags = [...this.all_tags];
			for(let t in this.singleTask.tags) {
				tags.forEach(function(el) {
					if(el.checked === true) return;
					if(el.id == this.singleTask.tags[t]) {
						el['checked'] = true;
						this.onAddTag(el.id, true);
					}
					else el['checked'] = false;
				}, this)
			}
			this.all_tags = tags;

			let blocked = [];

			for(let task of this.singleTask.blockedBy) {
				blocked.push(task['id']);
			};
			this.singleTask.blockedBy = blocked;

			if(this.singleTask.assignee) {
				this.assignee['id'] = this.singleTask.assignee['id'];
				this.assignee['name'] = this.singleTask.assignee['name'];
			}

			this.taskForm.value.status = this.singleTask.status;
			this.taskForm.patchValue(this.singleTask, { onlySelf: true });	
		}
	}

	getReporter() {
		this.boardService.getMyData()
			.subscribe(
				response => {
					if(!this.singleTask) {
						this.reporter = response.data;
					}
				}
			)
	}

	onAddTag(id, isChecked) {
		const tags = <FormArray>this.taskForm.controls.tags;

		if(isChecked) {
			if(!this.taskForm.value.tags.includes(id)) {
				tags.push(new FormControl(id));
			}
		} else {
			let index = tags.controls.findIndex(i => i.value == id)
			tags.removeAt(index);
		}
	}
	
	submitForm() {
		if(this.isNew) {
			let dataToSend = {...this.taskForm.value};

			dataToSend['assignee'] = this.taskForm.value.assignee.id;
			dataToSend['reporter'] = this.reporter.id;

			this.boardService.createNewTask(dataToSend)
			.subscribe(
				response => {
					this.taskForm.reset();
					this.router.navigate(['../'], {relativeTo: this.route});
				},
				error => this.toastr.error(error)
			)
		} 	
		else {
			let dataToSend = {...this.taskForm.value};
			dataToSend['assignee'] = this.taskForm.value.assignee.id;
			dataToSend['reporter'] = this.reporter.id;
			dataToSend['blockedBy']

			this.boardService.updateTask(this.singleTask.id, dataToSend)
			.subscribe(
				response => {
					this.taskForm.reset();
					this.router.navigate(['../'], {relativeTo: this.route});
				},
				error => this.toastr.error(error)
			)
		}	
	}
	onBack() {
		this.router.navigate(['../'], {relativeTo: this.route});
	}

	compareFn(c1: any, c2:any): boolean {     
		return c1 && c2 ? c1.id === c2.id : c1 === c2; 
   }

	ngOnDestroy() {
		this.subscriptionTags.unsubscribe();
		this.subscriptionTasks.unsubscribe();
		this.subscriptionUsers.unsubscribe();
	}
}
