
export interface ProjectModel {
    id?: string,
    title: string,
    description: string;
    priority: string,
    status: string;
    startDate: string;
    endDate: string;
}

export interface TableSchema {
    cols: string[];
    rows: ProjectModel[];
}

export interface ProjectState {
    error: string | null;
    projects: ProjectModel[];
    tableData: TableSchema,
}