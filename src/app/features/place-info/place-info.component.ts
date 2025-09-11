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
    { ssid: 'Televirgins', password: 'TV$Spaces2025' },
    { ssid: 'Televirgins-EXT', password: 'TV$Spaces2025' },
    { ssid: 'ZTE23AC#B', password: '5F5L36B73R' },
  ];

  about = `
    TVS Spaces is a modern co-working environment designed for productivity, collaboration, and comfort. Enjoy high-speed Wi-Fi, ergonomic workspaces, private rooms, and a vibrant community. Our amenities include a kitchen, meeting rooms, printing services, and 24/7 access for members.`;
}
