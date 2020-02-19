/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ListComponentDirective } from '../../shared/components/list-component.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { ModelId } from '../../core/models/model';
import { ProjectModel } from '../../core/models/project-model';
import { AdminProjectService } from '../../core/services/admin-project.service';

@Component({
  selector: 'bs-group-project-list',
  templateUrl: 'group-project-list.component.html'
})
export class AdminGroupProjectListComponent extends ListComponentDirective<ProjectModel> implements OnInit, OnChanges {
  protected _groupId: ModelId;

  @Input()
  public set groupId(value: ModelId) {
    this._groupId = value;
  }

  constructor(service: AdminProjectService,
              activatedRoute: ActivatedRoute,
              router: Router,
              notificationService: NotificationService) {
    super(service, activatedRoute, router, notificationService);

    this._listName = 'group-projects';
  }

  public ngOnInit() {
    this._queryParams.groupId = this._groupId.toString();
    super.ngOnInit();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['groupId']) {
      this._queryParams.groupId = this._groupId.toString();
      this._update();
    }
  }
}
