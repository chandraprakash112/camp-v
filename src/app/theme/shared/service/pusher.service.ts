import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { environment } from 'src/environments/environment';
import { getBaseUrl } from '../_helpers/base-url.util';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class PusherService {
  baseUrl: string = getBaseUrl();
  pusher: any;
  appConstant: any = environment;
  messagesChannel: any;

  constructor(private commonService: CommonService) {
    let authToken = this.commonService.getLocalStorageData('userToken');
    this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster,
      // authEndpoint: `${this.baseUrl}${environment.pusher.endPoint}`,
      authEndpoint: environment.pusher.endPoint,
      auth: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    });

    // this.pusher.connection.bind('connected', () => console.log('✅ Pusher connected!'));
    // this.pusher.connection.bind('error', (err) => console.log(err));

    // this.messagesChannel = this.pusher.subscribe('private-messages');
    // this.messagesChannel.bind('pusher:subscription_succeeded', (message) => console.log('✅ Subscribed to private-messages', message));
    // this.messagesChannel.bind('client-new-message', (data: any) => {
    //   console.log('📩 Received:', data);
    // });
  }

  send(message: any) {
    if (this.messagesChannel) {
      console.log('📤 Sending message:', message);
      this.messagesChannel.trigger('client-new-message', message);
    }
  }

  ngOnDestroy(): void {
    this.pusher.disconnect();
  }
}
