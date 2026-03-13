
export interface Task {
    title: string,
    description: string;
    priority: string,
    status: string;
    startDate: string;
    endDate: string;
}

export interface TableSchema {
    cols: string[];
    rows: Task[];
}

export interface TaskState {
    error: string | null;
    tasks: Task[];
    tableData: TableSchema
}