import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'select', loadComponent: () => import('./components/resource-selector/resource-selector.component').then(m => m.ResourceSelectorComponent) },
      { path: 'dates', loadComponent: () => import('./components/date-plan-picker/date-plan-picker.component').then(m => m.DatePlanPickerComponent) },
      { path: 'plan', loadComponent: () => import('./components/plan-selector/plan-selector.component').then(m => m.PlanSelectorComponent) },
      { path: 'summary', loadComponent: () => import('./components/booking-summary/booking-summary.component').then(m => m.BookingSummaryComponent) },
      { path: 'checkout', loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent) },
      { path: '', redirectTo: 'select', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule {}
