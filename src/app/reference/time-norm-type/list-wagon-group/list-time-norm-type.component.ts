import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {TimeNormTypeService} from '../../service/time-norm-type.service';
import {TimeNormType} from '../../../shared/interfaces';
import {UtilsService} from '../../../shared/service/utils.service';

@Component({
  selector: 'app-list-time-norm-type',
  templateUrl: './list-time-norm-type.component.html',
  styleUrls: ['./list-time-norm-type.component.scss']
})
export class ListTimeNormTypeComponent implements OnInit, OnDestroy {

  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  typeIdToDelete: number;
  editedTimeNormType: TimeNormType;
  timeNormTypeList: TimeNormType[];
  enableForm = true;
  private isNewRecord: boolean;
  private listSub: Subscription;
  private delSub: Subscription;
  private updateSub: Subscription;
  private createSub: Subscription;

  constructor(private timeNormTypeService: TimeNormTypeService,
              private router: Router,
              private alert: AlertService,
              private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.listSub = this.timeNormTypeService.getAll().subscribe(data => {
      this.timeNormTypeList = data;
    }, error => {
      throwError(error);
    });

  }

  // загружаем один из двух шаблонов
  loadTemplate(timeNormType: TimeNormType): TemplateRef<any> {
    if (this.editedTimeNormType && this.editedTimeNormType.typeId === timeNormType.typeId) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  // добавление
  addNew(): void {
    this.editedTimeNormType = {
      typeId: 0,
      typeName: '',
      typeCode: ''
    };
    this.timeNormTypeList.push(this.editedTimeNormType);
    this.isNewRecord = true;
    this.enableForm = false;
  }

  // редактирование
  edit(timeNormType: TimeNormType): void {
    this.enableForm = false;
    this.isNewRecord = false;
    this.editedTimeNormType = {
      typeId: timeNormType.typeId,
      typeName: timeNormType.typeName,
      typeCode: timeNormType.typeCode
    };
  }

  // отмена редактирования
  cancel(): void {
    // если отмена при добавлении, удаляем последнюю запись
    if (this.isNewRecord) {
      this.timeNormTypeList.pop();
      this.isNewRecord = false;
    }
    this.editedTimeNormType = null;
    this.enableForm = true;
  }

  // сохраняем
  save(): void {
    if (this.isNewRecord) {
      // добавляем
      this.createSub = this.timeNormTypeService.create(this.editedTimeNormType).subscribe((data) => {
        this.editedTimeNormType.typeId = data.typeId;
      }, () => {
        this.timeNormTypeList.pop();
        this.alert.danger('Ошибка при создании типа нормы времени');
      }, () => {
        this.alert.success('Тип нормы времени создан');
        this.editedTimeNormType = null;
      });
      this.isNewRecord = false;
      this.enableForm = true;
    } else {
      // изменяем
      this.updateSub = this.timeNormTypeService.update(this.editedTimeNormType).subscribe((data) => {
        this.timeNormTypeList.map(timeNormType => {
          if (timeNormType.typeId === this.editedTimeNormType.typeId) {
            timeNormType.typeName = this.editedTimeNormType.typeName;
            timeNormType.typeCode = this.editedTimeNormType.typeCode;
          }
        });
      }, () => {
        this.alert.danger('Ошибка');
      }, () => {
        this.alert.success('Сохранено');
        this.editedTimeNormType = null;
        this.enableForm = true;
      });
    }
  }

  delete(): void {
    this.delSub = this.timeNormTypeService.delete(this.typeIdToDelete).subscribe((data) => {
      this.timeNormTypeList = this.timeNormTypeList.filter(timeNormType => timeNormType.typeId !== this.typeIdToDelete);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка при удалении группы вагона');
    }, () => {
      this.alert.success('Группа вагона удалена');
    });
  }

  setDelete(timeNormTypeId: number): void {
    this.typeIdToDelete = timeNormTypeId;
  }

  unsetDelete(): void {
    this.typeIdToDelete = null;
  }

  getById(timeNormTypeId: number): number {
    if (timeNormTypeId) {
      return this.timeNormTypeList.find(value => value.typeId === timeNormTypeId).typeId;
    }
    return 0;
  }


  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.listSub,
      this.createSub,
      this.updateSub,
      this.delSub
    ]);
  }
}
