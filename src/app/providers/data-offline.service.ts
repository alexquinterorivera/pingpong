import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
const remote = require('electron').remote;
const main = remote.require('./main.js');


@Injectable()
export class DataOfflineService {

  constructor(public http:Http) {
    console.log('Data Service connected');
  }

  getPlayers(){
    console.log("YOUR OFFLINE HOMIE!");
    return this.http.get('http://127.0.0.1:3000/getPlayers').map(res => res.json());
  }

  getPlayerStats(){
    return this.http.get('http://127.0.0.1:3000/getPlayerStats').map(res => res.json());
  }

  getMatchStats(p1,p2){
    return this.http.get('http://127.0.0.1:3000/getMatchStats/'+p1+'/'+p2).map(res => res.json());
  }

  getMatchHistory(p1,p2){
    return this.http.get('http://127.0.0.1:3000/getMatchHistory/'+p1+'/'+p2).map(res => res.json());
  }

  saveGame(match,winner){
    return this.http.get('http://127.0.0.1:3000/setSave/'+JSON.stringify(match)+'/'+winner).map(res => res.json());
  }
}
