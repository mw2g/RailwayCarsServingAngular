import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ControllerStatement, Customer, DeliveryOfWagon, MemoOfDelivery, MemoOfDispatch, Owner} from '../../shared/interfaces';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {CustomerService} from '../../reference/service/customer.service';
import {ControllerStatementService} from '../controller-statement.service';
import {DeliveryOfWagonService} from '../../delivery-of-wagon/delivery-of-wagon.service';
import {toNumber} from 'ngx-bootstrap/timepicker/timepicker.utils';
import {MemoOfDispatchService} from '../../memo-of-dispatch/memo-of-dispatch.service';
import {MemoOfDispatchModule} from '../../memo-of-dispatch/memo-of-dispatch.module';

@Component({
  selector: 'app-memo-in-controller-statement',
  templateUrl: './list-memo-in-controller-statement.component.html',
  styleUrls: ['./list-memo-in-controller-statement.component.scss']
})
export class ListMemoInControllerStatementComponent implements OnInit, OnDestroy {

  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  @Input() statementId: number;
  @Input() memoList: MemoOfDispatch[] = [];
  @Input() controllerStatement: ControllerStatement;
  @Input() enableForm;

  deliveryList: DeliveryOfWagon[] = [];
  suitableMemos: MemoOfDispatch[] = [];
  memoIdToDelete: number;
  memoIdToAdd: number;
  public editedMemo: MemoOfDispatch;
  private isNewRecord: boolean;

  private uSub: Subscription;
  private cSub: Subscription;
  private memoSub: Subscription;
  private delSub: Subscription;
  private sDeliverySub: Subscription;
  private addMemoToListSub: Subscription;
  private addMemoSub: Subscription;
  private ownerSub: Subscription;
  private ownersList: Owner[] = [];

  constructor(private deliveryService: DeliveryOfWagonService,
              private memoOfDispatchService: MemoOfDispatchService,
              private customerService: CustomerService,
              private controllerStatementService: ControllerStatementService,
              private router: Router,
              private alert: AlertService) {
  }

  ngOnInit(): void {
    this.ownerSub = this.deliveryService.getAllOwners().subscribe(owners => {
      this.ownersList = owners;
    }, error => {
      throwError(error);
    });
    this.loadSuitableMemos(this.statementId);
  }

  public loadDeliveryList(): void {
    this.deliveryList = [];
    for (const memo of this.memoList) {
      this.deliveryList = this.deliveryList.concat(memo.deliveryOfWagonList);
    }
  }

  public loadSuitableMemos(statementId: number): void {
    this.sDeliverySub = this.memoOfDispatchService.getSuitableMemosForControllerStatement(statementId).subscribe(memos => {
      this.suitableMemos = memos;
    }, error => {
      throwError(error);
    });
  }

  // загружаем один из двух шаблонов
  loadTemplate(memoOfDispatch: MemoOfDispatch): TemplateRef<any> {
    if (this.editedMemo && this.editedMemo.memoOfDispatchId === memoOfDispatch.memoOfDispatchId) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  getById(memoId: number): number {
    if (memoId) {
      return this.memoList.find(value => value.memoOfDispatchId === memoId).memoOfDispatchId;
    }
    return 0;
  }

  addMemoById(): void {
    if (!this.suitableMemos.find(memo => memo.memoOfDispatchId === this.memoIdToAdd)) {
      this.alert.warning('Нет подходящей памятки с таким номером');
      this.clearMemoIdToAdd();
      return;
    }
    this.addMemoSub = this.memoOfDispatchService.addControllerStatement(this.memoIdToAdd.toString(), String(this.statementId))
      .subscribe(() => {
        this.clearMemoIdToAdd();
      }, () => {
        this.alert.danger('Ошибка при добавлении памятки по номеру');
      }, () => {
        this.alert.success('В общую подачу добавлена ведомость приемосдатчика');
      });

    const memoOfDispatch: MemoOfDispatch = this.suitableMemos.find(memo => memo.memoOfDispatchId === this.memoIdToAdd);
    this.memoList.push(memoOfDispatch);
    this.suitableMemos = this.suitableMemos.filter(memo => memo.memoOfDispatchId !== this.memoIdToAdd);
  }

  removeStatementFromMemo(memoId): void {
    this.delSub = this.memoOfDispatchService.removeControllerStatement(memoId).subscribe((data) => {
      this.suitableMemos.push(this.memoList.find(memo => memo.memoOfDispatchId === memoId));
      this.memoList = this.memoList.filter(memo => memo.memoOfDispatchId !== memoId);
    }, () => {
      this.alert.danger('Ошибка при откреплении памятки от ведомости');
    }, () => {
      this.alert.success('Памятка откреплена от ведомости');
    });
  }

  clearMemoIdToAdd(): void {
    this.memoIdToAdd = null;
  }

  addAllSuitableMemos(): void {
    this.clearMemoIdToAdd();
    this.addMemoToListSub = this.memoOfDispatchService
      .addControllerStatementToMemoOfDispatchList(this.suitableMemos.map(memo => memo.memoOfDispatchId), this.statementId)
      .subscribe(() => {
      }, () => {
        this.alert.danger('Ошибка при добавлении всех подходящих памяток');
      }, () => {
        this.alert.success('Все подходящие памятки добавлены');
      });

    this.memoList = this.memoList.concat(this.suitableMemos);
    this.suitableMemos = [];
  }

  ngOnDestroy(): void {
    if (this.cSub) {
      this.cSub.unsubscribe();
    }
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
    if (this.memoSub) {
      this.memoSub.unsubscribe();
    }
    if (this.delSub) {
      this.delSub.unsubscribe();
    }
    if (this.sDeliverySub) {
      this.sDeliverySub.unsubscribe();
    }
    if (this.ownerSub) {
      this.ownerSub.unsubscribe();
    }
  }

  removeAllMemoFromStatement(): void {
    const memoIds = this.memoList.map(memo => memo.memoOfDispatchId);
    this.delSub = this.memoOfDispatchService.removeControllerStatementFromAllMemo(memoIds).subscribe(() => {
      this.loadSuitableMemos(this.statementId);
      this.memoList = [];
    }, () => {
      this.alert.danger('Ошибка при откреплении памяток');
    }, () => {
      this.alert.success('Все памятки убраны из ведомости');
    });
  }

  // checkWeight(): void {
  //   if (this.editedMemo.cargoWeight > 999) {
  //     this.editedMemo.cargoWeight = null;
  //   }
  // }
}
