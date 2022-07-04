import {Component, OnInit} from '@angular/core';
import {PaymentService} from "./service/payment.service";

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

  customDetails = this.price !== null && this.frequency !== null;

  constructor(private paymentService: PaymentService) {
  }

  ngOnInit() {
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
}
