import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { TableComponent } from './components/table/table.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LobbyComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'tables/:name', component: TableComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
