import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

interface Information {
  info_id: number;
  info_text: string;
  descid: string;
}

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css'],
  providers: [MessageService],
})
export class LinkComponent implements OnInit {
  information: Information[] = [
    { info_id: 1, info_text: 'https://angular.io/', descid: 'Angular Documentation' },
    { info_id: 2, info_text: 'https://reactjs.org/', descid: 'React Documentation' },
    { info_id: 3, info_text: 'https://vuejs.org/', descid: 'Vue Documentation' },
    { info_id: 4, info_text: 'https://developer.mozilla.org/', descid: 'MDN Web Docs' },
    { info_id: 5, info_text: 'https://github.com/', descid: 'GitHub' },
    { info_id: 6, info_text: 'https://stackoverflow.com/', descid: 'Stack Overflow' },
  ];

  currentPage: number = 1;
  pageSize: number = 5;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  isLink(url: string): boolean {
    return url.includes('://');
  }

  displayPartialURL(fullURL: string, maxLength: number = 35): string {
    const urlParts = fullURL.split('://');
    let displayURL = urlParts[urlParts.length - 1];

    displayURL = displayURL.trim();

    if (displayURL.length > maxLength) {
      return displayURL.substr(0, maxLength) + '...';
    }

    return displayURL.trim() !== '' ? displayURL : fullURL;
  }
}