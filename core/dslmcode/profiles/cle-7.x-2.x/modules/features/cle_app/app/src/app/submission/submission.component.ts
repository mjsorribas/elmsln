import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Submission } from './submission';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {
  submissionId:number;
  assignmentId:number;
  submission$:Observable<Submission>;

  constructor(
    private route:ActivatedRoute,
    private store:Store<{}>,
    private router:Router,
    private location:Location
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params:Params) => {
        if (params['submissionId']) {
          this.submissionId = Number(params['submissionId']);

          this.submission$ = this.store.select('submissions')
            .map((state:any) => state.submissions.find((sub:Submission) => {
              if (sub.id === this.submissionId) {
                this.assignmentId = sub.assignment;
                return true;
              }
              else {
                return false;
              }
            }))
        }
      })
  }

  onClickBack() {
    this.router.navigate(['/assignments/' + this.assignmentId]);
  }

  editSubmission() {
    this.router.navigate(['/submissions/' + this.submissionId + '/edit']);
  }
}