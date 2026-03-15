import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { TaskModel } from "../interfaces/task.interface";

@Injectable({
    providedIn: 'root'
})
export default class TaskService {

    private readonly API = `${environment.base_api}tasks/`;

    constructor(private http: HttpClient) { }

    getTasks(): Observable<any> {
        return this.http.get(`${this.API}`);
    }

    addTask(payload: TaskModel): Observable<any> {
        return this.http.post(`${this.API}`, payload);
    }

    updateTask(payload: TaskModel): Observable<any> {
        return this.http.put(`${this.API}id/${payload.id}`, payload);
    }

    deleteTask(payload: TaskModel): Observable<any> {
        return this.http.delete(`${this.API}id/${payload.id}`);
    }
}