import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
export class TestComponent  {


}
