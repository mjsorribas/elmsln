import { Component, OnInit, ElementRef, OnDestroy, OnChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Assignment } from '../assignment';
import { AssignmentService } from '../assignment.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { loadAssignments } from '../app.actions';
declare const jQuery:any;

@Component({
  selector: 'cle-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
  providers: [AssignmentService]
})
export class AssignmentComponent implements OnInit {
  assignmentId:number;
  date:number;
  userCanSubmit$:Observable<boolean>;
  userCanEdit$:Observable<boolean>;
  assignments$:Observable<Assignment[]>;
  submissions$:Observable<any[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private assignmentService: AssignmentService,
    private el:ElementRef,
    private store: Store<{}>
  ) { 
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['id']) {
        let id = +params['id'];
        this.assignmentId = Number(id);
      }
    });

    // check the permissions store to see if the user has edit
    this.userCanEdit$ = this.store.select('user')
      .map((state:any) => {
        if (state.permissions.includes('edit any cle_assignment content')) {
          return true;
        }
        return false;
      });
    
    // get the submissions
    this.submissions$ = this.store.select('submissions')
      .map((state:any) => {
        return state.submissions.filter(sub => sub.assignment === this.assignmentId);
      })

    if (this.assignmentId) {
      this.assignments$ = this.store.select('assignments')
        .map((state:any) => state.assignments.find(assignment => {
          return assignment.id === this.assignmentId;
        }))
        .map((state:any) => {
          return [state];
        })
    }
  }

  onEditAssignment(assignment:Assignment) {
    const url = 'assignment-edit/' + assignment.id;
    this.router.navigate([{outlets: {dialog: url}}])
  }

  onCreateSubmission(assignment:Assignment) {
    const url = 'submissions/create/' + assignment.id;
    this.router.navigate([url]);
  }
}