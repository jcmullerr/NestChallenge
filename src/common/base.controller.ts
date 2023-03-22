import { HttpService } from '@nestjs/axios';

export class BaseController {
  private readonly baseUrl: string;
  constructor(private readonly http: HttpService) {
    this.baseUrl = 'https://reqres.in/api/users';
  }

  protected async getUserFromApi<T>(path: string) {
    return this.http.get<T>(`${this.baseUrl}/${path}`).toPromise();
  }

  protected async get<T>(path: string, options: any = null) {
    if (options !== null) return this.http.get<T>(path, options).toPromise();

    return this.http.get<T>(path).toPromise();
  }
}
