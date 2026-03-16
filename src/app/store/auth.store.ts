import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import AuthService from "../core/services/auth.service";
import { inject } from "@angular/core";
import LocalStorageService from "../core/services/localstorage.service";
import { Router } from "@angular/router";
import { AuthState, LoginInterface, RegisterInterface } from "../core/interfaces/auth.interface";
import { AppUiStateService, ToastrType } from "../core/services/app-ui-state.service";
import { delay } from "rxjs";


export const AuthStore = signalStore(
    { providedIn: 'root' },

    withState<AuthState>({
        error: null,
        loggedIn: false,
        user: null,
        accessToken: null,
        refreshToken: null,
    }),
    withMethods((store) => {
        const auth = inject(AuthService);
        const localstorage = inject(LocalStorageService)
        const router = inject(Router)
        const app = inject(AppUiStateService);

        const login = (payload: LoginInterface): void => {

            patchState(store, { error: null });
            app.startLoader();

            auth.login(payload).pipe(delay(1000)).subscribe({
                next: (res) => {
                    patchState(store, {
                        error: null,
                        loggedIn: true,
                        user: res.user,
                        accessToken: res.accessToken,
                        refreshToken: res.refreshToken
                    })
                    localstorage.setItem("loggedIn", res.loggedIn)
                    localstorage.setItem("accessToken", res.accessToken);
                    localstorage.setItem("refreshToken", res.refreshToken);
                    localstorage.setItem("user", res.user);
                    app.showToastr('Logged in successfully.')
                    router.navigateByUrl('');
                },
                error: (err: any) => {
                    patchState(store, {
                        error: err.error.message,
                    });
                    app.stopLoader()
                    app.showToastr(err.error.message, ToastrType.ERROR);
                },
                complete: () => app.stopLoader()
            });
        }

        const register = (payload: RegisterInterface): void => {

            patchState(store, { error: null });
            app.startLoader();

            auth.register(payload).pipe(delay(1000)).subscribe({
                next: (res) => {
                    patchState(store, {
                        error: null,
                        loggedIn: true,
                        user: res.user,
                        accessToken: res.accessToken,
                        refreshToken: res.refreshToken
                    })
                    localstorage.setItem("loggedIn", res.loggedIn)
                    localstorage.setItem("accessToken", res.accessToken);
                    localstorage.setItem("refreshToken", res.refreshToken);
                    localstorage.setItem("user", res.user);
                    router.navigateByUrl('');
                    app.showToastr('Registered successfully.')
                },
                error: (err: any) => {
                    patchState(store, {
                        error: err.error.message
                    });
                    app.stopLoader()
                    app.showToastr(err.error.message, ToastrType.ERROR);
                },
                complete: () => app.stopLoader()
            })
        }

        const logout = (): void => {

            patchState(store, { error: null });
            app.startLoader();

            auth.logout().pipe(delay(1000)).subscribe({
                next: (res) => {
                    patchState(store, {
                        loggedIn: false,
                        error: null,
                        user: null,
                        accessToken: null,
                        refreshToken: null
                    })
                    localstorage.clearAllItems();
                    router.navigateByUrl('/landing');
                    app.showToastr('Logged out successfully.')
                },
                error: (err: any) => {
                    patchState(store, {
                        error: err.message
                    });
                    app.stopLoader()
                    app.showToastr(err.error.message, ToastrType.ERROR);
                },
                complete: () => app.stopLoader()
            });
        }

        return {
            login,
            register,
            logout
        };
    }),
    withHooks((store) => ({
        onInit() {
            const localstorage = inject(LocalStorageService);

            const accessToken = localstorage.getItem("accessToken");
            const refreshToken = localstorage.getItem("refreshToken");
            const userDetails = localstorage.getItem("user");
            const loggedIn = localstorage.getItem("loggedIn");

            patchState(store, {
                loggedIn: loggedIn,
                user: userDetails,
                accessToken,
                refreshToken
            })

            console.log("Auth hook is initialized");
        }
    }))
)