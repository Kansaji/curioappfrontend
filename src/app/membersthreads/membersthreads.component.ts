import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { ForumService } from '../forum.service';
import { AnswerPayload } from '../forum/answer-payload';
import {DatePipe} from '@angular/common'; 
import { AnswerReplyPayload } from '../forum/answerReply-payload';

@Component({
  selector: 'app-membersthreads',
  templateUrl: './membersthreads.component.html',
  styleUrls: ['./membersthreads.component.css'],
  providers:[DatePipe]
})
export class MembersthreadsComponent implements OnInit {

  answers:Observable<Array<AnswerPayload>>
  answerForm:FormGroup;
  answerPayload:AnswerPayload;
  newAnswers:Array<AnswerPayload>=[];
  username:String;
  answerReplyForm:FormGroup;
  answerReplyPayload:AnswerReplyPayload;
  newAnswerReplies:Array<AnswerReplyPayload>=[];
  answerReplies:Observable<Array<AnswerReplyPayload>>;

  constructor(private route:ActivatedRoute, private forumService:ForumService, private formBuilder:FormBuilder, private localStorageService:LocalStorageService, private datePipe:DatePipe) { 
    this.answerForm=this.formBuilder.group({
      answerContent:['',Validators.required]
    });

    this.answerReplyForm=this.formBuilder.group({
      answerReplyContent:'',
    })

    this.answerPayload={
      answerId:0,
      answerContent:'',
      answeredTimeStamp:'',
      answeredUsername:'',
      questionId:0,
      questionContent:'',
      subject:'',
      numOfReplies:0
    }

    this.answerReplyPayload={
      answerReplyId:0,
      answerReplyContent:'',
      answerReplyTimeStamp:'',
      answerId:0,
      answerReplyUsername:''
    }
   


    this.username=this.localStorageService.retrieve('username');
  }

  permalink:number;
  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      this.permalink=params['id'];
    })
    this.answers=this.forumService.getAsnwers(this.permalink);
    
  }

  onSubmit(){
    if(this.answerForm.get('answerContent').value!=''){
      this.answerPayload.answerContent=this.answerForm.get('answerContent').value;
      this.answerPayload.questionId=this.permalink;
      this.answerPayload.answeredTimeStamp=this.datePipe.transform(new Date(),'yyyy MM dd, HH:mm:ss');
      let answer=Object.assign({},this.answerPayload);
     
        
      
      this.forumService.postAnswer(this.answerPayload).subscribe(data=>{
        console.log("answer sent");
        this.newAnswers.push(answer);
      },error=>{

      });
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

  clearNewlySentanswerReplies(){
    this.newAnswerReplies=[];

  }

  removeAnswer(answerId,element){
    this.forumService.removeAnswer(answerId).subscribe(data=>{
      element.textContent="removed";
      console.log('success')
    },error=>{
      element.textContent="error";
      console.log('failed');

    });
  }

  removeAnswerReply(answerReplyId,element){
    this.forumService.removeAnswerReply(answerReplyId).subscribe(data=>{
      element.textContent="removed";
      console.log('success')
    },error=>{
      element.textContent="error";
      console.log('failed');

    });
  }
}
