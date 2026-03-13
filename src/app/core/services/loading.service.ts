import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    
    isLoading = signal(false);

    constructor() { }
    
    startLoader(): void {
        this.isLoading.set(true);
    }

    stopLoader(): void {
        this.isLoading.set(false);
    }
}
