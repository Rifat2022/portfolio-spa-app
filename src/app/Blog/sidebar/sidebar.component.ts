import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  recentPosts = [
    { title: 'Atque placeat maiores.' },
    { title: 'Lorem ipsum dolor sit amet consectetur' },
    // More recent posts
  ];

  archives = [
    'September, 2017.',
    'April, 2017.',
    // More archives
  ];

  tags = ['Web', 'Design', 'Travel', 'Photoshop', 'Corel Draw', 'JavaScript'];
}
