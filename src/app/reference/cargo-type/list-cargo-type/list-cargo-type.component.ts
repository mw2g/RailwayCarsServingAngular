import {Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CargoType} from '../../../shared/interfaces';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {CargoTypeService} from '../../service/cargo-type.service';
import {UtilsService} from '../../../shared/service/utils.service';

@Component({
  selector: 'app-cargo-type',
  templateUrl: './list-cargo-type.component.html',
  styleUrls: ['./list-cargo-type.component.scss']
})
export class ListCargoTypeComponent implements OnInit, OnDestroy {

  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  cargoTypeIdToDelete: number;
  editedCargoType: CargoType;
  cargoTypeList: CargoType[];
  enableForm = true;
  sort = true;
  searchStr = '';
  private isNewRecord: boolean;
  private listSub: Subscription;
  private createSub: Subscription;
  private updateSub: Subscription;
  private delSub: Subscription;

  constructor(private cargoTypeService: CargoTypeService,
              private router: Router,
              private alert: AlertService,
              private utils: UtilsService
  ) {
  }


  showFixedTableHeader = false;

  @HostListener('window:scroll')
  onScroll(): void {
    const pageTopOffset = window.pageYOffset;

    if (pageTopOffset > 30) {
      this.showFixedTableHeader = true;
    } else {
      this.showFixedTableHeader = false;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    //Do nothing.
    //It will automatically trigger to update the bound properties in template.
  }


  ngOnInit(): void {
    this.listSub = this.cargoTypeService.getAll().subscribe(types => {
      this.cargoTypeList = types;
      this.sortList();
    }, error => {
      throwError(error);
    });

  }

  sortList(): void {
    if (this.sort) {
      this.cargoTypeList.sort((a, b) => a.typeName > b.typeName ? 1 : -1);
      this.sort = false;
    } else {
      this.cargoTypeList.sort((a, b) => a.typeName < b.typeName ? 1 : -1);
      this.sort = true;
    }
  }

  // загружаем один из двух шаблонов
  loadTemplate(cargoType: CargoType): TemplateRef<any> {
    if (this.editedCargoType && this.editedCargoType.typeId === cargoType.typeId) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  // добавление
  addNew(): void {
    this.editedCargoType = {
      typeId: 0,
      typeName: ''
    };
    this.cargoTypeList.push(this.editedCargoType);
    this.isNewRecord = true;
    this.enableForm = false;
  }

  // редактирование
  editWagonGroup(cargoType: CargoType): void {
    this.enableForm = false;
    this.isNewRecord = false;
    this.editedCargoType = {
      typeId: cargoType.typeId,
      typeName: cargoType.typeName
    };
  }

  // отмена редактирования
  cancel(): void {
    // если отмена при добавлении, удаляем последнюю запись
    if (this.isNewRecord) {
      this.cargoTypeList.pop();
      this.isNewRecord = false;
    }
    this.editedCargoType = null;
    this.enableForm = true;
  }

  // сохраняем
  save(): void {
    if (this.isNewRecord) {
      // добавляем
      this.createSub = this.cargoTypeService.create(this.editedCargoType).subscribe((data) => {
        this.editedCargoType.typeId = data.typeId;
      }, () => {
        this.cargoTypeList.pop();
        this.alert.danger('Ошибка при создании группы вагонов, возможно группа с таким наименованием уже существует');
      }, () => {
        this.alert.success('Группа вагонов создана');
        this.editedCargoType = null;
      });
      this.isNewRecord = false;
      this.enableForm = true;
    } else {
      // изменяем
      this.updateSub = this.cargoTypeService.update(this.editedCargoType).subscribe((data) => {
        this.cargoTypeList.map(cargoType => {
          if (cargoType.typeId === this.editedCargoType.typeId) {
            cargoType.typeName = this.editedCargoType.typeName;
          }
        });
      }, () => {
        this.alert.danger('Ошибка');
      }, () => {
        this.alert.success('Группа вагонов сохранена');
        this.editedCargoType = null;
        this.enableForm = true;
      });
    }
  }

  delete(): void {
    this.delSub = this.cargoTypeService.delete(this.cargoTypeIdToDelete).subscribe((data) => {
      this.cargoTypeList = this.cargoTypeList.filter(cargoType => cargoType.typeId !== this.cargoTypeIdToDelete);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка при удалении группы вагона');
    }, () => {
      this.alert.success('Группа вагона удалена');
    });
  }

  setDelete(cargoTypeId: number): void {
    this.cargoTypeIdToDelete = cargoTypeId;
  }

  unsetDelete(): void {
    this.cargoTypeIdToDelete = null;
  }

  getById(cargoTypeId: number): number {
    if (cargoTypeId) {
      return this.cargoTypeList.find(value => value.typeId === cargoTypeId).typeId;
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
