import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Plan} from "../models/plan.model";
import {environment} from "../../environments/environment";

@Injectable()
export class PaymentService {
  constructor(private httpClient: HttpClient) {
  }

  getPlan({uid, planId}: { uid: any, planId: any }): Observable<Plan> {
    const httpOptions = {
      headers: new HttpHeaders({
        uid: uid
      })
    };
    return this.httpClient.get<Plan>(`http://localhost:8080/rest/payments/active-plan/${planId}`, httpOptions);
  }
}
