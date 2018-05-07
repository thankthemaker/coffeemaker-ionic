import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProtocolPage } from './protocol';

@NgModule({
  declarations: [
    ProtocolPage,
  ],
  imports: [
    IonicPageModule.forChild(ProtocolPage),
  ],
})
export class ProtocolPageModule {}
