import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { ForumService } from '../forum.service';
import { AnswerPayload } from '../forum/answer-payload';

@Component({
  selector: 'app-mythread',
  templateUrl: './mythread.component.html',
  styleUrls: ['./mythread.component.css']
})
export class MythreadComponent implements OnInit {
  
  subject: Observable<AnswerPayload>;
  questionContent:Observable<AnswerPayload>;
  
  answers:Observable<Array<AnswerPayload>>;
  constructor(private router:ActivatedRoute, private forumService:ForumService) { }
  permalink:Number;
  ngOnInit(): void {
    this.router.params.subscribe(params=>{
      this.permalink=params['id'];
    });
    
    this.answers=this.forumService.getAsnwers(this.permalink);
  
   
    
  }
  
}
