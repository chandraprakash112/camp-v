import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Subject, Observable } from 'rxjs';
import { CommonService } from './common.service';
import { getBaseWebSocketUrl } from '../_helpers/base-url.util';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private messageSubject = new Subject<string>();
  private webSocketUrl = getBaseWebSocketUrl();
  personId: any;

  constructor(private commonService: CommonService) {}

  public connect(): void {
    if (this.client?.active) {
      return;
    }

    this.personId = JSON.parse(this.commonService.getLocalStorageData('userDetails'))?.personId || '';
    if (!this.personId) {
      console.error('WebSocket: Cannot connect without a personId.');
      return;
    }

    this.client = new Client({
      brokerURL: this.webSocketUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.onConnect = () => {
      console.log('Listening to notifications');

      this.client.subscribe(`/topic/alert/${this.personId}`, (message: IMessage) => {
        this.messageSubject.next(message.body);
      });
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message'], frame.body);
    };

    this.client.activate();
  }

  public get messages$(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  public close(): void {
    // this.client.deactivate();
    console.log('Closed notifications');
  }
}
