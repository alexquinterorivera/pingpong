import { Component, OnInit } from '@angular/core';
import {DataService } from '../../providers/data.service';


@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
  
})
export class ScoreboardComponent implements OnInit {
  players: Players;
  p1: any;
  p2: any;
  king: any;
  stats: any;
  Loaded: boolean = false;
  matches: any;
  history: boolean = false;
  historyStatus: string;
  games: any;
  historyKeys: any;
  playerHistory: any;

  settings = {
    columns: {
      count: {
        title: "#",
        editable: false,
        filter: false,
      },
       p1score: {
         title: "Jou score",
         editable: false,
         filter: false,
       },
       p2score: {
         title: "Speler 2's Score",
         editable: false,
         filter: false
       },
       day: {
         title: 'Datum',
         editable: false,
         valuePrepareFunction: (value) => {
            let date = getDate('date', value);
            if(date.day < 10){
              date.day = '0'+ date.day
            }
            return date.day+"-"+date.month+"-"+date.year;
         },
         filter: false
       },
       time: {
         title: 'Tijd',
         editable: false,
         valuePrepareFunction: (value) => {
           let formatTime = (t) => {
             if(t < 10){
               t = '0'
             }
             return t;
           }
           let time = getDate('time',value);
           return formatTime(time.hours)+":"+formatTime(time.minutes)+":"+formatTime(time.seconds)
         },
         filter: false
       },
       playtime: {
         title: 'Speel tijd',
         editable: false,
         filter: false
       },
       name: {
         title: 'Winnaar',
         editable: false
       }
    },
    attr: {
      class: 'historyTable'
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    }
  };
  

  constructor(private dataService: DataService) {
    
    console.log('constructor ran');
  }

  checkHistory(action, value){
    switch(action){
      case 'pickPlayer':
        this.p1 = value;
        console.log(this.p1);
        this.history = true;
        this.historyStatus = 'pickPlayer';
      break;

      case 'getMatchHistory':
        if(!value) {
          alert('Pick a player');
          return
        };

        this.p2 = value;
        this.historyStatus = 'checkHistory';

        this.dataService.getMatchHistory(this.p1,this.p2).subscribe((data) => {
          if(!data[0].winnerID){
            console.log('nope');
          }else{
            this.games = {
                wins: 0,
                total: 0
            }
            let playerHistory = [];
            let count=0;
            for(let key in data){
              let date = new Date(data[key].date)

              playerHistory.push({
                day: date,
                time: date,
                playtime: data[key].time,
                count: count,
                p1name: this.p1.name,
                p2name: this.p2.name,
                p1score: data[key].p1score,
                p2score: data[key].p2score,
                name: data[key].name,
                winnerID: data[key].winnerID
              })
                if(data[key].winnerID){
                    this.games.total ++;
                    if(data[key].winnerID == this.p1){
                        this.games.wins ++
                    }
                }
                count++;
            };
            this.playerHistory = playerHistory;
            this.p1 = this.stats[this.p1];
            this.p2 = this.stats[this.p2];
            this.historyStatus = 'foundHistory';
            
          }
        });
      break;

      case 'close':
        if(this.historyStatus != 'pickPlayer'){
          this.p2, this.playerHistory, this.historyKeys = null;
          this.p1 = this.p1.id;
          this.historyStatus = 'pickPlayer';
        }else{
          this.history = false;
          this.historyStatus, this.p1, this.p2, this.games, this.playerHistory, this.historyKeys = null;
        }
      break;
    }
  }


  ngOnInit() {
    this.dataService.getPlayers().subscribe((players) => {
      this.players = players;
      this.players.length = players.length;
      this.king;
      this.matches = {};
      let tempElo = 0;
      console.log(players);

      for(let key in this.players){
        if(this.players[key].elo > tempElo){
          this.king = this.players[key];
          tempElo = this.players[key].elo;
        }
      }

      this.dataService.getPlayerStats().subscribe((stats) => {
        //Subscribed to stats, need to add new stats (playervsplayer) using dataService.getMatchStats();??
        for(let keyp1 in stats){ 
          this.matches[keyp1] = [];
          stats[keyp1].winrate = Math.floor((stats[keyp1].games_played / 100) * stats[keyp1].wins);
          for(let keyp2 in stats){
            let p1 = stats[keyp1].id;
            let p2 = stats[keyp2].id;
            this.dataService.getMatchStats(p1,p2).subscribe((matchStats) => {
              this.matches[keyp1].push(matchStats.p1);
            })
          }
        }

        this.stats = stats;
        console.log(this.stats);
        this.king = this.stats[this.king.id]
        this.Loaded = true;
      })
    }); 
  }
}
interface Players{
  id: number,
  name: string,
  elo: number,
  wins: number,
  games: number,
  length: number
};

let getDate = (action , value) => {
  let date = value;
  let newObject;
  if(action == 'date'){
    newObject = {
      day: date.getDate(),
      month: date.getMonth()+1,
      year: date.getFullYear()
    }
  }
  else if(action == 'time'){
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    newObject = {
      hours: h,
      minutes: m,
      seconds: s
    }
  }

  return newObject;
}