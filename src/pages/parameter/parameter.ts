import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';


@Component({
  selector: 'page-parameter',
  templateUrl: 'parameter.html'
})

export class ParameterPage {
  item: { NameRel?: string, UrlApi?: string, Grafico?: string, Descr?: string, Value1?: string, Value2?: string, ResultCache?: any };
  itens: Array<{ NameRel?: string, UrlApi?: string, Grafico?: string }>;
  retornoApi: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public events: Events, public http: Http, public toastCtrl: ToastController) {
    this.itens = [];
    this.storage.get('MenuDash').then(data => {
      if (data) {
        this.itens = data;
      }
    });

    this.item = {
      NameRel: '',
      UrlApi: '',
      Grafico: '',
      Descr: '',
      Value1: '',
      Value2: '',
      ResultCache: {},
    };
  }

  exibirMensagem(mensagem: string) {
    const toast = this.toastCtrl.create({
      message: mensagem,
      duration: 3000
    });

    toast.present();
  }

  logForm() {
    if (!this.item.NameRel) {
      this.exibirMensagem('Informe o nome do Relatório.');
      return;
    }

    if (!this.item.UrlApi) {
      this.exibirMensagem('Informe o end-point para localizar as informações para o relatório.');
      return;
    }

    if (!this.item.Grafico) {
      this.exibirMensagem('Informe qual será o gráfico para exibição os valores.');
      return;
    }

    if (!this.item.Descr) {
      this.exibirMensagem('Informe a descrição do eixo.');
      return;
    }

    if (!this.item.Value1) {
      this.exibirMensagem('Informe o valor do eixo.');
      return;
    }

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