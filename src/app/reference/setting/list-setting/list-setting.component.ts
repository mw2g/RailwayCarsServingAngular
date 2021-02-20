import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {Setting} from '../../../shared/interfaces';
import {UtilsService} from '../../../shared/service/utils.service';
import {SettingService} from '../../service/setting.service';

@Component({
    selector: 'app-list-setting',
    templateUrl: './list-setting.component.html',
    styleUrls: ['./list-setting.component.scss']
})
export class ListSettingComponent implements OnInit, OnDestroy {

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
    @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

    editedSetting: Setting;
    settings: Setting[];
    enableForm = true;
    private settingListSub: Subscription;
    private updateSub: Subscription;

    constructor(private settingService: SettingService,
                private router: Router,
                private alert: AlertService,
                private utils: UtilsService
    ) {
    }

    ngOnInit(): void {
        this.settingListSub = this.settingService.getAll().subscribe(settings => {
            this.settings = settings;
        }, error => {
            throwError(error);
        });
    }

    // загружаем один из двух шаблонов
    loadTemplate(setting: Setting): TemplateRef<any> {
        if (this.editedSetting && this.editedSetting.settingId === setting.settingId) {
            return this.editTemplate;
        } else {
            return this.readOnlyTemplate;
        }
    }

    // редактирование
    edit(setting: Setting): void {
        this.editedSetting = {
            settingId: setting.settingId,
            settingType: setting.settingType,
            settingValue: setting.settingValue
        };
    }

    // отмена редактирования
    cancel(): void {
        this.editedSetting = null;
    }

    // сохраняем
    save(): void {
        // изменяем
        this.updateSub = this.settingService.update(this.editedSetting).subscribe((data) => {
            this.settings.map(setting => {
                if (setting.settingId === this.editedSetting.settingId) {
                    setting.settingType = this.editedSetting.settingType;
                    setting.settingValue = this.editedSetting.settingValue;
                }
            });
        }, () => {
            this.alert.danger('Ошибка');
        }, () => {
            this.alert.success('Cохранено');
            this.editedSetting = null;
        });
    }

    ngOnDestroy(): void {
        this.utils.unsubscribe([
            this.settingListSub,
            this.updateSub,
        ]);
    }
}
