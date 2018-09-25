import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher} from 'ionic-angular';

import { Chart } from 'chart.js';

import { AuthService } from '../../app/auth.service'
import { ModalController } from 'ionic-angular'
import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'

import { CoffeeStore } from '../../app/coffee.store'
import { ICoffee } from '../../app/coffee.interface'

import * as _values from 'lodash.values'
import * as _reduce from 'lodash.reduce'
import * as _groupBy from 'lodash.groupby'
import * as _map from 'lodash.map'
import * as log from 'loglevel';

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

  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('lineCanvas') barCanvas;

  doughnutChart: any;
  lineChart: any;

  public doughnutChartLabels:string[]
  public doughnutChartData:number[]
  public doughnutChartLegend:boolean = false
  public doughnutChartType:string = 'doughnut'

  public lineChartData:any[]
  public lineChartLabels:any[]
  public lineChartLegend:boolean = true
  public lineChartType:string = 'bar'
  public lineChartOptions:any = {
    responsive: true,
    scales: {
      yAxes: [
        { id: 'y-axis-1', type: 'linear', display: true, position: 'left', gridLines: { display: false } },
        { id: 'y-axis-2', type: 'linear', display: true, position: 'right', gridLines: { display: false } } ],
      xAxes: [{ gridLines: { display: false } }]
    }
  }

  total = 0;
  coffeesByTypes: any = [];
  coffees: any = [];
  alreadyBilled = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private auth: AuthService,
    public modalCtrl: ModalController,
    public coffeestore: CoffeeStore) {
  }

  ionViewDidLoad() {
    log.debug('ionViewDidLoad StatisticsPage');
    this.loadData();
  }

  private loadData() {
    this.coffeestore.coffees
    .subscribe(data =>{
      this.total = 0;
      this.coffees = [];
      this.coffeesByTypes = [];
      data.forEach(element => {
        if(!element.billstatus || element.billstatus === "" || this.alreadyBilled) {
          this.coffees.push(
            { 
              "type": element.payload.product,
              "date": new Date(element.timestamp).toISOString().substr(2,8),
              "count": 1 
            }
          );        
        }
      });

      this.coffeesByTypes = _values(_reduce(this.coffees,function(result,obj){
        result[obj.type] = {
          type: obj.type,
          count:obj.count + (result[obj.type]?result[obj.type].count:0)
        };
        return result;
      },{}));

      this.createCharts();
    });
  }

  doRefresh(refresher: Refresher) {
    this.loadData();
    if(refresher) {
      setTimeout(() => {
        refresher.complete();
      }, 1000);
    }
  }

  private createCharts() {
    this.doughnutChartLabels = null
    this.createPieChart(this.coffeesByTypes);
    this.createBurnDownChart(this.coffees)
 }

 private createPieChart (coffees: any) {
  if (coffees.size === 0 && !this.doughnutChartLabels) { return this.doughnutChartLabels = null }

  this.doughnutChartLabels = []
  this.doughnutChartData = []

  let data = coffees.filter((p) => p.count > 0)
  if (data.length === 0 ) { return this.doughnutChartLabels = null }
  data.forEach((p) => {
    this.doughnutChartLabels.push(p.type)
    this.doughnutChartData.push(p.count)
    this.total += p.count;
  })

  this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
    type: this.doughnutChartType,
    data: {
        labels: this.doughnutChartLabels,
        datasets: [{
          legend: this.doughnutChartLegend,
          label: 'Anzahl Kaffee',
            data: this.doughnutChartData,
            backgroundColor: [
              'rgba(255, 0, 0, 0.2)',
              'rgba(0, 255, 0, 0.2)',
              'rgba(127, 0, 255, 0.2)',
              'rgba(255, 128, 0, 0.2)',
              'rgba(0, 255, 128, 0.2)',
              'rgba(255, 0, 255, 0.2)',
              'rgba(255, 255, 0, 0.2)',
              'rgba(0, 128, 255, 0.2)',
              'rgba(255, 0, 127, 0.2)',
              'rgba(128, 255, 0, 0.2)',
              'rgba(0, 0, 255, 0.2)',
              'rgba(128, 128, 128, 0.2)'
          ],
          borderColor: [
            'rgba(255, 0, 0, 1',
            'rgba(0, 255, 0, 1)',
            'rgba(127, 0, 255, 1)',
            'rgba(255, 128, 0, 1)',
            'rgba(0, 255, 128, 1)',
            'rgba(255, 0, 255, 1)',
            'rgba(255, 255, 0, 1)',
            'rgba(0, 128, 255, 1)',
            'rgba(255, 0, 127, 1)',
            'rgba(128, 255, 0, 01)',
            'rgba(0, 0, 255, 1)',
            'rgba(128, 128, 128, 1)'
        ],
          borderWidth: 1
        }]
    },
    options: {
      legend: {
          display: true,
          position: 'right'
      }
    }
  });
  this.doughnutChart.update();
}

private createBurnDownChart (coffees: any) {
  if (coffees.length === 0 && !this.lineChartLabels) { return this.lineChartLabels = null }

  let byMonths = _groupBy(coffees, 'date')
  this.lineChartLabels = Object.keys(byMonths).sort()
  let sum = 0;
  let burndown = this.lineChartLabels.map((k) => { sum+=byMonths[k].length; return sum }, 0);
  let completed = this.lineChartLabels.map((k) => byMonths[k].length, 0);

  let p = /\d{2}.(\d{2}).(\d{2})/
  this.lineChartLabels = this.lineChartLabels.map( d => d.replace(p, (m,p1,p2) => p2 + '.' + p1) )

  this.lineChartData = [
    { 
      label: 'Kaffeeanzahl/Tag', 
      borderWidth: 1, 
      type: 'bar', 
      yAxisID: 'y-axis-1',
      backgroundColor: "rgba(255, 0, 0, 0.2)",
      borderColor: "rgba(255, 0, 0, 1)",
      data: completed
    }, 
    { 
      label: 'Gesamtanzahl', 
      borderWidth: 1, 
      type: 'line', 
      yAxisID: 'y-axis-2',
      backgroundColor: "rgba(0, 255, 0, 0.2)",
      borderColor: "rgba(0, 255, 0, 1)",
      data: burndown
  }]

  this.lineChart = new Chart(this.barCanvas.nativeElement, {
 
    type: this.lineChartType,
    data: {
        labels: this.lineChartLabels,
        datasets: this.lineChartData
    },
    options: this.lineChartOptions
  });

  this.lineChart.update();
}

  openModal () {
    let modal = this.modalCtrl.create(this.auth.isUserSignedIn() ? LogoutModal : LoginModal)
    modal.present()
  }
  
  get userColor():string { return this.auth.isUserSignedIn() ? 'secondary' : 'dark' }

}
