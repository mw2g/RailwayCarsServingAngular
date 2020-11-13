import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {CargoOperation} from '../../../shared/interfaces';
import {CargoOperationService} from '../../service/cargo-operation.service';
import {UtilsService} from '../../../shared/service/utils.service';

@Component({
  selector: 'app-list-cargo-operation',
  templateUrl: './list-cargo-operation.component.html',
  styleUrls: ['./list-cargo-operation.component.scss']
})
export class ListCargoOperationComponent implements OnInit, OnDestroy {

  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  cargoOperationIdToDelete: number;
  editedCargoOperation: CargoOperation;
  cargoOperationList: CargoOperation[];
  enableForm = true;
  private isNewRecord: boolean;
  private listSub: Subscription;
  private createSub: Subscription;
  private updateSub: Subscription;
  private delSub: Subscription;

  constructor(private cargoOperationService: CargoOperationService,
              private router: Router,
              private alert: AlertService,
              private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.listSub = this.cargoOperationService.getAll().subscribe(groups => {
      this.cargoOperationList = groups;
    }, error => {
      throwError(error);
    });

  }

  // загружаем один из двух шаблонов
  loadTemplate(cargoOperation: CargoOperation): TemplateRef<any> {
    if (this.editedCargoOperation && this.editedCargoOperation.operationId === cargoOperation.operationId) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  // добавление
  addNew(): void {
    this.editedCargoOperation = {
      operationId: 0,
      operationName: ''
    };
    this.cargoOperationList.push(this.editedCargoOperation);
    this.isNewRecord = true;
    this.enableForm = false;
  }

  // редактирование
  edit(cargoOperation: CargoOperation): void {
    this.enableForm = false;
    this.isNewRecord = false;
    this.editedCargoOperation = {
      operationId: cargoOperation.operationId,
      operationName: cargoOperation.operationName
    };
  }

  // отмена редактирования
  cancel(): void {
    // если отмена при добавлении, удаляем последнюю запись
    if (this.isNewRecord) {
      this.cargoOperationList.pop();
      this.isNewRecord = false;
    }
    this.editedCargoOperation = null;
    this.enableForm = true;
  }

  // сохраняем
  save(): void {
    if (this.isNewRecord) {
      // добавляем
      this.createSub = this.cargoOperationService.create(this.editedCargoOperation).subscribe((data) => {
        this.editedCargoOperation.operationId = data.operationId;
      }, () => {
        this.cargoOperationList.pop();
        this.alert.danger('Ошибка при создании грузовой операции, возможно операция с таким наименованием уже существует');
      }, () => {
        this.alert.success('Грузовая операция создана');
        this.editedCargoOperation = null;
      });
      this.isNewRecord = false;
      this.enableForm = true;
    } else {
      // изменяем
      this.updateSub = this.cargoOperationService.update(this.editedCargoOperation).subscribe((data) => {
        this.cargoOperationList.map(cargoOperation => {
          if (cargoOperation.operationId === this.editedCargoOperation.operationId) {
            cargoOperation.operationName = this.editedCargoOperation.operationName;
          }
        });
      }, () => {
        this.alert.danger('Ошибка');
      }, () => {
        this.alert.success('Грузовая операция сохранена');
        this.editedCargoOperation = null;
        this.enableForm = true;
      });
    }
  }

  delete(): void {
    this.delSub = this.cargoOperationService.delete(this.cargoOperationIdToDelete).subscribe((data) => {
      this.cargoOperationList = this.cargoOperationList
        .filter(cargoOperation => cargoOperation.operationId !== this.cargoOperationIdToDelete);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка при удалении грузовой операции');
    }, () => {
      this.alert.success('Грузовая операция удалена');
    });
  }

  setDelete(cargoOperationId: number): void {
    this.cargoOperationIdToDelete = cargoOperationId;
  }

  unsetDelete(): void {
    this.cargoOperationIdToDelete = null;
  }

  getById(cargoOperationId: number): number {
    if (cargoOperationId) {
      return this.cargoOperationList.find(value => value.operationId === cargoOperationId).operationId;
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
