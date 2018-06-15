import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class InputService {
  //use service to pass data across components
  // no need to forcely pass data via components data binding

  // like a database, temporally store data


  private inputSubject$ = new BehaviorSubject('');


  constructor() { }

  changeInput( term:string ):void{
    this.inputSubject$.next(term);
  }

  getInput(): Observable<string>{
    return this.inputSubject$.asObservable();
  }
}
