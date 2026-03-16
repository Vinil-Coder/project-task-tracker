import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { inject } from "@angular/core";
import { AppUiStateService, ToastrType } from "../core/services/app-ui-state.service";
import { delay } from "rxjs";
import TaskService from "../core/services/task.service";
import { TaskModel, TaskState } from "../core/interfaces/task.interface";
import LocalStorageService from "../core/services/localstorage.service";

export const TaskStore = signalStore(
    { providedIn: 'root' },

    withState<TaskState>({
        error: null,
        tasks: [],
        tableData: {
            rows: [],
            cols: ['Title', 'Description', 'Priority', 'Status', 'Start Date', 'End Date']
        }
    }),
    withComputed((store) => {
        return {
            total: () => store.tasks().length ?? 0,
            initiated: () => store.tasks()?.filter((task) => task.status === 'Initiated').length ?? 0,
            inprogess: () => store.tasks()?.filter((task) => task.status === 'In Progress').length ?? 0,
            completed: () => store.tasks()?.filter((task) => task.status === 'Completed').length ?? 0,
            expired: () => store.tasks()?.filter((task) => task.status === 'Expired').length ?? 0,
            lowPriority: () => store.tasks()?.filter((task) => task.priority === 'Low').length ?? 0,
            mediumPriority: () => store.tasks()?.filter((task) => task.priority === 'Medium').length ?? 0,
            highPriority: () => store.tasks()?.filter((task) => task.priority === 'High').length ?? 0,
            criticalPriority: () => store.tasks()?.filter((task) => task.priority === 'Critical').length ?? 0
        }
    }),
    withMethods((store) => {

        const task = inject(TaskService);
        const app = inject(AppUiStateService);

        const getTasks = (): void => {

            patchState(store, { error: null });
            app.startLoader();

            task.getTasks().subscribe({
                next: (res) => {
                    patchState(store, {
                        tasks: res,
                        tableData: {
                            rows: res,
                            cols: store.tableData.cols()
                        }
                    });
                    app.showToastr('Tasks fetched successfully');
                },
                error: (err: any) => {
                    patchState(store, { error: err.error.message });
                    app.stopLoader();
                    app.showToastr(err.error.message, ToastrType.ERROR);
                },
                complete: () => app.stopLoader()
            });

        };

        const addTask = (payload: TaskModel, onSuccess: () => void): void => {

            patchState(store, { error: null });
            app.startLoader();

            task.addTask(payload).pipe(delay(3000)).subscribe({

                next: () => {

                    app.showToastr('Task added successfully');

                    getTasks();

                    onSuccess();

                },

                error: (err: any) => {
                    patchState(store, { error: err.error.message });
                    app.stopLoader();
                    app.showToastr(err.error.message, ToastrType.ERROR);
                },

                complete: () => app.stopLoader()

            });

        };

        const updateTask = (payload: TaskModel, onSuccess: () => void): void => {

            patchState(store, { error: null });
            app.startLoader();

            task.updateTask(payload).pipe(delay(3000)).subscribe({

                next: () => {

                    app.showToastr('Task updated successfully');

                    getTasks();

                    onSuccess();

                },

                error: (err: any) => {
                    patchState(store, { error: err.error.message });
                    app.stopLoader();
                    app.showToastr(err.error.message, ToastrType.ERROR);
                },

                complete: () => app.stopLoader()

            });

        };

        const deleteTask = (payload: TaskModel, onSuccess: () => void): void => {

            patchState(store, { error: null });
            app.startLoader();

            task.deleteTask(payload).pipe(delay(3000)).subscribe({

                next: () => {

                    app.showToastr('Task deleted successfully');

                    getTasks();

                    onSuccess();

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
            getTasks,
            addTask,
            updateTask,
            deleteTask
        };

    }),
    withHooks((store) => ({
        onInit() {
            const localstorage = inject(LocalStorageService);

            const accessToken = localstorage.getItem("accessToken");
            const refreshToken = localstorage.getItem("refreshToken");
            const loggedIn = localstorage.getItem("loggedIn");

            if (accessToken && refreshToken && loggedIn) {
                store.getTasks();
            }
            console.log("Task hook is initialized");
        }
    }))
)