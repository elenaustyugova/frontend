import { Injector } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { ConfirmationService } from './confirmation.service';
import { AuthServiceStub, ConfirmationStub, NotificationServiceStub, RouterStub } from '../../stubs/stubs.utils';
import { AdminEmailTemplateService } from './admin-email-template.service';
import { Observable } from 'rxjs/Observable';
import { EmailTemplateModel } from '../models/email-template-model';


export function main() {
  describe('AdminEmailTemplateService Service', () => {
    let testService: AdminEmailTemplateService;
    let injector: Injector;
    let mockBackend: MockBackend;
    let connection: MockConnection;
    let model: EmailTemplateModel;

    beforeEach(() => {
      model = new EmailTemplateModel();
    });

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpModule],
        providers: [
          AdminEmailTemplateService,
          { provide: NotificationService, useClass: NotificationServiceStub },
          { provide: AuthService, useClass: AuthServiceStub },
          { provide: XHRBackend, useClass: MockBackend },
          { provide: Router, useClass: RouterStub },
          { provide: ConfirmationService, useClass: ConfirmationStub}
        ]
      });
      injector = getTestBed();
      mockBackend = <any>injector.get(XHRBackend);
      testService = injector.get(AdminEmailTemplateService);
      mockBackend.connections.subscribe((c: MockConnection) => connection = c);
    });

    afterEach(() => {
      injector = undefined;
      mockBackend = undefined;
      testService = undefined;
      connection = undefined;
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
}