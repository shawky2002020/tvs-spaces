import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; // ✅ Correct import
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SpaceCardComponent } from './shared/components/space-card/space-card.component';
import { DeskDetailComponent } from './pages/desk-detail/desk-detail.component';
import { RoomDetailComponent } from './pages/room-detail/room-detail.component';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AuthLayoutComponent } from './layouts/auth-layout/components/auth-layout.component';
import { SideBar } from './shared/components/side-bar/side-bar';
import { SharedModule } from './shared/shared.module';
import { MatIconModule } from '@angular/material/icon';


// Required factory function for AoT
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    App,
    MainLayoutComponent,
    AuthLayoutComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    HeaderComponent,
    HttpClientModule,
    FooterComponent,
    SpaceCardComponent,
    DeskDetailComponent,
    RoomDetailComponent,
    
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
],
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

  ],
  bootstrap: [App]
})
export class AppModule { }
