import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PaymentRequiredComponent } from './pages/payment-required/payment-required.component';

const routes: Routes = [
  {
    path: '',
    // canActivate: [LicenseGuard],
    loadChildren: () =>
      import('./layouts/main-layout/main-layout.module').then(
        (m) => m.MainLayoutModule
      ),
  },
  {
    path: 'payment-required',
    title: 'Payment Required | TVS Spaces',
    component: PaymentRequiredComponent,
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./layouts/auth-layout/auth-layout.module').then(
        (m) => m.AuthLayoutModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    title: '404 Page Not Found | TVS Spaces',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
