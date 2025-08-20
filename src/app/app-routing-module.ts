import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent
  },
   {
    path: 'rooms/:type',
    loadComponent: () =>
      import('./pages/room-detail/room-detail.component').then(m => m.RoomDetailComponent),
  },
  {
    path: 'desks/:type',
    loadComponent: () =>
      import('./pages/desk-detail/desk-detail.component').then(m => m.DeskDetailComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'enabled', // 👈 always go to top
      anchorScrolling: 'enabled'  
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
