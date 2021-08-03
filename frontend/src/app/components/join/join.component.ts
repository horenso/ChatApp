import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { MainSocket } from 'src/app/providers/main-socket';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.sass'],
})
export class JoinComponent implements OnInit {
  nameForm: FormGroup;
  alreadySubmitted = false;

  latestError = '';

  tableList = [];

  constructor(
    private formBuilder: FormBuilder,
    private socketService: SocketService,
    private router: Router
  ) {
    this.nameForm = this.formBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  submit(): void {
    this.socketService.connect(this.nameForm.value.name);
    this.socketService.connectionObservable.subscribe((info) => {
      if (info.connected) {
        this.router.navigate(['lobby']);
      } else if (info.error) {
        this.latestError = info.error.message;
      }
    });
  }
}
