import {Component, OnInit} from '@angular/core';
import {StatementService} from '../statement.service';
import {Statement, MemoOfDelivery} from '../../shared/interfaces';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable, Subscription, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-print-form-statement',
  templateUrl: './print-form-statement.component.html',
  styleUrls: ['./print-form-statement.component.scss']
})
export class PrintFormStatementComponent implements OnInit {

  statementId: number;
  statement: Statement;
  private memoSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private memoOfDeliveryService: StatementService
  ) {
  }

  ngOnInit(): void {
    this.memoSub = this.route.params.pipe(
      switchMap((params: Params) => {
        if (params['statementId']) {
          this.statementId = params['statementId'];
          return this.memoOfDeliveryService.getById(params['statementId']);
        }
      }))
      .subscribe(statement => {
        this.statement = statement.statement;
      }, error => {
        throwError(error);
      });
  }

}
