import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { AboutComponent } from "../about/about.component";
import { MainComponent } from "../main/main.component";

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const checkbox = document.getElementById('menu-toggle') as HTMLInputElement;
        if (checkbox) checkbox.checked = false;
      }
    });
  }

}
