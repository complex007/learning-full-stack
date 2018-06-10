import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class InputService {
  private inputSubject$ = new BehaviorSubject('');


  constructor() { }

  changeInput( term:string ):void{
    this.inputSubject$.next(term);
  }

  getInput(): Observable<string>{
    return this.inputSubject$.asObservable();
  }
}
