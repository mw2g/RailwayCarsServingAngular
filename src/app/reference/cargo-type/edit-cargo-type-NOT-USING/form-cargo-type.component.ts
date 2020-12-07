import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CargoType, Signer} from '../../../shared/interfaces';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {switchMap} from 'rxjs/operators';
import {UtilsService} from '../../../shared/service/utils.service';
import {CargoTypeService} from '../../service/cargo-type.service';

@Component({
    selector: 'app-form-customer-of-wagon',
    templateUrl: './form-cargo-type.component.html',
    styleUrls: ['./form-cargo-type.component.scss']
})
export class FormCargoTypeComponent implements OnInit, OnDestroy {

    form: FormGroup;
    cargoType: CargoType;
    typeId: number;
    signers: Signer[];

    uSub: Subscription;
    cSub: Subscription;
    iSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private cargoTypeService: CargoTypeService,
        public router: Router,
        private alert: AlertService,
        private utils: UtilsService
    ) {
    }

    ngOnInit(): void {
        this.iSub = this.route.params.pipe(
            switchMap((params: Params) => {
                if (params.typeId) {
                    this.typeId = params.typeId;
                    return this.cargoTypeService.getById(params.typeId);
                } else {
                    this.initEmptyForm();
                    return new Observable<CargoType>();
                }
            })
        ).subscribe((type: CargoType) => {
            this.cargoType = type;
            this.form = new FormGroup({
                typeId: new FormControl(type.typeId),
                type: new FormControl(type.typeName, Validators.required),
            });
        });
    }

    initEmptyForm(): void {
        this.form = new FormGroup({
            type: new FormControl('', Validators.required),
        });
    }

    update(): void {
        if (this.form.invalid) {
            this.alert.warning('Форма невалидна');
            this.utils.markFormGroupTouched(this.form);
            return;
        }
        this.uSub = this.cargoTypeService.update({
            ...this.cargoType,
            typeName: this.form.value.type
        }).subscribe((data) => {
            this.alert.success(data.message);
        }, () => {
            this.alert.danger('Ошибка');
        });
    }

    create(): void {
        if (this.form.invalid) {
            this.alert.warning('Форма невалидна');
            this.utils.markFormGroupTouched(this.form);
            return;
        }
        this.cSub = this.cargoTypeService.create({
            typeName: this.form.value.type
        }).subscribe((data) => {
            this.typeId = data.typeId;
            this.form.addControl('typeId', new FormControl(data.typeId));
            this.alert.success('Вид груза создан');
        }, () => {
            this.alert.danger('Ошибка');
        });
    }

    ngOnDestroy(): void {
        if (this.iSub) {
            this.iSub.unsubscribe();
        }
        if (this.cSub) {
            this.cSub.unsubscribe();
        }
        if (this.uSub) {
            this.uSub.unsubscribe();
        }
    }
}
