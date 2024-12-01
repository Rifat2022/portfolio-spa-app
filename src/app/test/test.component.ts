import { Component, EventEmitter, Output, ViewChild, ViewContainerRef, Renderer2, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

export class InputType {
  text: string;
  textarea: string;
  file: string;
  constructor(text: string, textarea: string, file: string) {
    this.text = text;
    this.textarea = textarea;
    this.file = file;
  }
}

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
  // "title", "slug", "meta-title", "meta-description", "blog-video"
  uniqueProperties: string[] = [];
  isEditMode: boolean = false;
  progress: number = 0;
  message: string = '';
  serial = 0;
  Tools: any = {
    title: 'title',
    coverPhoto: 'cover-photo',
    heading: 'heading',
    slug: 'slug',
    metaTitle: 'meta-title',
    metaDescription: 'meta-description',
    blogContent: 'blog-content',
    contentPhoto: 'content-photo',
    contentVideo: 'content-video',
  }

  InputType = {
    textInput: ['title', 'heading', 'slug', 'meta-title', 'meta-description'],
    textareaInput: ["blog-content"],
    fileInput: ['cover-photo', 'content-photo', 'content-video']
  }
  newBlog!: {
    fileContainer: { selectedTool: string; serial: number; file: File }[];
    contentContainer: { selectedTool: string; serial: number; blogContent: string }[];
  };
  /**
   * Constructor
   */
  constructor(private fb: FormBuilder, private http: HttpClient, private renderer2: Renderer2) {
  }

  ngOnInit(): void {
    this.newBlog = {
      fileContainer: [],
      contentContainer: [],
    };
  }

  ngAfterViewInit(): void {

  }

  CreateBlogElementsBySelectedTool(element: HTMLElement) {
    const selectedTool = element?.id;
    if (!this.IsValidateBlogElement(selectedTool)) {
      return;
    }
    if (!this.uniqueProperties.includes(selectedTool)) {
      this.uniqueProperties.push(selectedTool);
    }
    let inputType: string = this.GetInputType(selectedTool);

    let newlyCreatedParentDiv = this.CreateElements(inputType, selectedTool)
    // loads into DOM
    this.renderer2.appendChild(this.container.element.nativeElement, newlyCreatedParentDiv);
  }

  CreateBlogsChildElement(contentType: string) {
    let inputType: string = this.GetInputType(contentType);
    let newlyCreatedParentDiv = this.CreateElements(inputType, contentType)
    return newlyCreatedParentDiv;
  }

  IsValidateBlogElement(tool: string): boolean {
    if (!tool || this.uniqueProperties.includes(tool)) {
      this.CreateWarning(`Multiple ${tool} not alowed!`);
      return false
    }
    return true;
  }
  GetInputType(selectedtool: string): string {
    if (this.InputType.textInput.includes(selectedtool)) {
      return 'text';
    }
    else if (this.InputType.textareaInput.includes(selectedtool)) {
      return 'textarea';
    }
    else if (this.InputType.fileInput.includes(selectedtool)) {
      return 'file';
    }
    else {
      return '';
    }
  }

  CreateElements(type: string, selectedTool: string) {
    const newParentDiv = this.renderer2.createElement('div');
    const label = this.renderer2.createElement('label');
    const inputElement = (type === 'textarea') ? this.renderer2.createElement('textarea') : this.renderer2.createElement('input');
    let newLabel = this.ConfigureLabel(label, selectedTool);
    let newInput = this.ConfigureInput(inputElement, selectedTool);
    this.ConfigureInputType(type, inputElement, selectedTool);
    this.BindInputElementWithValue(inputElement, type, selectedTool); //bind the type with user Event
    this.renderer2.addClass(newParentDiv, "mb-3");
    let newElementDiv = this.AddLabelAndInputElementInNewDiv(newParentDiv, newLabel, newInput);
    return newElementDiv;
  }

  ConfigureLabel(label: string, selectedTool: string) {
    // Configure label
    this.renderer2.setAttribute(label, 'for', selectedTool);
    this.renderer2.appendChild(label, this.renderer2.createText(selectedTool.toUpperCase()));
    this.renderer2.addClass(label, "mb-2") // add bootstrap class to label
    this.renderer2.addClass(label, "fw-bold") // add bootstrap class to label
    return label;
  }

  ConfigureInput(inputElement: string, selectedTool: string) {
    // Configure input
    this.renderer2.setAttribute(inputElement, 'id', selectedTool);
    this.renderer2.setAttribute(inputElement, 'name', selectedTool);
    if (selectedTool === this.Tools.title) {
      this.renderer2.setAttribute(inputElement, 'placeholder', `eg. Why Everyone Should Learn Programming`);
    }
    if (selectedTool === this.Tools.heading) {
      this.renderer2.setAttribute(inputElement, 'placeholder', `eg. Top Reasons to Start Your Programming Journey Today`);
    }
    if (selectedTool === this.Tools.metaTitle) {
      this.renderer2.setAttribute(inputElement, 'placeholder', `eg. Benefits of Learning Programming - Unlock Your Potential`);
    }
    if (selectedTool === this.Tools.metaDescription) {
      this.renderer2.setAttribute(inputElement, 'placeholder', `eg. Discover how learning programming can boost your career, enhance problem-solving skills, and unlock endless opportunities in the tech world.`);
    }
    if (selectedTool === this.Tools.slug) {
      this.renderer2.setAttribute(inputElement, 'placeholder', `eg. why-learn-programming`);
    }

    this.renderer2.addClass(inputElement, 'form-control');
    if (selectedTool === this.Tools.coverPhoto || selectedTool === this.Tools.contentPhoto || selectedTool === this.Tools.contentVideo) {
      this.renderer2.addClass(inputElement, 'w-50');
    }
    return inputElement
  }

  ConfigureInputType(type: string, inputElement: any, selectedTool: string) {
    if (type === 'textarea') {
      this.renderer2.setAttribute(inputElement, 'rows', '10');
    }
    else if (type === 'file') {
      this.renderer2.setAttribute(inputElement, 'type', 'file');
      this.renderer2.setAttribute(inputElement, 'accept', selectedTool == 'blog-photo' ? 'image/*' : 'video/*');
    }
    else if (type === "text") {
      this.renderer2.setAttribute(inputElement, 'type', type);
    }
  }

  AddLabelAndInputElementInNewDiv(parentDiv: any, labelElement: any, inputElement: any) {
    this.renderer2.appendChild(parentDiv, labelElement);
    this.renderer2.appendChild(parentDiv, inputElement)
    return parentDiv;
  }

  BindInputElementWithValue(inputElement: HTMLInputElement, type: string, selectedTool: string) {
    this.serial++;
    let eventName = 'input';
    if (type === 'file') {
      this.renderer2.listen(inputElement, eventName, (event: Event) => {
        const files = (event.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          const newFileContainer = Array.from(files).map(file => ({
            selectedTool: selectedTool,
            serial: this.serial,
            file: file,
          }));

          this.newBlog.fileContainer.push(...newFileContainer); // Push all files 
        }
      })
    }
    else {
      this.renderer2.listen(inputElement, eventName, (event: Event) => {

        let contentValue = (event?.target as HTMLInputElement)?.value;
        let newContentContainer = {
          selectedTool: selectedTool,
          serial: this.serial,
          blogContent: contentValue
        }
        this.newBlog.contentContainer.push(newContentContainer);
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
