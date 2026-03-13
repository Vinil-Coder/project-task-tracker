import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import LocalStorageService from "../services/localstorage.service";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
   
    const localstorage = inject(LocalStorageService);

    const accessToken = localstorage.getItem('accessToken');

    if (accessToken) {

        const clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return next(clonedReq)
    }

    return next(req);
}