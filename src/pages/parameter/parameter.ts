import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';


@Component({
  selector: 'page-parameter',
  templateUrl: 'parameter.html'
})

export class ParameterPage {
  item: { NameRel?: string, UrlApi?: string, Grafico?: string };
  itens: Array<{ NameRel?: string, UrlApi?: string, Grafico?: string }>;
  retornoApi: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public events: Events, public http: Http) {
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

  getDeepKeys(obj) {
    var keys = [];
    for (var key in obj) {
      keys.push(key);
      if (Array.isArray(obj[key])) {
        var subkeysArray = this.getDeepKeys(obj[key][0]);
        keys = keys.concat(subkeysArray.map(function (subkey) {
          return key + "." + subkey;
        }));
      } else if (typeof obj[key] === "object") {
        var subkeys = this.getDeepKeys(obj[key]);
        keys = keys.concat(subkeys.map(function (subkey) {
          return key + "." + subkey;
        }));
      }
    }
    return keys;
  }

  event() {
    return new Promise((resolve, reject) => {
      if (this.item.UrlApi) {
        this.http.get(this.item.UrlApi)
          .subscribe((result: any) => {

            resolve(result.json());
            this.retornoApi = this.getDeepKeys(result.json());

          },
          (error) => {
            reject(error.json());
          });
      }
    });
  }
}