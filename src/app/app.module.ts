import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ProductdetailPage } from '../pages/productdetail/productdetail';
import { CarddetailPage } from '../pages/carddetail/carddetail';
import { PricelistPage } from '../pages/pricelist/pricelist';
import { SettingsPage } from '../pages/settings/settings';
import { CardlistPage } from '../pages/cardlist/cardlist';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CacheModule } from "ionic-cache";
import {MQTTService} from '../core/mqttservice';
import { HttpModule } from '@angular/http';
import { ProductData } from '../core/product-data-provider';
import { CardData } from '../core/card-data-provider';

import { AwsConfig } from './app.config'
import { AuthService, AuthServiceProvider } from './auth.service'
import { Sigv4Http, Sigv4HttpProvider } from './sigv4.service'
import { LoginModal } from '../modal/login/login'
import { LogoutModal } from '../modal/logout/logout'


@NgModule({
  declarations: [
    MyApp,
    LoginModal,
    LogoutModal,
    ProductdetailPage,
    CarddetailPage,
    PricelistPage,
    SettingsPage,
    CardlistPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, new AwsConfig().load(), {
      links: [
        { component: CarddetailPage, name: 'CardDetail', segment: 'card/:id' },
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
    PricelistPage,
    SettingsPage,
    CardlistPage,
    TabsPage
  ],
  providers: [
    AuthService, 
    AuthServiceProvider,
    Sigv4Http, 
    Sigv4HttpProvider,
    StatusBar,
    ProductData,
    CardData,
    SplashScreen,
    MQTTService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
