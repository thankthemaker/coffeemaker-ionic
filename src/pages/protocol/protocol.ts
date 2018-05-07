import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MqttMessageProvider } from '../../core/message-provider' 
import * as log from 'loglevel';


/**
 * Generated class for the ProtocolPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-protocol',
  templateUrl: 'protocol.html',
})
export class ProtocolPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public messages: MqttMessageProvider) {
  }

  ionViewDidLoad() {
    log.debug('ionViewDidLoad ProtocolPage');
  }
}
