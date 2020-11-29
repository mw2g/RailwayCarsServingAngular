import {Component, OnDestroy, OnInit} from '@angular/core';
import {StatementService} from '../statement.service';
import {DeliveryOfWagon, Statement} from '../../shared/interfaces';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {UtilsService} from '../../shared/service/utils.service';

@Component({
  selector: 'app-print-form-statement',
  templateUrl: './print-form-statement.component.html',
  styleUrls: ['./print-form-statement.component.scss']
})
export class PrintFormStatementComponent implements OnInit, OnDestroy {

  statementId: number;
  statement: Statement;
  sumWeight = 0;
  sumShuntingWork = 0;
  deliveryList: DeliveryOfWagon[] = [];
  private statementSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private utils: UtilsService,
    private memoOfDeliveryService: StatementService
  ) {
  }

  ngOnInit(): void {
    this.statementSub = this.route.params.pipe(
      switchMap((params: Params) => {
        if (params['statementId']) {
          this.statementId = params['statementId'];
          return this.memoOfDeliveryService.getById(params['statementId']);
        }
      }))
      .subscribe(statement => {
        this.statement = statement.statement;
        for (const memo of this.statement.memoOfDispatchList) {
          this.deliveryList = this.deliveryList.concat(memo.deliveryOfWagonList);
        }
        this.deliveryList.map(delivery => {
          this.sumWeight += delivery.cargoWeight;
          this.sumShuntingWork = this.sumShuntingWork += delivery.shuntingWorks;
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
      this.statementSub
    ]);
  }
}
