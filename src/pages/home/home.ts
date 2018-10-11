import { Component, ViewChild  } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Chart } from 'chart.js';

import { ParameterPage } from '../parameter/parameter';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
	@ViewChild('lineCanvas') lineCanvas;
    selectedItem: any;
    barChart: any;
    doughnutChart: any;
    lineChar: any;

    gerarRelatorio() {
    return new Promise((resolve, reject) => {

	  	this.http.get(this.selectedItem.UrlApi)
                  .subscribe((result: any) => {
        resolve(result.json());
        var chaves = Object.keys(result.json());
        var valores = Object.keys(result.json()).map(function(k) { return result.json()[k] });
      
        if(this.selectedItem.pizza === true)
          this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
            type: 'doughnut',
            data: {
              labels: chaves,
              datasets: [{
              label: this.selectedItem.NameRel,
              data: valores,
              backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
              ],
              hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
              ]
            }]
            }
          });

        if(this.selectedItem.barra === true)
          this.barChart = new Chart(this.barCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: chaves,
                datasets: [{
                    label: this.selectedItem.NameRel,
                    data: valores,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
 
        });

        if(this.selectedItem.linha === true)
          this.lineChar = new Chart(this.lineCanvas.nativeElement, {
 
            type: 'line',
            data: {
                labels: chaves,
                datasets: [
                    {
                        label: this.selectedItem.NameRel,
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: valores,
                        spanGaps: false,
                    }
                ]
            }
 
        });


		        },
		        (error) => {
		          reject(error.json());
		        });
    });
  }

  constructor(public navCtrl: NavController, public http: Http, public navParams: NavParams) {
	  this.selectedItem = navParams.get('item');
    // Or to get a key/value pair
    if(this.selectedItem)
	    this.gerarRelatorio();
  }
  
  openConfigPage() {
    this.navCtrl.push(ParameterPage);
  }


}
