import { Component, inject } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import dayjs from 'dayjs/esm';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import locale from '@angular/common/locales/vi';
// jhipster-needle-angular-add-module-import JHipster will add new module here

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import MainComponent from './layouts/main/main.component';
import { TrackerService } from './core/tracker/tracker.service';

@Component({
  selector: 'jhi-app',
  template: '<jhi-main></jhi-main>',
  imports: [
    MainComponent,
    // jhipster-needle-angular-add-module JHipster will add new module here
  ],
})
export default class AppComponent {
  private readonly applicationConfigService = inject(ApplicationConfigService);
  private readonly iconLibrary = inject(FaIconLibrary);
  private readonly trackerService = inject(TrackerService);
  private readonly dpConfig = inject(NgbDatepickerConfig);

  constructor() {
    this.trackerService.setup();
    this.applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    registerLocaleData(locale);
    this.iconLibrary.addIcons(...fontAwesomeIcons);
    this.dpConfig.minDate = { year: dayjs().subtract(100, 'year').year(), month: 1, day: 1 };
  }
}
