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

  detailString: string | undefined;
  total: number | undefined;
  period: string | undefined;
  gifts: string | undefined;

  constructor(private paymentService: PaymentService) {
  }

  ngOnInit() {
    this.paymentService.getPlan({uid: this.uid, planId: this.plan + '_' + (this.animalIds != null ? this.animalIds.split(',').length : 0)})
      .subscribe(res=>{
        let monthId = res.planPeriodsWithPlanIds['MONTHLY'];
        let quartId = res.planPeriodsWithPlanIds['QUARTERLY'];
        let ev6monthId = res.planPeriodsWithPlanIds['EVERY_6_MONTHS'];
        let annuallyId = res.planPeriodsWithPlanIds['ANNUALLY'];
        let animalCount  = this.animalIds == null ? 0 :this.animalIds.split(',').length;
        if(monthId != null && monthId == this.plan_id){
          this.period = 'Monthly';
          if(this.plan == 'FREE_DELIVERY'){
            this.detailString = "Free delivery ($1.49) X 4 weeks"
            this.total = 1.49 * 4;
          } else if(this.plan == 'MEAL_1'){
            this.detailString = "1 meal day ($2.79) X 4 weeks X " + animalCount + " animal/s"
            this.total = 4 * 2.79 * animalCount;
          } else {
            this.detailString = "3 meal day ($4.99) X 4 weeks X " + animalCount + " animal/s"
            this.total = 4 * 4.99 * animalCount;
          }
        } else if(quartId != null && quartId == this.plan_id) {
          this.period = 'Quarterly';
          if(this.plan == 'FREE_DELIVERY'){
            this.detailString = "Free delivery X 13 weeks"
            this.total = 1.49 * 13;
            this.gifts = '5 meals';
          } else if(this.plan == 'MEAL_1'){
            this.detailString = "1 meal day X 13 weeks X " + animalCount + " animal/s"
            this.total = 13 * 2.79 * animalCount;
            this.gifts = '5 meals';
          } else {
            this.detailString = "3 meal day X 13 weeks X " + animalCount + " animal/s"
            this.total = 4.99 * 13 * animalCount;
            this.gifts = '10 meals';
          }
        } else if(ev6monthId != null && ev6monthId == this.plan_id) {
          this.period = 'Every 26 weeks';
          if(this.plan == 'FREE_DELIVERY'){
            this.detailString = "Free delivery ($1.49) X 26 weeks"
            this.total = 1.49 * 26;
            this.gifts = '10 meals';
          } else if(this.plan == 'MEAL_1'){
            this.detailString = "1 meal day ($2.79) X 26 weeks X " + animalCount + " animal/s"
            this.total = 2.79 * 26 * animalCount;
            this.gifts = '10 meals';
          } else {
            this.detailString = "3 meal day ($4.99) X 26 weeks X " + animalCount + " animal/s"
            this.total = 4.99 * 26 * animalCount;
            this.gifts = 'Toy';
          }
        } else if(annuallyId != null && annuallyId == this.plan_id) {
          this.period = 'Yearly';
          if(this.plan == 'FREE_DELIVERY'){
            this.detailString = "Free delivery ($1.49) X 52 weeks"
            this.total = 1.49 * 12;
            this.gifts = 'Toy'
          } else if(this.plan == 'MEAL_1'){
            this.detailString = "1 meal day ($2.79) X 52 weeks X " + animalCount + " animal/s"
            this.total = 2.79 * 52 * animalCount;
            this.gifts = 'Toy + 5 meals';
          } else {
            this.detailString = "3 meal day ($4.99) X 52 weeks X " + animalCount + " animal/s"
            this.total = 4.99 * 52 * animalCount;
            this.gifts = 'Toy + 10 meals ';
          }
        }

      });
  }
}
