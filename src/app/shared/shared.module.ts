import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Import shared components, directives, pipes here

@NgModule({
  imports: [CommonModule],
  declarations: [
    // Shared components, directives, pipes
  ],
  exports: [
    CommonModule,
    // Shared components, directives, pipes
  ]
})
export class SharedModule {}
