import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // 👈 your layout with header + router-outlet
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../features/landing/landing-page.component').then(
            (m) => m.LandingPageComponent
          ),
      },
      {
        path: 'rooms/:type',
        loadComponent: () =>
          import('../../pages/room-detail/room-detail.component').then(
            (m) => m.RoomDetailComponent
          ),
      },
      {
        path: 'desks/:type',
        loadComponent: () =>
          import('../../pages/desk-detail/desk-detail.component').then(
            (m) => m.DeskDetailComponent
          ),
      },

      {
        path: 'auth',
        loadChildren: () =>
          import('../../features/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainLayoutRoutingModule {}
