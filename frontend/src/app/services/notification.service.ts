import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { Notification, NotificationType } from '../model/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSub = new Subject<Notification>();
  notificationObs = this.notificationSub.asObservable();

  constructor() {}

  error(message: string): void {
    this.notificationSub.next({
      type: NotificationType.error,
      message: message,
    });
  }
}
