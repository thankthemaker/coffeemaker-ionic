import { Component } from '@angular/core';

import { StatisticsPage } from '../statistics/statistics';
import { PricelistPage } from '../pricelist/pricelist';
import { SettingsPage } from '../settings/settings';
import { CardlistPage } from '../cardlist/cardlist';
import { ProtocolPage } from '../protocol/protocol';
import { BillingPage } from '../billing/billing';

import { AuthService } from '../../app/auth.service'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab0Root = StatisticsPage;
  tab1Root = PricelistPage;
  tab2Root = CardlistPage;
  tab3Root = SettingsPage;
  tab4Root = ProtocolPage;
  tab5Root = BillingPage;

  constructor(private auth: AuthService ) {  }
}
