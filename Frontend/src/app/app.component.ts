import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { NgxSpinnerService, NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'test';

  constructor(private spinner: NgxSpinnerService, private router: Router) {}

  ngOnInit(): void {
    // Show spinner on route change start
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.spinner.show();
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.spinner.hide();
      }
    });
  }
}
