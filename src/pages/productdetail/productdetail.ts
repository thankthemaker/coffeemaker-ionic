import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProductData } from '../../core/product-data-provider';

import { AuthService } from '../../app/auth.service'

/**
 * Generated class for the ProductdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'product'
})
@Component({
  selector: 'page-productdetail',
  templateUrl: 'productdetail.html',
})
export class ProductdetailPage {

  product: any = {};

  constructor(
    public navCtrl: NavController, 
    private auth: AuthService,
    public navParams: NavParams,    
    public productData: ProductData) {

    }

    ionViewWillEnter() {
      console.log("Showing details for product " + this.navParams.data.id);    
      this.productData.getProduct(this.navParams.data.id).subscribe((data: any) => {
        this.product = data[0];
      });
    }
}
