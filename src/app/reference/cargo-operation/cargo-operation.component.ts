// import {Component, OnDestroy, OnInit} from '@angular/core';
// import {environment} from '../../../environments/environment';
// import {HttpClient} from '@angular/common/http';
// import {CargoOperation} from '../../shared/interfaces';
// import {Observable} from 'rxjs';
//
// @Component({
//   selector: 'app-cargo-operation',
//   // template: '{{ operations | async }}'
//   template: `<select class="custom-select custom-select-sm" id="cargoOperation" formControlName="cargoOperation"
//                      app-cargo-operation>
//     <option *ngFor="let operation of operations | async" value="{{ operation.operationName }}">{{ operation.operationName }}</option>
//   </select>`
//   // <p>{{operations.name | async}} : {{operations.value | async}}</p>`
// })
// export class CargoOperationComponent {
//
//   operations: Observable<Array<CargoOperation>>;
//
//   constructor(private httpClient: HttpClient) {
//     this.operations = httpClient.get<Array<CargoOperation>>(`${environment.dbUrl}/api/cargo-operation.json`);
//   }
//
// }
