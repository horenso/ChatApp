import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JoinComponent } from './components/join/join.component';
import { MainSocket } from './providers/main-socket';
import { LobbyComponent } from './components/lobby/lobby.component';
import { TableComponent } from './components/table/table.component';
import { ErrorComponent } from './components/error/error.component';
import { RoomFormComponent } from './components/room-form/room-form.component';

const config: SocketIoConfig = {
  url: 'http://localhost:4444/',
  options: {
    autoConnect: false,
  },
};

@NgModule({
  declarations: [
    AppComponent,
    JoinComponent,
    LobbyComponent,
    TableComponent,
    ErrorComponent,
    RoomFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [MainSocket],
  bootstrap: [AppComponent],
})
export class AppModule {}
