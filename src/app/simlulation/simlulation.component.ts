import { Component, ViewChild, ElementRef, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { BusStop, Bus, SimulationStats } from '../interfaces/simulation.model';
import { SimulationService } from '../services/simulation.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class SimulationComponent implements OnInit {
  @ViewChild('chart') chartRef!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;

  busStops: BusStop[] = [];
  bus: Bus = new Bus(1, 50);
  stats: SimulationStats = new SimulationStats();
  simulationRunning: boolean = false;
  busStopIds: number[] = [];

  constructor(
    private simulationService: SimulationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      import('chart.js/auto').then((module) => {
        this.chart = new module.Chart(this.chartRef.nativeElement, {
          type: 'line',
          data: {
            labels: this.busStopIds,
            datasets: [
              {
                label: 'Personas Transportadas',
                data: this.busStopIds.map(id => this.stats.transportadosPorParada[id] || 0),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Simulación de Autobús'
              }
            }
          }
        });
      });
    }
  }

  ngOnInit() {
    this.busStops = this.simulationService.getBusStops();
    this.bus = this.simulationService.getBus();
    this.stats = this.simulationService.getStats();
    this.busStopIds = this.busStops.map(s => s.id);
  }

  startSimulation() {
    this.simulationRunning = true;
  }

  stopSimulation() {
    this.simulationRunning = false;
    this.simulationService.stopSimulation();
    this.chart.data.datasets[0].data = this.busStopIds.map(id => this.stats.transportadosPorParada[id] || 0);
    this.chart.update();
  }

  simulateArrival(stopId: number) {
    const peopleArriving = Math.floor(Math.random() * 10) + 1;
    this.simulationService.simulateArrival(stopId, peopleArriving);
  }

  simulateBoarding(stopId: number) {
    this.simulationService.simulateBoarding(stopId);
  }

  simulateDisembarking(stopId: number) {
    const peopleDisembarking = Math.floor(Math.random() * 5) + 1;
    this.simulationService.simulateDisembarking(stopId, peopleDisembarking);
  }
}
