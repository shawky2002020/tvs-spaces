import { Component, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('myApp');
//   constructor(private translate: TranslateService) {
//   this.translate.setDefaultLang('ar');
//   this.translate.use('ar');
// }
}
