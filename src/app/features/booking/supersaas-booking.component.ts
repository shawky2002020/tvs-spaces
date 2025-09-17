import { Component } from '@angular/core';
import { environment } from '../../../../src/environments/environment.supersaas';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-supersaas-booking',
  templateUrl: './supersaas-booking.component.html',
  styleUrls: ['./supersaas-booking.component.scss'],
  standalone: true,
  imports: [SharedModule],

 
})
export class SupersaasBookingComponent {
  scheduleUrl = environment.supersaas.widgetUrl;
}
