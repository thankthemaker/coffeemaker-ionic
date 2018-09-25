import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { BillStore } from '../../app/bill.store'
import { CoffeeStore } from '../../app/coffee.store'
import { CardData } from '../../core/card-data-provider';
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
  cards: any = [];
  sum = 0;
  preview = true;

  constructor(
    private auth: AuthService,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public billstore: BillStore,
    public coffeestore: CoffeeStore,
    public carddata: CardData) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillingPage');
    this.sum = 0;
    this.carddata.getCards().subscribe(data =>{
      this.cards = [];
      data.forEach(element => {
        this.cards.push(element);
      });
    })
    this.todayAsDate = new Date();
    this.today = new Date().toISOString()
    this.enddate = new Date().toISOString();
    this.enddate = this.enddate.substr(0, 10) + "T23:59:59.999+02:00"
    this.startdate =  '' + this.todayAsDate.getFullYear() + '-' + ('0' + 
      (this.todayAsDate.getMonth()+1)).slice(-2) + "-01T00:00:00.000+02:00";
    this.updateBillPreview();
  }

  updateBillPreview() {
    var name = "";
    this.sum = 0;
    console.log("Filtering with " + "Startdate: " + this.startdate + ", Enddate: " + this.enddate);
    this.coffeestore.coffees
    .subscribe(data =>{
      this.coffees = [];
      data.forEach(element => {
        name = "";
        //console.log(JSON.stringify(card));      
        this.cards.forEach(card => {
          if(card.cardId === element.payload.cardid) {
            name = card.givenname + " " + card.surname;
          }
        });  
        console.log("Coffee Timestamp:" + new Date(element.timestamp).toISOString());
        if(new Date(element.timestamp).toISOString() > this.startdate && 
           new Date(element.timestamp).toISOString() < this.enddate &&
           (!element.billstatus || element.billstatus === "")) {
          this.sum += parseFloat(element.payload.price);
          this.coffees.push(
            { 
              "cardid": element.payload.cardid,
              "product": element.payload.product,
              "price": element.payload.price,
              "date": element.timestamp,
              "name": name
            }
          );
        }
      });

      this.coffees = _values(_reduce(this.coffees,function(result,obj){
        result[obj.cardid] = {
          cardid: obj.cardid,
          name: obj.name,
          price: parseFloat(obj.price) + parseFloat((result[obj.cardid]?result[obj.cardid].price:0))
        };
        return result;
      },{}));

      console.log(JSON.stringify(this.coffees));
    });
  }

  calculateBill() {
    this.showToast();
    this.billstore.createBill(this.startdate, this.enddate, this.preview);
  }

  showToast() {
    const toast = this.toastCtrl.create({
      message: 'Abrechnung wird erstellt',
      duration: 3000
    });
    toast.present();
  }
}
