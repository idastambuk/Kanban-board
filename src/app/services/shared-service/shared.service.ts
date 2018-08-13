
import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/forkJoin';
import { Router } from '@angular/router';
import { Subject } from '../../../../node_modules/rxjs';
import { KanbanBoardService } from '../kanban-board-service/kanban-board.service';

export interface Task {
    id:string;
    name:string;
    description:string;
    reporter: Object;
    tags: Number[];
    assignee: Object;
    blockedBy: Object[];
    status: string;
}

@Injectable()
export class SharedService {

  constructor(
      private boardService: KanbanBoardService
) {
    this.taskHandler();
}
    private tasks_initial = [];
    private tags;
    private users;

    private tasks_final;

    private tasksSubject:Subject<any> = new Subject<any>();
    tasksSubject$ = this.tasksSubject.asObservable();

    private tagsSubject:Subject<any> = new Subject<any>();
    tagsSubject$ = this.tagsSubject.asObservable();

    private usersSubject:Subject<any> = new Subject<any>();
    usersSubject$ = this.usersSubject.asObservable();



    taskHandler() {
		Observable.forkJoin([
            this.boardService.getAllTasks(),
            this.boardService.getAllTags(),
            this.boardService.getAllUsers(),
        ]).subscribe(results => {
            this.tasks_initial = results[0].data;

            this.tags = results[1].data;
            this.tagsSubject.next(this.tags);

            this.users = results[2].data;
            this.usersSubject.next(this.users);

			this.taskGetInfo();
        });
    }

    taskGetInfo() {

        this.tasks_final = [];

        for(let t of this.tasks_initial) {
            let task: Task = {name: '', id: '', description: '', assignee: {},reporter: {}, status: '', blockedBy: [], tags: []};

            task.id = t.id;
            task.name = t.name;
            task.description = t.description;
            task.reporter = this.getSingleUser(t.reporter);
            task.assignee = this.getSingleUser(t.assignee);
            task.status = t.status;

            for(let blocked of t.blockedBy) {
                task.blockedBy.push(this.getSingleTask(blocked));
            }

            for(let tag of t.tags) {
                task.tags.push(this.getSingleTag(tag));
			}
			this.tasks_final.push(task);
        }
        this.tasksSubject.next(this.tasks_final);
    }

    getFinalTasks() {
        return this.tasks_final;
    }

    getSingleUser(id) {
        for(let user of this.users) {
            if(user.id === id) {
                return user;
            }
        }
    }

    getSingleTask(id) {
        for(let task of this.tasks_initial) {
            if(task.id === id) {
                return task;
            }
        }
    }

    getSingleTag(id) {
        for(let tag of this.tags) {
            if(tag.id === id) {
                return tag;
            }
        }
    }
}
