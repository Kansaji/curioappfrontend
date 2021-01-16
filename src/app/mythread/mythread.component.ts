import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ForumService } from '../forum.service';
import { AnswerPayload } from '../forum/answer-payload';
import {DatePipe} from '@angular/common'; 
import { AnswerReplyPayload } from '../forum/answerReply-payload';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-mythread',
  templateUrl: './mythread.component.html',
  styleUrls: ['./mythread.component.css'],
  providers:[DatePipe]
})
export class MythreadComponent implements OnInit {
  
  subject: Observable<AnswerPayload>;
  questionContent:Observable<AnswerPayload>;
  answers:Observable<Array<AnswerPayload>>;
  answerReplyForm:FormGroup;
  answerReplyPayload:AnswerReplyPayload;
  newAnswerReplies:Array<AnswerReplyPayload>=[];
  answerReplies:Observable<Array<AnswerReplyPayload>>;
  username:String; 
 
  constructor(private router:ActivatedRoute, private forumService:ForumService, private formBuilder:FormBuilder, private datePipe:DatePipe, private localStorageService:LocalStorageService) { }
  permalink:Number;
  ngOnInit(): void {
    this.router.params.subscribe(params=>{
      this.permalink=params['id'];
    });
    
    this.answers=this.forumService.getAsnwers(this.permalink);
  
   this.answerReplyForm=this.formBuilder.group({
      answerReplyContent:'',
    })
    this.username=this.localStorageService.retrieve('username');


    this.answerReplyPayload={
      answerReplyId:0,
      answerReplyContent:'',
      answerReplyTimeStamp:'',
      answerId:0,
      answerReplyUsername:''
    }
   
    
  }

  onReply(answerId:number){
    if(this.answerReplyForm.get('answerReplyContent').value!=''){
      
      this.answerReplyPayload.answerId=answerId;
      this.answerReplyPayload.answerReplyContent=this.answerReplyForm.get('answerReplyContent').value;
      this.answerReplyPayload.answerReplyId=0;
      this.answerReplyPayload.answerReplyTimeStamp=this.datePipe.transform(new Date(),'yyyy MM dd, HH:mm:ss');
      this.answerReplyPayload.answerReplyUsername='';
      let answerReply=Object.assign({},this.answerReplyPayload);

      this.forumService.postAnswerReply(this.answerReplyPayload).subscribe(data=>{
        this.newAnswerReplies.push(answerReply);
        console.log('successfully replied');
      },error=>{
        
      });
      
    }
  }

  getAnswerReplies(answerId:number){
    this.answerReplies=this.forumService.getAnswerReplies(answerId);
    this.newAnswerReplies=[];

  }
  
}
