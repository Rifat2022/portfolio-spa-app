import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-modify',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.scss'
})
export class ModifyComponent implements OnInit{
  currentParameter! : string; 
  constructor(private route: ActivatedRoute, private router: Router) {
    
  }
  ngOnInit(): void {
    // this.route.paramMap.subscribe((params) => {
    //   const type = params.get('type') || '';
    //   if (type === 'clientsReview') {
    //     this.router.navigate(['clientsReview'], { relativeTo: this.route });
    //   } else if (type === 'offeredServices') {
    //     this.router.navigate(['offeredServices'], { relativeTo: this.route });
    //   } else {
    //     console.error('Invalid type parameter');
    //   }
    // });
  }
  
}
