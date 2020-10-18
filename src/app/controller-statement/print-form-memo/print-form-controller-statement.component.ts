import {Component, OnInit} from '@angular/core';
import {ControllerStatementService} from '../controller-statement.service';
import {ControllerStatement, MemoOfDelivery} from '../../shared/interfaces';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable, Subscription, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-print-form-memo',
  templateUrl: './print-form-controller-statement.component.html',
  styleUrls: ['./print-form-controller-statement.component.scss']
})
export class PrintFormControllerStatementComponent implements OnInit {

  statementId: number;
  controllerStatement: ControllerStatement;
  private memoSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private memoOfDeliveryService: ControllerStatementService
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
        this.controllerStatement = statement;
      }, error => {
        throwError(error);
      });
  }

}
