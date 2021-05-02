import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ForumService } from '../forum.service';
import { QuestionPayload } from './question-payload';
import {DatePipe} from '@angular/common'; 

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  providers:[DatePipe]
})
export class ForumComponent implements OnInit {

  askQuestionForm:FormGroup;
  questionPayload:QuestionPayload;
  myQuestionSelected:boolean=true;
  threadsSelected=false;
  questionPosted:boolean=false;
  searchQuestionForm:FormGroup;
  myQuestions:Observable<Array<QuestionPayload>>;
  allQuestions:Observable<Array<QuestionPayload>>;

  constructor(private formBuilder:FormBuilder, private forumService:ForumService, private router:Router, private datePipe:DatePipe) {

    this.askQuestionForm=this.formBuilder.group({
      questionContent:['',Validators.required],
      subject:['',Validators.required]
    });

   this.questionPayload={
    questionId:0,
    subject:'',
    questionContent:'',
    questionedTimeStamp:'',
    askedUsername:'',
    numOfAnswers:0
   };

   this.searchQuestionForm=this.formBuilder.group({
     searchTerm:['',Validators.required]
   })

   this.searchQuestionForm.controls.searchTerm.valueChanges.subscribe(value=>{
     
        if(value =='' && this.myQuestionSelected){
          this.myQuestions=this.forumService.getMyQuestions();
        }
        if(value =='' && this.threadsSelected){
          this.allQuestions=this.forumService.getAllQuestions();
        }
     
   },error=>{
     
   })
   }

  ngOnInit(): void {
    this.myQuestions=this.forumService.getMyQuestions();
  }

  onSubmit(){
    this.askQuestionForm.markAllAsTouched();
    if(this.askQuestionForm.get('questionContent').value!='' && this.askQuestionForm.get('subject').value!=''){

      this.questionPayload.questionContent=this.askQuestionForm.get('questionContent').value;
      this.questionPayload.subject=this.askQuestionForm.get('subject').value;
      this.questionPayload.questionedTimeStamp=this.datePipe.transform(new Date(),'yyyy MM dd, HH:mm:ss');
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
    this.myQuestions=this.forumService.getMyQuestions();
  }
  selectThreads(){
    this.myQuestionSelected=false;
    this.threadsSelected=true;
    this.allQuestions=this.forumService.getAllQuestions();
  }

  search(){
    var searchTerm=this.searchQuestionForm.get('searchTerm').value;
    if(this.myQuestionSelected){
      this.myQuestions=this.forumService.searchQuestions(searchTerm);
    }
    if(this.threadsSelected){
      this.allQuestions=this.forumService.searchQuestions(searchTerm);
    }
  }

  removeQuestion(questionId,element){
    this.forumService.removeQuestion(questionId).subscribe(data=>{
      element.textContent="removed";
      console.log('success')
    },error=>{
      element.textContent="error";
      console.log('failed');

    });
  }
}
