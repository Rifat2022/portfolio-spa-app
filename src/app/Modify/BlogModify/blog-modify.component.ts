import { Component, EventEmitter, Output, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FileDetails } from '../../Shared/models/FileDetails.model';
import { Blog } from '../../components/blog/blog.model';

@Component({
  selector: 'app-blog-modify',
  standalone: true,
  imports: [],
  templateUrl: './blog-modify.component.html',
  styleUrl: './blog-modify.component.scss'
})
export class BlogModifyComponent {
  @Output() public onUploadFinished = new EventEmitter();
  @ViewChild('dynamicContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  @ViewChild('warning', { read: ViewContainerRef }) warningContainer!: ViewContainerRef;
  // "title", "meta-title", "meta-description", "blog-video"
  uniqueProperties: string[] = [];
  assignedProperties: string[] = [];
  isEditMode: boolean = false;
  progress: number = 0;
  message: string = '';
  serial = 0;

  blogs!:Blog[];

  blogTools: any = {
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

  InputTypeId!: {
    textInput: string [];
    textareaInput: string[];
    fileInput: string[];
  }

  newBlog!: {
    blogId:any,
    title?:string; 
    coverPhoto ?: File | null; 
    heading?: string; 
    slug?: string; 
    metaTitle?: string; 
    metaDescription?: string[]; 
    blogContent: { id:string; serial: number; content: string } [];
    contentPhotos: {  serial: number; file: File |null } [];
    contentVideo?: File |null;
  };
  /**
   * Constructor
   */
  constructor(private renderer2: Renderer2) {
  
  }

  ngOnInit(): void {
    var me = this; 
    me.newBlog = {
      blogId: null, 
      title: '', 
      coverPhoto: null, 
      heading: '', 
      metaTitle: '', 
      metaDescription: [], 
      blogContent: [],
      contentPhotos: [],
      contentVideo: null
    };
    me.uniqueProperties = ['title', 'heading', 'meta-title', 'meta-description', 
      'cover-photo', 'content-video'];
    me.InputTypeId = {
      textInput: ['title', 'heading', 'meta-title', 'meta-description'],
      textareaInput: ["blog-content"],
      fileInput: ['cover-photo', 'content-photo', 'content-video']
    }
  }

  ngAfterViewInit(): void {

  }

  CreateBlogElementsBySelectedTool(element: HTMLElement) {
    var me = this; 
    const selectedTool = element?.id;
    if (!me.IsValidBlogElement(selectedTool)) {
      return;
    }
    let inputType: string = me.GetInputType(selectedTool);
    let newlyCreatedParentDiv = me.CreateElements(inputType, selectedTool)
    // loads into DOM
    me.renderer2.appendChild(me.container.element.nativeElement, newlyCreatedParentDiv);
  }

  // CreateBlogsChildElement(contentType: string) {
  //   let inputType: string = this.GetInputType(contentType);
  //   let newlyCreatedParentDiv = this.CreateElements(inputType, contentType)
  //   return newlyCreatedParentDiv;
  // }

  IsValidBlogElement(selectedTool: string): boolean {
    var me = this; 
    if (me.assignedProperties.includes(selectedTool)) {
      me.CreateWarning(`Multiple ${selectedTool} is not allowed`)
      return false;
    }       
    if(me.uniqueProperties.includes(selectedTool)){
      me.assignedProperties.push(selectedTool); 
    }
    return true; 
  }
  GetInputType(selectedtool: string): string {
    if (this.InputTypeId.textInput.includes(selectedtool)) {
      return 'text';
    }
    else if (this.InputTypeId.textareaInput.includes(selectedtool)) {
      return 'textarea';
    }
    else if (this.InputTypeId.fileInput.includes(selectedtool)) {
      return 'file';
    }
    else {
      return '';
    }
  }

  CreateElements(type: string, toolsItem: string) {
    var me = this; 
    const newParentDiv = me.renderer2.createElement('div');
    const label = me.renderer2.createElement('label');
    const createdType = (type === 'textarea') ? me.renderer2.createElement('textarea') : me.renderer2.createElement('input');
    let newLabel = me.ConfigureLabel(label, toolsItem);
    let newInputElement = me.ConfigureInput(createdType, toolsItem);    
    // me.ConfigureModel(toolsItem)
    me.ConfigureInputType(type, createdType, toolsItem);
    me.BindInputElementWithValue(createdType, type, toolsItem); //bind Event
    me.renderer2.addClass(newParentDiv, "mb-3");
    let newElementDiv = me.AddLabelAndInputElementInNewDiv(newParentDiv, newLabel, newInputElement);
    return newElementDiv;
  }

  // ConfigureModel(toolsItem:string) {
  //   if(toolsItem == this.blogTools.blogContent) {
  //     this.newBlog.blogContent.push({serial:this.serial++, content:''}); 
  //   }
  //   else if(toolsItem == this.blogTools.contentPhoto){
  //     this.newBlog.contentPhotos.push({serial:this.serial++, file: null}); 
  //   }
  // }

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
    var me = this; 
    me.renderer2.setAttribute(inputElement, 'id', `selectedTool-${Date.now()}`);
    me.renderer2.setAttribute(inputElement, 'name', selectedTool);
    if (selectedTool === me.blogTools.title) {
      me.renderer2.setAttribute(inputElement, 'placeholder', `eg. Why Everyone Should Learn Programming`);
    }
    if (selectedTool === me.blogTools.heading) {
      me.renderer2.setAttribute(inputElement, 'placeholder', `eg. Top Reasons to Start Your Programming Journey Today`);
    }
    if (selectedTool === me.blogTools.metaTitle) {
      me.renderer2.setAttribute(inputElement, 'placeholder', `eg. Benefits of Learning Programming - Unlock Your Potential`);
    }
    if (selectedTool === me.blogTools.metaDescription) {
      me.renderer2.setAttribute(inputElement, 'placeholder', `Enter comma( , ) separated description. E.g programming can boost your career, enhance problem-solving skills`);
    }
    me.renderer2.addClass(inputElement, 'form-control');
    if (selectedTool === me.blogTools.coverPhoto || selectedTool === me.blogTools.contentPhoto || selectedTool === me.blogTools.contentVideo) {
      me.renderer2.addClass(inputElement, 'w-50');
    }
    return inputElement
  }

  ConfigureInputType(type: string, inputElement: any, selectedTool: string) {
    var me = this; 
    if (type === 'textarea') {
      me.renderer2.setAttribute(inputElement, 'rows', '10');
    }
    else if (type === 'file') {
      me.renderer2.setAttribute(inputElement, 'type', 'file');
      me.renderer2.setAttribute(inputElement, 'accept', (selectedTool == 'cover-photo') || (selectedTool == 'content-photo') ? 'image/*' : 'video/*');
    }
    else if (type === "text") {
      me.renderer2.setAttribute(inputElement, 'type', type);
    }
  }

  AddLabelAndInputElementInNewDiv(parentDiv: any, labelElement: any, inputElement: any) {
    this.renderer2.appendChild(parentDiv, labelElement);
    this.renderer2.appendChild(parentDiv, inputElement)
    return parentDiv;
  }

  BindInputElementWithValue(inputElement: HTMLInputElement, type: string, toolsItem: string) {    
    // file type has cover-photo, content-photo, content-video
    if (type === 'file') {
      this.renderer2.listen( inputElement, "change", (event: Event) => {
        const files = (event.target as HTMLInputElement).files;
        if (files && files.length > 0) {          
          this.AddFileToNewBlog(toolsItem, files); 
        }
      })
    }
    else {
      // text & textarea type has title, heading, meta title, meta description , blog content, 
      this.renderer2.listen(inputElement, "blur", (event: Event) => {
        let contentValue = (event?.target as HTMLInputElement)?.value;        
        this.AddTextToNewBlog(toolsItem, contentValue)
      })
    }
  }
  AddFileToNewBlog(toolsItem:string, files:any){
    if(toolsItem === this.blogTools.coverPhoto){
      this.newBlog.coverPhoto = files[0];        
    }
    else if(toolsItem === this.blogTools.contentPhoto){ // interested on this one
      const newContentPhoto = {serial : this.serial, file: files[0]}
      this.newBlog.contentPhotos.push(newContentPhoto)
    }
    else if(toolsItem === this.blogTools.contentVideo){
      this.newBlog.contentVideo = files[0];        
    }
  }

  AddTextToNewBlog(toolsItem:string, contentValue:string){
    if(toolsItem === this.blogTools.title){
      this.newBlog.title = contentValue     
    }
    else if(toolsItem === this.blogTools.heading){
      this.newBlog.heading = contentValue
    }
    else if(toolsItem === this.blogTools.metaTitle){
      this.newBlog.heading = contentValue
    }
    else if(toolsItem === this.blogTools.metaDescription){
      let contentValueArr =  contentValue.split(",");
      this.newBlog.metaDescription = {...contentValueArr};
    }
    else if(toolsItem === this.blogTools.blogContent){ // interested on this one
      // let id = this.newBlog.blogContent.filter(bc=>{ return bc.id === })
      // const nbc = {id: , serial : this.serial, content: contentValue}
      // this.newBlog.blogContent.push(nbc)
    }
  }
  CreateBlog($event: Event) {
    console.log(this.newBlog);
  }

  CreateWarning(msg: string) {
    var me = this; 
    // Create a paragraph element
    const paragraph = me.renderer2.createElement('p');
    me.renderer2.setStyle(paragraph, 'color', 'red'); // Set CSS color style
    me.renderer2.setStyle(paragraph, 'margin', '0'); // Optional: Adjust styling for spacing
    // me.renderer2.addClass(paragraph, "opacity-25"); // Optional: Adjust styling for spacing

    // Create a text node with the message
    const textNode = me.renderer2.createText(msg);
    // Append the text node to the paragraph
    me.renderer2.appendChild(paragraph, textNode);

    // Find the warning container and append the paragraph
    const warnDiv = me.warningContainer?.element?.nativeElement;
    if (warnDiv) {
      me.renderer2.appendChild(warnDiv, paragraph);
      // Remove the warning message after 3 seconds
      setTimeout(() => {
        if (warnDiv.contains(paragraph)) {
          me.renderer2.removeChild(warnDiv, paragraph);
        }
      }, 3000);
    }
  }
  ResetBlog($event: any){
    var me = this; 
    me.newBlog = {
      blogId: null, 
      title: '', 
      coverPhoto: null, 
      heading:'', 
      metaTitle:'', 
      metaDescription: [], 
      blogContent: [],
      contentPhotos: [],
      contentVideo: null
    };
  }
}
