import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import AuthService from "../core/services/auth.service";
import { inject } from "@angular/core";
import LocalStorageService from "../core/services/localstorage.service";
import { Router } from "@angular/router";
import { AuthState, LoginInterface, RegisterInterface } from "../core/interfaces/auth.interface";


export const AuthStore = signalStore(
    { providedIn: 'root' },

    withState<AuthState>({
        isLoading: false,
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

        return {
            login(payload: LoginInterface): void {
                patchState(store, { isLoading: true, error: null });

                auth.login(payload).subscribe({
                    next: (res) => {
                        patchState(store, {
                            isLoading: false,
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
                            isLoading: false,
                            error: err.error.message,
                        });
                    }
                });
            },
            register(payload: RegisterInterface): void {
                patchState(store, { isLoading: true,error: null });
                auth.register(payload).subscribe({
                    next: (res) => {
                        patchState(store, {
                            isLoading: false,
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
                            isLoading: false,
                            error: err.error.message
                        });
                    }
                })
            },
            logout(): void {
                patchState(store, { isLoading: true, error: null });

                auth.logout().subscribe({
                    next: (res) => {
                        patchState(store, {
                            isLoading: false,
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
                            isLoading: false,
                            error: err.message
                        });
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