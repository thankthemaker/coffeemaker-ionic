import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/concatAll'
import 'rxjs/add/operator/share'
import { List } from 'immutable'
import { ICoffee } from './coffee.interface'
import { AuthService } from './auth.service'
import * as moment from 'moment'
import * as _orderBy from 'lodash.orderby'
import { Sigv4Http } from './sigv4.service'
import { Config } from 'ionic-angular'
import * as log from 'loglevel';

let coffeeStoreFactory = (sigv4: Sigv4Http, auth: AuthService, config: Config) => { return new CoffeeStore(sigv4, auth, config) }

export let CoffeeStoreProvider = {
  provide: CoffeeStore,
  useFactory: coffeeStoreFactory,
  deps: [Sigv4Http, AuthService]
}

const displayFormat = 'YYYY-MM-DD'

@Injectable()
export class CoffeeStore {

  private _coffees: BehaviorSubject<List<ICoffee>> = new BehaviorSubject(List([]))
  private endpoint:string

  constructor (private sigv4: Sigv4Http, private auth: AuthService, private config: Config) {
    this.endpoint = this.config.get('APIs')['Coffee']
    this.auth.signoutNotification.subscribe(() => this._coffees.next(List([])))
    this.auth.signinNotification.subscribe(() => this.refresh() )
    this.refresh()
  }

  get coffees () { return Observable.create( fn => this._coffees.subscribe(fn) ) }

  refresh () : Observable<any> {
    if (this.auth.isUserSignedIn()) {
      let observable = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, 'coffees', creds)).concatAll().share()
      observable.subscribe(resp => {
        log.debug(resp)
        let data = resp.json()
        this._coffees.next(List(this.sort(data.coffees)))
      })
      return observable
    } else {
      this._coffees.next(List([]))
      return Observable.from([])
    }
  }

  private sort (coffees:ICoffee[]): ICoffee[] {
    return _orderBy(coffees, ['cardId'], ['asc'])
  }
}
