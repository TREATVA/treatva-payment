import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PaymentService} from "./service/payment.service";
import { HttpClientModule} from "@angular/common/http";
import { environment } from '../environments/environment';
import { ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import {AngularFireAnalytics, AngularFireAnalyticsModule} from "@angular/fire/compat/analytics";
import {AngularFireModule} from "@angular/fire/compat";
import {UserService} from "./service/user.service";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    FormsModule
  ],
  providers: [PaymentService, UserService, ScreenTrackingService,UserTrackingService, AngularFireAnalytics],
  bootstrap: [AppComponent]
})
export class AppModule { }
