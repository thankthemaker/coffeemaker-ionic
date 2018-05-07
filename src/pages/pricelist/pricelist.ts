import { Component } from '@angular/core';
import { NavController, Refresher } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ProductData } from '../../core/product-data-provider';
import { ProductdetailPage } from '../productdetail/productdetail';
import {MQTTService} from '../../core/mqttservice';

import { AuthService } from '../../app/auth.service'
import { ModalController } from 'ionic-angular'
import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import * as log from 'loglevel';

@Component({
  selector: 'page-pricelist',
  templateUrl: 'pricelist.html'
})
export class PricelistPage {

  products: any;

  constructor(public http: Http, 
    public navCtrl: NavController,
    private auth: AuthService,
    public mqtt: MQTTService,
    public productData: ProductData,
    public modalCtrl: ModalController) {
      this.productData.getProducts().subscribe((data: any) => {
        this.products = data;
      });
    }

    updatePricelist() {
      log.debug("Update pricelist requested")
      this.mqtt.uploadPricelist(this.products);
    }

    goToProduct( id: String) {
      this.navCtrl.push(ProductdetailPage, { id: id });      
    }

    doRefresh(refresher: Refresher) {
      this.productData.getProducts().subscribe((data: any) => {
        this.products = data;
      });        setTimeout(() => {
          refresher.complete();
        }, 1000);
    }

    reorderItem(indexes) {
    }

    openModal () {
      let modal = this.modalCtrl.create(this.auth.isUserSignedIn() ? LogoutModal : LoginModal)
      modal.present()
    }
    
    get userColor():string { return this.auth.isUserSignedIn() ? 'secondary' : 'dark' }
  
}

