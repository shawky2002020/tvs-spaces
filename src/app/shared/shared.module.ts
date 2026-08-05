import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SideBar } from './components/side-bar/side-bar';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { BackendWarmupComponent } from './components/backend-warmup/backend-warmup.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';
import { ButtonLoadingDirective } from './directives/button-loading.directive';

@NgModule({
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    SideBar,
    LoaderComponent,
    SafeUrlPipe,
    BackendWarmupComponent,
    ToastContainerComponent,
    SkeletonComponent,
    ButtonLoadingDirective
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
    SafeUrlPipe,
    BackendWarmupComponent,
    ToastContainerComponent,
    SkeletonComponent,
    ButtonLoadingDirective
  ],
})
export class SharedModule {}

