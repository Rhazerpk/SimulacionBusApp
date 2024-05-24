export class BusStop {
  constructor(
    public id: number,
    public nombre: string,
    public personasEnEspera: number = 0,
    public personasAbordo: number = 0,
    public personaDesembarcada: number = 0
  ) {}
}

export class Bus {
  constructor(
    public id: number,
    public capacidad: number,
    public pasajeros: number = 0
  ) {}
}

export class SimulationStats {
  constructor(
    public totalTransportado: number = 0,
    public faltanteEnBus: number = 0,
    public transportadosPorParada: { [key: number]: number } = {},
    public abandonados: number = 0
  ) {}
}
