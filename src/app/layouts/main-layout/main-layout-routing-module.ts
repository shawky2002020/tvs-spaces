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
        title: 'TVS Spaces | Coworking Desks & Meeting Rooms Heliopolis',
        loadComponent: () =>
          import('../../features/landing/landing-page.component').then(
            (m) => m.LandingPageComponent
          ),
      },
      {
        path: 'rooms/:type',
        title: 'Room Details | TVS Spaces Heliopolis',
        loadComponent: () =>
          import('../../pages/room-detail/room-detail.component').then(
            (m) => m.RoomDetailComponent
          ),
      },
      {
        path: 'desks/:type',
        title: 'Desk Details | TVS Spaces Heliopolis',
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
