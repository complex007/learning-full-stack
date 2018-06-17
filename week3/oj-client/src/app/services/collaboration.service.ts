import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs'

declare var io:any;

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  collaborationSocket:any;
  private collaborationInfo = new BehaviorSubject([]);//multiple registers,mulity cast, online show,get data when register
  //obervable:record , get all info

  constructor() { }
  init(editor:any,sessionId:string): void{
    this.collaborationSocket = io(window.location.origin,
      {query:'sessionId='+sessionId});
      
    this.collaborationSocket.on('collaboration-info', collaboration=>{
      console.dir(collaboration);
      this.changeEditors(collaboration);
    })
   

  
    this.collaborationSocket.on('change',(delta:string)=>{
      console.log("collobration: editor changed by "+ delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    });
  }
  change(delta:string): void {
    this.collaborationSocket.emit('change',delta);// send change to server
  }

  restoreBuffer():void{
    this.collaborationSocket.emit('restoreBuffer');
  }

  closeSocket():void{
    this.collaborationSocket.disconnect();
  }

  changeEditors( editors:string[] ):void{
    this.collaborationInfo.next(editors);
  }
  getEditors(): Observable<string[]>{
    return this.collaborationInfo.asObservable();
  }
  
}
