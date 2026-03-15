
export interface TaskModel {
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
    rows: TaskModel[];
}

export interface TaskState {
    error: string | null;
    tasks: TaskModel[];
    tableData: TableSchema
}
