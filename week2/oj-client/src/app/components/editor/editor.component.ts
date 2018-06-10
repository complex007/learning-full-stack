import { Component, OnInit } from '@angular/core'; 
import { CollaborationService }from '../../services/collaboration.service';
import { ActivatedRoute, Params} from '@angular/router'
declare var ace: any;  //already this ace is created inside script in angular.json , will be included in index.js

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  public languages: string[] = ["Java","Python"];
  editor: any;
  defaultContent = {
    'Java':`public class Example{
      public static void main(string[] args){
        // type your code
      }
    }
    `// ` support mutiple lines string
    ,'Python':`public class Example{
      public static void main(string[] args){
        // type your code
      }
    }`
  }
  sessionId:string;

  constructor( private collaboration:CollaborationService , private route:ActivatedRoute) { }

  ngOnInit() {
    
    this.route.params.subscribe(params=>{
      this.sessionId = params['id'];
      this.initEditor();
      this.collaboration.restoreBuffer();
    })
  
  }
  initEditor(): void{
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/eclipse");
    this.editor.getSession().setMode("ace/mode/java");
    this.editor.setValue(this.defaultContent['Java']);
    document.getElementsByTagName('textarea')[0].focus();// focus on a certain area
    this.collaboration.init(this.editor,this.sessionId);// keep clients editing same problem in same session
    this.editor.lastAppliedChange = null;
    this.editor.on("change",(e)=>{
      console.log('editor changes: '+ JSON.stringify(e));
      if (this.editor.lastAppliedChange != e){  // many changes are same if avoid dead loop 
        this.collaboration.change(JSON.stringify(e));
      }
    });
  }

}
