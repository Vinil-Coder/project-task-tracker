import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { ProjectInterface, ProjectState } from "../core/interfaces/project.interface";
import { inject } from "@angular/core";
import ProjectService from "../core/services/project.service";
import { LoaderService } from "../core/services/loading.service";
import { delay } from "rxjs";

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
            inprogess:() => store.projects()?.filter((project) => project.status === 'In Progress').length ?? 0,
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
        const loader = inject(LoaderService);

        const getProjects = (): void => {

            patchState(store, { error: null });
            loader.startLoader();

            project.getProjects().subscribe({
                next: (res) => {
                    patchState(store, {
                        projects: res,
                        tableData: {
                            rows: res,
                            cols: store.tableData.cols()
                        }
                    });
                },
                error: (err: any) => {
                    patchState(store, { error: err.error.message });
                },
                complete: () => loader.stopLoader()
            });

        };

        const addProject = (payload: ProjectInterface, onSuccess: () => void): void => {

            patchState(store, { error: null });
            loader.startLoader();

            project.addProject(payload).pipe(delay(3000)).subscribe({

                next: () => {

                    getProjects();

                    onSuccess();

                },

                error: (err: any) => {
                    patchState(store, { error: err.error.message });
                },

                complete: () => loader.stopLoader()

            });

        };

        const updateProject = (payload: ProjectInterface, onSuccess: () => void): void => {
        
            patchState(store, { error: null });
            loader.startLoader();

            project.updateProject(payload).pipe(delay(3000)).subscribe({

                next: () => {

                    getProjects();

                    onSuccess();

                },

                error: (err: any) => {
                    patchState(store, { error: err.error.message });
                },

                complete: () => loader.stopLoader()

            });

        };

        const deleteProject = (payload: ProjectInterface, onSuccess: () => void): void => {

            patchState(store, { error: null });
            loader.startLoader();

            project.deleteProject(payload).pipe(delay(3000)).subscribe({

                next: () => {

                    getProjects();

                    onSuccess();

                },

                error: (err: any) => {
                    patchState(store, { error: err.error.message });
                },

                complete: () => loader.stopLoader()

            });

        };

        return {
            getProjects,
            addProject,
            updateProject,
            deleteProject
        };

    }),
    withHooks(() => ({
        onInit() {
            console.log("Project hook is initialized");
        }
    }))
)