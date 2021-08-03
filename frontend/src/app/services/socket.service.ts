import { Injectable, NgZone } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConnectionInfo } from '../model/connection-info';
import { JoinResponse } from '../model/join-response';
import { LobbyInfo } from '../model/lobby-info';
import { TableMeta } from '../model/table-meta';

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

  constructor(public socket: Socket, private ngZone: NgZone) {}

  connect(username: string): void {
    if (username == undefined || username.trim() === '') {
      throw new Error('Username cannot be empty or null');
    }
    this.socket.ioSocket.io.opts.query = { username: username };
    this.socket.ioSocket.io.uri = 'http://localhost:4444';
    this.socket.connect();

    this.socket.on('connect', () =>
      this.connectionSubject.next({ connected: true })
    );

    this.socket.on('disconnect', () =>
      this.connectionSubject.next({ connected: false })
    );

    this.socket.on('connect_error', (error: Error) => {
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
    const tableCreation: TableMeta = { name: name, password: password };
    this.socket.emit(
      'create-new-table',
      tableCreation,
      (response: JoinResponse) => {
        // this.ngZone.run(router.)
      }
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
