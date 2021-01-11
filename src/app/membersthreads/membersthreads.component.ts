import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { ForumService } from '../forum.service';
import { AnswerPayload } from '../forum/answer-payload';

@Component({
  selector: 'app-membersthreads',
  templateUrl: './membersthreads.component.html',
  styleUrls: ['./membersthreads.component.css']
})
export class MembersthreadsComponent implements OnInit {

  answers:Observable<Array<AnswerPayload>>
  answerForm:FormGroup;
  answerPayload:AnswerPayload;
  newAnswers:Array<AnswerPayload>=[];
  username:String;

  constructor(private route:ActivatedRoute, private forumService:ForumService, private formBuilder:FormBuilder, private localStorageService:LocalStorageService) { 
    this.answerForm=this.formBuilder.group({
      answerContent:['',Validators.required]
    });

    this.answerPayload={
      answerId:0,
      answerContent:'',
      answeredTimeStamp:'',
      answeredUsername:'',
      questionId:0,
      questionContent:'',
      subject:''
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
      let answer=Object.assign({},this.answerPayload);
     
        
      
      this.forumService.postAnswer(this.answerPayload).subscribe(data=>{
        console.log("answer sent");
        this.newAnswers.push(answer);
      },error=>{

      });
    }
  }
  

}
