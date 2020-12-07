import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {PenaltyService} from '../../service/penalty.service';
import {Penalty, WagonType} from '../../../shared/interfaces';
import {WagonTypeService} from '../../service/wagon-type.service';
import {UtilsService} from '../../../shared/service/utils.service';

@Component({
    selector: 'app-list-penalty',
    templateUrl: './list-penalty.component.html',
    styleUrls: ['./list-penalty.component.scss']
})
export class ListPenaltyComponent implements OnInit, OnDestroy {

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
    @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

    penaltyIdToDelete: number;
    editedPenalty: Penalty;
    penaltyList: Penalty[];
    wagonTypeList: Observable<Array<WagonType>>;
    enableForm = true;
    private isNewRecord: boolean;
    private listSub: Subscription;
    private updateSub: Subscription;
    private createSub: Subscription;
    private delSub: Subscription;

    constructor(private penaltyService: PenaltyService,
                private wagonTypeService: WagonTypeService,
                private router: Router,
                private alert: AlertService,
                private utils: UtilsService
    ) {
    }

    ngOnInit(): void {
        this.wagonTypeList = this.wagonTypeService.getAll();

        this.listSub = this.penaltyService.getAll().subscribe(data => {
            this.penaltyList = data;
        }, error => {
            throwError(error);
        });

    }

    // загружаем один из двух шаблонов
    loadTemplate(penalty: Penalty): TemplateRef<any> {
        if (this.editedPenalty && this.editedPenalty.penaltyId === penalty.penaltyId) {
            return this.editTemplate;
        } else {
            return this.readOnlyTemplate;
        }
    }

    // добавление
    addNew(): void {
        this.editedPenalty = {
            penaltyId: 0,
            relevanceDate: new Date(Date.now()),
            penalty: 0,
            wagonType: {typeId: 0}
        };
        this.penaltyList.push(this.editedPenalty);
        this.isNewRecord = true;
        this.enableForm = false;
    }

    // редактирование
    edit(penalty: Penalty): void {
        this.enableForm = false;
        this.isNewRecord = false;
        this.editedPenalty = {
            penaltyId: penalty.penaltyId,
            relevanceDate: new Date(penalty.relevanceDate),
            penalty: penalty.penalty,
            wagonType: penalty.wagonType
        };
    }

    // отмена редактирования
    cancel(): void {
        // если отмена при добавлении, удаляем последнюю запись
        if (this.isNewRecord) {
            this.penaltyList.pop();
            this.isNewRecord = false;
        }
        this.editedPenalty = null;
        this.enableForm = true;
    }

    // сохраняем
    save(): void {
        if (this.isNewRecord) {
            // добавляем
            this.createSub = this.penaltyService.create(this.editedPenalty).subscribe((data) => {
                this.editedPenalty.penaltyId = data.penaltyId;
                this.editedPenalty.wagonType = data.wagonType;
            }, () => {
                this.penaltyList.pop();
                this.alert.danger('Ошибка при создании штрафа');
            }, () => {
                this.alert.success('Штраф создан');
                this.editedPenalty = null;
            });
            this.isNewRecord = false;
            this.enableForm = true;
        } else {
            // изменяем
            this.updateSub = this.penaltyService.update(this.editedPenalty).subscribe((data) => {
                this.penaltyList.map(penalty => {
                    if (penalty.penaltyId === this.editedPenalty.penaltyId) {
                        penalty.relevanceDate = this.editedPenalty.relevanceDate;
                        penalty.penalty = this.editedPenalty.penalty;
                        penalty.wagonType = {typeName: this.editedPenalty.wagonType.typeName};
                    }
                });
            }, () => {
                this.alert.danger('Ошибка');
            }, () => {
                this.alert.success('Штраф сохранен');
                this.editedPenalty = null;
                this.enableForm = true;
            });
        }
    }

    delete(): void {
        this.delSub = this.penaltyService.delete(this.penaltyIdToDelete).subscribe((data) => {
            this.penaltyList = this.penaltyList.filter(wagonGroup => wagonGroup.penaltyId !== this.penaltyIdToDelete);
            this.unsetDelete();
        }, () => {
            this.alert.danger('Ошибка при удалении тарифа');
        }, () => {
            this.alert.success('Тариф удален');
        });
    }

    setDelete(id: number): void {
        this.penaltyIdToDelete = id;
    }

    unsetDelete(): void {
        this.penaltyIdToDelete = null;
    }

    getById(id: number): number {
        if (id) {
            return this.penaltyList.find(value => value.penaltyId === id).penaltyId;
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
