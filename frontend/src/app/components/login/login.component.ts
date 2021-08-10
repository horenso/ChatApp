import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Notification } from 'src/app/model/notification';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-join',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  nameForm: FormGroup;
  alreadySubmitted = false;

  latestError = '';

  tableList = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
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

  isValid(): boolean {
    return this.nameForm.valid && !this.authService.isAuthenticated();
  }

  a(): boolean {
    return this.authService.isAuthenticated();
  }

  submit(): void {
    const user: User = { username: this.nameForm.value.name };
    this.authService.login(user).subscribe({
      next: (response) => console.log(response),
      error: (error) => {
        console.log('Error when logging in!');
        this.notificationService.error(error.error);
      },
    });
    // this.socketService.connectionObservable.subscribe((info) => {
    //   if (info.connected) {
    //     this.router.navigate(['lobby']);
    //   } else if (info.error) {
    //   }
    // });
  }
}
