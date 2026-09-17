import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { APP_CONFIG } from "../../shared/configs/app-config.state";
import { Observable } from "rxjs";

@Service()
export class ApiClientService {
    private http = inject(HttpClient);
    private config = inject(APP_CONFIG);

    private async buildUrl(route: string, action: string) {
        const config = await this.config;
        const baseUrl = `${config.baseUrl}/api/${route}`;

        return action ? `${baseUrl}/${action}`: baseUrl;
    }

    async get<TResponse>(route: string, action: string) {
        return this.http.get<TResponse>(await this.buildUrl(route, action));
    }

    async post<TRequest, TResponse>(route: string, action: string, body: TRequest) {
        return this.http.post<TResponse>(await this.buildUrl(route, action), body);
    }

    async put<TRequest, TResponse>(route: string, action: string, body: TRequest) {
        return this.http.put<TResponse>(await this.buildUrl(route, action), body);
    }
}