import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Plan} from "../models/plan.model";
import {User} from "../models/user.model";

@Injectable()
export class UserService {
  constructor(private httpClient: HttpClient) {
  }

  getUser( uid: string ): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        uid: uid
      })
    };
    return this.httpClient.get<User>(`https://dogapp-67827.appspot.com/rest/users/is-anonymous`, httpOptions);
  }

  putEmail( uid: string, email: string ): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        uid: uid
      })
    };
    return this.httpClient.put<any>(`https://dogapp-67827.appspot.com/rest/users/set-email/${email}`, {}, httpOptions);
  }
}
