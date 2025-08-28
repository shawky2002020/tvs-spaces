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
        loadChildren: () => import('../../features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'booking',
        loadChildren: () => import('../../features/booking/booking.module').then(m => m.BookingModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../../features/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'payments',
        loadChildren: () => import('../../features/payment/payment.module').then(m => m.PaymentModule)
      },
      {
        path: 'facilities',
        loadComponent: () => import('../../features/place-info/place-info.component')
          .then(m => m.PlaceInfoComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthLayoutRoutingModule { }
