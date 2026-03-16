
export interface ActivityModel {
    _id: string,
    user_id: number,
    project_id: number,
    task_id: number;
    message: string;
    endDate: string;
    timestamp: Date;
}

export interface ActivityState {
    error: string | null;
    activities: ActivityModel[];
}