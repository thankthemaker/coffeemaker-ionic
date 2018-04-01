import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../app/auth.service'

@IonicPage({
  segment: 'card'
})
@Component({
  selector: 'page-carddetail',
  templateUrl: 'carddetail.html',
})
export class CarddetailPage {

  card: any = {};

  constructor(
      public navCtrl: NavController, 
      private auth: AuthService,
      public navParams: NavParams) {
    }

    ionViewWillEnter() {
      console.log("Showing details for card " + this.navParams.data.id);  
      this.card = this.navParams.data.card;  
      console.log(JSON.stringify(this.card));
    }
}
