import { Injectable, NgZone } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConnectionInfo } from '../model/connection-info';
import { ConnectionRequest } from '../model/connection-request';
import { JoinResponse } from '../model/join-response';
import { LobbyInfo } from '../model/lobby-info';
import { TableMeta } from '../model/table-meta';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  username: string = '';

  private connectionSubject = new BehaviorSubject<ConnectionInfo>({
    connected: false,
  });

  connectionObservable = this.connectionSubject.asObservable();
  newTableObservable: Observable<any> = this.socket.fromEvent('new-table-info');
  newUserObservable = this.socket.fromEvent('new-join');
  loobyInfoObservable: Observable<LobbyInfo> =
    this.socket.fromEvent('lobby-info');

  constructor(public socket: Socket, private authService: AuthService) {}

  connect(table: string): void {
    this.socket.ioSocket.io.opts.query = {
      token: this.authService.getToken(),
      table: table,
    };
    this.socket.ioSocket.io.uri = 'http://localhost:4444';
    this.socket.connect();

    this.socket.on('connect', () => {
      console.log('Connected!');
      this.connectionSubject.next({ connected: true });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected!');
      this.connectionSubject.next({ connected: false });
    });

    this.socket.on('connect_error', (error: Error) => {
      console.log('Connection error!');
      this.socket.disconnect();
      this.connectionSubject.next({ connected: false, error: error });
    });
  }

  disconnect(): void {
    if (this.isConnected()) this.socket.disconnect();
  }

  isConnected(): boolean {
    return this.socket.ioSocket?.connected;
  }

  createTable(name: string, password?: string): void {
    if (!this.isConnected() || name == undefined || name.trim() === '') {
      return;
    }
    const tableCreation: TableMeta = {
      name: name,
      password: password,
      size: 8,
    };
    this.socket.emit(
      'create-new-table',
      tableCreation,
      (response: JoinResponse) => {}
    );
  }

  joinTable(name: string): void {
    if (!this.isConnected() || name == undefined || name.trim() === '') {
      return;
    }
    this.socket.emit('join-table', name, (response: any) => {
      console.log(response);
    });
  }
}
