import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { TestconfigRoutingModule } from './testconfig-routing.module';
import { TestConfigComponent } from './testconfig.component';
import { TestConfigService } from './testconfig.service';
import { ArchwizardModule } from 'angular-archwizard';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule, MatSelectModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    NgxPaginationModule,
    MatButtonModule,
    NgbModule,
    MatIconModule,
    MatSelectModule,
    TestconfigRoutingModule,
    ArchwizardModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxSelectModule,
    NgMultiSelectDropDownModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatRadioModule,
    MatInputModule,
    MatTableModule,
    MatCardModule
  ],
  declarations: [TestConfigComponent],
  providers: [TestConfigService]
})
export class TestConfigModule {}
