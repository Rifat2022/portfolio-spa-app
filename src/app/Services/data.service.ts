import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  private counter = [
    {
        icon: 'bi bi-check',
        endValue: 450,
        text: 'WORKS COMPLETED'
    },
    {
        icon: 'bi bi-journal-richtext',
        endValue: 25,
        text: 'YEARS OF EXPERIENCE'
    },
    {
        icon: 'bi bi-people',
        endValue: 550,
        text: 'TOTAL CLIENTS'
    },
    {
        icon: 'bi bi-award',
        endValue: 2,
        text: 'AWARD WON'
    }
  ]
  private navlink = [
    { label: 'Home', href: '#hero', isActive: true, isDropdown: false, children: [] },
    { label: 'About', href: '#about', isActive: false, isDropdown: false, children: [] },
    { label: 'Services', href: '#services', isActive: false, isDropdown: false, children: [] },
    { label: 'Work', href: '#work', isActive: false, isDropdown: false, children: [] },
    { label: 'Blog', href: '#blog', isActive: false, isDropdown: false, children: [] },
    // {
    //   label: 'Drop Down', href: '#', isActive: false, isDropdown: true, icon: 'bi bi-chevron-down',
    //   children: [
    //     { label: 'Drop Down 1', href: '#' },
    //     {
    //       label: 'Deep Drop Down', href: '#', isDropdown: true, icon: 'bi bi-chevron-right',
    //       children: [
    //         { label: 'Deep Drop Down 1', href: '#' },
    //         { label: 'Deep Drop Down 2', href: '#' },
    //         { label: 'Deep Drop Down 3', href: '#' },
    //         { label: 'Deep Drop Down 4', href: '#' },
    //         { label: 'Deep Drop Down 5', href: '#' }
    //       ]
    //     },
    //     { label: 'Drop Down 2', href: '#' },
    //     { label: 'Drop Down 3', href: '#' },
    //     { label: 'Drop Down 4', href: '#' }
    //   ]
    // },
    { label: 'Contact', href: '#contact', isActive: false, isDropdown: false, children: [] }
  ];
  private service = [
    {
        title: 'Web Design',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni adipisci eaque autem fugiat! Quia, provident vitae! Magni tempora perferendis eum non provident.',
        icon: 'bi bi-briefcase'
      },
      {
        title: 'Web Development',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni adipisci eaque autem fugiat! Quia, provident vitae! Magni tempora perferendis eum non provident.',
        icon: 'bi bi-card-checklist'
      },
      {
        title: 'Photography',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni adipisci eaque autem fugiat! Quia, provident vitae! Magni tempora perferendis eum non provident.',
        icon: 'bi bi-bar-chart'
      },
      {
        title: 'Responsive Design',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni adipisci eaque autem fugiat! Quia, provident vitae! Magni tempora perferendis eum non provident.',
        icon: 'bi bi-binoculars'
      },
      {
        title: 'Graphic Design',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni adipisci eaque autem fugiat! Quia, provident vitae! Magni tempora perferendis eum non provident.',
        icon: 'bi bi-brightness-high'
      },
      {
        title: 'Marketing Services',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni adipisci eaque autem fugiat! Quia, provident vitae! Magni tempora perferendis eum non provident.',
        icon: 'bi bi-calendar4-week'
      }
  ]
  private portfolio = [
    {
      "imageSrc": "assets/img/work-1.jpg",
      "title": "Lorem impsum dolor",
      "category": "Web Design",
      "date": "18 Sep. 2018"
    },
    {
      "imageSrc": "assets/img/work-2.jpg",
      "title": "Loreda Cuno Nere",
      "category": "Web Design",
      "date": "18 Sep. 2018"
    },
    {
      "imageSrc": "assets/img/work-3.jpg",
      "title": "Mavrito Lana Dere",
      "category": "Web Design",
      "date": "18 Sep. 2018"
    },
    {
      "imageSrc": "assets/img/work-4.jpg",
      "title": "Bindo Laro Cado",
      "category": "Web Design",
      "date": "18 Sep. 2018"
    },
    {
      "imageSrc": "assets/img/work-5.jpg",
      "title": "Studio Lena Mado",
      "category": "Web Design",
      "date": "18 Sep. 2018"
    },
    {
      "imageSrc": "assets/img/work-6.jpg",
      "title": "Studio Big Bang",
      "category": "Web Design",
      "date": "18 Sep. 2017"
    }
  ]
  private testimonial = [
    {
      imageSrc: 'assets/img/testimonial-2.jpg',
      author: 'Xavi Alonso',
      description: 'Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      imageSrc: 'assets/img/testimonial-4.jpg',
      author: 'Marta Socrate',
      description: 'Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }
  ];

  private blog_posts = [
    {
      imageSrc: 'assets/img/post-1.jpg',
      category: 'Travel',
      title: 'See more ideas about Travel',
      description: 'Proin eget tortor risus. Pellentesque in ipsum id orci porta dapibus. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.',
      authorImage: 'assets/img/testimonial-2.jpg',
      author: 'Morgan Freeman',
      time: '10 min'
    },
    {
      imageSrc: 'assets/img/post-2.jpg',
      category: 'Web Design',
      title: 'See more ideas about Travel',
      description: 'Proin eget tortor risus. Pellentesque in ipsum id orci porta dapibus. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.',
      authorImage: 'assets/img/testimonial-2.jpg',
      author: 'Morgan Freeman',
      time: '10 min'
    },
    {
      imageSrc: 'assets/img/post-3.jpg',
      category: 'Web Design',
      title: 'See more ideas about Travel',
      description: 'Proin eget tortor risus. Pellentesque in ipsum id orci porta dapibus. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.',
      authorImage: 'assets/img/testimonial-2.jpg',
      author: 'Morgan Freeman',
      time: '10 min'
    }
  ];
  
  public getData(){
   var data: any = {
    blog_posts: this.blog_posts, 
    testimonial: this.testimonial, 
    portfolio: this.blog_posts, 
    service: this.blog_posts, 
    navlink: this.blog_posts, 
    counter: this.blog_posts,    
   }; 
   return data; 
  }
}
