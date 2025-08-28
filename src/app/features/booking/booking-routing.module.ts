import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceSelectorComponent } from './components/resource-selector/resource-selector.component';

const routes: Routes = [
  {
    path: '', 
    component:ResourceSelectorComponent
  },
      { path: 'dates', loadComponent: () => import('./components/date-plan-picker/date-plan-picker.component').then(m => m.DatePlanPickerComponent) },
      { path: 'summary', loadComponent: () => import('./components/booking-summary/booking-summary.component').then(m => m.BookingSummaryComponent) },
      { path: 'checkout', loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent) },
      { path: '', redirectTo: 'dates', pathMatch: 'full' },
      { path: '**', redirectTo: 'dates', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule {}