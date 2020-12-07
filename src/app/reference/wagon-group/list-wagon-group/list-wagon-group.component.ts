import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {WagonGroupService} from '../../service/wagon-group.service';
import {WagonGroup} from '../../../shared/interfaces';
import {UtilsService} from '../../../shared/service/utils.service';

@Component({
    selector: 'app-list-wagon-group',
    templateUrl: './list-wagon-group.component.html',
    styleUrls: ['./list-wagon-group.component.scss']
})
export class ListWagonGroupComponent implements OnInit, OnDestroy {

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
    @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

    wagonGroupIdToDelete: number;
    editedWagonGroup: WagonGroup;
    wagonGroupList: WagonGroup[];
    enableForm = true;
    private isNewRecord: boolean;
    private wagonGroupListSub: Subscription;
    private createSub: Subscription;
    private updateSub: Subscription;
    private delSub: Subscription;

    constructor(private wagonGroupService: WagonGroupService,
                private router: Router,
                private alert: AlertService,
                private utils: UtilsService
    ) {
    }

    ngOnInit(): void {
        this.wagonGroupListSub = this.wagonGroupService.getAll().subscribe(groups => {
            this.wagonGroupList = groups;
        }, error => {
            throwError(error);
        });

    }

    // загружаем один из двух шаблонов
    loadTemplate(wagonGroup: WagonGroup): TemplateRef<any> {
        if (this.editedWagonGroup && this.editedWagonGroup.groupId === wagonGroup.groupId) {
            return this.editTemplate;
        } else {
            return this.readOnlyTemplate;
        }
    }

    // добавление
    addNew(): void {
        this.editedWagonGroup = {
            groupId: 0,
            groupName: ''
        };
        this.wagonGroupList.push(this.editedWagonGroup);
        this.isNewRecord = true;
        this.enableForm = false;
    }

    // редактирование
    editWagonGroup(wagonGroup: WagonGroup): void {
        this.enableForm = false;
        this.isNewRecord = false;
        this.editedWagonGroup = {
            groupId: wagonGroup.groupId,
            groupName: wagonGroup.groupName
        };
    }

    // отмена редактирования
    cancel(): void {
        // если отмена при добавлении, удаляем последнюю запись
        if (this.isNewRecord) {
            this.wagonGroupList.pop();
            this.isNewRecord = false;
        }
        this.editedWagonGroup = null;
        this.enableForm = true;
    }

    // сохраняем
    save(): void {
        if (this.isNewRecord) {
            // добавляем
            this.createSub = this.wagonGroupService.create(this.editedWagonGroup).subscribe((data) => {
                this.editedWagonGroup.groupId = data.groupId;
            }, () => {
                this.wagonGroupList.pop();
                this.alert.danger('Ошибка при создании группы вагонов, возможно группа с таким наименованием уже существует');
            }, () => {
                this.alert.success('Группа вагонов создана');
                this.editedWagonGroup = null;
            });
            this.isNewRecord = false;
            this.enableForm = true;
        } else {
            // изменяем
            this.updateSub = this.wagonGroupService.update(this.editedWagonGroup).subscribe((data) => {
                this.wagonGroupList.map(wagonGroup => {
                    if (wagonGroup.groupId === this.editedWagonGroup.groupId) {
                        wagonGroup.groupName = this.editedWagonGroup.groupName;
                    }
                });
            }, () => {
                this.alert.danger('Ошибка');
            }, () => {
                this.alert.success('Группа вагонов сохранена');
                this.editedWagonGroup = null;
                this.enableForm = true;
            });
        }
    }

    delete(): void {
        this.delSub = this.wagonGroupService.delete(this.wagonGroupIdToDelete).subscribe((data) => {
            this.wagonGroupList = this.wagonGroupList.filter(wagonGroup => wagonGroup.groupId !== this.wagonGroupIdToDelete);
            this.unsetDelete();
        }, () => {
            this.alert.danger('Ошибка при удалении группы вагона');
        }, () => {
            this.alert.success('Группа вагона удалена');
        });
    }

    setDelete(wagonGroupId: number): void {
        this.wagonGroupIdToDelete = wagonGroupId;
    }

    unsetDelete(): void {
        this.wagonGroupIdToDelete = null;
    }

    getById(wagonGroupId: number): number {
        if (wagonGroupId) {
            return this.wagonGroupList.find(value => value.groupId === wagonGroupId).groupId;
        }
        return 0;
    }


    ngOnDestroy(): void {
        this.utils.unsubscribe([
            this.wagonGroupListSub,
            this.createSub,
            this.updateSub,
            this.delSub
        ]);
    }
}
