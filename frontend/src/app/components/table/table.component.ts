import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/model/message';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass'],
})
export class TableComponent implements OnInit {
  chatForm: FormGroup;
  tableName = '';
  messageList: Message[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private socketService: SocketService
  ) {
    this.chatForm = this.formBuilder.group({
      message: [null, [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params) => (this.tableName = params.name)
    );
    this.socketService.socket.on('message-from-server', (message: Message) => {
      console.log(message);
      this.messageList.push(message);
    });
  }

  send(): void {
    const message: Message = {
      table: this.tableName,
      text: this.chatForm.value.message,
    };
    this.socketService.socket.emit('message-to-server', message);
    this.chatForm.reset();
  }
}