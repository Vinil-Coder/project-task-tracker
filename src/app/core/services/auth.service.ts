import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoginInterface, RegisterInterface } from "../interfaces/auth.interface";

@Injectable({
    providedIn: 'root'
})
export default class AuthService {

    private readonly API = `${environment.base_api}auth/`;

    constructor(private http: HttpClient) {}

    login(payload: LoginInterface): Observable<any> {
        return this.http.post(`${this.API}login`, payload);
    }

    register(payload: RegisterInterface): Observable<any> {
        return this.http.post(`${this.API}register`, payload);
    }

    logout(): Observable<any> {
        return this.http.get(`${this.API}logout`);
    }
}