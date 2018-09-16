import { Component } from '@angular/core';
import { NavController, ToastController, Refresher } from 'ionic-angular';
import { MQTTService } from '../../core/mqttservice';
import { Platform } from 'ionic-angular';
import { CarddetailPage } from '../carddetail/carddetail';
import { CardData } from '../../core/card-data-provider';
import { MqttMessageProvider } from '../../core/message-provider';

import { AuthService } from '../../app/auth.service'
import { ModalController } from 'ionic-angular'
import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import * as log from 'loglevel';


@Component({
  selector: 'page-cardlist',
  templateUrl: 'cardlist.html'
})
export class CardlistPage {

  public isConnected: boolean = false;
  private queryText = '';  
  private RESPONSE_TOPIC: string = "/coffeemaker/gigax8/fromCoffeemaker";

  cards: any = [];
  cardcount = 0;
  
  constructor(public navCtrl: NavController,
    public mqtt: MQTTService,
    public toastCtrl: ToastController,
    public platform: Platform,
    public carddata: CardData,
    private auth: AuthService,
    public modalCtrl: ModalController,
    public messages: MqttMessageProvider) {
      
      this.platform.pause.subscribe(() => {
        log.debug("Receive event: pause");
                    mqtt.disconnect();
                });
        
                this.platform.resume.subscribe(() => {
                  log.debug("Receive event: resume");
                    mqtt.connect();
                });
        
                this.connect();
  }

  connect() { 
    this.mqtt.connect();
    this.mqtt.attachDebugHandlers();
    this.mqtt.attachMessageHandler((topic: string, payload: any) => {
      log.debug("Received message on topic [" + topic + "]: "  + payload);

      const message = payload.toString();
      if(message.startsWith("CARDS")) {
        this.updateCardlist(message);
      } else {
        this.messages.addMessages(message);
        const toast = this.toastCtrl.create({
          message: message,
          duration: 3000
        });
        toast.present();                    
      }
    });
    this.mqtt.subscribe(this.RESPONSE_TOPIC);
    }
    
  disconnect() {
 /*
          this.mqtt.disconnect(err => {
                if (err) return;
                log.debug("disconnect: MQTT disconnect");
                this.isConnected = false;
            });
*/
        }

      ionViewDidLoad() {
        this.auth.getCredentials().subscribe(creds => 
          this.mqtt.updateWebSocketCredentials(creds.accessKeyId, creds.secretAccessKey, creds.sessionToken)
           );
        this.loadCards()
      }

        loadCards() {
        this.carddata.getCards().subscribe(data =>{
          this.cards = [];
          data.forEach(element => {
            this.cards.push(element);
            this.cardcount = this.cards.length;
          });
        })
      }

      doRefresh(refresher: Refresher) {
        //this.carddata.clearCache();
        this.loadCards();
        this.mqtt.readCards();
          setTimeout(() => {
            refresher.complete();
          }, 1000);
      }

      showToast(newcard) {
        const toast = this.toastCtrl.create({
          message: 'Neue Karte gefunden: ' + newcard,
          duration: 3000
        });
        toast.present();
      }

      goToCard(card: any, cardId: string) {
        log.debug("pushing for carddetails of card.cardId=" + cardId);
        this.navCtrl.push(CarddetailPage, { card: card, cardId: cardId });      
      }

      deleteCard(cardId: string) {
        log.debug("deleting card: " + cardId);
        this.mqtt.deleteCard(cardId);
        this.carddata.deleteCard(cardId);
      }

      updateCardlist(newcard: string) {
        let count = 0;
        newcard = newcard.substr(newcard.indexOf(":")+1);
        log.debug("new CARD=" + newcard);
        if(this.cards.filter(card => (card.cardId === newcard)).length === 0) {
          count++;
          this.cards.push({
            "cardId": newcard
          })
          this.showToast(newcard)  
        }
      }

  filterCards() {
    this.carddata.getCards(this.queryText).subscribe(data => {
      this.cards = data;
    });
  }

  openModal () {
    let modal = this.modalCtrl.create(this.auth.isUserSignedIn() ? LogoutModal : LoginModal)
    modal.present()
  }
  
  get userColor():string { return this.auth.isUserSignedIn() ? 'secondary' : 'dark' }
}
