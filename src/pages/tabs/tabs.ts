import { Component } from '@angular/core';

import { StatisticsPage } from '../statistics/statistics';
import { PricelistPage } from '../pricelist/pricelist';
import { SettingsPage } from '../settings/settings';
import { CardlistPage } from '../cardlist/cardlist';

import { AuthService } from '../../app/auth.service'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab0Root = StatisticsPage;
  tab1Root = PricelistPage;
  tab2Root = CardlistPage;
  tab3Root = SettingsPage;

  constructor(private auth: AuthService ) {  }
}
