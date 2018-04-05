import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class ProductData {
  
  products: any;

  constructor( public http: Http) {}

  getProducts() {
    let url = '/assets/data/productlist.json';
    return this.http.get(url).map(res => res.json());
  }

  getProduct(id: string) {
    return this.getProducts()
    .map((data: any) => {
      return data.filter(item => {
         return item.id === id;
       })
     });;  
  }
}
