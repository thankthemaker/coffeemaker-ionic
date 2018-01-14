import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MQTTService} from '../../core/mqttservice';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController,
    public mqtt: MQTTService) {
  }

  readCards() {
    this.mqtt.readCards();
  }

  readPricelist() {
    this.mqtt.readPricelist();
  }

  registerNewCards() {
    this.mqtt.registerNewCards();
  }

  deleteCard(card_id: string) {
    this.mqtt.deleteCard(card_id);
  }

  chargeCard(card_id: string, amount: string){
    this.mqtt.chargeCard(card_id, amount);
  }

  inkassoModeOn() {
    this.mqtt.inkassoModeOn();
  }

  inkassoModeOff() {
    this.mqtt.inkassoModeOff();
  }

  startOTAUpdate() {
    this.mqtt.startOTAUpdate();
  }
}
