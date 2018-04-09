import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../app/auth.service'
import { ModalController } from 'ionic-angular'
import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'

import { CoffeeStore } from '../../app/coffee.store'
import { ICoffee } from '../../app/coffee.interface'

import * as _values from 'lodash.values'
import * as _reduce from 'lodash.reduce'

/**
 * Generated class for the StatisticsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage {

  public projectChartLabels:string[]
  public projectChartData:number[]
  public projectChartLegend:boolean = false
  public projectChartType:string = 'doughnut'

  total = 0;
  coffees: any = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private auth: AuthService,
    public modalCtrl: ModalController,
    public coffeestore: CoffeeStore) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatisticsPage');

    this.coffeestore.coffees
    .subscribe(data =>{
      this.coffees = [];
      data.forEach(element => {
        this.coffees.push(
          { 
            "type": element.payload.product,
            "count": 1 
          }
        );
      });

      this.coffees = _values(_reduce(this.coffees,function(result,obj){
        result[obj.type] = {
          type: obj.type,
          count:obj.count + (result[obj.type]?result[obj.type].count:0)
        };
        return result;
      },{}));

      this.createCharts();
    });
  }

  public createCharts() {
    this.projectChartLabels = null
    this.createPieChart(this.coffees);
 }

 private createPieChart (coffees: any) {
  if (coffees.size === 0 && !this.projectChartLabels) { return this.projectChartLabels = null }

  this.projectChartLabels = []
  this.projectChartData = []

  let data = coffees.filter((p) => p.count > 0)
  if (data.length === 0 ) { return this.projectChartLabels = null }
  data.forEach((p) => {
    this.projectChartLabels.push(p.type)
    this.projectChartData.push(p.count)
    this.total += p.count;
  })

}

  openModal () {
    let modal = this.modalCtrl.create(this.auth.isUserSignedIn() ? LogoutModal : LoginModal)
    modal.present()
  }
  
  get userColor():string { return this.auth.isUserSignedIn() ? 'secondary' : 'dark' }

}
