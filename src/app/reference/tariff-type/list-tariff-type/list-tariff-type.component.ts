import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {TariffTypeService} from '../../service/tariff-type.service';
import {TariffType} from '../../../shared/interfaces';
import {UtilsService} from '../../../shared/service/utils.service';

@Component({
    selector: 'app-list-tariff-type',
    templateUrl: './list-tariff-type.component.html',
    styleUrls: ['./list-tariff-type.component.scss']
})
export class ListTariffTypeComponent implements OnInit, OnDestroy {

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
    @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

    typeIdToDelete: number;
    editedTariffType: TariffType;
    tariffTypeList: TariffType[];
    enableForm = true;
    private isNewRecord: boolean;
    private listSub: Subscription;
    private delSub: Subscription;
    private updateSub: Subscription;
    private createSub: Subscription;

    constructor(private tariffTypeService: TariffTypeService,
                private router: Router,
                private alert: AlertService,
                private utils: UtilsService
    ) {
    }

    ngOnInit(): void {
        this.listSub = this.tariffTypeService.getAll().subscribe(data => {
            this.tariffTypeList = data;
        }, error => {
            throwError(error);
        });

    }

    // загружаем один из двух шаблонов
    loadTemplate(tariffType: TariffType): TemplateRef<any> {
        if (this.editedTariffType && this.editedTariffType.typeId === tariffType.typeId) {
            return this.editTemplate;
        } else {
            return this.readOnlyTemplate;
        }
    }

    // добавление
    addNew(): void {
        this.editedTariffType = {
            typeId: 0,
            typeName: '',
            typeCode: ''
        };
        this.tariffTypeList.push(this.editedTariffType);
        this.isNewRecord = true;
        this.enableForm = false;
    }

    // редактирование
    edit(tariffType: TariffType): void {
        this.enableForm = false;
        this.isNewRecord = false;
        this.editedTariffType = {
            typeId: tariffType.typeId,
            typeName: tariffType.typeName,
            typeCode: tariffType.typeCode
        };
    }

    // отмена редактирования
    cancel(): void {
        // если отмена при добавлении, удаляем последнюю запись
        if (this.isNewRecord) {
            this.tariffTypeList.pop();
            this.isNewRecord = false;
        }
        this.editedTariffType = null;
        this.enableForm = true;
    }

    // сохраняем
    save(): void {
        if (this.isNewRecord) {
            // добавляем
            this.createSub = this.tariffTypeService.create(this.editedTariffType).subscribe((data) => {
                this.editedTariffType.typeId = data.typeId;
                this.editedTariffType.typeCode = data.typeCode;
            }, () => {
                this.tariffTypeList.pop();
                this.alert.danger('Ошибка при создании типа тарифа');
            }, () => {
                this.alert.success('Тип тарифа создан');
                this.editedTariffType = null;
            });
            this.isNewRecord = false;
            this.enableForm = true;
        } else {
            // изменяем
            this.updateSub = this.tariffTypeService.update(this.editedTariffType).subscribe((data) => {
                this.tariffTypeList.map(tariffType => {
                    if (tariffType.typeId === this.editedTariffType.typeId) {
                        tariffType.typeName = this.editedTariffType.typeName;
                        tariffType.typeCode = this.editedTariffType.typeCode;
                    }
                });
            }, () => {
                this.alert.danger('Ошибка');
            }, () => {
                this.alert.success('Сохранено');
                this.editedTariffType = null;
                this.enableForm = true;
            });
        }
    }

    delete(): void {
        this.delSub = this.tariffTypeService.delete(this.typeIdToDelete).subscribe((data) => {
            this.tariffTypeList = this.tariffTypeList.filter(tariffType => tariffType.typeId !== this.typeIdToDelete);
            this.unsetDelete();
        }, () => {
            this.alert.danger('Ошибка при удалении типа тарифа');
        }, () => {
            this.alert.success('Тип тарифа удален');
        });
    }

    setDelete(tariffTypeId: number): void {
        this.typeIdToDelete = tariffTypeId;
    }

    unsetDelete(): void {
        this.typeIdToDelete = null;
    }

    getById(tariffTypeId: number): number {
        if (tariffTypeId) {
            return this.tariffTypeList.find(value => value.typeId === tariffTypeId).typeId;
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
