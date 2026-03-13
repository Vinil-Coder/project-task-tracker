import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { inject } from "@angular/core";
import { LoaderService } from "../core/services/loading.service";
import { TaskState } from "../core/interfaces/task.interface";
import TaskService from "../core/services/task.service";

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
    withMethods((store) => {
        const project = inject(TaskService);
        const loader = inject(LoaderService);
        return {
            getTasks(): void {
                patchState(store, { error: null });
                loader.startLoader();
                setTimeout(() => {
                    project.getTasks().subscribe({
                        next: (res) => {
                            patchState(store, {
                                error: null,
                                tasks: res,
                                tableData: {
                                    rows: res,
                                    cols: store.tableData.cols()
                                }
                            })
                        },
                        error: (err: any) => {
                            patchState(store, {
                                error: err.error.message
                            });
                        },
                        complete: () => {
                            loader.stopLoader();
                        }
                    })
                }, 1000)
            }
        }
    }),
    withHooks(() => ({
        onInit() {
            console.log("Task hook is initialized");
        }
    }))
)