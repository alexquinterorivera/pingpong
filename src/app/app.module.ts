import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';


import { AppRoutingModule } from './app-routing.module';

import { ElectronService } from './providers/electron.service';
import { DataService } from './providers/data.service';
import { DataOfflineService } from './providers/data-offline.service';


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ScoreboardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    Ng2SmartTableModule
  ],
  providers: [ElectronService, DataService, DataOfflineService],
  bootstrap: [AppComponent]
})

export class AppModule { }