import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { CoffeeStore } from '../../app/coffee.store'
import { AuthService } from '../../app/auth.service'

import * as _values from 'lodash.values'
import * as _reduce from 'lodash.reduce'
import * as log from 'loglevel';
/**
 * Generated class for the BillingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-billing',
  templateUrl: 'billing.html',
})
export class BillingPage {

  startdate: String;
  enddate: String;
  today: String;
  todayAsDate: Date;
  coffees: any = [];

  constructor(
    private auth: AuthService,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public coffeestore: CoffeeStore) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillingPage');
    this.todayAsDate = new Date();
    this.today = new Date().toISOString()
    this.enddate = new Date().toISOString()
    this.startdate =  '' + this.todayAsDate.getFullYear() + '-' + ('0' + 
      (this.todayAsDate.getMonth()+1)).slice(-2) + "-01T00:00:00.000Z";
    this.updateBillPreview();
  }

  updateBillPreview() {
    console.log("Filtering with " + "Startdate: " + this.startdate + ", Enddate: " + this.enddate);
    this.coffeestore.coffees
    .subscribe(data =>{
      this.coffees = [];
      data.forEach(element => {
        //console.log(JSON.stringify(element));
        console.log("Coffee Timestamp:" + new Date(element.timestamp).toISOString());
        if(new Date(element.timestamp).toISOString() > this.startdate && 
           new Date(element.timestamp).toISOString() < this.enddate) {
          this.coffees.push(
            { 
              "cardid": element.payload.cardid,
              "product": element.payload.product,
              "price": element.payload.price,
              "date": element.timestamp
            }
          );
        }
      });

      this.coffees = _values(_reduce(this.coffees,function(result,obj){
        result[obj.cardid] = {
          cardid: obj.cardid,
          price: obj.price + (result[obj.cardid]?result[obj.cardid].price:0)
        };
        return result;
      },{}));

      console.log(JSON.stringify(this.coffees));
    });
  }

  calculateBill() {
    this.showToast();
  }

  showToast() {
    const toast = this.toastCtrl.create({
      message: 'Abrechnung wird erstellt',
      duration: 3000
    });
    toast.present();
  }
}
