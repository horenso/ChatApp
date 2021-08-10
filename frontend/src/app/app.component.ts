import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  username: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  connectionString: string = 'Not Connected';
  connected = false;

  ngOnInit(): void {
    this.authService.usernameObs.subscribe({
      next: (username) => {
        if (username !== null) {
          this.username = username;
          this.connected = true;
        } else {
          this.username = null;
          this.connected = false;
        }
      },
    });
  }

  enter(): void {
    this.router.navigate(['enter']);
  }

  leave(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
