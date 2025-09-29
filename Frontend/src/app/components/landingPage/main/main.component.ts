import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "../../../../../node_modules/@angular/router/router_module.d-Bx9ArA6K";

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  userRegistration(){
    window.location.href = '/user-registration';
  }

  doctorRegistration(){
    window.location.href = '/doctor-registration';
  }

  login(){
    window.location.href = '/login';
  }
}
