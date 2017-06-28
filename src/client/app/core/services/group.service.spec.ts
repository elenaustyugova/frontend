import { Injector } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { ConfirmationService } from './confirmation.service';
import { AuthServiceStub, ConfirmationStub, NotificationServiceStub, RouterStub } from '../../stubs/stubs.utils';
import { GroupService } from './group.service';
import { GroupModel } from '../models/group-model';
import { Observable } from 'rxjs/Observable';


export function main() {
  describe('EventService Service', () => {
    let testService: GroupService;
    let injector: Injector;
    let mockBackend: MockBackend;
    let connection: MockConnection;
    let model: GroupModel;

    beforeEach(() => {
      model = new GroupModel();
    });

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpModule],
        providers: [
          GroupService,
          { provide: NotificationService, useClass: NotificationServiceStub },
          { provide: AuthService, useClass: AuthServiceStub },
          { provide: XHRBackend, useClass: MockBackend },
          { provide: Router, useClass: RouterStub },
          { provide: ConfirmationService, useClass: ConfirmationStub}
        ]
      });
      injector = getTestBed();
      mockBackend = <any>injector.get(XHRBackend);
      testService = injector.get(GroupService);
      mockBackend.connections.subscribe((c: MockConnection) => connection = c);
    });

    afterEach(() => {
      injector = undefined;
      mockBackend = undefined;
      testService = undefined;
      connection = undefined;
    });

    it('should be defined', () => {
      expect(GroupService).toBeDefined();
      expect(testService).toBeDefined();
      expect(testService instanceof GroupService).toBeTruthy();
    });

    it('should return an Observable when addUser() called', () => {
      let getResponse = testService.addUser();

      expect(getResponse).toEqual(jasmine.any(Observable));
    });

    it('should return an Observable when removeUser() called', () => {
      let getResponse = testService.removeUser();

      expect(getResponse).toEqual(jasmine.any(Observable));
    });
  });
}