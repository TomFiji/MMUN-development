import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpApiService {
  constructor(public httpClient: HttpClient) {}

  get(
    url: string,
    headers?: HttpHeaders | { [header: string]: string | string[] }
  ) {
    return this.httpClient.get<any>(url, { headers, withCredentials: true });
  }

  post(
    url: string,
    body: object,
    headers?: HttpHeaders | { [header: string]: string | string[] }
  ) {
    return this.httpClient.post<any>(url, body, {
      headers,
      withCredentials: true,
    });
  }

  put(
    url: string,
    body: object,
    headers?: HttpHeaders | { [header: string]: string | string[] }
  ) {
    return this.httpClient.put<any>(url, body, {
      headers,
      withCredentials: true,
    });
  }

  delete(
    url: string,
    headers?: HttpHeaders | { [header: string]: string | string[] }
  ) {
    return this.httpClient.delete<any>(url, { headers, withCredentials: true });
  }
}
