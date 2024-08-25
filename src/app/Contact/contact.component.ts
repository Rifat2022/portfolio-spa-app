import { CommonModule } from '@angular/common';
import { Component, ComponentRef, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  isLoading = false;
  errorMessage: string | null = null;
  sentMessage: string | null = null;

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    // Simulate form submission
    setTimeout(() => {
      this.isLoading = false;
      this.sentMessage = 'Your message has been sent. Thank you!';
      form.reset();
    }, 2000);

    // Handle actual form submission logic here (e.g., HTTP request)
  }
}
