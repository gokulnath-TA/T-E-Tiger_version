import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { TestConfigModule } from './testconfig/testconfig.module';
import { ControlStoreModule } from './controlstore/controlstore.module';
import { TestMeasureModule } from './testmeasure/testmeasure.module';
import { ShellModule } from './shell/shell.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ControlStoreComponent } from './controlstore/controlstore.component';
import { TestMeasureComponent } from './testmeasure/testmeasure.component';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// import { SimpleNotificationsModule } from 'angular2-notifications';

import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION } from 'ngx-ui-loader';

import { SnackbarControlComponent } from './snackbar-control/snackbar-control.component';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: 'white',
  threshold: 3000,

  //text:'Test&Execute',
  textColor: 'yellow',
  fgsPosition: POSITION.centerCenter,
  fgsSize: 100,
  fgsType: SPINNER.rectangleBounceParty,
  pbThickness: 0
};

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    TranslateModule.forRoot(),
    NgbModule.forRoot(),
    MatSnackBarModule,
    CoreModule,
    SharedModule,
    ShellModule,
    TestConfigModule,
    ControlStoreModule,
    TestMeasureModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 3000
    }),
    LoginModule,
    AppRoutingModule // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent,SnackbarControlComponent],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    SnackbarControlComponent
  ]
})
export class AppModule {}
