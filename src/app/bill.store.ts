import { Injectable } from '@angular/core'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/concatAll'
import 'rxjs/add/operator/share'
import { AuthService } from './auth.service'
import * as _orderBy from 'lodash.orderby'
import { Sigv4Http } from './sigv4.service'
import { Config } from 'ionic-angular'
import * as log from 'loglevel';

let billStoreFactory = (sigv4: Sigv4Http, auth: AuthService, config: Config) => { return new BillStore(sigv4, auth, config) }

export let BillStoreProvider = {
  provide: BillStore,
  useFactory: billStoreFactory,
  deps: [Sigv4Http, AuthService]
}

@Injectable()
export class BillStore {

  private endpoint:string

  constructor (private sigv4: Sigv4Http, private auth: AuthService, private config: Config) {
    this.endpoint = this.config.get('APIs')['Billing']
  }

  createBill (startdate, enddate, preview) {
    let request = {
      "input": "{\"startdate\": \"" + startdate + "\", \"enddate\": \"" + enddate + "\", \"preview\": " + preview + "}", 
      "name": "Billing-" + new Date().getTime(), 
      "stateMachineArn": "arn:aws:states:eu-central-1:127306523332:stateMachine:Billing" 
    }
    
    let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'bill', request, creds)).concatAll().share()

    observable.subscribe(resp => {
      console.log(resp.status + ", " + resp.statusText);
      console.log(resp.json());
      if (resp.status === 200) {
        //resp.json();
      }
    })
  }
}
