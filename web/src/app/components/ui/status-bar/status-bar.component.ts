import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../../api/api.service';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.sass']
})
export class StatusBarComponent implements OnInit {

  loadAvg: string;
  @Input() version: string;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.apiService.infoLoadAvg().subscribe({
      next: response => this.loadAvg = response
    });
  }
}
