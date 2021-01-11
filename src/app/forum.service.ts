import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnswerPayload } from './forum/answer-payload';
import { QuestionPayload } from './forum/question-payload';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  constructor(private httpClient:HttpClient) {

  }

  postQuestion(questionPayload:QuestionPayload):Observable<any>{
    console.log(questionPayload);
    return this.httpClient.post('http://localhost:8080/api/discussion/',questionPayload);
  }

  getMyQuestions():Observable<Array<QuestionPayload>>{
    return this.httpClient.get<Array<QuestionPayload>>("http://localhost:8080/api/discussion/myquestions");
  }
  getAsnwers(permalink:Number):Observable<Array<AnswerPayload>>{
    return this.httpClient.get<Array<AnswerPayload>>("http://localhost:8080/api/discussion/showanswers/"+permalink);
  }

  getAllQuestions():Observable<Array<QuestionPayload>>{
    return this.httpClient.get<Array<QuestionPayload>>("http://localhost:8080/api/discussion/allquestions");
  }

  postAnswer(answerPayload:AnswerPayload):Observable<any>{
    return this.httpClient.post("http://localhost:8080/api/discussion/postanswer",answerPayload);
  }
}
