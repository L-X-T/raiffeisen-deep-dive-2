import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userName = '';

  login(): void {
    this.userName = 'Alex';
  }

  logout(): void {
    this.userName = '';
  }
}
