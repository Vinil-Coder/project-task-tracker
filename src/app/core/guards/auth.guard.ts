import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import LocalStorageService from "../services/localstorage.service";

export const AuthGuard: CanActivateFn = () => {

    const localStorage = inject(LocalStorageService);
    const router = inject(Router)

    if (!localStorage.getItem('accessToken')) {
        router.navigateByUrl('/landing');
        return false;
    }

    return true;
}