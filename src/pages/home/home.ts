import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Chart } from 'chart.js';

import { ParameterPage } from '../parameter/parameter';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})


export class HomePage {

    @ViewChild('lineCanvas') lineCanvas;
    @ViewChild('barCanvas') barCanvas;
    @ViewChild('radarCanvas') radarCanvas;
    @ViewChild('doughnutCanvas') doughnutCanvas;
    @ViewChild('polarCanvas') polarCanvas;
    @ViewChild('bubbleCanvas') bubbleCanvas;
    @ViewChild('scatterCanvas') scatterCanvas;
    @ViewChild('areaCanvas') areaCanvas;
    @ViewChild('mixedCanvas') mixedCanvas;

    Title: string;
    selectedItem: any;
    lineChar: any;
    barChart: any;
    radarChart: any;
    doughnutChart: any;
    polarChart: any;
    bubbleChart: any;
    scatterChart: any;
    areaChart: any;
    mixedChart: any;

    backgroundColors() {
        return [
            'rgba(255, 99, 132)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)']
    }

    borderColors() {
        return [
            'rgba(255, 99, 132)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)']
    }

    getValueToKeys(obj, findKey, estrutura, index, comb) {
        var values = [];
        comb += estrutura[0];

        if (comb === findKey)
            values = obj.map(function (k) { return k[estrutura[0]] });
        else
            values = this.getValueToKeys(obj[estrutura[0]], findKey, estrutura.slice(1, estrutura.length), index + 1, comb + '.');

        return values;
    }

    gerarRelatorio() {
        return new Promise((resolve, reject) => {

            this.http.get(this.selectedItem.UrlApi)
                .subscribe((result: any) => {
                    var estruturaChave = this.selectedItem.Descr.split(".");
                    var estruturaValue1 = this.selectedItem.Value1.split(".");
                    var datasetsValues = []
                    var chaves = this.getValueToKeys(result.json(), this.selectedItem.Descr, estruturaChave, 0, '');

                    if (this.selectedItem.Value1) {
                        var valores = this.getValueToKeys(result.json(), this.selectedItem.Value1, estruturaValue1, 0, '');
                        datasetsValues.push({
                            label: estruturaValue1[estruturaValue1.length-1],
                            data: valores,
                            backgroundColor: this.backgroundColors()[0],
                            borderColor: this.borderColors()[0],
                            borderWidth: 1
                        })
                    }

                    if (this.selectedItem.Value2) {
                        var estruturaValue2 = this.selectedItem.Value2.split(".");
                        var valores = this.getValueToKeys(result.json(), this.selectedItem.Value2, estruturaValue2, 0, '');
                        datasetsValues.push({
                            label: estruturaValue2[estruturaValue2.length-1],
                            data: valores,
                            backgroundColor: this.backgroundColors()[1],
                            borderColor: this.borderColors()[1],
                            borderWidth: 1
                        })
                    }

                    if (this.selectedItem.Grafico === 'barraH')
                        this.barChart = new Chart(this.barCanvas.nativeElement, {
                            type: 'horizontalBar',
                            data: {
                                labels: chaves,
                                datasets: datasetsValues
                            },
                            options: {
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }]
                                }
                            }

                        });

                    if (this.selectedItem.Grafico === 'barraV')
                        this.barChart = new Chart(this.barCanvas.nativeElement, {
                            type: 'bar',
                            data: {
                                labels: chaves,
                                datasets: datasetsValues
                            },
                            options: {
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }],
                                }
                            }
                        });


                    if (this.selectedItem.Grafico === 'bolha')
                        this.bubbleChart = new Chart(this.bubbleCanvas.nativeElement, {
                            type: 'bubble',
                            data: {
                                labels: chaves,
                                datasets: [{
                                    label: this.selectedItem.NameRel,
                                    data: valores,
                                    backgroundColor: this.backgroundColors()[0],
                                    borderColor: this.borderColors()[0]
                                }]
                            }
                        });

                    if (this.selectedItem.Grafico === 'linha')
                        this.lineChar = new Chart(this.lineCanvas.nativeElement, {

                            type: 'line',
                            data: {
                                labels: chaves,
                                datasets: [
                                    {
                                        label: this.selectedItem.NameRel,
                                        fill: false,
                                        lineTension: 0.1,
                                        backgroundColor: this.backgroundColors()[0],
                                        borderColor: this.borderColors()[0],
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

                    if (this.selectedItem.Grafico === 'mix')
                        this.mixedChart = new Chart(this.mixedCanvas.nativeElement, {
                            type: 'bar',
                            data: {
                                labels: chaves,
                                datasets: [{
                                    label: this.selectedItem.NameRel,
                                    data: valores,
                                    backgroundColor: this.backgroundColors()[0],
                                    borderColor: this.borderColors()[0],
                                    hoverBackgroundColor: [
                                        "#FF6384",
                                        "#36A2EB",
                                        "#FFCE56",
                                        "#FF6384",
                                        "#36A2EB",
                                        "#FFCE56"
                                    ]
                                },
                                {
                                    label: this.selectedItem.NameRel,
                                    data: valores,
                                    backgroundColor: this.backgroundColors()[0],
                                    borderColor: this.borderColors()[0],
                                    hoverBackgroundColor: [
                                        "#FF6384",
                                        "#36A2EB",
                                        "#FFCE56",
                                        "#FF6384",
                                        "#36A2EB",
                                        "#FFCE56"
                                    ],
                                    type: 'line'
                                }]
                            }
                        });

                    if (this.selectedItem.Grafico === 'pizza')
                        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
                            type: 'pie',
                            data: {
                                labels: chaves,
                                datasets: [{
                                    label: this.selectedItem.NameRel,
                                    data: valores,
                                    backgroundColor: this.backgroundColors()[0],
                                    borderColor: this.borderColors()[0],
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

                    if (this.selectedItem.Grafico === 'polar')
                        this.polarChart = new Chart(this.polarCanvas.nativeElement, {
                            type: 'polarArea',
                            data: {
                                labels: chaves,
                                datasets: [{
                                    label: this.selectedItem.NameRel,
                                    data: valores,
                                    backgroundColor: this.backgroundColors()[0],
                                    borderColor: this.borderColors()[0],
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

                    if (this.selectedItem.Grafico === 'radar')
                        this.radarChart = new Chart(this.radarCanvas.nativeElement, {
                            type: 'radar',
                            data: {
                                labels: chaves,
                                datasets: [{
                                    label: this.selectedItem.NameRel,
                                    data: valores,
                                    backgroundColor: this.backgroundColors()[0],
                                    borderColor: this.borderColors()[0]
                                }, {
                                    label: this.selectedItem.NameRel,
                                    data: valores,
                                    backgroundColor: this.backgroundColors()[0],
                                    borderColor: this.borderColors()[0]
                                }]
                            }
                        });

                    if (this.selectedItem.Grafico === 'rosca')
                        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
                            type: 'doughnut',
                            data: {
                                labels: chaves,
                                datasets: [{
                                    label: this.selectedItem.NameRel,
                                    data: valores,
                                    backgroundColor: this.backgroundColors()[0],
                                    borderColor: this.borderColors()[0],
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


                },
                (error) => {
                    reject(error.json());
                });
        });
    }

    constructor(public navCtrl: NavController, public http: Http, public navParams: NavParams) {
        this.selectedItem = navParams.get('item');
        if (this.selectedItem) {
            this.Title = this.selectedItem.NameRel;
            this.gerarRelatorio();
        }
        else this.Title = "Home";
    }

    openConfigPage() {
        this.navCtrl.push(ParameterPage);
    }


}
