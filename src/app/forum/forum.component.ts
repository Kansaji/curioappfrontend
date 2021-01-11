import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ForumService } from '../forum.service';
import { QuestionPayload } from './question-payload';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  askQuestionForm:FormGroup;
  questionPayload:QuestionPayload;
  myQuestionSelected:boolean=true;
  threadsSelected=false;
  questionPosted:boolean=false;

  myQuestions:Observable<Array<QuestionPayload>>;
  allQuestions:Observable<Array<QuestionPayload>>;
  constructor(private formBuilder:FormBuilder, private forumService:ForumService, private router:Router) {

    this.askQuestionForm=this.formBuilder.group({
      questionContent:['',Validators.required],
      subject:['',Validators.required]
    });

   this.questionPayload={
    questionId:0,
    subject:'',
    questionContent:'',
    questionedTimeStamp:'',
    askedUsername:''
   };
   }

  ngOnInit(): void {
    this.myQuestions=this.forumService.getMyQuestions();
  }

  onSubmit(){
    this.askQuestionForm.markAllAsTouched();
    if(this.askQuestionForm.get('questionContent').value!='' && this.askQuestionForm.get('subject').value!=''){

      this.questionPayload.questionContent=this.askQuestionForm.get('questionContent').value;
      this.questionPayload.subject=this.askQuestionForm.get('subject').value;
      this.forumService.postQuestion(this.questionPayload).subscribe(data=>{
        console.log('question post success');
        this.questionPosted=true;
      },error=>{
        console.log('question post failed');
      });
    }
    }
  
  selectMyQuestion(){
    this.myQuestionSelected=true;
    this.threadsSelected=false;
  }
  selectThreads(){
    this.myQuestionSelected=false;
    this.threadsSelected=true;
    this.allQuestions=this.forumService.getAllQuestions();
  }
}
