import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './components/auth-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        title: 'User Dashboard | TVS Spaces',
        loadChildren: () =>
          import('../../features/dashboard/dashboard.module').then(
            (module) => module.DashboardModule
          ),
      },
      {
        path: 'booking',
        title: 'Book a Workspace | TVS Spaces',
        loadChildren: () =>
          import('../../features/booking/booking.module').then(
            (module) => module.BookingModule
          ),
      },
      {
        path: 'profile',
        title: 'My Profile | TVS Spaces',
        loadChildren: () =>
          import('../../features/profile/profile.module').then(
            (module) => module.ProfileModule
          ),
      },
      {
        path: 'facilities',
        title: 'Facilities & Information | TVS Spaces',
        loadComponent: () =>
          import('../../features/place-info/place-info.component').then(
            (module) => module.PlaceInfoComponent
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthLayoutRoutingModule {}
