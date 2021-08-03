import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  tableCreationForm: FormGroup;
  tableJoinForm: FormGroup;

  latestError = '';

  tableList: string[] = [];

  currentInfo = '';

  connected: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private socketService: SocketService,
    private router: Router
  ) {
    this.tableCreationForm = this.formBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      password: [null, [Validators.minLength(5), Validators.maxLength(20)]],
    });
    this.tableJoinForm = this.formBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
    });
  }

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

  createNewTable(): void {
    const socket = this.socketService.socket;
    const values = this.tableCreationForm.value;
    const tableCreation: TableMeta = {
      name: values.name,
      password: values.password,
    };
    socket.emit('create-new-table', tableCreation, (response: JoinResponse) => {
      if (response.joined) {
        console.log('joined!');
        this.router.navigate(['tables', values.name]);
      } else if (response.message) {
        this.latestError = response.message;
      } else {
        this.latestError = 'Could not connect!';
      }
    });
  }

  joinTable(): void {
    // this.socketService.joinTable(this.tableJoinForm.value.name);

    const tableName = this.tableJoinForm.value.name;
    console.log(`Trying to join ${tableName}.`);
    const tableMeta: TableMeta = { name: tableName };
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
