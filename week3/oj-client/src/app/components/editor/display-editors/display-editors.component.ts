import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CollaborationService } from '../../../services/collaboration.service';


@Component({
  selector: 'app-display-editors',
  templateUrl: './display-editors.component.html',
  styleUrls: ['./display-editors.component.css']
})
export class DisplayEditorsComponent implements OnInit {
  subscriptionEditors: Subscription;
  editors:string[];
  constructor( private collaboration: CollaborationService ) { }

  ngOnInit() {
    this.getEditors();
    
  }
  ngOnDestroy() {
    this.subscriptionEditors.unsubscribe();
    
  }
  getEditors():void{
    this.subscriptionEditors = this.collaboration.getEditors()
    .subscribe(editors=>{
      this.editors = editors;
    });
  }

}
