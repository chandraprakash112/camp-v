import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value 
    ? { 'passwordMismatch': true } 
    : null;
}

export function minTextLength(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      const div = document.createElement('div');
      div.innerHTML = control.value;
      const text = div.textContent || div.innerText || '';
      return text.trim().length < min ? { minTextLength: { requiredLength: min, actualLength: text.trim().length } } : null;
    }
    return null;
  };
}