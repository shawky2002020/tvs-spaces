import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthLayoutRoutingModule } from './auth-layout-routing-module';
import { ProfileModule } from '../../features/profile/profile.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthLayoutRoutingModule,
    ProfileModule,
  ]
})
export class AuthLayoutModule { }
