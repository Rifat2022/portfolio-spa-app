import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OfferedServicesService } from '../../components/offered-services/offered-services.service';
import { OfferedServices } from '../../components/offered-services/offered-services.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-offered-services-modify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [OfferedServicesService],

  templateUrl: './offered-services-modify.component.html',
  styleUrl: './offered-services-modify.component.scss'
})
export class OfferedServicesModifyComponent {
  offeredServicesHeaders!: (keyof OfferedServices)[];
  OfferedServices: OfferedServices[] = []
  editingIndex: any = null;
  newOfferedService: any = {
    id: undefined,
    bootstrap_icon_code: '',
    description: '',
    headings: '',
    quote: '',
    service_name: '',
    date: ''
  };
  constructor(
    private route: ActivatedRoute,
    private offeredServicesService: OfferedServicesService,) {
    // this.router.events.pipe(
    //   filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    // ).subscribe(() => {
    // });
    this.route.paramMap.subscribe((params) => {
      const componentName = params.get('clientsReview') || '';
      this.GetAllOfferedServicess();
    });
  }

  CreateOfferedService() {
    this.newOfferedService.date = new Date().toLocaleString();
    const offeredServiceFormData = new FormData();
    offeredServiceFormData.append('OfferedService', JSON.stringify(this.newOfferedService));

    this.offeredServicesService.createOfferedService(offeredServiceFormData)
      .subscribe({
        next: (os: any) => {
          this.OfferedServices.push(os);
        },
        error: (err: any) => {
          console.log(err.message);
        },
        complete: () => {
          // console.log("Request Completed");
          this.ResetForm();
        }
      })
  }

  GetAllOfferedServicess() {
    this.offeredServicesService.getAllOfferedServices().subscribe({
      next: (offeredServices: OfferedServices[]) => {
        if (offeredServices.length > 0) {
          this.offeredServicesHeaders = Object.keys(offeredServices[0]) as (keyof OfferedServices)[];
          offeredServices.map((os: OfferedServices) => {
            this.OfferedServices.push(os);
          })
        }
      },
      error: ((error: any) => {
        console.log("Request failed!" + error);
      }),
      complete: () => {
        console.log("Request Completed");
      }
    })

  }


  EditOfferedServices(index: number) {
    this.editingIndex = index;
    this.newOfferedService = { ...this.OfferedServices[index] };
  }

  UpdateOfferedServices() {
    if (this.editingIndex !== null) {
      let OfferedServicesId = this.OfferedServices[this.editingIndex].id; // get the id of the OfferedServicesId of the selected array index
      if (OfferedServicesId == null) {
        return;
      }

      const updatedOfferedServicesFormData = new FormData();
      updatedOfferedServicesFormData.append(`UpdatedOfferedService`, JSON.stringify(this.newOfferedService));

      this.offeredServicesService.updateOfferedService(OfferedServicesId, updatedOfferedServicesFormData).subscribe({
        next: (updatedOfferedServices: OfferedServices) => {
          this.OfferedServices[this.editingIndex] = updatedOfferedServices;
        },
        error: (err: any) => {
          console.log("updated request failed!" + err.message);
        },
        complete: () => {
          this.ResetForm();
          console.log("updated request completed")
        }
      });
    }

  }
  DeleteOfferedServices(index: number) {
    let OfferedServicesId = this.OfferedServices[index].id;
    if (OfferedServicesId == null)
      return;
    this.offeredServicesService.deleteOfferedService(OfferedServicesId).subscribe({
      next: (isDeleted: any) => {
        this.OfferedServices.splice(index, 1);
      },
      error: (err: any) => {
        console.log("deletion failed!" + err);
      },
      complete: () => {
        console.log('completed!')
      }
    })
  }

  ResetForm() {
    this.newOfferedService = {};
    this.editingIndex = null;
  }
}
