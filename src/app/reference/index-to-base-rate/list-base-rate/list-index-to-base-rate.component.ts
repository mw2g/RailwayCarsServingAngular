import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {BaseRate, IndexToBaseRate, WagonGroup} from '../../../shared/interfaces';
import {BaseRateService} from '../../service/base-rate.service';
import {WagonGroupService} from '../../service/wagon-group.service';
import {IndexToBaseRateService} from '../../service/index-to-base-rate.service';

@Component({
  selector: 'app-list-base-rate',
  templateUrl: './list-index-to-base-rate.component.html',
  styleUrls: ['./list-index-to-base-rate.component.scss']
})
export class ListIndexToBaseRateComponent implements OnInit, OnDestroy {

  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  indexIdToDelete: number;
  editedIndexToBaseRate: IndexToBaseRate;
  indexToBaseRateList: IndexToBaseRate[];
  enableForm = true;
  private isNewRecord: boolean;
  private listSub: Subscription;
  private delSub: Subscription;
  private updateSub: Subscription;
  private createSub: Subscription;

  constructor(private indexToBaseRateService: IndexToBaseRateService,
              private router: Router,
              private alert: AlertService) {
  }

  ngOnInit(): void {
    this.listSub = this.indexToBaseRateService.getAll().subscribe(data => {
      this.indexToBaseRateList = data;
    }, error => {
      throwError(error);
    });

  }

  // загружаем один из двух шаблонов
  loadTemplate(indexToBaseRate: IndexToBaseRate): TemplateRef<any> {
    if (this.editedIndexToBaseRate && this.editedIndexToBaseRate.indexId === indexToBaseRate.indexId) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  // добавление
  addNew(): void {
    this.editedIndexToBaseRate = {
      indexId: 0,
      relevanceDate: new Date(Date.now()),
      indexToRate: 0
    };
    this.indexToBaseRateList.push(this.editedIndexToBaseRate);
    this.isNewRecord = true;
    this.enableForm = false;
  }

  // редактирование
  edit(indexToBaseRate: IndexToBaseRate): void {
    this.enableForm = false;
    this.isNewRecord = false;
    this.editedIndexToBaseRate = {
      indexId: indexToBaseRate.indexId,
      relevanceDate: new Date(indexToBaseRate.relevanceDate),
      indexToRate: indexToBaseRate.indexToRate
    };
  }

  // отмена редактирования
  cancel(): void {
    // если отмена при добавлении, удаляем последнюю запись
    if (this.isNewRecord) {
      this.indexToBaseRateList.pop();
      this.isNewRecord = false;
    }
    this.editedIndexToBaseRate = null;
    this.enableForm = true;
  }

  // сохраняем
  save(): void {
    if (this.isNewRecord) {
      // добавляем
      this.createSub = this.indexToBaseRateService.create(this.editedIndexToBaseRate).subscribe((data) => {
        this.editedIndexToBaseRate.indexId = data.indexId;
      }, () => {
        this.indexToBaseRateList.pop();
        this.alert.danger('Ошибка при создании группы вагонов, возможно группа с таким наименованием уже существует');
      }, () => {
        this.alert.success('Группа вагонов создана');
        this.editedIndexToBaseRate = null;
      });
      this.isNewRecord = false;
      this.enableForm = true;
    } else {
      // изменяем
      this.updateSub = this.indexToBaseRateService.update(this.editedIndexToBaseRate).subscribe((data) => {
        this.indexToBaseRateList.map(indexToBaseRate => {
          if (indexToBaseRate.indexId === this.editedIndexToBaseRate.indexId) {
            indexToBaseRate.relevanceDate = this.editedIndexToBaseRate.relevanceDate;
            indexToBaseRate.indexToRate = this.editedIndexToBaseRate.indexToRate;
          }
        });
      }, () => {
        this.alert.danger('Ошибка');
      }, () => {
        this.alert.success('Группа вагонов сохранена');
        this.editedIndexToBaseRate = null;
        this.enableForm = true;
      });
    }
  }

  delete(): void {
    this.delSub = this.indexToBaseRateService.delete(this.indexIdToDelete).subscribe((data) => {
      this.indexToBaseRateList = this.indexToBaseRateList.filter(indexToBaseRate => indexToBaseRate.indexId !== this.indexIdToDelete);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка при удалении индекса');
    }, () => {
      this.alert.success('Индекс удален');
    });
  }

  setDelete(indexId: number): void {
    this.indexIdToDelete = indexId;
  }

  unsetDelete(): void {
    this.indexIdToDelete = null;
  }

  getById(indexId: number): number {
    if (indexId) {
      return this.indexToBaseRateList.find(value => value.indexId === indexId).indexId;
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
