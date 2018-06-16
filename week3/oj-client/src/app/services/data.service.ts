import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable , BehaviorSubject } from 'rxjs';

// .. => one level higher in file system
// . => current level

@Injectable({
  providedIn: 'root'// providedIn: the access of this service. root => all components can use it
})
export class DataService {
  private _problemSource = new BehaviorSubject<Problem[]>([]); // private method using _xxx. behaviorsubject always has a init value


  constructor( private httpClient: HttpClient ) {  }
  // constructor => languare provides
  // ngOninit => angular provides

  // === => don't convert type, compare type and value
  
// npm start => for all common node program. ng serve => specific to angular
getProblems():Observable<Problem[]> {
   this.httpClient.get('api/v1/problems')
   .toPromise()
   .then((res:any)=>{  // any means any type
     this._problemSource.next(res);
   })
   .catch(this.handleError);
   return this._problemSource.asObservable();

}
getProblem(id:number):Promise<Problem> {
  return this.httpClient.get(`api/v1/problems/${id}`)
  .toPromise()
  .then((res:any)=>res)
  .catch(this.handleError);
}

addProblem( problem: Problem ){
  const options = {headers: new HttpHeaders({'Content-Type':'application/json'}) }
  return this.httpClient.post('api/v1/problems',problem,options)
  .toPromise()
  .then((res:any)=>{
    this.getProblems();
    return res;
  })
  .catch(this.handleError);
}
buildAndRun( code: string ): Promise<string> {
  return this.httpClient.post('api/v1/build_and_run',{code:code})
  .toPromise()
  .then((res:any)=>{
    return res.status;
  })
  .catch(this.handleError);
}

private handleError(error:any):Promise<any>{
    return Promise.reject(error.error||error);
  }
}
