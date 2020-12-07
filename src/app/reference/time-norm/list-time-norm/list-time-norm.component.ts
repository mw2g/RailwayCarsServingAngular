import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {TimeNorm, TimeNormType} from '../../../shared/interfaces';
import {TimeNormService} from '../../service/time-norm.service';
import {TimeNormTypeService} from '../../service/time-norm-type.service';
import {UtilsService} from '../../../shared/service/utils.service';

@Component({
    selector: 'app-list-time-norm',
    templateUrl: './list-time-norm.component.html',
    styleUrls: ['./list-time-norm.component.scss']
})
export class ListTimeNormComponent implements OnInit, OnDestroy {

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
    @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

    timeNormIdToDelete: number;
    editedTimeNorm: TimeNorm;
    timeNormList: TimeNorm[];
    timeNormTypeList: Observable<Array<TimeNormType>>;
    enableForm = true;
    private isNewRecord: boolean;
    private listSub: Subscription;
    private delSub: Subscription;
    private updateSub: Subscription;
    private createSub: Subscription;

    constructor(private timeNormService: TimeNormService,
                private timeNormTypeService: TimeNormTypeService,
                private router: Router,
                private alert: AlertService,
                private utils: UtilsService
    ) {
    }

    ngOnInit(): void {
        this.timeNormTypeList = this.timeNormTypeService.getAll();

        this.listSub = this.timeNormService.getAll().subscribe(data => {
            this.timeNormList = data;
        }, error => {
            throwError(error);
        });

    }

    // загружаем один из двух шаблонов
    loadTemplate(timeNorm: TimeNorm): TemplateRef<any> {
        if (this.editedTimeNorm && this.editedTimeNorm.normId === timeNorm.normId) {
            return this.editTemplate;
        } else {
            return this.readOnlyTemplate;
        }
    }

    // добавление
    addNew(): void {
        this.editedTimeNorm = {
            normId: 0,
            relevanceDate: new Date(Date.now()),
            norm: 0,
            normType: {typeId: 0}
        };
        this.timeNormList.push(this.editedTimeNorm);
        this.isNewRecord = true;
        this.enableForm = false;
    }

    // редактирование
    edit(timeNorm: TimeNorm): void {
        this.enableForm = false;
        this.isNewRecord = false;
        this.editedTimeNorm = {
            normId: timeNorm.normId,
            relevanceDate: new Date(timeNorm.relevanceDate),
            norm: timeNorm.norm,
            normType: timeNorm.normType
        };
    }

    // отмена редактирования
    cancel(): void {
        // если отмена при добавлении, удаляем последнюю запись
        if (this.isNewRecord) {
            this.timeNormList.pop();
            this.isNewRecord = false;
        }
        this.editedTimeNorm = null;
        this.enableForm = true;
    }

    // сохраняем
    save(): void {
        if (this.isNewRecord) {
            // добавляем
            this.createSub = this.timeNormService.create(this.editedTimeNorm).subscribe((data) => {
                this.editedTimeNorm.normId = data.normId;
                this.editedTimeNorm.normType = data.normType;
            }, () => {
                this.timeNormList.pop();
                this.alert.danger('Ошибка при создании нормы времени');
            }, () => {
                this.alert.success('Норма времени создана');
                this.editedTimeNorm = null;
            });
            this.isNewRecord = false;
            this.enableForm = true;
        } else {
            // изменяем
            this.updateSub = this.timeNormService.update(this.editedTimeNorm).subscribe((data) => {
                this.timeNormList.map(timeNorm => {
                    if (timeNorm.normId === this.editedTimeNorm.normId) {
                        timeNorm.relevanceDate = this.editedTimeNorm.relevanceDate;
                        timeNorm.norm = this.editedTimeNorm.norm;
                        timeNorm.normType = {typeName: this.editedTimeNorm.normType.typeName};
                    }
                });
            }, () => {
                this.alert.danger('Ошибка');
            }, () => {
                this.alert.success('Норма времени сохранена');
                this.editedTimeNorm = null;
                this.enableForm = true;
            });
        }
    }

    delete(): void {
        this.delSub = this.timeNormService.delete(this.timeNormIdToDelete).subscribe((data) => {
            this.timeNormList = this.timeNormList.filter(wagonGroup => wagonGroup.normId !== this.timeNormIdToDelete);
            this.unsetDelete();
        }, () => {
            this.alert.danger('Ошибка при удалении Нормы времени');
        }, () => {
            this.alert.success('Норма времени удалена');
        });
    }

    setDelete(wagonGroupId: number): void {
        this.timeNormIdToDelete = wagonGroupId;
    }

    unsetDelete(): void {
        this.timeNormIdToDelete = null;
    }

    getById(wagonGroupId: number): number {
        if (wagonGroupId) {
            return this.timeNormList.find(value => value.normId === wagonGroupId).normId;
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
