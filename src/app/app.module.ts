import { NgModule, ErrorHandler } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ProductdetailPage } from '../pages/productdetail/productdetail';
import { CarddetailPage } from '../pages/carddetail/carddetail';
import { PricelistPage } from '../pages/pricelist/pricelist';
import { StatisticsPage } from '../pages/statistics/statistics';
import { SettingsPage } from '../pages/settings/settings';
import { CardlistPage } from '../pages/cardlist/cardlist';
import { ProtocolPage } from '../pages/protocol/protocol';
import { BillingPage } from '../pages/billing/billing';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CacheModule } from "ionic-cache";
import {MQTTService} from '../core/mqttservice';
import { HttpModule } from '@angular/http';
import { ProductData } from '../core/product-data-provider';
import { CardData } from '../core/card-data-provider';
import { MqttMessageProvider } from '../core/message-provider';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AwsConfig } from './app.config'
import { AuthService, AuthServiceProvider } from './auth.service'
import { Sigv4Http, Sigv4HttpProvider } from './sigv4.service'
import { LoginModal } from '../modal/login/login'
import { LogoutModal } from '../modal/logout/logout'
import { CardStore, CardStoreProvider } from './card.store'
import { CoffeeStore, CoffeeStoreProvider } from './coffee.store'
import { BillStore, BillStoreProvider } from './bill.store'


@NgModule({
  declarations: [
    MyApp,
    LoginModal,
    LogoutModal,
    ProductdetailPage,
    CarddetailPage,
    StatisticsPage,
    PricelistPage,
    SettingsPage,
    ProtocolPage,
    CardlistPage,
    BillingPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ChartsModule,
    IonicModule.forRoot(MyApp, new AwsConfig().load(), {
      links: [
        { component: CarddetailPage, name: 'CardDetail', segment: 'card/:cardId' },
        { component: ProductdetailPage, name: 'ProductDetail', segment: 'product/:id' }
      ]
    }),
    CacheModule.forRoot()    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginModal,
    LogoutModal,
    CarddetailPage,
    ProductdetailPage,
    StatisticsPage,
    PricelistPage,
    SettingsPage,
    ProtocolPage,
    CardlistPage,
    BillingPage,
    TabsPage
  ],
  providers: [
    AuthService, 
    AuthServiceProvider,
    Sigv4Http, 
    Sigv4HttpProvider,
    CardStore, CardStoreProvider,
    CoffeeStore, CoffeeStoreProvider,
    BillStore, BillStoreProvider,
    StatusBar,
    ProductData,
    CardData,
    SplashScreen,
    MQTTService,
    MqttMessageProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
