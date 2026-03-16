import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { ProjectModel, ProjectState } from "../core/interfaces/project.interface";
import { inject } from "@angular/core";
import ProjectService from "../core/services/project.service";
import { AppUiStateService, ToastrType } from "../core/services/app-ui-state.service";
import { delay } from "rxjs";
import LocalStorageService from "../core/services/localstorage.service";

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
    withComputed((store) => {
        return {
            total: () => store.projects().length ?? 0,
            initiated: () => store.projects()?.filter((project) => project.status === 'Initiated').length ?? 0,
            inprogess: () => store.projects()?.filter((project) => project.status === 'In Progress').length ?? 0,
            completed: () => store.projects()?.filter((project) => project.status === 'Completed').length ?? 0,
            expired: () => store.projects()?.filter((project) => project.status === 'Expired').length ?? 0,
            lowPriority: () => store.projects()?.filter((project) => project.priority === 'Low').length ?? 0,
            mediumPriority: () => store.projects()?.filter((project) => project.priority === 'Medium').length ?? 0,
            highPriority: () => store.projects()?.filter((project) => project.priority === 'High').length ?? 0,
            criticalPriority: () => store.projects()?.filter((project) => project.priority === 'Critical').length ?? 0
        }
    }),
    withMethods((store) => {

        const project = inject(ProjectService);
        const app = inject(AppUiStateService);

        const getProjects = (): void => {

            patchState(store, { error: null });
            app.startLoader();

            project.getProjects().pipe(delay(1000)).subscribe({
                next: (res) => {
                    patchState(store, {
                        projects: res,
                        tableData: {
                            rows: res,
                            cols: store.tableData.cols()
                        }
                    });
                    app.showToastr('Projects fetched successfully');
                },
                error: (err: any) => {
                    patchState(store, { error: err.error.message });
                    app.stopLoader();
                    app.showToastr(err.error.message, ToastrType.ERROR);
                },
                complete: () => app.stopLoader()
            });

        };

        const addProject = (payload: ProjectModel, onSuccess: () => void): void => {

            patchState(store, { error: null });
            app.startLoader();

            project.addProject(payload).pipe(delay(1000)).subscribe({

                next: () => {

                    app.showToastr('Project added successfully');

                    getProjects();
                    
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

        const updateProject = (payload: ProjectModel, onSuccess: () => void): void => {

            patchState(store, { error: null });
            app.startLoader();

            project.updateProject(payload).pipe(delay(1000)).subscribe({

                next: () => {

                    app.showToastr('Project updated successfully');

                    getProjects();

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

        const deleteProject = (payload: ProjectModel, onSuccess: () => void): void => {

            patchState(store, { error: null });
            app.startLoader();

            project.deleteProject(payload).pipe(delay(1000)).subscribe({

                next: () => {

                    app.showToastr('Project deleted successfully');

                    getProjects();

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
            getProjects,
            addProject,
            updateProject,
            deleteProject
        };

    }),
    withHooks((store) => ({
        onInit() {
            const localstorage = inject(LocalStorageService);

            const accessToken = localstorage.getItem("accessToken");
            const refreshToken = localstorage.getItem("refreshToken");
            const loggedIn = localstorage.getItem("loggedIn");

            if (accessToken && refreshToken && loggedIn) {
                store.getProjects();
            }
            console.log("Project hook is initialized");
        }
    }))
)