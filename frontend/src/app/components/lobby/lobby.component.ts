import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JoinResponse } from 'src/app/model/join-response';
import { TableMeta } from 'src/app/model/table-meta';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';

const LOBBY = '~';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.sass'],
})
export class LobbyComponent implements OnInit {
  tableList: string[] = [];

  connected: boolean = false;

  constructor(
    private socketService: SocketService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.socketService.connect(LOBBY);
    this.socketService.connectionObservable.subscribe({
      next: (info) => {
        this.connected = info.connected;
      },
    });
  }

  createNewTable(tableMeta: TableMeta): void {
    const socket = this.socketService.socket;
    console.log('Trying to create table:');
    console.log(tableMeta);

    socket.emit('create-new-table', tableMeta, (response: JoinResponse) => {
      if (response.joined) {
        console.log('joined!');
        this.router.navigate(['tables', tableMeta.name]);
      } else if (response.message) {
        this.notificationService.error(response.message);
      } else {
        this.notificationService.error('Could not connect!');
      }
    });
  }

  joinTable(tableMeta: TableMeta): void {
    const tableName = tableMeta.name;
    console.log(`Trying to join ${tableName}.`);
    this.socketService.socket.emit(
      'join-table',
      tableMeta,
      (response: JoinResponse) => {
        if (response.joined) {
          console.log('joined!');
          this.router.navigate(['tables', tableName]);
        } else if (response.message) {
          this.notificationService.error(response.message);
        } else {
          this.notificationService.error('Could not connect!');
        }
      }
    );
  }
}
