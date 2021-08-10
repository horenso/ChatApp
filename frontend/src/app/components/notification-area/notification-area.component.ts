import { Component, OnInit } from '@angular/core';
import { Notification, NotificationType } from 'src/app/model/notification';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification-area',
  templateUrl: './notification-area.component.html',
  styleUrls: ['./notification-area.component.sass'],
})
export class NotificationAreaComponent implements OnInit {
  notificationList: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notificationObs.subscribe({
      next: (notification) => {
        this.notificationList.push(notification);
        console.log('Got a new notification!');
        console.log(notification);
      },
    });
  }

  removeError(id: number): void {
    this.notificationList.splice(id, 1);
  }
}
