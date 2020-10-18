import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {BaseRate, WagonGroup} from '../../../shared/interfaces';
import {BaseRateService} from '../../service/base-rate.service';
import {WagonGroupService} from '../../service/wagon-group.service';

@Component({
  selector: 'app-list-base-rate',
  templateUrl: './list-base-rate.component.html',
  styleUrls: ['./list-base-rate.component.scss']
})
export class ListBaseRateComponent implements OnInit, OnDestroy {

  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  baseRateIdToDelete: number;
  editedBaseRate: BaseRate;
  baseRateList: BaseRate[];
  wagonGroupList: WagonGroup[];
  enableForm = true;
  private isNewRecord: boolean;
  private listSub: Subscription;
  private delSub: Subscription;
  private updateSub: Subscription;
  private createSub: Subscription;

  constructor(private baseRateService: BaseRateService,
              private wagonGroupService: WagonGroupService,
              private router: Router,
              private alert: AlertService) {
  }

  ngOnInit(): void {
    this.wagonGroupService.getAll().subscribe(data => {
      this.wagonGroupList = data;
    }, error => {
      throwError(error);
    });
    this.listSub = this.baseRateService.getAll().subscribe(data => {
      this.baseRateList = data;
    }, error => {
      throwError(error);
    });

  }

  // загружаем один из двух шаблонов
  loadTemplate(baseRate: BaseRate): TemplateRef<any> {
    if (this.editedBaseRate && this.editedBaseRate.rateId === baseRate.rateId) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  // добавление
  addNew(): void {
    this.editedBaseRate = {
      rateId: 0,
      relevanceDate: new Date(Date.now()),
      hours: 0,
      rate: 0,
      wagonGroup: { groupName: '' }
    };
    this.baseRateList.push(this.editedBaseRate);
    this.isNewRecord = true;
    this.enableForm = false;
  }

  // редактирование
  editWagonGroup(baseRate: BaseRate): void {
    this.enableForm = false;
    this.isNewRecord = false;
    this.editedBaseRate = {
      rateId: baseRate.rateId,
      relevanceDate: new Date(baseRate.relevanceDate),
      hours: baseRate.hours,
      rate: baseRate.rate,
      wagonGroup: baseRate.wagonGroup
    };
  }

  // отмена редактирования
  cancel(): void {
    // если отмена при добавлении, удаляем последнюю запись
    if (this.isNewRecord) {
      this.baseRateList.pop();
      this.isNewRecord = false;
    }
    this.editedBaseRate = null;
    this.enableForm = true;
  }

  // сохраняем
  saveWagonGroup(): void {
    if (this.isNewRecord) {
      // добавляем
      this.createSub = this.baseRateService.create(this.editedBaseRate).subscribe((data) => {
        this.editedBaseRate.rateId = data.rateId;
      }, () => {
        this.baseRateList.pop();
        this.alert.danger('Ошибка при создании группы вагонов, возможно группа с таким наименованием уже существует');
      }, () => {
        this.alert.success('Группа вагонов создана');
        this.editedBaseRate = null;
      });
      this.isNewRecord = false;
      this.enableForm = true;
    } else {
      // изменяем
      this.updateSub = this.baseRateService.update(this.editedBaseRate).subscribe((data) => {
        this.baseRateList.map(wagonGroup => {
          if (wagonGroup.rateId === this.editedBaseRate.rateId) {
            wagonGroup.relevanceDate = this.editedBaseRate.relevanceDate;
            wagonGroup.hours = this.editedBaseRate.hours;
            wagonGroup.rate = this.editedBaseRate.rate;
            wagonGroup.wagonGroup = this.editedBaseRate.wagonGroup;
          }
        });
      }, () => {
        this.alert.danger('Ошибка');
      }, () => {
        this.alert.success('Группа вагонов сохранена');
        this.editedBaseRate = null;
        this.enableForm = true;
      });
    }
  }

  delete(): void {
    this.delSub = this.baseRateService.delete(this.baseRateIdToDelete).subscribe((data) => {
      this.baseRateList = this.baseRateList.filter(wagonGroup => wagonGroup.rateId !== this.baseRateIdToDelete);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка при удалении группы вагона');
    }, () => {
      this.alert.success('Группа вагона удалена');
    });
  }

  setDelete(wagonGroupId: number): void {
    this.baseRateIdToDelete = wagonGroupId;
  }

  unsetDelete(): void {
    this.baseRateIdToDelete = null;
  }

  getById(wagonGroupId: number): number {
    if (wagonGroupId) {
      return this.baseRateList.find(value => value.rateId === wagonGroupId).rateId;
    }
    return 0;
  }


  ngOnDestroy(): void {
    if (this.listSub) {
      this.listSub.unsubscribe();
    }
    if (this.createSub) {
      this.createSub.unsubscribe();
    }
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
    if (this.delSub) {
      this.delSub.unsubscribe();
    }
  }
}
