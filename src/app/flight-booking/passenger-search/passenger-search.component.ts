import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'app-passenger-search',
  templateUrl: './passenger-search.component.html',
  styleUrls: ['./passenger-search.component.scss']
})
export class PassengerSearchComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.debug('userName', this.authService.userName);
  }
}
