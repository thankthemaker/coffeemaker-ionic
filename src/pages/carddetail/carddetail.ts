import { Component } from '@angular/core';
import { IonicPage, NavController,ToastController,  NavParams } from 'ionic-angular';
import UUID from 'uuid'

import { AuthService } from '../../app/auth.service'
import { UserStore } from '../../app/user.store'
import { IUser } from '../../app/user.interface'

@IonicPage({
  segment: 'card'
})
@Component({
  selector: 'page-carddetail',
  templateUrl: 'carddetail.html',
})
export class CarddetailPage {

  card: any = {};

  task:IUser = {
    surname:"",
    givenname:"",
    email:"",
    paymethod: "cash"
  };

  constructor(
      private auth: AuthService,
      private userStore: UserStore,
      public navCtrl: NavController, 
      public toastCtrl: ToastController,
      public navParams: NavParams) {
    }

    ionViewWillEnter() {
      console.log("Showing details for card " + this.navParams.data.taskId);  
      this.card = this.navParams.data.card;  
      console.log(JSON.stringify(this.card));
    }

    updateCard() {

      this.task.taskId = this.card.taskId;
      this.task.givenname = this.card.givenname ;
      this.task.surname = this.card.surname;
      this.task.email = this.card.email;
      this.task.paymethod = this.card.paymethod;

        this.userStore.addTask(this.task).subscribe(task => {
          if (task) {
            this.presentToast('task updated' + task.taskId)
          } else {
            console.log('Could not add user. Please see logs')
          }
        })
    }

    presentToast(message) {
      let toast = this.toastCtrl.create({
        message: message,
        duration: 1500,
        position: 'bottom'
      })
      toast.onDidDismiss(() => { console.log('Dismissed toast') })
      toast.present()
    }
}
