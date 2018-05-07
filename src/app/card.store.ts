import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/concatAll'
import 'rxjs/add/operator/share'
import { List } from 'immutable'
import { ICard } from './card.interface'
import { AuthService } from './auth.service'
import * as moment from 'moment'
import * as _orderBy from 'lodash.orderby'
import { Sigv4Http } from './sigv4.service'
import { Config } from 'ionic-angular'
import * as log from 'loglevel';

let cardStoreFactory = (sigv4: Sigv4Http, auth: AuthService, config: Config) => { return new CardStore(sigv4, auth, config) }

export let CardStoreProvider = {
  provide: CardStore,
  useFactory: cardStoreFactory,
  deps: [Sigv4Http, AuthService]
}

const displayFormat = 'YYYY-MM-DD'

@Injectable()
export class CardStore {

  private _cards: BehaviorSubject<List<ICard>> = new BehaviorSubject(List([]))
  private endpoint:string

  constructor (private sigv4: Sigv4Http, private auth: AuthService, private config: Config) {
    this.endpoint = this.config.get('APIs')['Card']
    this.auth.signoutNotification.subscribe(() => this._cards.next(List([])))
    this.auth.signinNotification.subscribe(() => this.refresh() )
    this.refresh()
  }

  get cards () { return Observable.create( fn => this._cards.subscribe(fn) ) }

  refresh () : Observable<any> {
    if (this.auth.isUserSignedIn()) {
      let observable = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, 'cards', creds)).concatAll().share()
      observable.subscribe(resp => {
        log.debug(resp)
        let data = resp.json()
        this._cards.next(List(this.sort(data.cards)))
      })
      return observable
    } else {
      this._cards.next(List([]))
      return Observable.from([])
    }
  }

  addCard (card): Observable<ICard> {
    let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'cards', card, creds)).concatAll().share()

    observable.subscribe(resp => {
      if (resp.status === 200) {
        let cards = this._cards.getValue().toArray()
        let card = resp.json().card
        cards.push(card)
        this._cards.next(List(this.sort(cards)))
      }
    })
    return observable.map(resp => resp.status === 200 ? resp.json().card : null)
  }

  deleteCard (index): Observable<ICard> {
    let cards = this._cards.getValue().toArray()
    let obs = this.auth.getCredentials().map(creds => this.sigv4.del(this.endpoint, `cards/${cards[index].cardId}`, creds)).concatAll().share()

    obs.subscribe(resp => {
      if (resp.status === 200) {
        cards.splice(index, 1)[0]
        this._cards.next(List(<ICard[]>cards))
      }
    })
    return obs.map(resp => resp.status === 200 ? resp.json().card : null)
  }

  updateCard (index): Observable<ICard> {
    let cards = this._cards.getValue().toArray()
    let obs = this.auth.getCredentials().map(creds => this.sigv4.put(
      this.endpoint,
      `cards/${cards[index].cardId}`,
      {completed: true, completedOn: moment().format(displayFormat)},
      creds)).concatAll().share()

    obs.subscribe(resp => {
      if (resp.status === 200) {
        cards[index] = resp.json().card
        this._cards.next(List(this.sort(cards)))
      }
    })

    return obs.map(resp => resp.status === 200 ? resp.json().card : null)
  }

  private sort (cards:ICard[]): ICard[] {
    return _orderBy(cards, ['surname'], ['asc'])
  }
}
