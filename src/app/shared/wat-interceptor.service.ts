// import {Injectable} from '@angular/core';
// import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
// import {Observable, throwError} from 'rxjs';
// import {tap} from 'rxjs/operators';
// import {LoginResponsePayload} from '../admin/login-page/login-response.payload';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class WaitInterceptor implements HttpInterceptor {
//
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//
//     // return next.handle(req).pipe(evt => {
//     //   if (evt instanceof HttpResponse) {
//     //     console.log('---> status:', evt.status);
//     //     console.log('---> filter:', req.params.get('filter'));
//     //   }
//     // });
//     if (req.url.indexOf('base-rate-and-penalty') !== -1) {
//       return next.handle(req).pipe(tap(response => {
//         const resp: HttpResponse<LoginResponsePayload> = response as HttpResponse<LoginResponsePayload>;
//         if (resp instanceof HttpResponse) {
//           console.log('---> status:', resp.status);
//           // console.log('---> filter:', req.params.get('filter'));
//           // console.log(resp.body.authenticationToken);
//           // console.log('authenticationToken is ' + resp.body.authenticationToken);
//         }
//       }));
//     }
//     return next.handle(req);
//   }
// }
