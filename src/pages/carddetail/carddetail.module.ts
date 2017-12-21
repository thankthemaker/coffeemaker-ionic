import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarddetailPage } from './carddetail';

@NgModule({
  declarations: [
    CarddetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CarddetailPage),
  ],
})
export class CarddetailPageModule {}
