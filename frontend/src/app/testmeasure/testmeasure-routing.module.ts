import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/core';
import { TestMeasureComponent } from './testmeasure.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/testmeasure', pathMatch: 'full' },
    { path: 'testmeasure', component: TestMeasureComponent, data: { title: extract('Test and Control Analysis Tool') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TestMeasureRoutingModule {}
