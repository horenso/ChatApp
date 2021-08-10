import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { TableComponent } from './components/table/table.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'tables/:name', component: TableComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
