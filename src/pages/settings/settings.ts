import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MQTTService} from '../../core/mqttservice';

import { AuthService } from '../../app/auth.service'
import { ModalController } from 'ionic-angular'
import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController,
    private auth: AuthService,
    public mqtt: MQTTService,
    public modalCtrl: ModalController) {
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

  openModal () {
    let modal = this.modalCtrl.create(this.auth.isUserSignedIn() ? LogoutModal : LoginModal)
    modal.present()
  }
  
  get userColor():string { return this.auth.isUserSignedIn() ? 'secondary' : 'dark' }

}
