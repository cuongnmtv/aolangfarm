import { ComponentFixture, TestBed, fakeAsync, inject, tick, waitForAsync } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';

import { RegisterService } from './register.service';
import RegisterComponent from './register.component';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let comp: RegisterComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RegisterComponent],
      providers: [provideHttpClient(), FormBuilder],
    })
      .overrideTemplate(RegisterComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    comp = fixture.componentInstance;
  });

  it('should ensure the two passwords entered match', () => {
    comp.registerForm.patchValue({
      password: 'password',
      confirmPassword: 'non-matching',
    });

    comp.register();

    expect(comp.doNotMatch()).toBe(true);
  });

  it('should update success to true after creating an account', inject(
    [RegisterService, TranslateService],
    fakeAsync((service: RegisterService, mockTranslateService: TranslateService) => {
      jest.spyOn(service, 'save').mockReturnValue(of({}));
      mockTranslateService.currentLang = 'vi';
      comp.registerForm.patchValue({
        password: 'password',
        confirmPassword: 'password',
      });

      comp.register();
      tick();

      expect(service.save).toHaveBeenCalledWith({
        email: '',
        password: 'password',
        login: '',
        langKey: 'vi',
      });
      expect(comp.success()).toBe(true);
      expect(comp.errorUserExists()).toBe(false);
      expect(comp.errorEmailExists()).toBe(false);
      expect(comp.error()).toBe(false);
    }),
  ));

  it('should notify of user existence upon 400/login already in use', inject(
    [RegisterService],
    fakeAsync((service: RegisterService) => {
      const err = { status: 400, error: { type: LOGIN_ALREADY_USED_TYPE } };
      jest.spyOn(service, 'save').mockReturnValue(throwError(() => err));
      comp.registerForm.patchValue({
        password: 'password',
        confirmPassword: 'password',
      });

      comp.register();
      tick();

      expect(comp.errorUserExists()).toBe(true);
      expect(comp.errorEmailExists()).toBe(false);
      expect(comp.error()).toBe(false);
    }),
  ));

  it('should notify of email existence upon 400/email address already in use', inject(
    [RegisterService],
    fakeAsync((service: RegisterService) => {
      const err = { status: 400, error: { type: EMAIL_ALREADY_USED_TYPE } };
      jest.spyOn(service, 'save').mockReturnValue(throwError(() => err));
      comp.registerForm.patchValue({
        password: 'password',
        confirmPassword: 'password',
      });

      comp.register();
      tick();

      expect(comp.errorEmailExists()).toBe(true);
      expect(comp.errorUserExists()).toBe(false);
      expect(comp.error()).toBe(false);
    }),
  ));

  it('should notify of generic error', inject(
    [RegisterService],
    fakeAsync((service: RegisterService) => {
      const err = { status: 503 };
      jest.spyOn(service, 'save').mockReturnValue(throwError(() => err));
      comp.registerForm.patchValue({
        password: 'password',
        confirmPassword: 'password',
      });

      comp.register();
      tick();

      expect(comp.errorUserExists()).toBe(false);
      expect(comp.errorEmailExists()).toBe(false);
      expect(comp.error()).toBe(true);
    }),
  ));
});
