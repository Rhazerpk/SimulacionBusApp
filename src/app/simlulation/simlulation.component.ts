import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BusStop, Bus, SimulationStats } from '../interfaces/simulation.model';
import { SimulationService } from '../services/simulation.service';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class SimulationComponent implements OnInit {
  busStops: BusStop[] = [];
  bus: Bus = new Bus(1, 50);
  stats: SimulationStats = new SimulationStats();
  simulationRunning: boolean = false;
  busStopIds: number[] = [];

  constructor(private simulationService: SimulationService) {}

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
