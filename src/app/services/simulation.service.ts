import { Injectable } from '@angular/core';
import { Bus, BusStop, SimulationStats } from '../interfaces/simulation.model';


@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private busStops: BusStop[] = [];
  private bus: Bus = new Bus(1, 50);
  private stats: SimulationStats = new SimulationStats();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    this.busStops = [
      new BusStop(1, 'Parada 1'),
      new BusStop(2, 'Parada 2'),
      new BusStop(3, 'Parada 3')
    ];
    this.bus = new Bus(1, 50);
  }

  getBusStops(): BusStop[] {
    return this.busStops;
  }

  getBus(): Bus {
    return this.bus;
  }

  getStats(): SimulationStats {
    return this.stats;
  }

  simulateArrival(stopId: number, peopleArriving: number) {
    const stop = this.busStops.find(s => s.id === stopId);
    if (stop) {
      stop.personasEnEspera += peopleArriving;
    }
  }

  simulateBoarding(stopId: number) {
    const stop = this.busStops.find(s => s.id === stopId);
    if (stop) {
      const espacioDisponible = this.bus.capacidad - this.bus.pasajeros;
      const personasEnAbordar = Math.min(espacioDisponible, stop.personasEnEspera);
      stop.personasEnEspera -= personasEnAbordar;
      stop.personasAbordo += personasEnAbordar;
      this.bus.pasajeros += personasEnAbordar;
      this.stats.totalTransportado += personasEnAbordar;
      this.stats.transportadosPorParada[stopId] = (this.stats.transportadosPorParada[stopId] || 0) + personasEnAbordar;
    }
  }

  simulateDisembarking(stopId: number, peopleDisembarking: number) {
    const stop = this.busStops.find(s => s.id === stopId);
    if (stop) {
      const personasPorDesembarcar = Math.min(peopleDisembarking, this.bus.pasajeros);
      this.bus.pasajeros -= personasPorDesembarcar;
      stop.personaDesembarcada += personasPorDesembarcar;
    }
  }

  stopSimulation() {
    this.stats.faltanteEnBus = this.bus.pasajeros;
    this.stats.abandonados = this.busStops.reduce((acc, stop) => acc + stop.personasEnEspera, 0);
  }
}
