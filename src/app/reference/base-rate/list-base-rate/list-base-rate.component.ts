import {Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {BaseRate, WagonGroup} from '../../../shared/interfaces';
import {BaseRateService} from '../../service/base-rate.service';
import {WagonGroupService} from '../../service/wagon-group.service';
import {UtilsService} from '../../../shared/service/utils.service';

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
    wagonGroupList: Observable<Array<WagonGroup>>;
    enableForm = true;
    private isNewRecord: boolean;
    private listSub: Subscription;
    private delSub: Subscription;
    private updateSub: Subscription;
    private createSub: Subscription;
    wagonGroupFilter = '';

    constructor(private baseRateService: BaseRateService,
                private wagonGroupService: WagonGroupService,
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
    }

    ngOnInit(): void {
        this.wagonGroupList = this.wagonGroupService.getAll();

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
            wagonGroup: {groupName: ''}
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
            wagonGroup: {groupName: baseRate.wagonGroup.groupName}
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
    save(): void {
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
        this.utils.unsubscribe([
            this.listSub,
            this.createSub,
            this.updateSub,
            this.delSub
        ]);
    }
}
