import { Component } from '@angular/core';
import { NavController, ToastController, Refresher } from 'ionic-angular';
import { MQTTService } from '../../core/mqttservice';
import { Platform } from 'ionic-angular';
import { CarddetailPage } from '../carddetail/carddetail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public isConnected: boolean = false;
  private RESPONSE_TOPIC: string = "/coffeemaker/gigax8/fromCoffeemaker";

  cards: any = [];
  
  constructor(public navCtrl: NavController,
    public mqtt: MQTTService,
    public toastCtrl: ToastController,
    public platform: Platform) {
      
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
                    this.updateProductlist(message);
                  }
                  const toast = this.toastCtrl.create({
                    message: message,
                    duration: 3000
                  });
                  toast.present();
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

      doRefresh(refresher: Refresher) {
        this.mqtt.readCards();
          setTimeout(() => {
            refresher.complete();
          }, 1000);
      }

      showToast() {
        const toast = this.toastCtrl.create({
          message: 'Einträge aktuallisiert',
          duration: 3000
        });
        toast.present();
      }

      goToCard(card: any, id: String) {
        console.log("pushing for carddetails of card.id=" + id);
        this.navCtrl.push(CarddetailPage, { card: card, id: id });      
      }

      updateProductlist(cards: String) {
        this.cards = [];
        if(cards.charAt(cards.length-1) === ',') {
          cards = cards.substring(7, cards.length-1);
        } else {         
           cards = cards.substring(7);
        }
        console.log("CARDS=" + cards);
        cards.split(",")
        .map((val: string) => {
          this.cards.push({
            "id": val
          }) 
        });  
        this.showToast() 
      }
}
