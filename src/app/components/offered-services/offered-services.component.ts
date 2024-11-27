import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OfferedServices } from './offered-services.model';
import { OfferedServicesService } from './offered-services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-offered-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offered-services.component.html',
  styleUrl: './offered-services.component.scss'
})
export class OfferedServicesComponent implements OnInit{
  apiUrl = "http://localhost:5001/api/offeredServices"
  offeredServicesHeaders!: (keyof OfferedServices)[];
  OfferedServices: OfferedServices[] = []
  constructor(
    private offeredService : OfferedServicesService, 
    private toastrService: ToastrService ){
  }
  ngOnInit(): void {
    this.offeredService.getAllOfferedServices().subscribe({
      next: (offeredServices: OfferedServices[]) => {
        if (offeredServices.length > 0) {
          this.offeredServicesHeaders = Object.keys(offeredServices[0]) as (keyof OfferedServices)[];
          offeredServices.map((os: OfferedServices) => {
            this.OfferedServices.push(os);
          })
        }
      },
      error: ((error: any) => {
        this.toastrService.error("Request failed!", "GET offeredServices"); 
      }),
      complete: () => {
        console.log("Completed");
      }
    })
  }
  
}
