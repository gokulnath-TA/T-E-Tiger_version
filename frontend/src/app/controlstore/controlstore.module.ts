import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { ControlStoreRoutingModule } from './controlstore-routing.module';
import { ControlStoreService } from './controlstore.service';
import { ControlStoreComponent } from './controlstore.component';
import { ArchwizardModule } from 'angular-archwizard';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxPaginationModule } from 'ngx-pagination';
import { DualListBoxModule } from 'slavede-ng-dual-list-box';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatSelectModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { map } from 'rxjs/operators';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    ControlStoreRoutingModule,
    ArchwizardModule,
    NgxSelectModule,
    NgbModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ScrollingModule,
    DragDropModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatTableExporterModule,
    MatCardModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
    DualListBoxModule.forRoot()
  ],
  declarations: [ControlStoreComponent],
  providers: [ControlStoreService],
  exports: [MatIconModule]
})
export class ControlStoreModule {
  constructor(private calendar: NgbCalendar) {}
}
