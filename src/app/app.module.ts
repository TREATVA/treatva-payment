import { NgModule } from '@angular/core';

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
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    FormsModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [PaymentService, UserService, ScreenTrackingService,UserTrackingService, AngularFireAnalytics],
  bootstrap: [AppComponent]
})
export class AppModule { }
