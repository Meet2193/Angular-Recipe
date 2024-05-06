import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CredentialService {
  http = inject(HttpClient);
  getAPIUrl = environment.apiUrl;
  apiURL = `${this.getAPIUrl}/loginData`;
  constructor() {}

  getAllUserCred() {
    return this.http.get(this.apiURL);
  }

  doSignUpData(userCred: any) {
    return this.http.post(this.apiURL, userCred);
  }
}
