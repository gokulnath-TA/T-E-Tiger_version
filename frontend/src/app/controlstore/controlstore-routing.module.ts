import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/core';
import { ControlStoreComponent } from './controlstore.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/controlstore', pathMatch: 'full' },
    { path: 'controlstore', component: ControlStoreComponent, data: { title: extract('Test and Control Analysis Tool') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ControlStoreRoutingModule {}
