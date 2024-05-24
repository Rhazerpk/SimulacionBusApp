import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SimulationService } from './services/simulation.service';



@NgModule({
  imports: [
    BrowserModule,
  ],
  providers: [SimulationService],
})
export class AppModule { }
