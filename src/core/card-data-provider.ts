import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { CacheService } from 'ionic-cache';

@Injectable()
export class CardData {
  
  cards: any = [{ "id": "2345654345", 
  "givenname": "David", 
  "surname": "Gey", 
  "email": "tonymande@gmx.de",
  "paymethod": "cash"
},
{ "id": "4354634634", 
  "givenname": "Peter", 
  "surname": "Pan", 
  "email": "ppan@gmx.de",
  "paymethod": "paydirekt"
},
{ "id": "532413413", 
  "givenname": "Paul", 
  "surname": "Panzer", 
  "email": "panzer@bw.de",
  "paymethod": "paypal"
}];

  constructor(
    public http: Http,
    public cache: CacheService
  ) {}

  getCards() {
    return this.cards;
  }

  clearCache() {
    this.cache.clearGroup('cards');
  }
}
