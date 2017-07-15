import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment-list-by-me',
  templateUrl: './comment-list-by-me.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentListByMeComponent implements OnInit {
  comments = [
    {averageScore: 4.5, scoreOnTimeliness: 4.5, scoreOnAccuracy: 4.5, scoreOnNormalization: 4, scoreOnIntegrity: 5},
    {averageScore: 4.5, scoreOnTimeliness: 4.5, scoreOnAccuracy: 4.5, scoreOnNormalization: 4, scoreOnIntegrity: 5}
    ];
  averageScore: Array<any>;
  constructor() { }

  ngOnInit() {
    this.averageScore = Array(5).fill(1).map((x, i) => i);
  }

}
