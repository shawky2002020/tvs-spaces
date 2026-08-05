import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();

  show(message: string, type: ToastType = 'info', title?: string, duration: number = 4000): void {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, type, message, title, duration };

    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, title?: string, duration: number = 4000): void {
    this.show(message, 'success', title || 'Success', duration);
  }

  error(message: string, title?: string, duration: number = 5000): void {
    this.show(message, 'error', title || 'Error', duration);
  }

  info(message: string, title?: string, duration: number = 4000): void {
    this.show(message, 'info', title || 'Information', duration);
  }

  warning(message: string, title?: string, duration: number = 4500): void {
    this.show(message, 'warning', title || 'Warning', duration);
  }

  remove(id: string): void {
    this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== id));
  }
}
