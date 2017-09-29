import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentFormStatus, AssessmentModel, IFormAnswer } from '../core/models/assessment-model';
import { FormModel } from '../core/models/form-model';
import { ModelId } from '../core/models/model';
import { AssessmentService } from '../core/services/assessment.service';
import { NotificationService } from '../core/services/notification.service';
import { IListResponse, IQueryParams } from '../core/services/rest.service';
import { ListComponent } from '../shared/components/list.component';
import { AssessmentObject } from './assessment-object-list.component';
import { EventStatus } from '../core/models/event-model';
import { ProjectModel } from '../core/models/project-model';
import { EventService } from '../core/services/event.service';
import { UserPictureService } from '../core/services/user-picture.service';
import { Observable } from 'rxjs/Observable';
import { Utils } from '../utils';

@Component({
  moduleId: module.id,
  selector: 'bs-user-assessment-event',
  templateUrl: 'assessment-event.component.html'
})
export class AssessmentEventComponent extends ListComponent<AssessmentModel> implements OnInit, OnChanges {
  protected _project: ProjectModel;
  protected _eventId: ModelId;
  protected _forms: FormModel[];
  protected _answers: AssessmentModel[] = [];
  protected _inline: boolean;
  protected _queryParams: IQueryParams = {};
  protected _assessmentObject: AssessmentObject = null;
  protected _status: string;
  protected _cleared: number = 0;
  protected _isClear: boolean = true;
  protected _isAnswered: boolean = false;
  protected _showNextProject: EventEmitter<any> = new EventEmitter<any>();
  protected _filteredUsers: AssessmentModel[];
  protected _users: AssessmentModel[];
  protected _surveys: IFormAnswer[];

  @Input()
  public set project(value: ProjectModel) {
    this._project = value;
  }

  public get project(): ProjectModel {
    return this._project;
  }

  @Input()
  public set inline(value: boolean) {
    this._inline = value;
  }

  public get inline(): boolean {
    return this._inline;
  }

  @Input()
  public set eventId(value: ModelId) {
    this._eventId = value;
  }

  public get eventId(): ModelId {
    return this._eventId;
  }

  public get forms(): FormModel[] {
    return this._forms;
  }

  public get assessmentObject(): AssessmentObject {
    return this._assessmentObject;
  }

  public get status(): string {
    return this._status;
  }

  public get isClear(): boolean {
    return this._isClear;
  }

  public get answers(): AssessmentModel[] {
    return this._answers;
  }

  public get EventStatus() {
    return EventStatus;
  }

  public get cleared(): number {
    return this._cleared;
  }

  public get isAnswered(): boolean {
    return this._isAnswered;
  }

  @Output()
  public get showNextProject(): EventEmitter<any> {
    return this._showNextProject;
  }

  public get filteredUsers(): AssessmentModel[] {
    return this._filteredUsers;
  }

  public get users(): AssessmentModel[] {
    return this._users;
  }

  public get surveys(): IFormAnswer[] {
    return this._surveys;
  }

  constructor(service: AssessmentService,
              activatedRoute: ActivatedRoute,
              router: Router,
              notificationService: NotificationService,
              protected _eventService: EventService,
              protected _userPictureService: UserPictureService) {
    super(service, activatedRoute, router, notificationService);
  }

  public ngOnInit() {
    this._queryParams.projectId = this._project.id.toString();

    this._eventService.get(this._eventId).subscribe(event => this._status = event.status);

    super.ngOnInit();
    this._update().subscribe(() => {
      let notAnsweredUser = Utils.getNext(this._users, undefined, _ => !_.isAnswered);
      let notAnsweredSurvey = Utils.getNext(this._surveys, undefined, _ => _.status === AssessmentFormStatus.New);

      if (notAnsweredUser) {
        this.displayItem(notAnsweredUser);
      } else if (notAnsweredSurvey) {
        this.displayItem(notAnsweredSurvey);
      } else {
        this._showNextProject.emit(this._list);
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['projectId']) {
      Object.assign(this._queryParams, {
        projectId: this._project.id.toString()
      });
    }
  }

  public displayItem(item: AssessmentObject, index?: number) {
    this._assessmentObject = null;

    setTimeout(() => {
      this._assessmentObject = item;
      console.log(this._assessmentObject);

      if (this._assessmentObject.hasOwnProperty('user')) {
        let obj = <AssessmentModel>this._assessmentObject;
        obj.forms.forEach(_ => _.active = false);
        obj.forms[0].active = true;
      } else {
        (<IFormAnswer>this._assessmentObject).active = true;
      }

      console.log('assessmentobj', this._assessmentObject);

    });
  }

  public showNext(assessment: AssessmentModel) {
    this._update().subscribe(() => {
      if (this._assessmentObject.hasOwnProperty('user')) {
        let obj = <AssessmentModel>this._assessmentObject;
        let nextForm = Utils.getNext(obj.forms, _ => _.active, _ => _.status === AssessmentFormStatus.New);

        if (nextForm) {
          obj.forms.forEach(_ => _.active = false);
          nextForm.active = true;
        } else {
          let nextUser = Utils.getNext(this._users, _ => _.user.id === obj.user.id, _ => !!_.user && !_.isAnswered);

          if (nextUser) {
            this.displayItem(nextUser);
          } else if (!!this._surveys.length) {
            let nextSurvey = Utils.getNext(this._surveys, undefined, _ => _.status === AssessmentFormStatus.New);

            if (nextSurvey) {
              this.displayItem(nextSurvey);
            } else {
              this._showNextProject.emit(this._list);
            }
          } else {
            this._showNextProject.emit(this._list);
          }
        }
      } else if (!!this._surveys.length) {
        let nextSurvey = Utils.getNext(this._surveys, _ => _.form.id === (<IFormAnswer>this._assessmentObject).form.id,
          _ => _.status === AssessmentFormStatus.New);
        if (nextSurvey) {
          this.displayItem(nextSurvey);
        } else {
          this._showNextProject.emit(this._list);
        }
      } else {
        this._showNextProject.emit(this._list);
      }
    });
  }

  public formChanged(value: any) {
    let sameAnswer;

    if (value) {
      sameAnswer = this._answers.find(x => ((!x.userId || x.userId === value.userId) && x.form.formId === value.form.formId));
    }

    if (sameAnswer) {
      let index = this._answers.indexOf(sameAnswer);
      this._answers[index].form.answers = value.form.answers;
    } else {
      this._answers.push(value);
    }

    this._isClear = !value.isAnswered;
  }

  public save() {
    let postQueryParams: IQueryParams = {
      projectId: this._project.id.toString()

    };

    (<AssessmentService>this._service).saveBulk(this._answers, postQueryParams).subscribe(() => {
      this._notificationService.success('T_SUCCESS_SAVED');
      this._isAnswered = !this._list.find(x => !x.isAnswered);
      this._showNextProject.emit(this._list);
    });
  }

  public userSearch(searchUser: AssessmentModel[]) {
    this._filteredUsers = searchUser;
  }

  public clear() {
    if (this._inline) {
      this._isClear = true;
      this._cleared++;
    } else {
      this._answers = [];
    }
  }

  protected _update(): Observable<any> {
    this._answers = [];
    return this._fetch().map(list => {
      this._list = list;

      if (list) {
        this._users = list.filter((assessment: AssessmentModel) => !!assessment.user);
        this._surveys = list.find((assessment: AssessmentModel) => !assessment.user).forms;

        this._users.sort((x, y) => {
          return !!x.user && !!y.user && (x.user.name < y.user.name) ? -1 : !!x.user && !!y.user && (x.user.name > y.user.name) ? 1 : 0;
        });

        this._surveys.sort((x, y) => x.form.name < y.form.name ? -1 : 1);
      }

      this._filteredUsers = this._list;

      this._isAnswered = !list.find((item: AssessmentModel) => !item.isAnswered);

      if (this._assessmentObject && this._assessmentObject.userId) {
        this._assessmentObject = list.find((item: AssessmentModel) => item.user.id === this._assessmentObject.userId);
      }
    });
  }

  protected _fetch(): Observable<any> {
    let observable = new Observable((observer) => {
      this._fetching = this._service.list(this._queryParams).subscribe((res: IListResponse<AssessmentModel>) => {
        let list = res.data;

        list.forEach(assessment => {
          assessment.isClassic = !!assessment.user;
          assessment.isAnswered = !assessment.forms.find(x => x.status === AssessmentFormStatus.New);
          assessment.forms
            .sort((x: IFormAnswer, y: IFormAnswer) => x.form.name < y.form.name ? -1 : 1)
            .forEach(form => form.active = false);
          if (assessment.user && assessment.user.hasPicture) {
            this._userPictureService.getPicture(assessment.user.id).subscribe(pic => assessment.user.picture = pic);
          }

          this._isClear = !assessment.isAnswered;
        });


        if (this._project.isLast) {
          let forms = list[list.length - 1].forms;
          forms[forms.length - 1].isLast = true;
        }

        observer.next(list);
        observer.complete();
      }, error => observer.error(error));
    });
    return observable;
  }
}
