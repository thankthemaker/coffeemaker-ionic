import { Injectable } from '@angular/core';

@Injectable()
export class MqttMessageProvider {
  
  messages: any = [];

  constructor() {}

  getMessages() {
    return this.messages;
  }

  addMessages(message: String) {
    this.messages.push(message);
  }
}
