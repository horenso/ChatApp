import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JoinResponse } from 'src/app/model/join-response';
import { TableMeta } from 'src/app/model/table-meta';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.sass'],
})
export class LobbyComponent implements OnInit {
  latestError = '';

  tableList: string[] = [];

  currentInfo = '';

  connected: boolean = false;

  constructor(private socketService: SocketService, private router: Router) {}

  ngOnInit(): void {
    if (!this.socketService.isConnected()) {
      // this.router.navigate(['']);
    }
    this.socketService.connectionObservable.subscribe({
      next: (info) => {
        this.connected = info.connected;
      },
    });
    this.socketService.loobyInfoObservable.subscribe({
      next: (data) => (this.currentInfo = data.info),
    });
  }

  createNewTable(tableMeta: TableMeta): void {
    const socket = this.socketService.socket;
    socket.emit('create-new-table', tableMeta, (response: JoinResponse) => {
      if (response.joined) {
        console.log('joined!');
        this.router.navigate(['tables', tableMeta.name]);
      } else if (response.message) {
        this.latestError = response.message;
      } else {
        this.latestError = 'Could not connect!';
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
          this.latestError = response.message;
        } else {
          this.latestError = 'Could not connect!';
        }
      }
    );
  }
}
