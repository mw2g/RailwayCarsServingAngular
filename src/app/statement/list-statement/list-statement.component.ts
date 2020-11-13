import {Component, OnDestroy, OnInit} from '@angular/core';
import {Statement, MemoOfDelivery} from '../../shared/interfaces';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {StatementService} from '../statement.service';
import {UtilsService} from '../../shared/service/utils.service';

@Component({
  selector: 'app-list-statement',
  templateUrl: './list-statement.component.html',
  styleUrls: ['./list-statement.component.scss']
})
export class ListStatementComponent implements OnInit, OnDestroy{

  statements: Statement[] = [];
  statementIdToDelete: number;
  statementsSub: Subscription;
  delSub: Subscription;

  constructor(private statementService: StatementService,
              public router: Router,
              private alert: AlertService,
              private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.statementsSub = this.statementService.getAllStatements().subscribe(statements => {
      this.statements = statements;
    }, error => {
      throwError(error);
    });
  }

  delete(): void {
    this.delSub = this.statementService.delete(this.statementIdToDelete).subscribe((data) => {
      this.statements = this.statements.filter(statement => statement.statementId !== this.statementIdToDelete);
      // this.router.navigate(['/admin', 'memo']);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Ведомость удалена');
    });
  }

  setDelete(memoId: number): void {
    this.statementIdToDelete = memoId;
  }

  unsetDelete(): void {
    this.statementIdToDelete = null;
  }

  getCreatedById(memoId: number): any {
    if (memoId) {
      return this.statements.find(value => value.statementId === memoId).created;
    }
    return null;
  }

  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.statementsSub,
      this.delSub
    ]);
  }
}
