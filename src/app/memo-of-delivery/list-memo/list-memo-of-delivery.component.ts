import {Component, OnDestroy, OnInit} from '@angular/core';
import {MemoOfDelivery} from '../../shared/interfaces';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {MemoOfDeliveryService} from '../memo-of-delivery.service';
import {UtilsService} from '../../shared/service/utils.service';

@Component({
  selector: 'app-list-memo-of-delivery',
  templateUrl: './list-memo-of-delivery.component.html',
  styleUrls: ['./list-memo-of-delivery.component.scss']
})
export class ListMemoOfDeliveryComponent implements OnInit, OnDestroy{

  memos: MemoOfDelivery[] = [];
  memoIdToDelete: number;
  memosSub: Subscription;
  delSub: Subscription;

  constructor(private memoService: MemoOfDeliveryService,
              public router: Router,
              private alert: AlertService,
              private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.memosSub = this.memoService.getAllMemos().subscribe(memos => {
      this.memos = memos;
    }, error => {
      throwError(error);
    });
  }

  delete(): void {
    this.delSub = this.memoService.delete(this.memoIdToDelete).subscribe((data) => {
      this.memos = this.memos.filter(memo => memo.memoOfDeliveryId !== this.memoIdToDelete);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Памятка подачи удалена');
    });
  }

  setDelete(memoId: number): void {
    this.memoIdToDelete = memoId;
  }

  unsetDelete(): void {
    this.memoIdToDelete = null;
  }

  getById(memoId: number): number {
    if (memoId) {
      return this.memos.find(value => value.memoOfDeliveryId === memoId).memoOfDeliveryId;
    }
    return 0;
  }

  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.memosSub,
      this.delSub
    ]);
  }
}
