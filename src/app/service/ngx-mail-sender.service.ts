import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NgxMailSenderService {
  http = inject(HttpClient);
  apiUrl = 'http://ngx-mail-sender.ap-1.evennode.com/sendMail';
  constructor() {}

  sendMail(emailData: any): Observable<any> {
    return this.http.post(this.apiUrl, emailData);
  }
}
