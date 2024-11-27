import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  filePreview!: string | ArrayBuffer | null;

  binaryData!: string;
  imagePreviewUrl!: string;
  /**
   * Create a dictionary of file with id and file.
   */
  constructor() { }
  
  

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

  base64ToByteArray(base64: string): Uint8Array {
    // Remove the Base64 prefix if it exists (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64.split(',')[1] || base64;

    // Decode the base64 string to a binary string
    const binaryString = atob(cleanBase64);

    // Convert the binary string to a byte array
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    return byteArray;
  }
  createBlobUrlFromBase64String(base64: string, type: string) {
    // Convert byte array to a Blob
    // Assuming fileDetails.data is a base64-encoded string

    // Decode base64 string to a binary string
    
    const binaryString = atob(base64);

    // Convert binary string to a byte array (Uint8Array)
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    // Now you can create a Blob from the byte array
    const blob = new Blob([byteArray], { type: type });

    // Create a Blob URL
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl; 
  }



}


