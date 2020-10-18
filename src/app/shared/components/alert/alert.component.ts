import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Alert, AlertService} from '../../service/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  @Input() delay = 5000;

  // public text = '';
  // public type = 'success';

  public al: Alert[] = [];
  aSub: Subscription;

  constructor(public alertService: AlertService) {
  }

  ngOnInit(): void {
    this.aSub = this.alertService.alert$.subscribe(alert => {
      this.al.push(alert);
      // this.delay = 5000;
      // this.text = alert.text;
      // this.type = alert.type;

      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        this.al.shift();
        // this.text = '';
      }, this.delay);
    });
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

}
