import { Component, EventEmitter, Output, ViewChild, ViewContainerRef, Renderer2, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, AfterViewInit {
  @Output() public onUploadFinished = new EventEmitter();
  @ViewChild('dynamicContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  @ViewChild('warning', { read: ViewContainerRef }) warningContainer!: ViewContainerRef;
  uniqueProperties: string[] = [];
  blogForm!: FormGroup;
  isEditMode: boolean = false;
  progress: number = 0;
  message: string = '';

  newBlog!: any;
  /**
   * Constructor
   */
  constructor(private fb: FormBuilder, private http: HttpClient, private renderer2: Renderer2) {
  }

  ngOnInit(): void {
    this.newBlog = { files: [] };
  }

  ngAfterViewInit(): void {

  }

  FetchInputType(selectedtool: string): string {
    if (['title', 'heading', 'slug', 'meta-title', 'meta-description'].includes(selectedtool)) {
      return 'text';
    }
    else if (selectedtool === 'blog-content') {
      return 'textarea';
    }
    else if (['blog-photo', 'blog-video'].includes(selectedtool)) {
      return 'file';
    }
    else {
      return '';
    }
  }

  CreateInputsBySelectedTool(element: HTMLElement | Event | any) {
    const selectedTool = element?.id;
    if (!selectedTool || this.uniqueProperties.includes(selectedTool)) {
      this.CreateWarning(`Multiple ${selectedTool} not alowed!`);
      return; 
    }
    this.uniqueProperties.push(selectedTool);
    

    let type: string = this.FetchInputType(selectedTool);
    if (!type) return;

    //Create a parent div, label & an input element type
    const div = this.renderer2.createElement('div');
    const label = this.renderer2.createElement('label');
    const inputElement = (type === 'textarea') ? this.renderer2.createElement('textarea') : this.renderer2.createElement('input');

    // Configure label
    this.renderer2.setAttribute(label, 'for', selectedTool);
    this.renderer2.appendChild(label, this.renderer2.createText(selectedTool.toUpperCase()));
    this.renderer2.addClass(label, "mb-2") // add bootstrap class to label
    this.renderer2.addClass(label, "fw-bold") // add bootstrap class to label


    // Configure input
    this.renderer2.setAttribute(inputElement, 'id', selectedTool);
    this.renderer2.setAttribute(inputElement, 'name', selectedTool);
    this.renderer2.setAttribute(inputElement, 'placeholder', `Enter ${selectedTool}`);
    this.renderer2.addClass(inputElement, 'form-control');

    if (type == 'textarea') {
      this.renderer2.setAttribute(inputElement, 'rows', '10');
    }
    else if (type === 'file') {
      this.renderer2.setAttribute(inputElement, 'type', 'file');
      this.renderer2.setAttribute(inputElement, 'accept', selectedTool == 'blog-photo' ? 'image/*' : 'video/*');
    }
    else {
      this.renderer2.setAttribute(inputElement, 'type', type);
    }
    //bind the type with data
    this.BindInputElementWithValue(inputElement, type);

    //Set margin at the bottom of the div
    this.renderer2.addClass(div, "mb-3")
    // Append children
    this.renderer2.appendChild(div, label);
    this.renderer2.appendChild(div, inputElement)
    // Append div to the dynamic container
    const containerElement = this.container.element.nativeElement;
    this.renderer2.appendChild(containerElement, div);
  }

  BindInputElementWithValue(inputElement: HTMLInputElement, type: string) {
    if (type === 'file') {
      this.renderer2.listen(inputElement, 'input', (event: Event) => {
        const files = (event.target as HTMLInputElement).files;
        if (files) {
          this.newBlog.files = Array.from(files);
        }
      })
    }
    else {
      this.renderer2.listen(inputElement, 'input', (event: Event) => {
        this.newBlog[inputElement.id] = (event?.target as HTMLInputElement)?.value;
      })
    }
  }

  CreateBlog($event: Event) {
    console.log(this.newBlog);
  }

  CreateWarning(msg: string) {
    // Create a paragraph element
    const paragraph = this.renderer2.createElement('p');
    this.renderer2.setStyle(paragraph, 'color', 'red'); // Set CSS color style
    this.renderer2.setStyle(paragraph, 'margin', '0'); // Optional: Adjust styling for spacing
    // this.renderer2.addClass(paragraph, "opacity-25"); // Optional: Adjust styling for spacing
  
    // Create a text node with the message
    const textNode = this.renderer2.createText(msg);  
    // Append the text node to the paragraph
    this.renderer2.appendChild(paragraph, textNode);
  
    // Find the warning container and append the paragraph
    const warnDiv = this.warningContainer?.element?.nativeElement;
    if (warnDiv) {
      this.renderer2.appendChild(warnDiv, paragraph);
      // Remove the warning message after 3 seconds
      setTimeout(() => {
        if (warnDiv.contains(paragraph)) {
          this.renderer2.removeChild(warnDiv, paragraph);
        }
      }, 3000);
    } 
  }
  

}
