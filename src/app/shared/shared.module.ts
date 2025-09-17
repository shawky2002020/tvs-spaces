import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SideBar } from './components/side-bar/side-bar';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
// Import shared components, directives, pipes here

@NgModule({
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    SideBar,
    LoaderComponent,
    SafeUrlPipe
    // Shared standalone components, directives, pipes
  ],
  declarations: [
    // Shared pipes, directives, etc.
  ],
  exports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    SideBar,
    SafeUrlPipe
    // Shared standalone components, directives, pipes
  ],
})
export class SharedModule {}
