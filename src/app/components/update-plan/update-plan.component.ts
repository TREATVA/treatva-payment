import { Component, OnInit } from '@angular/core';
import {PaymentService} from "../../service/payment.service";

@Component({
  selector: 'app-update-plan',
  templateUrl: './update-plan.component.html',
  styleUrls: ['./update-plan.component.css']
})
export class UpdatePlanComponent implements OnInit {
  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
  }

}
