import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideState, provideStore } from '@ngrx/store';
import { favCounterReducer } from './states-NGRX/favcounter/favcounter.reducer';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideToastr(),
    provideAnimationsAsync(),
    provideStore(),
    provideState({ name: 'counter', reducer: favCounterReducer }),
  ],
};
