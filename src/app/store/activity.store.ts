import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { inject } from "@angular/core";
import { AppUiStateService, ToastrType } from "../core/services/app-ui-state.service";
import { delay, map, takeLast } from "rxjs";
import LocalStorageService from "../core/services/localstorage.service";
import { ActivityState } from "../core/interfaces/activity.interface";
import ActivityService from "../core/services/activity.service";

export const ActivityStore = signalStore(
    { providedIn: 'root' },

    withState<ActivityState>({
        error: null,
        activities: []
    }),
    withMethods((store) => {

        const activity = inject(ActivityService);
        const app = inject(AppUiStateService);

        const getActivities = (): void => {

            patchState(store, { error: null });
            app.startLoader();

            activity.getActivities().pipe(
                delay(1000),
                map((res) => res.slice(-4))
            ).subscribe({
                next: (res) => {
                    patchState(store, {
                        activities: res
                    });
                    console.log(res);
                    app.showToastr('Activities fetched successfully');
                },
                error: (err: any) => {
                    patchState(store, { error: err.error.message });
                    app.stopLoader();
                    app.showToastr(err.error.message, ToastrType.ERROR);
                },
                complete: () => app.stopLoader()
            });

        };

        return {
            getActivities
        };

    }),
    withHooks((store) => ({
        onInit() {
            const localstorage = inject(LocalStorageService);

            const accessToken = localstorage.getItem("accessToken");
            const refreshToken = localstorage.getItem("refreshToken");
            const loggedIn = localstorage.getItem("loggedIn");

            if (accessToken && refreshToken && loggedIn) {
                store.getActivities();
            }
            console.log("Activities hook is initialized");
        }
    }))
)