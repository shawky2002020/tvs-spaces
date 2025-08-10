import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { AppRoutingModule } from "../../app-routing-module";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  imports: [HeaderComponent, AppRoutingModule, FooterComponent, CommonModule]
})
export class MainLayoutComponent {
  
}
