import { Component } from '@angular/core';
import { AppRoutingModule } from "../../app-routing-module";
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  standalone:false
})
export class AuthLayoutComponent {
  constructor(private authService:AuthService){

  }
  
}
