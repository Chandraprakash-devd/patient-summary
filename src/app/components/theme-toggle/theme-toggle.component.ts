import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent implements OnInit {
  dark = false;

  constructor(public theme: ThemeService) {}

  ngOnInit() {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      this.dark = document.documentElement.getAttribute('data-theme') === 'dark';
    });
  }

  toggle() {
    this.theme.toggle();
    this.dark = !this.dark;
  }
}