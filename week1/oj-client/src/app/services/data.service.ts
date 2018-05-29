import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import { PROBLEMS } from '../mock-problems';
// .. => one level higher in file system
// . => current level

@Injectable({
  providedIn: 'root'// providedIn: the access of this service. root => all components can use it
})
export class DataService {
  problems: Problem[] = PROBLEMS;

  constructor() { }
  // constructor => languare provides
  // ngOninit => angular provides

  // === => don't convert type, compare type and value
  
// npm start => for all common node program. ng serve => specific to angular
getProblems():Problem[]{
  return this.problems;
}
getProblem(id:number):Problem {
  return this.problems.find( ( problem ) => problem.id === id );
}

addProblem( problem: Problem ){
  problem.id = this.problems.length+1;
  this.problems.push(problem);
}

}
