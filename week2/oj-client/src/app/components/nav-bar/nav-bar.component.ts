import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Subscription} from 'rxjs';
import { Router } from '@angular/router';
import { InputService } from '../../services/input.service'
import { debounceTime } from 'rxjs/Operators'


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  title:string;
  searchBox:FormControl = new FormControl();
  subscription:Subscription;

  constructor( private input: InputService, private router: Router) { }

  ngOnInit() {
    this.title = "Forerror";
    this.subscription = this.searchBox
                        .valueChanges
                        .pipe(debounceTime(200))
                        .subscribe(term=>{
                          this.input.changeInput(term);
                        })

  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
