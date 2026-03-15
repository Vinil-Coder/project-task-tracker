
export interface ProjectInterface {
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
    rows: ProjectInterface[];
}

export interface ProjectState {
    error: string | null;
    projects: ProjectInterface[];
    tableData: TableSchema
}