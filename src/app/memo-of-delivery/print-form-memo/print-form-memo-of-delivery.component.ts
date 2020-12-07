import {Component, OnDestroy, OnInit} from '@angular/core';
import {MemoOfDeliveryService} from '../memo-of-delivery.service';
import {DeliveryOfWagon, MemoOfDelivery} from '../../shared/interfaces';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {UtilsService} from '../../shared/service/utils.service';

@Component({
    selector: 'app-print-form-memo-of-delivery',
    templateUrl: './print-form-memo-of-delivery.component.html',
    styleUrls: ['./print-form-memo-of-delivery.component.scss']
})
export class PrintFormMemoOfDeliveryComponent implements OnInit, OnDestroy {

    memoOfDeliveryId: number;
    memoOfDelivery: MemoOfDelivery;
    private memoSub: Subscription;
    deliveryList: DeliveryOfWagon[] = [];
    pages: number[];
    rowsOnPage = 30;

    constructor(
        private route: ActivatedRoute,
        private utils: UtilsService,
        private memoOfDeliveryService: MemoOfDeliveryService
    ) {
    }

    ngOnInit(): void {
        this.memoSub = this.route.params.pipe(
            switchMap((params: Params) => {
                if (params['memoOfDeliveryId']) {
                    this.memoOfDeliveryId = params['memoOfDeliveryId'];
                    return this.memoOfDeliveryService.getById(params['memoOfDeliveryId']);
                }
            }))
            .subscribe(memo => {
                this.memoOfDelivery = memo;
                this.deliveryList = memo.deliveryOfWagonList;
                const count = Math.ceil(this.deliveryList.length / this.rowsOnPage);
                this.pages = Array.from({length: count}, (v, k) => k++);
            }, error => {
                throwError(error);
            });
    }

    print(): void {
        window.print();
    }

    ngOnDestroy(): void {
        this.utils.unsubscribe([
            this.memoSub
        ]);
    }
}
