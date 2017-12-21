import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { CacheService } from "ionic-cache";

@Injectable()
export class ProductData {
  
  products: any;

  constructor(
    public http: Http,
    public cache: CacheService
  ) {}

  getProducts() {
    let url = "/assets/data/productlist.json";
    let cacheKey = url;
    let request = this.http.get(url).map(res => res.json());
    return this.cache.loadFromObservable(cacheKey, request, 'products');
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
