import {Component, OnInit} from '@angular/core';
import {MemoOfDispatchService} from '../memo-of-dispatch.service';
import {MemoOfDispatch} from '../../shared/interfaces';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-print-form-memo',
  templateUrl: './print-form-memo.component.html',
  styleUrls: ['./print-form-memo.component.scss']
})
export class PrintFormMemoComponent implements OnInit {

  memoOfDispatchId: number;
  memoOfDispatch: MemoOfDispatch;
  private memoSub: Subscription;

  constructor(
    private route: ActivatedRoute,
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
      }, error => {
        throwError(error);
      });
  }

}
