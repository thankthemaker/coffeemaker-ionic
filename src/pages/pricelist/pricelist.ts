import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ProductData } from '../../core/product-data-provider';
import { ProductdetailPage } from '../productdetail/productdetail';
import {MQTTService} from '../../core/mqttservice';

@Component({
  selector: 'page-pricelist',
  templateUrl: 'pricelist.html'
})
export class PricelistPage {

  products: any;

  constructor(public http: Http, 
    public navCtrl: NavController,
    public mqtt: MQTTService,
    public productData: ProductData) {
      this.productData.getProducts().subscribe((data: any) => {
        this.products = data;
      });
    }

    updatePricelist() {
      console.log("Update pricelist requested")
      this.mqtt.uploadPricelist();
    }

    goToProduct( id: String) {
      this.navCtrl.push(ProductdetailPage, { id: id });      
    }
}

