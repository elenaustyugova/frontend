import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListComponent } from '../../shared/components/list.component';
import { RelationModel } from '../../core/models/relation-model';
import { RelationService } from '../../core/services/relation.service';

@Component({
  moduleId: module.id,
  selector: 'bs-project-relation-list',
  templateUrl: 'project-relation-list.component.html'
})
export class ProjectRelationListComponent extends ListComponent<RelationModel> implements OnInit, OnChanges {
  protected _projectId: string = 'null';

  @Input()
  public set projectId(value: string) {
    this._projectId = value;
  }

  public get projectId() {
    return this._projectId;
  }

  constructor(service: RelationService,
              activatedRoute: ActivatedRoute,
              router: Router) {
    super(service, activatedRoute, router);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['projectId']) {
      Object.assign(this._queryParams, { projectId: this._projectId });
      this._update();
    }
  }
}