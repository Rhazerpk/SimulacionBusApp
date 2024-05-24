import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SimulationComponent } from './simlulation/simlulation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SimulationComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SimulacionBus-App';
}
