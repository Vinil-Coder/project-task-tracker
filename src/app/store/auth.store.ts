import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import AuthService from "../core/services/auth.service";
import { inject } from "@angular/core";
import LocalStorageService from "../core/services/localstorage.service";
import { Router } from "@angular/router";
import { AuthState, LoginInterface, RegisterInterface } from "../core/interfaces/auth.interface";
import { LoaderService } from "../core/services/loading.service";


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
        const loader = inject(LoaderService);
        return {
            login(payload: LoginInterface): void {
                patchState(store, { error: null });
                loader.startLoader();
                auth.login(payload).subscribe({
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
                    },
                    error: (err: any) => {
                        patchState(store, {
                            error: err.error.message,
                        });
                        loader.stopLoader();
                    },
                    complete: () => {
                        loader.stopLoader();
                    }
                });
            },
            register(payload: RegisterInterface): void {
                patchState(store, { error: null });
                loader.startLoader();
                auth.register(payload).subscribe({
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
                    },
                    error: (err: any) => {
                        patchState(store, {
                            error: err.error.message
                        });
                        loader.stopLoader();
                    },
                    complete: () => {
                        loader.stopLoader();
                    }
                })
            },
            logout(): void {
                patchState(store, { error: null });
                loader.startLoader();
                auth.logout().subscribe({
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
                    },
                    error: (err: any) => {
                        patchState(store, {
                            error: err.message
                        });
                        loader.stopLoader();
                    },
                    complete: () => {
                        loader.stopLoader();
                    }
                });
            }

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