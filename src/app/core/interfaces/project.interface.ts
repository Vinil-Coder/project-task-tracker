
export interface Project {
    title: string,
    description: string;
    priority: string,
    status: string;
    startDate: string;
    endDate: string;
}

export interface TableSchema {
    cols: string[];
    rows: Project[];
}

export interface ProjectState {
    error: string | null;
    projects: Project[];
    tableData: TableSchema
}