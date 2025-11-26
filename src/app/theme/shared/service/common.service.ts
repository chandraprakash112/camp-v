import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private storage: Storage = localStorage;
  private secretKey = 'itsmANGULARsampark';

  apiPersonaResponse: any;
  personaResponse: any;
  userDetails: any;

  constructor(private cookieService: CookieService) {
    this.userDetails = this.getLocalStorageData('userDetails');
  }

  setLocalStorageData(key: string, value: any): void {
    this.storage.setItem(key, this.encrypt(JSON.stringify(value)));
  }

  getLocalStorageData(key: string): any {
    const data = this.storage?.getItem(key);
    if (!data) return null;

    const decrypted = this.decrypt(data);
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted; // fallback if it wasn’t JSON
    }
  }

  removeLocalStorageData(key: string): void {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.removeItem('userToken');
    this.storage.removeItem('userDetails');
  }

  setCookieData(key: string, value: string) {
    this.removeCookieData(key);
    this.cookieService.set(key, value);
  }

  getCookieData(key: string) {
    return this.cookieService.get(key);
  }

  removeCookieData(key: string) {
    this.cookieService.delete(key);
  }

  // setSessionStorageData(key: string, value: string) {
  //   sessionStorage.setItem(key, JSON.stringify(value));
  // }

  // getSessionStorageData(key: string) {
  //   const data = sessionStorage.getItem(key);
  //   return data ? JSON.parse(data) : null;
  // }

  // removeSessionStorageData(key: string) {
  //   sessionStorage.removeItem(key);
  // }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.secretKey).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.secretKey).toString(
      CryptoJS.enc.Utf8
    );
  }

  acceptOnlyAlphanumeric(key) {
    var charCode = key.which ? key.which : key.keyCode;
    if (
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122) &&
      charCode != 56 &&
      charCode > 31 &&
      (charCode < 48 || charCode > 57)
    ) {
      key.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  acceptOnlyNumeric(event): boolean {
    var regex = new RegExp('^[0-9]+$');
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (regex.test(key)) {
      return true;
    } else {
      return false;
    }
  }

  acceptOnlyMobileNumber(event): boolean {
    return this.acceptOnlyNumeric(event) && event.target.value.length < 10;
  }

  acceptOnlyZipCode(event): boolean {
    return this.acceptOnlyNumeric(event) && event.target.value.length < 6;
  }

  acceptOnlyAlphabets(event): boolean {
    var regex = new RegExp('^[a-zA-Z]+$');
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (regex.test(key)) {
      return true;
    } else {
      return false;
    }
  }

  acceptOnlyAlphabetsWithSpaces(event): boolean {
    var regex = new RegExp('^[a-zA-Z ]+$');
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    return regex.test(key);
  }

  restrictInput(event, fieldType) {
    const keyCode = event.keyCode || event.which;
    const key = event.key;

    if (fieldType === 'city' || fieldType === 'state') {
      if (!/^[A-Za-z\s]$/.test(key) && keyCode !== 8 && keyCode !== 32) {
        event.preventDefault();
      }
    } else if (fieldType === 'address') {
      if (!/^[A-Za-z0-9\s,\/\-\.\#]*$/.test(key) && keyCode !== 8) {
        event.preventDefault();
      }
    } else if (fieldType === 'country') {
      if (!/^[A-Za-z\s]*$/.test(key) && keyCode !== 8) {
        event.preventDefault();
      }
    } else if (
      fieldType === 'organizationName' ||
      fieldType === 'orgName' ||
      fieldType === 'companyName'
    ) {
      if (!/^[A-Za-z0-9\s&\.']*$/.test(key) && keyCode !== 8) {
        event.preventDefault();
      }
    }
  }

  getPersonaData(persona:any = null) {
    if(persona){
      this.apiPersonaResponse = persona;
    }else if (!this.apiPersonaResponse) {
      this.apiPersonaResponse = this.getLocalStorageData('persona') || null;
    }

    let userList = this.apiPersonaResponse?.[0]?.slice(1) || [];
    const moduleList = this.apiPersonaResponse?.[1]?.data || [];

    userList.map((user: any) => {
      let arr = [];
      moduleList.forEach((module: any) => {
        const obj = {
          id: module?.id,
          title: module.title,
          menu_name: module?.menu_name,
          controller_title: module?.controller_title,
          display_title: module?.display_title,
        };

        if (user?.id == 1) {
          arr.push({
            ...obj,
            status: 'Yes',
            allowView: true,
            allowEdit: true,
          });
        } else {
          let data = module?.role_access?.filter(
            (el: any) => el?.role_id === user?.id,
          );
          arr.push({
            ...obj,
            status: data?.[0]?.status || 'No',
            allowView: data?.[0]?.status == 'Yes',
            allowEdit: data?.[0]?.status == 'Yes',
          });
        }
      });
      user.modules = arr;
    });
    // this.personaResponse = userList;
    console.log(userList,moduleList);
    
    return userList;
  }

  viewPage(role_id: any, pageName: any) {
    // if (!this.apiPersonaResponse) {
    //   this.personaResponse = this.getPersonaData();
    // }

    // if (this.apiPersonaResponse) {
    //   const role = this.personaResponse?.find(
    //     (user: any) => user?.id == this.userDetails?.role_id
    //   );

    //   const pagePermission = role?.modules?.find(
    //     (mod: any) => mod?.title?.trim() === pageName
    //   );

    //   if (pagePermission?.status === 'Yes') {
    //     return pagePermission;
    //   }
    // }

    return {
      allowView: true,
      allowEdit: true,
    };
  }

  viewPageGroup(role_id: any, module: any) {
    // if (!this.apiPersonaResponse) {
    //   this.getPersonaData();
    // }

    if (this.apiPersonaResponse) {
      // const moduleList = this.apiPersonaResponse?.[1]?.data || [];
      // console.log(moduleList, role_id, module);
      // let data = moduleList.filter((page: any) => page?.title === module);
      // console.log(data[0],role_id,module);

      let obj: any = {};
      // if (pageGroupName) {
      //   data[0]?.role_access?.forEach((el: any) => {
      //     // if (el?.role_id == role_id) {
      //     //   (obj.allowView = el?.allowView),
      //     //     (obj.allowEdit = el?.allowEdit),
      //     //     (obj.pageName = el?.pageName),
      //     //     (obj.pageId = el?.pageId);
      //     // }
      //   });
      // }
      // return obj;
    }
    return {
      allowView: true,
      // allowEdit: true,
    };

    // if (this.apiPersonaResponse) {
    //   var data = this.apiPersonaResponse[module]?.pageGroupDetails;
    //   let obj: any = {};
    //   if (data?.pageGroupName == pageGroupName) {
    //     (obj.allowView = data?.allowView),
    //       (obj.allowEdit = data?.allowEdit),
    //       (obj.pageGroupName = data?.pageGroupName),
    //       (obj.pageGroupId = data?.pageGroupId);
    //   }
    //   return obj;
    // }
  }
}
