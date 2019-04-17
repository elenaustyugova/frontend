import { Component, Input, OnInit } from '@angular/core';
import { ListComponent } from '../../shared/components/list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { ModelId } from '../../core/models/model';
import { EventModel, EventStatus } from '../../core/models/event-model';
import { AdminEventService } from '../../core/services/admin-event.service';

@Component({
  selector: 'bs-project-event-list',
  templateUrl: 'project-event-list.component.html'
})
export class AdminProjectEventListComponent extends ListComponent<EventModel> implements OnInit {
  protected _projectId: ModelId;

  @Input()
  public set projectId(value: ModelId) {
    this._projectId = value;
  }

  public get EventStatus() {
    return EventStatus;
  }
  constructor(service: AdminEventService,
              activatedRoute: ActivatedRoute,
              router: Router,
              notificationService: NotificationService) {
    super(service, activatedRoute, router, notificationService);

    this._listName = 'project-events';
  }

  public ngOnInit() {
    this._queryParams.projectId = this._projectId.toString();
    super.ngOnInit();
  }

  public remove(eventId?: ModelId) {
    (<AdminEventService> this._service).removeProject(eventId, this._projectId).subscribe(() => this._update());
  }
}
