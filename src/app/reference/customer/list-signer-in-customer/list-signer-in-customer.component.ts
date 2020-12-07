import {Component, Input, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Signer} from '../../../shared/interfaces';
import {CustomerService} from '../../service/customer.service';
import {AlertService} from '../../../shared/service/alert.service';
import {SignerService} from '../../service/signer.service';
import {UtilsService} from '../../../shared/service/utils.service';

@Component({
    selector: 'app-signer-in-customer',
    templateUrl: './list-signer-in-customer.component.html',
    styleUrls: ['./list-signer-in-customer.component.scss']
})
export class ListSignerInCustomerComponent implements OnDestroy {

    @ViewChild('readTemplate', {static: false}) readTemplate: TemplateRef<any>;
    @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

    @Input() signers: Signer[];
    @Input() customerId: number;

    signerIdToDelete: number;
    editedSigner: Signer;
    enableForm = true;
    isNewRecord: boolean;

    private createSub: Subscription;
    private updateSub: Subscription;
    private delSub: Subscription;

    constructor(private customerService: CustomerService,
                private signerService: SignerService,
                private router: Router,
                private alert: AlertService,
                private utils: UtilsService
    ) {
    }

    // загружаем один из двух шаблонов
    loadTemplate(signer: Signer): TemplateRef<any> {
        if (this.editedSigner && this.editedSigner.signerId === signer.signerId) {
            return this.editTemplate;
        } else {
            return this.readTemplate;
        }
    }

    // добавление пользователя
    addNew(): void {
        this.editedSigner = {
            signerId: 0,
            firstName: '',
            middleName: '',
            lastName: '',
            customerId: this.customerId,
        };
        this.signers.push(this.editedSigner);
        this.isNewRecord = true;
        this.enableForm = false;
    }

    // редактирование пользователя
    editSigner(signer: Signer): void {
        this.isNewRecord = false;
        this.editedSigner = {
            signerId: signer.signerId,
            firstName: signer.firstName,
            middleName: signer.middleName,
            lastName: signer.lastName,
            customerId: signer.customerId
        };
        this.enableForm = false;
    }

    // отмена редактирования
    cancel(): void {
        // если отмена при добавлении, удаляем последнюю запись
        if (this.isNewRecord) {
            this.signers.pop();
            this.isNewRecord = false;
        }
        this.editedSigner = null;
        this.enableForm = true;
    }

    // сохраняем пользователя
    save(): void {
        if (this.isNewRecord) {
            // добавляем пользователя
            this.createSub = this.signerService.create(this.editedSigner).subscribe((data) => {
                this.editedSigner.signerId = data.signerId;
                this.alert.success('Подписант создан');
            }, () => {
                this.alert.danger('Ошибка при создании');
            }, () => {
                this.editedSigner = null;
            });
            this.isNewRecord = false;
            this.enableForm = true;
        } else {
            // изменяем пользователя
            this.updateSub = this.signerService.update(this.editedSigner).subscribe((data) => {
                this.signers.map(signer => {
                    if (signer.signerId === this.editedSigner.signerId) {
                        signer.lastName = data.lastName;
                        signer.firstName = data.firstName;
                        signer.middleName = data.middleName;
                    }
                });
                this.alert.success('Подписант сохранен');
            }, () => {
                this.alert.danger('Ошибка при сохранении');
            }, () => {
                this.editedSigner = null;
            });
            this.enableForm = true;
        }
    }

    delete(): void {
        this.delSub = this.signerService.delete(this.signerIdToDelete).subscribe((data) => {
            this.alert.success(data.message);
            this.signers = this.signers.filter(signer => signer.signerId !== this.signerIdToDelete);
            this.unsetDelete();
        }, () => {
            this.alert.danger('Ошибка при удалении');
        }, () => {
            this.alert.success('Подписант удален');
        });
    }

    setDelete(signerId: number): void {
        this.signerIdToDelete = signerId;
    }

    unsetDelete(): void {
        this.signerIdToDelete = null;
    }

    getById(signerId: number): string {
        if (signerId != null) {
            return this.signers.find(value => value.signerId === signerId).lastName;
        }
        return '';
    }

    ngOnDestroy(): void {
        this.utils.unsubscribe([
            this.createSub,
            this.updateSub,
            this.delSub
        ]);
    }
}
