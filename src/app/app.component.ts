import {Component, OnInit} from '@angular/core';
import {PaymentService} from "./service/payment.service";
import {AngularFireAnalytics} from "@angular/fire/compat/analytics";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'bluesnap-payment';
  // @ts-ignore
  plan = new URLSearchParams(window.location.search).get('plan');
  animalIds = new URLSearchParams(window.location.search).get('animal_ids');
  uid = new URLSearchParams(window.location.search).get('uid');
  plan_id = new URLSearchParams(window.location.search).get('plan_id');
  frequency = new URLSearchParams(window.location.search).get('frequency');
  price = new URLSearchParams(window.location.search).get('price');

  detailString: string | undefined;
  total: number | undefined;
  period: string | undefined;
  gifts: string | undefined;

  start_time: Date = new Date();

  customDetails = this.price !== null && this.frequency !== null;

  constructor(private paymentService: PaymentService,
              private analytics: AngularFireAnalytics) {
  }

  ngOnInit() {
    this.analytics.logEvent('payment_page_landing', { "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
    this.paymentService.getPlan({uid: this.uid, planId: this.plan == 'FREE_DELIVERY' ? 'FREE_DELIVERY' : this.plan + '_' + (this.animalIds != null ? this.animalIds.split(',').length : 0)})
      .subscribe(res=>{
        let monthId = res.planPeriodsWithPlanIds['MONTHLY'];
        let quartId = res.planPeriodsWithPlanIds['QUARTERLY'];
        let ev6monthId = res.planPeriodsWithPlanIds['EVERY_6_MONTHS'];
        let annuallyId = res.planPeriodsWithPlanIds['ANNUALLY'];
        let animalCount  = this.animalIds == null ? 0 :this.animalIds.split(',').length;
        if(monthId != null && monthId == this.plan_id){
          this.period = 'Monthly';
          if(this.plan == 'FREE_DELIVERY'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$1.49 per week") + " X 4 weeks"
            this.total = 1.49 * 4;
          } else if(this.plan == 'MEAL_1'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$2.79 per week") + " X 4 weeks X " + animalCount + " animal/s"
            this.total = 4 * 2.79 * animalCount;
          } else {
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$4.99 per week") + " X 4 weeks X " + animalCount + " animal/s"
            this.total = 4 * 4.99 * animalCount;
          }
        } else if(quartId != null && quartId == this.plan_id) {
          this.period = 'Quarterly';
          if(this.plan == 'FREE_DELIVERY'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$1.49 per week")+" X 13 weeks"
            this.total = 1.49 * 13;
            this.gifts = (animalCount * 5) + ' meals';
          } else if(this.plan == 'MEAL_1'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$2.79 per week") + " X 13 weeks X " + animalCount + " animal/s"
            this.total = 13 * 2.79 * animalCount;
            this.gifts = (animalCount * 5) + ' meals';
          } else {
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$4.99 per week")+" X 13 weeks X " + animalCount + " animal/s"
            this.total = 4.99 * 13 * animalCount;
            this.gifts = (animalCount * 10) + ' meals';
          }
        } else if(ev6monthId != null && ev6monthId == this.plan_id) {
          this.period = 'Every 26 weeks';
          if(this.plan == 'FREE_DELIVERY'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$1.49 per week") + " X 26 weeks"
            this.total = 1.49 * 26;
            this.gifts = '10 meals';
          } else if(this.plan == 'MEAL_1'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$2.79 per week") + " X 26 weeks X " + animalCount + " animal/s"
            this.total = 2.79 * 26 * animalCount;
            this.gifts = (10* animalCount) + ' meals';
          } else {
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$4.99 per week")+" X 26 weeks X " + animalCount + " animal/s"
            this.total = 4.99 * 26 * animalCount;
            this.gifts = animalCount + ' Toy/s';
          }
        } else if(annuallyId != null && annuallyId == this.plan_id) {
          this.period = 'Yearly';
          if(this.plan == 'FREE_DELIVERY'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$1.49 per week")+" X 52 weeks"
            this.total = 1.49 * 52;
            this.gifts = animalCount + ' Toy/s'
          } else if(this.plan == 'MEAL_1'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$2.79 per week")+" X 52 weeks X " + animalCount + " animal/s"
            this.total = 2.79 * 52 * animalCount;
            this.gifts = animalCount + ' Toy/s + ' + animalCount * 5 + ' meals ';
          } else {
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$4.99 per week")+" X 52 weeks X " + animalCount + " animal/s"
            this.total = 4.99 * 52 * animalCount;
            this.gifts = animalCount + ' Toy/s + ' + animalCount * 10 + ' meals ';
          }
        }

      });
  }

  clickOnCard(){
    this.analytics.logEvent('enter_card_number', { "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
  }

  clickOnCVV(){
    this.analytics.logEvent('enter_cvv', { "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
  }

  clickOnExpDate(){
    this.analytics.logEvent('enter_exp_date', { "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
  }

  clickOnSubscribe() {
    console.log('subscribing')
    const duration =  (new Date().getTime() - this.start_time.getTime())/1000;
    this.analytics.logEvent('click_on_subscribe', {"duration_from_landing":duration, "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});

  }

  validBluesnap() {
    this.analytics.logEvent('valid_card_by_bluesnap', { "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
  }

  inValidBluesnap() {
    const errEl = document.getElementById('error-content');
    if(errEl  != null) {
      const errorMessage = errEl.textContent
      this.analytics.logEvent('error_from_bluesnap', {"message":errorMessage, "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});

    } else {
      this.analytics.logEvent('error_from_bluesnap', { "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
    }
  }

  clickOnSubscribeSuccess() {
    console.log('subscribing')
    const duration = (new Date().getTime() - this.start_time.getTime())/1000;
    this.analytics.logEvent('success_on_subscribe', {"duration_from_landing":duration, "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
   }

  clickOnSubscribeError() {
    const errEl = document.getElementById('error-content');
    const duration = (new Date().getTime() - this.start_time.getTime())/1000;
    if(errEl  != null) {
      const errorMessage = errEl.textContent
      this.analytics.logEvent('error_on_subscribe', {"duration_from_landing": duration,"message":errorMessage,"uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
    } else {
      this.analytics.logEvent('error_on_subscribe', { "duration_from_landing": duration,"uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
    }
  }
}
