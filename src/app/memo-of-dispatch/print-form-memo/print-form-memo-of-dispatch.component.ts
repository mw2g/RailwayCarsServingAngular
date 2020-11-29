import {Component, OnDestroy, OnInit} from '@angular/core';
import {MemoOfDispatchService} from '../memo-of-dispatch.service';
import {DeliveryOfWagon, MemoOfDispatch} from '../../shared/interfaces';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {UtilsService} from '../../shared/service/utils.service';

@Component({
  selector: 'app-print-form-memo-of-dispatch',
  templateUrl: './print-form-memo-of-dispatch.component.html',
  styleUrls: ['./print-form-memo-of-dispatch.component.scss']
})
export class PrintFormMemoOfDispatchComponent implements OnInit, OnDestroy {

  memoOfDispatchId: number;
  memoOfDispatch: MemoOfDispatch;
  private memoSub: Subscription;
  deliveryList: DeliveryOfWagon[] = [];
  pages: number[];
  rowsOnPage = 30;
  totalWeight = 0;

  constructor(
    private route: ActivatedRoute,
    private utils: UtilsService,
    private memoOfDispatchService: MemoOfDispatchService
  ) {
  }

  ngOnInit(): void {
    this.memoSub = this.route.params.pipe(
      switchMap((params: Params) => {
        if (params['memoOfDispatchId']) {
          this.memoOfDispatchId = params['memoOfDispatchId'];
          return this.memoOfDispatchService.getById(params['memoOfDispatchId']);
        }
      }))
      .subscribe(memo => {
        this.memoOfDispatch = memo;
        this.deliveryList = memo.deliveryOfWagonList;
        const count = Math.ceil(this.deliveryList.length / this.rowsOnPage);
        this.pages = Array.from({length: count}, (v, k) => k++);
        this.deliveryList.map(delivery => {
          this.totalWeight += delivery.cargoWeight;
        });
      }, error => {
        throwError(error);
      });
  }

  print(): void {
    window.print();
  }

  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.memoSub
    ]);
  }
}
