import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-parameter',
  templateUrl: 'parameter.html'
})

export class ParameterPage {
  item: { NameRel?: string, UrlApi?: string, Grafico?: string };
  itens: Array<{ NameRel?: string, UrlApi?: string, Grafico?: string }>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public events: Events) {
    // storage.set('configRel', 'https://api.github.com/repos/Bertoncini/DashConnect/languages');
    this.itens = [];
    this.storage.get('MenuDash').then(data => {
      if (data) {
        for (let i = 0; i <= data.length - 1; i++) {
          this.itens.push({
            NameRel: data[i].NameRel,
            UrlApi: data[i].UrlApi,
            Grafico: data[i].Grafico,
          });
        }
      }
    });

    this.item = {
      NameRel: '',
      UrlApi: '',
      Grafico: '',
    };
  }

  logForm() {
    this.itens.push(this.item);
    this.storage.set('MenuDash', this.itens).then(data => {
      this.events.publish('menu:addRel', data, Date.now());
    });
    this.navCtrl.pop();
    console.log(this.item)
  }

}