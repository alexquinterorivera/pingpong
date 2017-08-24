import { Component, OnInit } from '@angular/core';
import { DataService } from '../../providers/data.service';
import { DataOfflineService } from '../../providers/data-offline.service';
let onLine = window.navigator.onLine;


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit {
  players: Players;
  king: any;
  stats: any;
  pickPlayers:boolean = true;
  match: Match;
  timer: any;
  dataservice: any;

  constructor(private dataService: DataService, private dataOfflineService: DataOfflineService) {
    console.log('constructor ran');
  }

  ngOnInit() {
    
    if(onLine){
      this.dataservice = this.dataService;
    }else{
      this.dataservice = this.dataOfflineService;
    }

    this.dataService.getPlayers().subscribe((players) => {
      this.players = players;
      this.king;
      let tempElo = 0;
      console.log(players);

      this.dataService.getPlayerStats().subscribe((stats) => {
        this.stats = stats;
        console.log(stats);
      })

      for(let key in this.players){
        if(this.players[key].elo > tempElo){
          this.king = this.players[key];
          tempElo = this.players[key].elo;
        }
      }
      console.log(this.king + 'is the best');
    });
  }

  startMatch(player1,player2,lucky){
    if(!lucky){
      lucky = 0;
    }

    if(!player1 || !player2 || player1.id == player2.id){
      if(!player1 || !player2){
        alert("Selecteer 2 spelers");
      }else if(player1.id == player2.id){
        alert("met jezelf spelen??");
      }
    }else{      
      let p1 = this.stats[player1.id];
      let p2 = this.stats[player2.id];  

      this.dataService.getMatchStats(player1.id,player2.id).subscribe((matchStats) => {
        this.match = {
          p1: {
            id: player1.id,
            wins: matchStats.p1.wins,
            games: matchStats.p1.game,
            name: p1.name,
            elo: p1.elo,
            score: 0,
            bonus: p1.bonus
          },
          p2: {
            id: player2.id,
            wins: matchStats.p2.wins,
            games: matchStats.p2.games,
            name: p2.name,
            elo: p2.elo,
            score: 0,
            bonus: p2.bonus
          },
          server: Math.floor((Math.random() * 2) + 1),
          timeplayed: 0,
          lucky: lucky
        };
        
        this.pickPlayers = false;
        this.timer = setInterval(() => {this.match.timeplayed += 1},1000);
      })
    }
  }

  Match(action,player){
    let match = this.match;
    let p1 = this.match.p1;
    let p2 = this.match.p2;
    let server = this.match.server;
    let score = p1.score + p2.score;
    console.log('server is: '+server);
    switch(action){
      case 'score-': case'score':
        switch(action){
          case 'score-':
            if(player == 'p1' && p1.score <= 0 || player == 'p2' && p2.score <= 0){
              return;
            }else{
              if(player == 'p1'){
                p1.score -= 1;
                if(p2.score >= 11 && p1.score <= 9){
                  this.Match('win',{winner: p2, loser: p1});
                }
              }else if(player == 'p2'){
                p2.score -= 1;
                if(p1.score >= 11 && p2.score <= 9){
                  this.Match('win',{winner: p1, loser: p2});
                }
              }
              score--;
              console.log(score);
            }
          break;

          case 'score':
            if(player == 'p1'){
              p1.score += 1;
              if(p1.score >= 11 && p2.score <= 9){
                this.Match('win',{winner: p1, loser: p2});
              }
            }else if(player == 'p2'){
              p2.score += 1;
              if(p2.score >= 11 && p1.score <= 9){
                this.Match('win',{winner: p2, loser: p1});
              }
            }
            score++
          break;
        }

        if(score < 20){
          if(score % 2 == 0){
            if(server == 1){
              this.match.server = 2;
              return;
            }else if(server == 2){
            this.match.server = 1;
              return;
            }
          }
        }else{
          if(p1.score - p2.score >= 2){
            this.Match('win',{winner: p1, loser: p2});
            return;
          }else if(p2.score - p1.score >= 2){
            this.Match('win',{winner: p2, loser: p1});
            return;
          }
          if(server == 1){
            this.match.server = 2;
          }else if(server == 2){
            this.match.server = 1;
          }
        } 
      break;

      case 'restart':
        this.match.timeplayed = 0;
        clearInterval(this.timer);
        p1.elo = this.players[p1.id].elo;
        p2.elo = this.players[p2.id].elo;
        p1.score = 0;
        p2.score = 0;
        this.match.server = this.PickServer();
        this.timer = setInterval(() => {this.match.timeplayed += 1},1000)
        console.log(match)
      break;

      case 'reset':      
        clearInterval(this.timer);
        this.match = null;
        this.pickPlayers = true;
      break;

      case 'win':
      clearInterval(this.timer);
      let winElo = parseInt(player.winner.elo);
      let loseElo = parseInt(player.loser.elo);
      let kFactor = 30; //(adjust this according to how quickly you want ratings to adapt, lower number --> adapts more quickly).
      let qw = Math.pow(10,(winElo/400));
      let ql = Math.pow(10,(loseElo/400));
      let lossExpectation = ql/(ql+qw);
      let points = Math.floor( (kFactor*lossExpectation) );
      let loserbonus = player.loser.bonus * 20 || 0;


      player.winner.elo += (match.lucky ? points*2 : points) + (match.lucky ? loserbonus*2 : loserbonus);
      player.loser.elo -= (match.lucky ? points*2 : points);
      player.loser.bonus = 0;

      if(player.winner.bonus == 4){
        if(match.lucky){
          player.winner.elo += 200;
        }else{
          player.winner.elo += 100;
        }
        player.winner.bonus = 0;
      }else{
        player.winner.bonus ++;
      }
      this.dataService.saveGame(match,player.winner.id).subscribe((data) => {
        if(data.success == true){
          let winner = player.winner;
          let loser = player.loser;

          this.players[winner.id].elo = winner.elo;
          this.players[winner.id].bonus = winner.bonus;

          this.players[loser.id].elo = loser.elo;
          this.players[loser.id].bonus = loser.bonus;

          winner.games += 1;
          winner.wins += 1;
          loser.games += 1;
          this.Match('restart',1);
        }
      });
        
      break;
    }
  }

  PickServer(){
    let server;
    if(Math.floor((Math.random() * 100) + 1) <= 50){
      server = 1;
    }else{
      server = 2;
    }
    return server;
  }

}

interface Match{
  p1: {id:number,wins:number,games:number,name:string,elo:number,score:number,bonus:number},
  p2: {id:number,wins:number,games:number,name:string,elo:number,score:number,bonus:number},
  server: number,
  timeplayed: number,
  lucky: boolean
}

interface Players{
  id: number,
  name: string,
  elo: number,
  wins: number,
  games: number,
  score: number,
  bonus: number
};