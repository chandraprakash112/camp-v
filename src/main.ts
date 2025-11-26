import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideToastr, ToastrComponentlessModule } from 'ngx-toastr';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { authInterceptorProviders } from './app/theme/shared/auth.interceptor';
import { commonReducer } from './app/store/common/common.reducer';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule,ToastrComponentlessModule),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore({"common": commonReducer}),
    provideToastr({
      timeOut: 1500,
      positionClass: 'toast-top-right',
      // preventDuplicates: true,
      newestOnTop: true,
    }),
    authInterceptorProviders,
  ],
}).catch((err) => console.error(err));
