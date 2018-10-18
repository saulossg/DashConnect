import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { Events } from 'ionic-angular';

import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, rel?: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storage: Storage, public events: Events) {
    this.initializeApp();


    // used for an example of ngFor and navigation
    this.storage.get('MenuDash').then(data =>{
      if(data){
        this.carregarMenu(data);
      }else{
        this.menuPadrao();
      }
    });

   events.subscribe('menu:addRel', (paginas, time) => {
     // user and time are the same arguments passed in `events.publish(user, time)`
     this.carregarMenu(paginas);
     });
  }

  menuPadrao(){
    this.pages = [
      { title: 'Home', component: HomePage },
    ];
  }

  carregarMenu(paginas: any){
    
   this.menuPadrao();

     for (let i = 0; i <= paginas.length-1; i++) {
        this.pages.push({
          title: paginas[i].NameRel,
          component: HomePage,
          rel: paginas[i]
        });
      }
     
   }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.rel){
      this.nav.setRoot(page.component, {
            item: page.rel
          });
    }else{
      this.nav.setRoot(page.component);
    }
  }
}
