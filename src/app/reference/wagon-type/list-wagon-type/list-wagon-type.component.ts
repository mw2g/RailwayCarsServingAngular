import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {WagonTypeService} from '../../service/wagon-type.service';
import {WagonGroup, WagonType} from '../../../shared/interfaces';
import {WagonGroupService} from '../../service/wagon-group.service';
import {UtilsService} from '../../../shared/service/utils.service';

@Component({
  selector: 'app-list-wagon-type',
  templateUrl: './list-wagon-type.component.html',
  styleUrls: ['./list-wagon-type.component.scss']
})
export class ListWagonTypeComponent implements OnInit, OnDestroy {

  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  wagonTypeIdToDelete: number;
  editedWagonType: WagonType;
  wagonTypeList: WagonType[];
  wagonGroupList: Observable<Array<WagonGroup>>;
  enableForm = true;
  private isNewRecord: boolean;
  private wagonTypeListSub: Subscription;
  private createSub: Subscription;
  private updateSub: Subscription;
  private delSub: Subscription;

  constructor(private wagonTypeService: WagonTypeService,
              private wagonGroupService: WagonGroupService,
              private router: Router,
              private alert: AlertService,
              private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.wagonGroupList = this.wagonGroupService.getAll();

    this.wagonTypeListSub = this.wagonTypeService.getAll().subscribe(types => {
      this.wagonTypeList = types;
    }, error => {
      throwError(error);
    });

  }

  // загружаем один из двух шаблонов
  loadTemplate(wagonType: WagonType): TemplateRef<any> {
    if (this.editedWagonType && this.editedWagonType.typeId === wagonType.typeId) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  // добавление
  addNew(): void {
    this.editedWagonType = {
      typeId: 0,
      typeName: '',
      wagonGroup: {groupId: 0}
    };
    this.wagonTypeList.push(this.editedWagonType);
    this.isNewRecord = true;
    this.enableForm = false;
  }

  // редактирование
  edit(wagonType: WagonType): void {
    this.enableForm = false;
    this.isNewRecord = false;
    this.editedWagonType = {
      typeId: wagonType.typeId,
      typeName: wagonType.typeName,
      wagonGroup: {groupName: wagonType.wagonGroup.groupName}
    };
  }

  // отмена редактирования
  cancel(): void {
    // если отмена при добавлении, удаляем последнюю запись
    if (this.isNewRecord) {
      this.wagonTypeList.pop();
      this.isNewRecord = false;
    }
    this.editedWagonType = null;
    this.enableForm = true;
  }

  // сохраняем
  save(): void {
    if (this.isNewRecord) {
      // добавляем
      this.createSub = this.wagonTypeService.create(this.editedWagonType).subscribe((data) => {
        this.editedWagonType = data;
      }, () => {
        this.wagonTypeList.pop();
        this.alert.danger('Ошибка при создании типа вагона, возможно тип с таким наименованием уже существует');
      }, () => {
        this.alert.success('Тип вагона создана');
        this.editedWagonType = null;
      });
      this.isNewRecord = false;
      this.enableForm = true;
    } else {
      // изменяем
      this.updateSub = this.wagonTypeService.update(this.editedWagonType).subscribe((data) => {
        this.wagonTypeList.map(wagonType => {
          if (wagonType.typeId === this.editedWagonType.typeId) {
            wagonType.typeName = this.editedWagonType.typeName;
            wagonType.wagonGroup = {groupName: this.editedWagonType.wagonGroup.groupName};
          }
        });
      }, () => {
        this.alert.danger('Ошибка');
      }, () => {
        this.alert.success('Тип вагона сохранена');
        this.editedWagonType = null;
        this.enableForm = true;
      });
    }
  }

  delete(): void {
    this.delSub = this.wagonTypeService.delete(this.wagonTypeIdToDelete).subscribe((data) => {
      this.wagonTypeList = this.wagonTypeList.filter(wagonType => wagonType.typeId !== this.wagonTypeIdToDelete);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка при удалении типа вагона');
    }, () => {
      this.alert.success('Тип вагона удалена');
    });
  }

  setDelete(wagonTypeId: number): void {
    this.wagonTypeIdToDelete = wagonTypeId;
  }

  unsetDelete(): void {
    this.wagonTypeIdToDelete = null;
  }

  getById(wagonTypeId: number): number {
    if (wagonTypeId) {
      return this.wagonTypeList.find(value => value.typeId === wagonTypeId).typeId;
    }
    return 0;
  }


  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.wagonTypeListSub,
      this.createSub,
      this.updateSub,
      this.delSub
    ]);
  }
}
