import { AppSettings } from '../app.settings';
import { HttpHeaders, HttpClient } from '@angular/common/http';

export abstract class Repository<T> {

    apiRoot: string = AppSettings.API_ROOT;
    path: string;

    constructor(public http: HttpClient, path: string) {
        this.path = path;
    }
    public add(entity: T): Promise<T> {
        return this.executeQuery(this.path, 'post', entity);
    }

    public update(entity: T): Promise<T> {
        return this.executeQuery(this.path, 'put', entity);
    }

    public delete(id: number): Promise<void> {
        return this.executeQuery(this.path + '/' + id.toString(), 'delete');
    }

    public get(id: number): Promise<T> {
        return this.executeQuery<T>(this.path + '/' + id.toString(), 'get');
    }

    public getAll(): Promise<Array<T>> {
        return this.executeQuery<T[]>(this.path, 'get');
    }

    protected executeQuery<P>(path, method, data = null): Promise<P> {
        return new Promise((resolve, reject) => {
            const apiUrl = this.apiRoot + path;
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            this.http[method](apiUrl, JSON.stringify(data), { headers })
                    .toPromise()
                    .then(
                        (res: P) => {
                            resolve(res);
                        },
                        err => {
                            reject(err);
                        }
                    );
                });
    }
}
