import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceSelectorComponent } from './components/resource-selector/resource-selector.component';

const routes: Routes = [
  {
    path: '', 
    title: 'Select Workspace | TVS Spaces',
    component: ResourceSelectorComponent
  },
  { path: 'dates', title: 'Select Date & Plan | TVS Spaces', loadComponent: () => import('./components/date-plan-picker/date-plan-picker.component').then(m => m.DatePlanPickerComponent) },
  { path: 'summary', title: 'Booking Summary | TVS Spaces', loadComponent: () => import('./components/booking-summary/booking-summary.component').then(m => m.BookingSummaryComponent) },
  { path: 'checkout', title: 'Checkout & Confirmation | TVS Spaces', loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: '', redirectTo: 'dates', pathMatch: 'full' },
  { path: '**', redirectTo: 'dates', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule {}