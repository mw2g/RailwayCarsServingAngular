import {Component, OnDestroy, OnInit} from '@angular/core';
import {ControllerStatement, MemoOfDelivery} from '../../shared/interfaces';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {ControllerStatementService} from '../controller-statement.service';

@Component({
  selector: 'app-list-controller-statement',
  templateUrl: './list-controller-statement.component.html',
  styleUrls: ['./list-controller-statement.component.scss']
})
export class ListControllerStatementComponent implements OnInit, OnDestroy{

  statements: ControllerStatement[] = [];
  statementIdToDelete: number;
  statementsSub: Subscription;
  delSub: Subscription;

  constructor(private statementService: ControllerStatementService,
              public router: Router,
              private alert: AlertService) {
  }

  ngOnInit(): void {
    this.statementsSub = this.statementService.getAllStatements().subscribe(statements => {
      this.statements = statements;
    }, error => {
      throwError(error);
    });
  }

  ngOnDestroy(): void {
    if (this.statementsSub) {
      this.statementsSub.unsubscribe();
    }
    if (this.delSub) {
      this.delSub.unsubscribe();
    }
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
}
