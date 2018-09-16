import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable'
import { CardStore } from '../app/card.store'
import { ICard } from '../app/card.interface'
import { int } from 'aws-sdk/clients/datapipeline';

@Injectable()
export class CardData {

  constructor(
    public http: Http,
    private cardStore: CardStore) {}

  getCards(queryText = '') {
    queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    let request = this.cardStore.cards;
    return request
    .map((data: any) => {
     return data.filter(card => {
      let matchesQueryText = false;
      if (queryWords.length) {
        // of any query word is in the session name than it passes the query test
        queryWords.forEach((queryWord: string) => {
          var target = card.surname + card.givenname + card.email + card.cardId;
          if (target.toLowerCase().indexOf(queryWord.toLowerCase()) > -1) {
            matchesQueryText = true;
          }
        });
      } else {
        // if there are no query words then this session passes the query test
        matchesQueryText = true;
      }
      return matchesQueryText;
    });
  }); 
  }

  deleteCard(index) {
    this.cardStore.deleteCard(index);  
  }
}
