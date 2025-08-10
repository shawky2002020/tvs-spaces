import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
// Import shared components, directives, pipes here

@NgModule({
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    LoaderComponent
    // Shared standalone components, directives, pipes
  ],
  exports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    LoaderComponent
    // Shared standalone components, directives, pipes
  ]
})
export class SharedModule {}
