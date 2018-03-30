import { Component } from '@angular/core';

import { PricelistPage } from '../pricelist/pricelist';
import { SettingsPage } from '../settings/settings';
import { CardlistPage } from '../cardlist/cardlist';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CardlistPage;
  tab2Root = PricelistPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}
