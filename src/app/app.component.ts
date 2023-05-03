import {Component, OnInit} from '@angular/core';
import {PaymentService} from "./service/payment.service";
import {AngularFireAnalytics} from "@angular/fire/compat/analytics";
import {UserService} from "./service/user.service";

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
  isAnonymous = false;
  enteredEmail: string = '';
  plan_id = new URLSearchParams(window.location.search).get('plan_id');
  paypal_plan_id = new URLSearchParams(window.location.search).get('paypal_plan_id');
  frequency = new URLSearchParams(window.location.search).get('frequency');
  price = new URLSearchParams(window.location.search).get('price');
  newShop = new URLSearchParams(window.location.search).get('new-shop');
  version = new URLSearchParams(window.location.search).get('version');
  trial = new URLSearchParams(window.location.search).get('trial');

  detailString: string | undefined;
  total: number | undefined;
  period: string | undefined;
  gifts: string | undefined;
  showEmailHint: boolean = false;

  start_time: Date = new Date();

  customDetails = (this.price !== null && this.frequency !== null) && (this.price !== '' && this.frequency !== '');

  constructor(private paymentService: PaymentService,
              private userService: UserService,
              private analytics: AngularFireAnalytics) {
    if(this.trial){
      if(this.trial.toLowerCase() === 'false') this.trial = null;
    }
  }

  ngOnInit() {
    if (this.uid) {
      this.analytics.logEvent('payment_page_landing', {"uid": this.uid, "plan": this.plan, "plan_id": this.plan_id});
      this.userService.getUser(this.uid).subscribe(u=>{
        // @ts-ignore
        this.isAnonymous = u.anon;
      });
    }
    this.paymentService.getPlan({uid: this.uid, planId: this.plan == 'FREE_DELIVERY'  ? 'FREE_DELIVERY' + (this.newShop != null && this.price != null
        ? '_' + this.price.replace('.', '') : '') :  this.plan
        + (this.trial ? '_TRIAL' : '') + '_'
        + (this.animalIds != null ? this.animalIds.split(',').length : 0) + (this.newShop != null && this.price != null
          ? '_' + this.price.replace('.', '') : '')})
      .subscribe(res=>{
        let monthId = res.planPeriodsWithPlanIds['MONTHLY'];
        let quartId = res.planPeriodsWithPlanIds['QUARTERLY'];
        let ev6monthId = res.planPeriodsWithPlanIds['EVERY_6_MONTHS'];
        let annuallyId = res.planPeriodsWithPlanIds['ANNUALLY'];
        let weeklyId = res.planPeriodsWithPlanIds['WEEKLY'];
        let animalCount  = this.animalIds == null ? 0 :this.animalIds.split(',').length;
        let multiplyPart;
        if(weeklyId != null && weeklyId == this.plan_id) {
          if(this.customDetails) {
            if(this.frequency == 'day') {
              multiplyPart = '7 days'
            } else if(this.frequency == 'week') {
              multiplyPart = '4 weeks'
            }  else {
              multiplyPart = '1 week'
            }
          } else {
            multiplyPart = '1 week'
          }
          this.period = 'Weekly';
          if(this.plan == 'FREE_DELIVERY'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$1.49 per week") + " X " + multiplyPart + ""
            this.total = this.price != null && this.price != '' ? +this.price : 1.49 ;
          } else if(this.plan == 'MEAL_1'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$2.79 per week") + " X " + multiplyPart + " X " + animalCount + " animal/s"
            this.total = (this.price != null && this.price != '' ? +this.price : 2.79) * animalCount;
          } else {
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$4.99 per week") + " X " + multiplyPart + " X " + animalCount + " animal/s"
            this.total = (this.price != null && this.price != '' ? +this.price : 4.99) * animalCount;
          }
        } else if(monthId != null && monthId == this.plan_id){
          if(this.customDetails) {
            if(this.frequency == 'day') {
              multiplyPart = '31 days'
            } else if(this.frequency == 'week') {
              multiplyPart = '4 weeks'
            } else if (this.frequency == 'month') {
              multiplyPart = '1 month'
            } else {
              multiplyPart = '4 weeks'
            }
          } else {
            multiplyPart = '4 weeks'
          }
          this.period = 'Monthly';
          let totalMultiplier = 4;
          if(this.frequency){
            if(this.frequency == 'weekly') totalMultiplier = 4
            if(this.frequency == 'month') totalMultiplier = 1
          }
          if(this.plan == 'FREE_DELIVERY'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$1.49 per week") + " X " + multiplyPart + ""
            this.total = (this.price !== null && this.price !== '' ? +this.price : 1.49) * totalMultiplier;
          } else if(this.plan == 'MEAL_1'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$2.79 per week") + " X " + multiplyPart + " X " + animalCount + " animal/s"
            this.total =  (this.price !== null && this.price !== '' ? +this.price : 2.79) * totalMultiplier * animalCount;
          } else {
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$4.99 per week") + " X " + multiplyPart + " X " + animalCount + " animal/s"
            this.total = (this.price !== null && this.price !== '' ? +this.price  :  4.99) * totalMultiplier  * animalCount;
          }
        } else if(quartId != null && quartId == this.plan_id) {
          if(this.customDetails) {
            if(this.frequency == 'day') {
              multiplyPart = '93 days'
            } else if(this.frequency == 'week') {
              multiplyPart = '13 weeks'
            } else if (this.frequency == 'month') {
              multiplyPart = '3 months'
            } else {
              multiplyPart = '13 weeks'
            }
          } else {
            multiplyPart = '13 weeks'
          }
          this.period = 'Quarterly';
          let totalMultiplier = 13;
          if(this.frequency){
            if(this.frequency == 'weekly') totalMultiplier = 13
            if(this.frequency == 'month') totalMultiplier = 3
          }
          if(this.plan == 'FREE_DELIVERY'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$1.49 per week")+" X " + multiplyPart + ""
            this.total = (this.price !== null && this.price !== '' ? +this.price  : 1.49) * totalMultiplier;
            this.gifts = (animalCount * 5) + ' meals';
          } else if(this.plan == 'MEAL_1'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$2.79 per week") + " X " + multiplyPart + " X " + animalCount + " animal/s"
            this.total =  ((this.price !== null && this.price !== '' ? +this.price : 2.79) * totalMultiplier ) * animalCount;
            this.gifts = (animalCount * 5) + ' meals';
          } else {
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$4.99 per week")+" X " + multiplyPart + " X " + animalCount + " animal/s"
            this.total =  ((this.price !== null && this.price !== '' ? +this.price : 4.99) * totalMultiplier) * animalCount;
            this.gifts = (animalCount * 10) + ' meals';
          }
        } else if(ev6monthId != null && ev6monthId == this.plan_id) {
          if(this.customDetails) {
            if(this.frequency == 'day') {
              multiplyPart = '183 days'
            } else if(this.frequency == 'week') {
              multiplyPart = '26 weeks'
            } else if (this.frequency == 'month') {
              multiplyPart = '6 months'
            } else {
              multiplyPart = '26 weeks'
            }
          } else {
            multiplyPart = '26 weeks'
          }
          this.period = 'Every 26 weeks';
          let totalMultiplier = 26;
          if(this.frequency){
            if(this.frequency == 'weekly') totalMultiplier = 26
            if(this.frequency == 'month') totalMultiplier = 6
          }
          if(this.plan == 'FREE_DELIVERY'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$1.49 per week") + " X " + multiplyPart + ""
            this.total =  (this.price !== null && this.price !== '' ? +this.price : 1.49) * totalMultiplier;
            this.gifts = '10 meals';
          } else if(this.plan == 'MEAL_1'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$2.79 per week") + " X " + multiplyPart + " X " + animalCount + " animal/s"
            this.total =  ((this.price !== null && this.price !== '' ? +this.price :2.79) * totalMultiplier) * animalCount;
            this.gifts = (10* animalCount) + ' meals';
          } else {
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$4.99 per week")+" X " + multiplyPart + " X " + animalCount + " animal/s"
            this.total =  (this.price !== null && this.price !== '' ? +this.price : 4.99) * totalMultiplier * animalCount;
            this.gifts = animalCount + ' Toy/s';
          }
        } else if(annuallyId != null && annuallyId == this.plan_id) {
          this.period = 'Yearly';
          let totalMultiplier = 52;
          if(this.frequency){
            if(this.frequency == 'weekly') totalMultiplier = 52
            if(this.frequency == 'month') totalMultiplier = 12
          }
          if(this.customDetails) {
            if(this.frequency == 'day') {
              multiplyPart = '365 days'
            } else if(this.frequency == 'week') {
              multiplyPart = '52 weeks'
            } else if (this.frequency == 'month') {
              multiplyPart = '12 months'
            } else {
              multiplyPart = '52 weeks'
            }
          } else {
            multiplyPart = '52 weeks'
          }
          if(this.plan == 'FREE_DELIVERY'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$1.49 per week")+" X " + multiplyPart + ""
            this.total =  (this.price !== null && this.price !== '' ? +this.price : 1.49) * totalMultiplier;
            this.gifts = animalCount + ' Toy/s'
          } else if(this.plan == 'MEAL_1'){
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$2.79 per week")+" X " + multiplyPart + " X " + animalCount + " animal/s"
            this.total =  (this.price !== null && this.price !== '' ? +this.price  : 2.79) * totalMultiplier * animalCount;
            this.gifts = animalCount + ' Toy/s + ' + animalCount * 5 + ' meals ';
          } else {
            this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$4.99 per week")+" X " + multiplyPart + " X " + animalCount + " animal/s"
            this.total =  (this.price !== null && this.price !== '' ? +this.price  : 4.99) * totalMultiplier * animalCount;
            this.gifts = animalCount + ' Toy/s + ' + animalCount * 10 + ' meals ';
          }
        }
        if(this.total) {
          if (this.newShop != null && this.newShop.trim() != '' && this.plan != 'FREE_DELIVERY'){
            if(animalCount > 1) {
              this.total = this.total / animalCount;
              this.detailString = this.detailString?.replace(" X " + animalCount + " animal/s", " (" + animalCount + " animals)")
            }
          }
          this.total = +this.total.toFixed(2)
        } else if(this.price != null){
          this.paymentService.getPlan({uid: this.uid, planId: this.plan == 'FREE_DELIVERY'  ? 'FREE_DELIVERY'
              +  '_' + this.price.replace('.', '') :  this.plan
              + (this.trial ? '_TRIAL' : '') + '_'
              + (this.animalIds != null ? this.animalIds.split(',').length : 0)
              +  '_' + this.price.replace('.', '')})
            .subscribe(res=>{
              let monthId = res.planPeriodsWithPlanIds['MONTHLY'];
              let quartId = res.planPeriodsWithPlanIds['QUARTERLY'];
              let ev6monthId = res.planPeriodsWithPlanIds['EVERY_6_MONTHS'];
              let annuallyId = res.planPeriodsWithPlanIds['ANNUALLY'];
              let weeklyId = res.planPeriodsWithPlanIds['WEEKLY'];
              let animalCount  = this.animalIds == null ? 0 :this.animalIds.split(',').length;
              let multiplyPart;
              if(weeklyId != null && weeklyId == this.plan_id) {
                if(this.customDetails) {
                  if(this.frequency == 'day') {
                    multiplyPart = '7 days'
                  } else if(this.frequency == 'week') {
                    multiplyPart = '4 weeks'
                  }  else {
                    multiplyPart = '1 week'
                  }
                } else {
                  multiplyPart = '1 week'
                }
                this.period = 'Weekly';
                if(this.plan == 'FREE_DELIVERY'){
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$1.49 per week") + " X " + multiplyPart + ""
                  this.total = this.price != null && this.price != '' ? +this.price : 1.49 ;
                } else if(this.plan == 'MEAL_1'){
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$2.79 per week") + " X " + multiplyPart + " X " + animalCount + " animal/s"
                  this.total = (this.price != null && this.price != '' ? +this.price : 2.79) * animalCount;
                } else {
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$4.99 per week") + " X " + multiplyPart + " X " + animalCount + " animal/s"
                  this.total = (this.price != null && this.price != '' ? +this.price : 4.99) * animalCount;
                }
              } else if(monthId != null && monthId == this.plan_id){
                if(this.customDetails) {
                  if(this.frequency == 'day') {
                    multiplyPart = '31 days'
                  } else if(this.frequency == 'week') {
                    multiplyPart = '4 weeks'
                  } else if (this.frequency == 'month') {
                    multiplyPart = '1 month'
                  } else {
                    multiplyPart = '4 weeks'
                  }
                } else {
                  multiplyPart = '4 weeks'
                }
                this.period = 'Monthly';
                let totalMultiplier = 4;
                if(this.frequency){
                  if(this.frequency == 'weekly') totalMultiplier = 4
                  if(this.frequency == 'month') totalMultiplier = 1
                }
                if(this.plan == 'FREE_DELIVERY'){
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$1.49 per week") + " X " + multiplyPart + ""
                  this.total = (this.price !== null && this.price !== '' ? +this.price : 1.49) * totalMultiplier;
                } else if(this.plan == 'MEAL_1'){
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$2.79 per week") + " X " + multiplyPart + " X " + animalCount + " animal/s"
                  this.total =  (this.price !== null && this.price !== '' ? +this.price : 2.79) * totalMultiplier * animalCount;
                } else {
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$4.99 per week") + " X " + multiplyPart + " X " + animalCount + " animal/s"
                  this.total = (this.price !== null && this.price !== '' ? +this.price  :  4.99) * totalMultiplier  * animalCount;
                }
              } else if(quartId != null && quartId == this.plan_id) {
                if(this.customDetails) {
                  if(this.frequency == 'day') {
                    multiplyPart = '93 days'
                  } else if(this.frequency == 'week') {
                    multiplyPart = '13 weeks'
                  } else if (this.frequency == 'month') {
                    multiplyPart = '3 months'
                  } else {
                    multiplyPart = '13 weeks'
                  }
                } else {
                  multiplyPart = '13 weeks'
                }
                this.period = 'Quarterly';
                let totalMultiplier = 13;
                if(this.frequency){
                  if(this.frequency == 'weekly') totalMultiplier = 13
                  if(this.frequency == 'month') totalMultiplier = 3
                }
                if(this.plan == 'FREE_DELIVERY'){
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$1.49 per week")+" X " + multiplyPart + ""
                  this.total = (this.price !== null && this.price !== '' ? +this.price  : 1.49) * totalMultiplier;
                  this.gifts = (animalCount * 5) + ' meals';
                } else if(this.plan == 'MEAL_1'){
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$2.79 per week") + " X " + multiplyPart + " X " + animalCount + " animal/s"
                  this.total =  ((this.price !== null && this.price !== '' ? +this.price : 2.79) * totalMultiplier ) * animalCount;
                  this.gifts = (animalCount * 5) + ' meals';
                } else {
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$4.99 per week")+" X " + multiplyPart + " X " + animalCount + " animal/s"
                  this.total =  ((this.price !== null && this.price !== '' ? +this.price : 4.99) * totalMultiplier) * animalCount;
                  this.gifts = (animalCount * 10) + ' meals';
                }
              } else if(ev6monthId != null && ev6monthId == this.plan_id) {
                if(this.customDetails) {
                  if(this.frequency == 'day') {
                    multiplyPart = '183 days'
                  } else if(this.frequency == 'week') {
                    multiplyPart = '26 weeks'
                  } else if (this.frequency == 'month') {
                    multiplyPart = '6 months'
                  } else {
                    multiplyPart = '26 weeks'
                  }
                } else {
                  multiplyPart = '26 weeks'
                }
                this.period = 'Every 26 weeks';
                let totalMultiplier = 26;
                if(this.frequency){
                  if(this.frequency == 'weekly') totalMultiplier = 26
                  if(this.frequency == 'month') totalMultiplier = 6
                }
                if(this.plan == 'FREE_DELIVERY'){
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$1.49 per week") + " X " + multiplyPart + ""
                  this.total =  (this.price !== null && this.price !== '' ? +this.price : 1.49) * totalMultiplier;
                  this.gifts = '10 meals';
                } else if(this.plan == 'MEAL_1'){
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$2.79 per week") + " X " + multiplyPart + " X " + animalCount + " animal/s"
                  this.total =  ((this.price !== null && this.price !== '' ? +this.price :2.79) * totalMultiplier) * animalCount;
                  this.gifts = (10* animalCount) + ' meals';
                } else {
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$4.99 per week")+" X " + multiplyPart + " X " + animalCount + " animal/s"
                  this.total =  (this.price !== null && this.price !== '' ? +this.price : 4.99) * totalMultiplier * animalCount;
                  this.gifts = animalCount + ' Toy/s';
                }
              } else if(annuallyId != null && annuallyId == this.plan_id) {
                this.period = 'Yearly';
                let totalMultiplier = 52;
                if(this.frequency){
                  if(this.frequency == 'weekly') totalMultiplier = 52
                  if(this.frequency == 'month') totalMultiplier = 12
                }
                if(this.customDetails) {
                  if(this.frequency == 'day') {
                    multiplyPart = '365 days'
                  } else if(this.frequency == 'week') {
                    multiplyPart = '52 weeks'
                  } else if (this.frequency == 'month') {
                    multiplyPart = '12 months'
                  } else {
                    multiplyPart = '52 weeks'
                  }
                } else {
                  multiplyPart = '52 weeks'
                }
                if(this.plan == 'FREE_DELIVERY'){
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$1.49 per week")+" X " + multiplyPart + ""
                  this.total =  (this.price !== null && this.price !== '' ? +this.price : 1.49) * totalMultiplier;
                  this.gifts = animalCount + ' Toy/s'
                } else if(this.plan == 'MEAL_1'){
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$2.79 per week")+" X " + multiplyPart + " X " + animalCount + " animal/s"
                  this.total =  (this.price !== null && this.price !== '' ? +this.price  : 2.79) * totalMultiplier * animalCount;
                  this.gifts = animalCount + ' Toy/s + ' + animalCount * 5 + ' meals ';
                } else {
                  this.detailString = (this.customDetails ? "$" + this.price + " per " + this.frequency : "$4.99 per week")+" X " + multiplyPart + " X " + animalCount + " animal/s"
                  this.total =  (this.price !== null && this.price !== '' ? +this.price  : 4.99) * totalMultiplier * animalCount;
                  this.gifts = animalCount + ' Toy/s + ' + animalCount * 10 + ' meals ';
                }
              }
              if(this.total) {
                if (this.newShop != null && this.newShop.trim() != '' && this.plan != 'FREE_DELIVERY'){
                  if(animalCount > 1) {
                    this.total = this.total / animalCount;
                    this.detailString = this.detailString?.replace(" X " + animalCount + " animal/s", " (" + animalCount + " animals)")
                  }
                }
                this.total = +this.total.toFixed(2)
              }});
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
    this.analytics.logEvent('click_on_subscribe', { "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});

  }

  validBluesnap() {
    this.analytics.logEvent('valid_card_by_bluesnap', { "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
  }

  successPaypal() {
    this.analytics.logEvent('success_paypal', { "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
    if(this.enteredEmail !== ''){
      // @ts-ignore
      this.userService.putEmail(this.uid, this.enteredEmail).subscribe(res=>{});
    }
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
    //const duration = (new Date().getTime() - this.start_time.getTime())/1000;
    this.analytics.logEvent('success_on_subscribe', { "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
    if(this.enteredEmail !== ''){
      // @ts-ignore
      this.userService.putEmail(this.uid, this.enteredEmail).subscribe(res=>{});
    }
  }

  clickOnPaypalButton() {
    this.analytics.logEvent('click_on_paypal', { "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
  }

  clickOnSubscribeError() {
    const errEl = document.getElementById('error-content');
    //const duration = (new Date().getTime() - this.start_time.getTime())/1000;
    if(errEl  != null) {
      const errorMessage = errEl.textContent
      this.analytics.logEvent('error_on_subscribe', {"message":errorMessage,"uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
    } else {
      this.analytics.logEvent('error_on_subscribe', { "uid":this.uid, "plan": this.plan, "plan_id": this.plan_id});
    }
  }
}
