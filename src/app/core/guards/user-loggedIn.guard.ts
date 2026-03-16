import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import LocalStorageService from "../services/localstorage.service";

export const UserNotLoggedInGuard: CanActivateFn = () => {

    const localStorage = inject(LocalStorageService);
    const router = inject(Router)

    const isLoggedIn = localStorage.getItem('loggedIn');

    if (isLoggedIn) {
        router.navigateByUrl('/dashboard');
        return true;
    }

    return true;
}