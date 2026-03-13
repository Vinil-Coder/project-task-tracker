import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { ProjectState } from "../core/interfaces/project.interface";
import { inject } from "@angular/core";
import ProjectService from "../core/services/project.service";
import { LoaderService } from "../core/services/loading.service";

export const ProjectStore = signalStore(
    { providedIn: 'root' },
    
    withState<ProjectState>({
        error: null,
        projects: [],
        tableData: {
            rows: [],
            cols: ['Title', 'Description', 'Priority', 'Status', 'Start Date', 'End Date']
        }
    }),
    withMethods((store) => {
        const project = inject(ProjectService);
        const loader = inject(LoaderService);
        return {
            getProjects(): void {
                patchState(store, { error: null });
                loader.startLoader();
                setTimeout(() => {
                    project.getProjects().subscribe({
                        next: (res) => {
                            patchState(store, {
                                error: null,
                                projects: res,
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
            console.log("Project hook is initialized");
        }
    }))
)