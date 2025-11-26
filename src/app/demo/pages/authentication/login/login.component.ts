// angular import
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/theme/shared/service/auth.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { DataLoaderService } from 'src/app/theme/shared/service/data-loader.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-login',
  imports: [SharedModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  signInForm!: FormGroup;
  isSubmitted = false;
  isPasswordVisible: boolean = false;
  errorMsg: string = '';
  constructor(
    private commonService: CommonService,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private dataLoaderService: DataLoaderService,
  ) {}

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, Validators.required],
      rememberMe: [false],
    });

    this.fetchRememberedCredential();
  }

  fetchRememberedCredential() {
    const savedEmail = this.commonService.getCookieData('savedEmail');
    const savedPassword = this.commonService.getCookieData('savedPassword');
    this.signInForm.patchValue({
      email: savedEmail,
      password: savedPassword,
      rememberMe: true,
    });
  }

  get formControl() {
    return this.signInForm.controls;
  }

  onLogin() {
    this.isSubmitted = true;
    let body = {
      email: this.signInForm.value.email.trim(),
      password: this.signInForm.value.password,
      // request: {
      //   requestData: {
      //     email: this.signInForm.value.email.trim(),
      //     password: this.signInForm.value.password,
      //   },
      // },
    };

    if (this.signInForm.valid) {
      this.spinner.show();
      this.authService.login(body).subscribe({
        next: (response: any) => {
          if (response?.status_code == 200 && response?.status == true) {
            this.errorMsg = '';
            // this.commonService.removeCookieData('savedEmail');
            // this.commonService.removeCookieData('savedPassword');
            document.cookie.split(';').forEach(function (c) {
              document.cookie = c
                .replace(/^ +/, '')
                .replace(
                  /=.*/,
                  '=;expires=' + new Date().toUTCString() + ';path=/',
                );
            });
            if (this.signInForm.value.rememberMe) {
              this.commonService.setCookieData(
                'savedEmail',
                this.signInForm.value.email,
              );
              this.commonService.setCookieData(
                'savedPassword',
                this.signInForm.value.password,
              );
            }
            this.commonService.setLocalStorageData(
              'userToken',
              response.data.token,
            );
            this.commonService.userDetails = response.data.user;
            this.commonService.setLocalStorageData(
              'userDetails',
              response.data.user,
            );

            this.dataLoaderService.fetchPersona();
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
              this.spinner.hide();
              //   this.authService.checkModuleVisibility().subscribe((res) => {
              //     this.spinner.hide();
              //     if (res.body.responseObject.configEnabled) {
              //       this.router.navigate(['/admin/dashboard']);
              //     } else {
              //       this.router.navigate(['/admin/setting']);
              //     }
              //   });
            }, 100);
          } else {
            this.spinner.hide();
            this.errorMsg = response.message;
            this.toastr.error(response.message);
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.errorMsg = err.error.message;
          this.toastr.error(err.error.message);
        },
      });
    }
  }

  togglePasswordIcon() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
