import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
   selector: '[kanban-visualize]'
})
export class KanbanVisualizeDirective implements OnChanges  {
    constructor(public renderer: Renderer2, public element: ElementRef) {
 }

	@Input() elements;
	@Input() groupArr: string[];

	private totalTagsInGroup = 0;
	
	collatedTags;

	//Tag count variables
	 
	private total_tags;
	private tags_object;

	private handled = false;


	ngOnChanges() {
		if(this.elements.length > 0) {
			this.collatedTags = this.visualizeHandler();
			this.createObject();
			this.visualize();
		}
	}

	//Filter and collate incoming data

	visualizeHandler() {
		let filteredEl = this.elements.map(
			element => {
				let arr = element.filter(tag => (this.groupArr.indexOf(tag) > -1));
				return arr;
			});
		return filteredEl.filter(el => el.length!==0);
	}

	createObject() {
		let obj: Object;
		this.total_tags = this.collatedTags.length;
		this.groupArr.forEach(
			el => {
				let numOfInstances =  this.collatedTags.filter(function(element){ return element == el; }).length;
				let o = {[el]: numOfInstances};
				obj = {...obj, ...o};
			}
		)
		this.tags_object = obj;
	}
	
	visualize() {
		if (this.handled === false) {
			let parent = this.element.nativeElement;
			for(let tag in this.tags_object) {
				let c:string = this.tags_object[tag] !== 0 ? ((this.tags_object[tag] / this.total_tags).toFixed(2)) : '0';
				let percentage = parseFloat(c) * 100;
				let tag_el = this.renderer.createElement('div');
				this.renderer.setAttribute(tag_el, 'class', tag);
				this.renderer.setStyle(tag_el, 'width', `${percentage.toString()}%`);
				this.renderer.appendChild(parent, tag_el);
	
			}
		}
		
		this.handled = true;
	}

}