import { Inject, Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable()
export class MainSocket extends Socket{
  constructor(@Inject('username') username: string) {
    super({ url: 'http://localhost:4444', options: {
      query: {
        username: username
      }
    } });
  }
}
