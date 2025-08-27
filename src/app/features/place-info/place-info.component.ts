import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-place-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './place-info.component.html',
  styleUrls: ['./place-info.component.scss']
})
export class PlaceInfoComponent {
  wifiList = [
    { ssid: 'TVS-Main', password: 'tvs2025main' },
    { ssid: 'TVS-Guest', password: 'tvs2025guest' },
    { ssid: 'TVS-Meeting', password: 'tvs2025meet' },
  ];

  about = `
    TVS Spaces is a modern co-working environment designed for productivity, collaboration, and comfort. Enjoy high-speed Wi-Fi, ergonomic workspaces, private rooms, and a vibrant community. Our amenities include a kitchen, meeting rooms, printing services, and 24/7 access for members.`;
}
