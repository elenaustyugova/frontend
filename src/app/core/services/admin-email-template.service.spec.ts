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

import { Injector } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { ConfirmationService } from './confirmation.service';
import { AuthServiceStub, ConfigurationServiceStub, ConfirmationStub, NotificationServiceStub, RouterStub } from '../../stubs/stubs.utils';
import { AdminEmailTemplateService } from './admin-email-template.service';
import { Observable } from 'rxjs';
import { EmailTemplateModel } from '../models/email-template-model';
import { ConfigurationService } from './configuration.service';

describe('AdminEmailTemplateService Service', () => {
  let testService: AdminEmailTemplateService;
  let injector: Injector;
  let model: EmailTemplateModel;

  beforeEach(() => {
    model = new EmailTemplateModel();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        AdminEmailTemplateService,
        { provide: NotificationService, useClass: NotificationServiceStub },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ConfirmationService, useClass: ConfirmationStub },
        { provide: ConfigurationService, useClass: ConfigurationServiceStub }
      ]
    });
    injector = getTestBed();
    testService = injector.get(AdminEmailTemplateService);
  });

  afterEach(() => {
    injector = undefined;
    testService = undefined;
  });

  it('should be defined', () => {
    expect(AdminEmailTemplateService).toBeDefined();
    expect(testService).toBeDefined();
    expect(testService instanceof AdminEmailTemplateService).toBeTruthy();
  });

  it('should return an Observable when clone() called', () => {
    let getResponse = testService.clone(model);

    expect(getResponse).toEqual(jasmine.any(Observable));
  });

  it('should call load', () => {
    const testSave = spyOn(testService, 'save');

    testService.clone(model);
    expect(testSave).toHaveBeenCalled();
  });
});
