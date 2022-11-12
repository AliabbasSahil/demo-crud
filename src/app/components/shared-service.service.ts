import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Subject } from 'rxjs';
import { appConfig } from '../app.config'


@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  loaderState = new Subject();
  loaderState$ = this.loaderState.asObservable();

  constructor(
    public httpclient: HttpClient,
  ) { }

     
    updateLoader(state:boolean) {
        this.loaderState.next(state);
    }

    getAllTableData(page:any,size:any){
      const getAllDataUrl = `${appConfig.users}?page=${page}&per_page=${size}`;
      return this.getData(getAllDataUrl)
    }

    createTableUser(data:any){
     const createUserUrl = `${appConfig.users}`;
     return this.postData(createUserUrl,data)
    }

    updateTableUser(data:any,id:any){
      const updateUrl = `${appConfig.users}/:${id}`;
      return this.putData(updateUrl,data)
    }

    deleteTableUser(id:any){
      const deleteUserUrl = `${appConfig.users}/${id}`;
      return this.deleteData(deleteUserUrl)
    }

    getTableDataById(id:any){
      const url = `${appConfig.users}/${id}`;
      return this.getData(url)
    }

    /**
     * To get data
     * @param url API Endpoint
     */
    getData(url:any) {
        return this.httpclient.get<any>(url).pipe(catchError((error) => {
            return this.errorHandler(error);
        }));
    }

    /**
     * To save data
     * @param data Data to be send
     * @param url API Endpoint
     */
    postData(url:any, data:any) {
        return this.httpclient.post<any>(url, data, { observe: 'response' }).pipe(
            catchError((error) => {
                return this.errorHandler(error);
            }));
    }


    /**
     * To update data
     * @param data Data to be send
     * @param url API Endpoint
     */
    putData(url:any, data:any) {
        return this.httpclient.put<any>(url, data, { observe: 'response' }).pipe(
            catchError((error) => {
                return this.errorHandler(error);
            }));
    }

    /**
     * To delete data
     * @param url API Endpoint
     */
    deleteData(url:any) {
        return this.httpclient.delete<any>(url, { observe: 'response' }).pipe(
            catchError((error) => {
                return this.errorHandler(error);
            }));
    }

    /**
     * Error Handler
     * @param error Error
     */
    errorHandler(error: HttpErrorResponse) {
        return throwError(error || 'Error');
    }

}
