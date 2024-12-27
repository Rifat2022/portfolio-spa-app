import { Component, EventEmitter, Output, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { Blog } from '../../components/blog/blog.model';
import { FileService } from '../../Shared/Services/file.service';
import { BlogService } from '../../components/blog/blog.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-blog-modify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-modify.component.html',
  styleUrl: './blog-modify.component.scss'
})
export class BlogModifyComponent {
  @Output() public onUploadFinished = new EventEmitter();
  @ViewChild('dynamicContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  @ViewChild('warning', { read: ViewContainerRef }) warningContainer!: ViewContainerRef;
  uniqueProperties: string[] = [];
  assignedProperties: string[] = [];
  isEditMode: boolean = false;
  progress: number = 0;
  message: string = '';
  serial = 0;
  blogs!: Blog[];
  blogTools: any = {
    title: 'title',
    coverPhoto: 'cover-photo',
    slug: 'slug',
    metaTitle: 'meta-title',
    metaDescription: 'meta-description',
    blogContents: 'blog-content',
    contentPhotos: 'content-photo',
    blogVideo: 'blog-video',
  }
  InputTypeId!: {
    textInput: string[];
    textareaInput: string[];
    fileInput: string[];
  }
  newBlog!: {
    blogId: number | undefined,
    title?: string;
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
    blogContents: { serialNo: number; uniqueId: string; content: string }[];
    contentPhotos: { serialNo: number; uniqueId: string; file: File | null }[];
    coverPhoto?: File | null;
    blogVideo?: File | null;
  };
  uniqueIdList: string[]=[];
  /**
   * Constructor
   */
  constructor(
    private renderer2: Renderer2, private toastr: ToastrService,
    private router: Router, private fileService: FileService, private blogService: BlogService
  ) {
    var me = this;
    me.InitializeEmptyProperties();

  }

  ngOnInit(): void {
    var me = this;
    me.GetAllBlogs();
  }

  protected ngAfterViewInit(): void {}

  public InitializeEmptyProperties(){
    var me = this;
    me.newBlog = {
      blogId: undefined,
      title: '',
      coverPhoto: null,
      slug: "",
      metaTitle: '',
      metaDescription: '',
      blogContents: [],
      contentPhotos: [],
      blogVideo: null,
    };
    me.uniqueProperties = ['title', 'meta-title', 'meta-description',
      'cover-photo', 'blog-video'];
    me.InputTypeId = {
      textInput: ['title', 'meta-title', 'meta-description'],
      textareaInput: ["blog-content"],
      fileInput: ['cover-photo', 'content-photo', 'blog-video']
    }
  }

  GetAllBlogs() {
    var me = this;
    me.blogService.getBlogs().subscribe({
      next: (blogs: Blog[]) => {
        this.blogs = me.MapBlogItem(blogs);
      },
      error: (error) => {
        this.toastr.error("Failed fetching blogs","", {
          timeOut: 2000,
        })
      },
      complete: () => {
      }
    });
  }

  public MapBlogItem(blogs:Blog[]){
    let mappedBlog = blogs.map((value: Blog) => ({
      id: value.id,
      title: value.title,
      authorName: value.authorName,
      slug: value.slug,
      metaTitle: value.metaTitle || '',
      metaDescription: value.metaDescription || [],
      createdAt: value.createdAt || undefined,
      coverPhoto: value.coverPhoto ? {
        ...value.coverPhoto, path: this.fileService.createBlobUrlFromBase64String(value.coverPhoto.data, value.coverPhoto.contentType)
      } : undefined,
      blogContents: value.blogContents ? value.blogContents : [],
      contentPhotos: value.contentPhotos ? value.contentPhotos.map(contentPhoto => ({
        ...contentPhoto, file: contentPhoto.file ? {
          ...contentPhoto.file, path: this.fileService.createBlobUrlFromBase64String(contentPhoto.file.data, contentPhoto.file.contentType)
        } : undefined
      })) : [],
      contentVideo: value.blogVideo || undefined,
    }));
    return mappedBlog;
  }

  protected CreateBlogElementsBySelectedTool(element: HTMLElement) {
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

  CreateBlog($event: Event) {
    let createdFormData = this.CreateFormData();
    if (createdFormData)
      this.blogService.createBlog(createdFormData).subscribe({
        next: (blog:any) => {
          this.toastr.success(`Blog Created`,"Success!", {
            timeOut: 2000,
          })
          if(!_.isEmpty(blog)){
            let newBlog = this.MapSingleBlog(blog);
            this.blogs.push(newBlog);
            this.ResetNewBlog($event);
            _.each(this.uniqueIdList, (uId)=> {
              this.ResetAllInputtype(uId); 
            })
          }
          
        },
        error: (error: any) => {
          this.toastr.error(`${error.message}`,"Failed to create blog", {
            timeOut: 2000,
          })
        }, 
        complete: ()=> {

        }
      })
    else{
      this.toastr.error(``,"Invalid FormData Creation!", {
        timeOut: 2000,
      })
    }
  }

  MapSingleBlog(blog:Blog){
    let mappedBlog = {
      id: blog.id,
      title: blog.title,
      authorName: blog.authorName,
      slug: blog.slug,
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || [],
      createdAt: blog.createdAt || undefined,
      coverPhoto: blog.coverPhoto ? {
        ...blog.coverPhoto,
        path: this.fileService.createBlobUrlFromBase64String(blog.coverPhoto.data, blog.coverPhoto.contentType)
      } : undefined,
      blogContents: blog.blogContents ? blog.blogContents : [],
      contentPhotos: blog.contentPhotos ? blog.contentPhotos.map(contentPhoto => ({
        ...contentPhoto,
        file: contentPhoto.file ? {
          ...contentPhoto.file,
          path: this.fileService.createBlobUrlFromBase64String(contentPhoto.file.data, contentPhoto.file.contentType)
        } : undefined
      })) : [],
      contentVideo: blog.blogVideo || undefined,
    };
    return mappedBlog;
  }

  CreateFormData() : FormData | undefined {
    const formData = new FormData();
    // Add primitive fields
    // formData.append("blogId", this.newBlog.blogId);
    var me = this;
    if (me.newBlog.title) formData.append("title", me.newBlog.title)
    else return;
    if (me.newBlog.slug) formData.append("slug", me.newBlog.slug);
    else {
      me.newBlog.slug = me.newBlog.title.replace(/\s+/g, '-');
    }
    if (me.newBlog.metaTitle) formData.append("metaTitle", me.newBlog.metaTitle);
    if (me.newBlog.metaDescription) formData.append(`metaDescription`, me.newBlog.metaDescription)
    if (me.newBlog.blogContents) formData.append(`blogContents`, JSON.stringify(me.newBlog.blogContents));
    else return;
    // Add content photos (array of objects)
    this.newBlog.contentPhotos.forEach((cp: any) => {
      if (cp.file) {
        var fileName = `${cp.file.name}%!%` + `${cp.serialNo}%!%` + `${cp.uniqueId}`;
        formData.append("contentPhotos", cp.file, fileName);
      }
    });
    // Add files
    if (me.newBlog.coverPhoto) {
      formData.append("coverPhoto", me.newBlog.coverPhoto, me.newBlog.coverPhoto.name);
    }
    if (me.newBlog.blogVideo) {
      formData.append("blogVideo", me.newBlog.blogVideo, me.newBlog.blogVideo.name);
    }
    // formData.append("serialIdentifier", JSON.stringify(this.newBlog.serialIdentifier)); 
    return formData;
  }

  IsValidBlogElement(selectedTool: string): boolean {
    var me = this;
    if (me.assignedProperties.includes(selectedTool)) {
      me.CreateWarning(`Multiple ${selectedTool} is not allowed`)
      return false;
    }
    if (me.uniqueProperties.includes(selectedTool)) {
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
    let newLabel = me.ConfigureLabelStyle(label, toolsItem);
    let newInputElement = me.ConfigureInputStyle(createdType, toolsItem);
    // me.ConfigureModel(toolsItem)
    me.ConfigureInputType(type, createdType, toolsItem);
    me.BindInputElementWithValue(createdType, type, toolsItem); //bind Event
    me.renderer2.addClass(newParentDiv, "mb-3");
    let newElementDiv = me.AddLabelAndInputElementInNewDiv(newParentDiv, newLabel, newInputElement);
    return newElementDiv;
  }


  ConfigureLabelStyle(label: string, selectedTool: string) {
    // Configure label
    this.renderer2.setAttribute(label, 'for', selectedTool);
    this.renderer2.appendChild(label, this.renderer2.createText(selectedTool.toUpperCase()));
    this.renderer2.addClass(label, "mb-2") // add bootstrap class to label
    this.renderer2.addClass(label, "fw-bold") // add bootstrap class to label
    return label;
  }

  ConfigureInputStyle(inputElement: string, selectedTool: string) {
    // Configure input
    var me = this;
    const uniqueId = `${selectedTool}-${Date.now()}`; 
    this.uniqueIdList.push(uniqueId); 
    me.renderer2.setAttribute(inputElement, 'id', uniqueId);
    me.renderer2.setAttribute(inputElement, 'name', selectedTool);
    if (selectedTool === me.blogTools.title) {
      me.renderer2.setAttribute(inputElement, 'placeholder', `e.g. Why Everyone Should Learn Programming`);
    }
    if (selectedTool === me.blogTools.metaTitle) {
      me.renderer2.setAttribute(inputElement, 'placeholder', `e.g. Benefits of Learning Programming - Unlock Your Potential`);
    }
    if (selectedTool === me.blogTools.metaDescription) {
      me.renderer2.setAttribute(inputElement, 'placeholder', `e.g. programming can boost your career, enhance problem-solving skills`);
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
    if (type === 'file') {
      this.renderer2.listen(inputElement, "change", (event: Event) => {
        let id = (event.target as HTMLInputElement).id;
        const files = (event.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          this.UpdateContentsPhotoValue(toolsItem, files, id);
        }
      })
    }
    else {
      // text & textarea type has title,  meta title, meta description , blog content
      this.renderer2.listen(inputElement, "blur", (event: Event) => {
        let id = (event.target as HTMLInputElement).id;
        let updatedValue = (event?.target as HTMLInputElement)?.value;
        this.UpdateBlogContentsTextValue(toolsItem, updatedValue, id)
      })
    }
  }

  ResetAllInputtype(uniqueId: string) {
    const fileInput = this.container.element.nativeElement.querySelector(`#${uniqueId}`) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  UpdateContentsPhotoValue(toolsItem: string, files: any, id: string) {
    if (toolsItem === this.blogTools.coverPhoto) {
      this.newBlog.coverPhoto = files[0]; //single file
    }
    else if (toolsItem === this.blogTools.contentPhotos) {
      let contentPhoto = this.newBlog.contentPhotos.find(fileContent => fileContent.uniqueId === id);
      if (contentPhoto) {
        contentPhoto.file = files[0];
      }
      else {
        this.serial++;
        let content = {
          uniqueId: id,
          serialNo: this.serial,
          file: files[0]
        }
        // let attachSerial = {serial: this.serial++, uniqueId: id};
        // this.newBlog.serialIdentifier.push(attachSerial);
        this.newBlog.contentPhotos.push(content);
      }
    }
    else if (toolsItem === this.blogTools.blogVideo) {
      this.newBlog.blogVideo = files[0];
    }
  }

  UpdateBlogContentsTextValue(toolsItem: string, contentValue: string, id: string) {
    if (toolsItem === this.blogTools.title) {
      this.newBlog.title = contentValue
    }
    else if (toolsItem === this.blogTools.metaTitle) {
      this.newBlog.metaTitle = contentValue
    }
    else if (toolsItem === this.blogTools.metaDescription) {
      this.newBlog.metaDescription = contentValue;
    }
    else if (toolsItem === this.blogTools.blogContents) { // interested on this one
      let blogContent = this.newBlog.blogContents.find(blogContent => blogContent.uniqueId === id);
      if (blogContent) { //inserts previously serialed serial
        blogContent.content = contentValue;
      }
      else {
        this.serial++;
        let content = {
          uniqueId: id,
          serialNo: this.serial,
          content: contentValue
        }
        // let attachSerial = {serial: this.serial++, uniqueId: id};
        // this.newBlog.serialIdentifier.push(attachSerial);
        this.newBlog.blogContents.push(content);
      }
    }
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
  ResetNewBlog($event: any) {
    var me = this;
    me.newBlog = {
      blogId: undefined,
      title: '',
      coverPhoto: null,
      metaTitle: '',
      metaDescription: '',
      blogContents: [],
      contentPhotos: [],
      blogVideo: null,
    };
  }

  DeleteBlogById(blogId: number) {
    if (_.isEmpty(blogId)) {
      this.blogService.deleteBlog(blogId).subscribe({
        next:(data: any)=> {
          this.toastr.success(`${data?.message}`,"Success!", {
            timeOut: 2000,
          })
          _.remove(this.blogs, (blog)=> {
            return blogId==blog.id
          })
        }, 
        error: (error: any)=> {

        }, 
        complete: ()=> {

        }
      })
    } else {
      this.toastr.error(``,"Invalid Id!", {
        timeOut: 2000,
      })
    }
  }

  PreviewBlog(index: number) {
    const blog = this.blogs[index];
    if (blog.slug)
      this.router.navigate(['/blog-preview', blog.slug], { state: { blog } });
    else{
      this.toastr.error(``,"Empty Slug!", {
        timeOut: 2000,
      })
    }
      
  }

}