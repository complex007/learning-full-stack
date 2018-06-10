import { Component, OnInit, OnDestroy } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service' ;
import { Subscription } from 'rxjs';
import { InputService } from '../../services/input.service'

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problems: Problem[];
  subscriptionProblems: Subscription;

  subscriptionSearch: Subscription;
  searchTerm: string = '';

  constructor(private dataService: DataService, private input: InputService ) { }

  ngOnInit() {
    this.getProblems();
    this.getInput();
  }
  ngOnDestroy(){
    this.subscriptionProblems.unsubscribe();
    this.subscriptionSearch.unsubscribe();
  }
  getProblems(): void{
    this.subscriptionProblems = this.dataService.getProblems().subscribe(problems=>this.problems=problems)
  }
  getInput():void{
    this.subscriptionSearch = this.input.getInput().subscribe(term=>this.searchTerm = term);
  }



  //  | is pipe. a | b ,a ,b is the params of the pipe function
}
