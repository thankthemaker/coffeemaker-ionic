import { Component } from '@angular/core';
import { IonicPage, NavController,ToastController,  NavParams } from 'ionic-angular';
import UUID from 'uuid'

import { AuthService } from '../../app/auth.service'
import { CardStore } from '../../app/card.store'
import { ICard } from '../../app/card.interface'

@IonicPage({
  segment: 'card'
})
@Component({
  selector: 'page-carddetail',
  templateUrl: 'carddetail.html',
})
export class CarddetailPage {

  card: any = {};

  newcard:ICard = {
    surname:"",
    givenname:"",
    email:"",
    paymethod: "cash"
  };

  constructor(
      private auth: AuthService,
      private cardStore: CardStore,
      public navCtrl: NavController, 
      public toastCtrl: ToastController,
      public navParams: NavParams) {
    }

    ionViewWillEnter() {
      console.log("Showing details for card " + this.navParams.data.cardId);  
      this.card = this.navParams.data.card;  
      console.log(JSON.stringify(this.card));
    }

    updateCard() {

      this.newcard.cardId = this.card.cardId;
      this.newcard.givenname = this.card.givenname ;
      this.newcard.surname = this.card.surname;
      this.newcard.email = this.card.email;
      this.newcard.paymethod = this.card.paymethod;

        this.cardStore.addCard(this.newcard).subscribe(card => {
          if (card) {
            this.presentToast('Karte gespeichert: ' + card.cardId)
          } else {
            console.log('Could not add user. Please see logs')
          }
        })
    }

    presentToast(message) {
      let toast = this.toastCtrl.create({
        message: message,
        duration: 1500,
        position: 'bottom'
      })
      toast.onDidDismiss(() => { console.log('Dismissed toast') })
      toast.present()
    }
}
