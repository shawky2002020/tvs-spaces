import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appButtonLoading]',
  standalone: true
})
export class ButtonLoadingDirective implements OnChanges {
  @Input('appButtonLoading') isLoading: boolean = false;
  @Input() loadingText?: string;

  private spinnerEl: HTMLElement | null = null;
  private originalText: string | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLoading']) {
      this.updateLoadingState();
    }
  }

  private updateLoadingState(): void {
    const nativeEl = this.el.nativeElement;

    if (this.isLoading) {
      this.renderer.addClass(nativeEl, 'btn-is-loading');
      this.renderer.setAttribute(nativeEl, 'disabled', 'true');

      if (!this.spinnerEl) {
        this.spinnerEl = this.renderer.createElement('span');
        this.renderer.addClass(this.spinnerEl, 'btn-spinner');
        this.renderer.appendChild(nativeEl, this.spinnerEl);
      }
    } else {
      this.renderer.removeClass(nativeEl, 'btn-is-loading');
      this.renderer.removeAttribute(nativeEl, 'disabled');

      if (this.spinnerEl) {
        this.renderer.removeChild(nativeEl, this.spinnerEl);
        this.spinnerEl = null;
      }
    }
  }
}
