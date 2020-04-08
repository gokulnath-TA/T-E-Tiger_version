import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { TestMeasureRoutingModule } from './testmeasure-routing.module';
import { TestMeasureComponent } from './testmeasure.component';
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
import { MatRadioModule } from '@angular/material/radio';
import{ TestMeasureService} from './testmeasure.service';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    TestMeasureRoutingModule,
    ArchwizardModule,
    NgxSelectModule,
    NgbModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ScrollingModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
    DualListBoxModule
  ],
  declarations: [TestMeasureComponent],
  providers: [TestMeasureService],
})
export class TestMeasureModule {
  constructor(private calendar: NgbCalendar) {}
}
