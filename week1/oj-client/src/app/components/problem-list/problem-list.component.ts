import { Component, OnInit } from '@angular/core';
import { Problem } from 'src/app/models/problem.model';

const PROBLEMS: Problem[] = [
  {
    id:1,
    name:"Two Sum",
    desc:"Given an array of integers, find two numbers such that they add up to a specific target number.",
    difficulty:"easy"
  },
  {
    id:2,
    name:"Three Sum",
    desc:"Given an array of integers, find three numbers such that they add up to a specific target number.",
    difficulty:"medium"
  }


];

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problems: Problem[];

  constructor() { }

  ngOnInit() {
    this.getProblems();
  }
  getProblems(){
    this.problems = PROBLEMS;
  }

}
