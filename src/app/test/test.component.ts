import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  progress!: number;
  message!: string;
  @Output() public onUploadFinished = new EventEmitter();
  
  constructor(private http: HttpClient) { }
  ngOnInit() {
  }
  filePreview: string | ArrayBuffer | null = null; // For preview
  binaryData: string = ''; // For storing binary/Base64 string

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      // Read file as a binary string (Base64)
      reader.onload = () => {
        this.filePreview = reader.result; // Preview for image
        this.binaryData = reader.result as string; // Binary data as Base64
        console.log('Binary Data:', this.binaryData);
      };

      // Start reading the file as Base64
      reader.readAsDataURL(file);
    }
  }
  uploadFile (files:any)  {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    
    this.http.post('http://localhost:5001/api/CustomerReview', formData, {reportProgress: true, observe: 'events'})
      .subscribe({
        next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
        }
      },
      error: (err: HttpErrorResponse) => console.log(err)
    });
  }
}
