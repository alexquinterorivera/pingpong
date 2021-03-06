import { IndexComponent } from './components/index/index.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: IndexComponent
    },
    {
        path: 'scoreboard',
        component: ScoreboardComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
