import {Component, OnInit} from '@angular/core';
import {MemoOfDeliveryService} from '../memo-of-delivery.service';
import {MemoOfDelivery} from '../../shared/interfaces';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable, Subscription, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-print-form-memo',
  templateUrl: './print-form-memo.component.html',
  styleUrls: ['./print-form-memo.component.scss']
})
export class PrintFormMemoComponent implements OnInit {

  memoOfDeliveryId: number;
  memoOfDelivery: MemoOfDelivery;
  private memoSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private memoOfDeliveryService: MemoOfDeliveryService
  ) {
  }

  ngOnInit(): void {
    this.memoSub = this.route.params.pipe(
      switchMap((params: Params) => {
        if (params['memoOfDeliveryId']) {
          this.memoOfDeliveryId = params['memoOfDeliveryId'];
          return this.memoOfDeliveryService.getById(params['memoOfDeliveryId']);
        }
      }))
      .subscribe(memo => {
        this.memoOfDelivery = memo;
      }, error => {
        throwError(error);
      });
  }

}
