import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {TariffService} from '../../service/tariff.service';
import {TariffTypeService} from '../../service/tariff-type.service';
import {Tariff, TariffType} from '../../../shared/interfaces';
import {UtilsService} from '../../../shared/service/utils.service';

@Component({
    selector: 'app-list-tariff',
    templateUrl: './list-tariff.component.html',
    styleUrls: ['./list-tariff.component.scss']
})
export class ListTariffComponent implements OnInit, OnDestroy {

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
    @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

    tariffIdToDelete: number;
    editedTariff: Tariff;
    tariffList: Tariff[];
    tariffTypeList: Observable<Array<TariffType>>;
    enableForm = true;
    private isNewRecord: boolean;
    private listSub: Subscription;
    private delSub: Subscription;
    private updateSub: Subscription;
    private createSub: Subscription;

    constructor(private tariffService: TariffService,
                private tariffTypeService: TariffTypeService,
                private router: Router,
                private alert: AlertService,
                private utils: UtilsService
    ) {
    }

    ngOnInit(): void {
        this.tariffTypeList = this.tariffTypeService.getAll();
        this.listSub = this.tariffService.getAll().subscribe(data => {
            this.tariffList = data;
        }, error => {
            throwError(error);
        });

    }

    // загружаем один из двух шаблонов
    loadTemplate(tariff: Tariff): TemplateRef<any> {
        if (this.editedTariff && this.editedTariff.tariffId === tariff.tariffId) {
            return this.editTemplate;
        } else {
            return this.readOnlyTemplate;
        }
    }

    // добавление
    addNew(): void {
        this.editedTariff = {
            tariffId: 0,
            relevanceDate: new Date(Date.now()),
            tariff: 0,
            tariffType: {typeId: 0}
        };
        this.tariffList.push(this.editedTariff);
        this.isNewRecord = true;
        this.enableForm = false;
    }

    // редактирование
    edit(tariff: Tariff): void {
        this.enableForm = false;
        this.isNewRecord = false;
        this.editedTariff = {
            tariffId: tariff.tariffId,
            relevanceDate: new Date(tariff.relevanceDate),
            tariff: tariff.tariff,
            tariffType: tariff.tariffType
        };
    }

    // отмена редактирования
    cancel(): void {
        // если отмена при добавлении, удаляем последнюю запись
        if (this.isNewRecord) {
            this.tariffList.pop();
            this.isNewRecord = false;
        }
        this.editedTariff = null;
        this.enableForm = true;
    }

    // сохраняем
    save(): void {
        if (this.isNewRecord) {
            // добавляем
            this.createSub = this.tariffService.create(this.editedTariff).subscribe((data) => {
                this.editedTariff.tariffId = data.tariffId;
                this.editedTariff.tariffType = data.tariffType;
            }, () => {
                this.tariffList.pop();
                this.alert.danger('Ошибка при создании тарифа');
            }, () => {
                this.alert.success('Тариф создан');
                this.editedTariff = null;
            });
            this.isNewRecord = false;
            this.enableForm = true;
        } else {
            // изменяем
            this.updateSub = this.tariffService.update(this.editedTariff).subscribe((data) => {
                this.tariffList.map(tariff => {
                    if (tariff.tariffId === this.editedTariff.tariffId) {
                        tariff.relevanceDate = this.editedTariff.relevanceDate;
                        tariff.tariff = this.editedTariff.tariff;
                        tariff.tariffType = {typeName: this.editedTariff.tariffType.typeName};
                    }
                });
            }, () => {
                this.alert.danger('Ошибка');
            }, () => {
                this.alert.success('Тариф сохранен');
                this.editedTariff = null;
                this.enableForm = true;
            });
        }
    }

    delete(): void {
        this.delSub = this.tariffService.delete(this.tariffIdToDelete).subscribe((data) => {
            this.tariffList = this.tariffList.filter(wagonGroup => wagonGroup.tariffId !== this.tariffIdToDelete);
            this.unsetDelete();
        }, () => {
            this.alert.danger('Ошибка при удалении тарифа');
        }, () => {
            this.alert.success('Тариф удален');
        });
    }

    setDelete(id: number): void {
        this.tariffIdToDelete = id;
    }

    unsetDelete(): void {
        this.tariffIdToDelete = null;
    }

    getById(id: number): number {
        if (id) {
            return this.tariffList.find(value => value.tariffId === id).tariffId;
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
