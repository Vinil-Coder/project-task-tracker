import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export default class TaskService {

    private readonly API = `${environment.base_api}tasks/`;

    constructor(private http: HttpClient) { }

    getTasks(): Observable<any> {
        return this.http.get(`${this.API}`);
    }
}