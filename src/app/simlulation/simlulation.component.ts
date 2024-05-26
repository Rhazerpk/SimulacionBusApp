import { Component, ViewChild, ElementRef, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { BusStop, Bus, SimulationStats } from '../interfaces/simulation.model';
import { SimulationService } from '../services/simulation.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SimulationComponent implements OnInit {
  @ViewChild('chart') chartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('busContainer') busContainerRef!: ElementRef<HTMLDivElement>;
  private chart!: Chart;
  private busInterval!: any;

  busStops: BusStop[] = [];
  bus: Bus = new Bus(1, 50);
  stats: SimulationStats = new SimulationStats();
  simulationRunning: boolean = false;
  busStopIds: number[] = [];
  currentStopIndex: number = 0;

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
            responsive: true,
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
    this.simulateBusMovement();
  }

  stopSimulation() {
    this.simulationRunning = false;
    this.simulationService.stopSimulation();
    clearInterval(this.busInterval);
    this.chart.data.datasets[0].data = this.busStopIds.map(id => this.stats.transportadosPorParada[id] || 0);
    this.chart.update();
  }

  simulateBusMovement() {
    this.busInterval = setInterval(() => {
      const currentStop = this.busStops[this.currentStopIndex];
      this.simulateArrival(currentStop.id);
      this.simulateBoarding(currentStop.id);
      this.simulateDisembarking(currentStop.id);
      this.moveBusToNextStop();
    }, 2000);
  }

  moveBusToNextStop() {
    const busContainer = this.busContainerRef.nativeElement;
    const stopContainer = document.getElementById(`stop-${this.busStops[this.currentStopIndex].id}`);
    if (stopContainer) {
      busContainer.style.left = `${stopContainer.offsetLeft}px`;
    }
    this.currentStopIndex = (this.currentStopIndex + 1) % this.busStops.length;
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
