import { Component } from '@angular/core';
import { NavController, ToastController, Refresher } from 'ionic-angular';
import { MQTTService } from '../../core/mqttservice';
import { Platform } from 'ionic-angular';
import { CarddetailPage } from '../carddetail/carddetail';
import { CardData } from '../../core/card-data-provider';

import { AuthService } from '../../app/auth.service'
import { ModalController } from 'ionic-angular'
import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'

@Component({
  selector: 'page-cardlist',
  templateUrl: 'cardlist.html'
})
export class CardlistPage {

  public isConnected: boolean = false;
  private queryText = '';  
  private RESPONSE_TOPIC: string = "/coffeemaker/gigax8/fromCoffeemaker";

  cards: any = [];
  
  constructor(public navCtrl: NavController,
    public mqtt: MQTTService,
    public toastCtrl: ToastController,
    public platform: Platform,
    public carddata: CardData,
    private auth: AuthService,
    public modalCtrl: ModalController) {
      
      this.platform.pause.subscribe(() => {
                    console.log("Receive event: pause");
                    mqtt.disconnect();
                });
        
                this.platform.resume.subscribe(() => {
        
                    console.log("Receive event: resume");
                    mqtt.connect();
                });
        
                this.connect();
  }

  connect() { 
            this.mqtt.connect(err => {
                if (err) return;
                console.log("connect: MQTT connected");
                this.isConnected = true;

                this.mqtt.subscribe(this.RESPONSE_TOPIC, (topic: string, message: string) => {
                  console.log("Received message on topic [" + topic + "]: "  + message);
                  if(message.startsWith("CARDS:")) {
                    this.updateCardlist(message);
                  } else {
                    const toast = this.toastCtrl.create({
                      message: message,
                      duration: 3000
                    });
                    toast.present();                    
                  }
                });
            });
        }
    
        disconnect() {
            this.mqtt.disconnect(err => {
                if (err) return;
                console.log("disconnect: MQTT disconnect");
                this.isConnected = false;
            });
        }

      ionViewDidLoad() {
        this.loadCards()
      }

        loadCards() {
        this.carddata.getCards().subscribe(data =>{
          this.cards = [];
          data.forEach(element => {
            this.cards.push(element);
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

      showToast(count) {
        const toast = this.toastCtrl.create({
          message: count + ' neue Karten gefunden.',
          duration: 3000
        });
        toast.present();
      }

      goToCard(card: any, cardId: String) {
        console.log("pushing for carddetails of card.cardId=" + cardId);
        this.navCtrl.push(CarddetailPage, { card: card, cardId: cardId });      
      }

      updateCardlist(newcards: String) {
        if(newcards.charAt(newcards.length-1) === ',') {
          newcards = newcards.substring(7, newcards.length-1);
        } else {         
          newcards = newcards.substring(7);
        }
        console.log("CARDS=" + newcards);
        let count = 0;
        newcards.split(",")
        .map((val: string) => {
          console.log("cards:" + JSON.stringify(this.cards));
          console.log("size:" + this.cards.filter(card => (card.cardId === val)).length);
          if(this.cards.filter(card => (card.cardId === val)).length === 0) {
            count++;
            this.cards.push({
              "cardId": val
            }) 
          }
        });  
        this.showToast(count) 
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
