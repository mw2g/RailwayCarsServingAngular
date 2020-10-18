import {Component, OnDestroy, OnInit} from '@angular/core';
import {MemoOfDispatch} from '../../shared/interfaces';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {MemoOfDispatchService} from '../memo-of-dispatch.service';

@Component({
  selector: 'app-list-controller-statement',
  templateUrl: './list-memo-of-dispatch.component.html',
  styleUrls: ['./list-memo-of-dispatch.component.scss']
})
export class ListMemoOfDispatchComponent implements OnInit, OnDestroy{

  memos: MemoOfDispatch[] = [];
  memoIdToDelete: number;
  memosSub: Subscription;
  delSub: Subscription;

  constructor(private memoService: MemoOfDispatchService,
              public router: Router,
              private alert: AlertService) {
  }

  ngOnInit(): void {
    this.memosSub = this.memoService.getAllMemos().subscribe(memos => {
      this.memos = memos;
    }, error => {
      throwError(error);
    });
  }

  ngOnDestroy(): void {
    if (this.memosSub) {
      this.memosSub.unsubscribe();
    }
    if (this.delSub) {
      this.delSub.unsubscribe();
    }
  }

  delete(): void {
    this.delSub = this.memoService.delete(this.memoIdToDelete).subscribe((data) => {
      this.alert.success(data.message);
      this.memos = this.memos.filter(memo => memo.memoOfDispatchId !== this.memoIdToDelete);
      // this.router.navigate(['/admin', 'memo']);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Пользователь удален');
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
      return this.memos.find(value => value.memoOfDispatchId === memoId).memoOfDispatchId;
    }
    return 0;
  }
}
