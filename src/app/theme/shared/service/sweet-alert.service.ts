import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  showSuccessPopUp(title: string, subtitle:string, confirmText:string) {
    return Swal.fire({
      title: title,
      text: subtitle,
      icon: 'success',
      confirmButtonText: confirmText,
      confirmButtonColor: '#3085d6',
      showCancelButton: false,
      width: 350,
    });
  }
  showDeletePopUp(showConfirmBtn: boolean) {
    return Swal.fire({
      title: showConfirmBtn ? 'Are you sure?' : '',
      text: showConfirmBtn ? "You won't be able to revert this!" : 'Sorry, You don\'t have permission to delete this item.',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: showConfirmBtn,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
  }

  showWarningPopup(warningHeader: string, warningText: string) {
    return Swal.fire({
      title: warningHeader,
      text: warningText,
      icon: 'error',
      showCancelButton: false,
      showConfirmButton: true
    })
  }
}
