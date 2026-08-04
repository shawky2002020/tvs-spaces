import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        App
      ],
      imports: [
        RouterOutlet
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the title signal as myApp', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect((app as any).title()).toEqual('myApp');
  });
});
