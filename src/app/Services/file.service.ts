import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }
  onOneFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      return fileInput.files[0];
    }
    return null; 
  }
  fileToBase64String(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Converts file to Base64
    });
  }
  base64FileToBlob(str: string) {
    // Extract content type and Base64 payload from the string
    const pos = str.indexOf(';base64,');
    if (pos === -1) {
      throw new Error('Invalid Base64 string');
    }
    const type = str.substring(5, pos);
    const b64 = str.slice(pos + 8);

    // Decode Base64 to binary string
    const Content = atob(b64);

    // Create an ArrayBuffer and a view
    const buffer = new ArrayBuffer(Content.length);
    const view = new Uint8Array(buffer);

    // Populate the view with binary data
    for (let n = 0; n < Content.length; n++) {
      view[n] = Content.charCodeAt(n);
    }
    // Convert ArrayBuffer to Blob
    return new Blob([buffer], { type });
  }
}
