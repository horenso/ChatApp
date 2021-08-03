import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ConnectionInfo } from './model/connection-info';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  constructor(private socketService: SocketService, private router: Router) {}

  connectionString: string = 'Not Connected';
  connected = false;

  ngOnInit(): void {
    this.socketService.connectionObservable.subscribe(
      (connectionInfo: ConnectionInfo) => {
        if (connectionInfo.connected) {
          this.connectionString = 'Connected';
          this.connected = true;
        } else {
          this.connected = false;
          if (connectionInfo.error) {
            this.connectionString = 'Error';
          } else {
            this.connectionString = 'Not Connected';
          }
        }
      }
    );
  }

  enter(): void {
    this.router.navigate(['enter']);
  }

  leave(): void {
    this.socketService.disconnect();
    this.router.navigate(['']);
  }
}
