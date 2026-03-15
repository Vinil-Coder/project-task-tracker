import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ProjectInterface } from "../interfaces/project.interface";

@Injectable({
    providedIn: 'root'
})
export default class ProjectService {

    private readonly API = `${environment.base_api}projects/`;

    constructor(private http: HttpClient) { }

    getProjects(): Observable<any> {
        return this.http.get(`${this.API}`);
    }

    addProject(payload: ProjectInterface): Observable<any> {
        return this.http.post(`${this.API}`, payload);
    }

    updateProject(payload: ProjectInterface): Observable<any> {
        return this.http.put(`${this.API}id/${payload.id}`, payload);
    }

    deleteProject(payload: ProjectInterface): Observable<any> {
        return this.http.delete(`${this.API}id/${payload.id}`);
    }
}