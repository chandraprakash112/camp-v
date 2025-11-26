import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
// import * as moment from 'moment';
import { getStoreData, SELECTOR } from 'src/app/store/common/common.selectors';

@Pipe({
  name: 'dateTimeFormat',
  pure: true,
})
export class DateTimeFormatPipe implements PipeTransform {
  dateFormat = 'YYYY-MM-DD';
  timeFormat = 'HH:mm:ss';
  constructor(private store: Store) {
    this.store.select(getStoreData(SELECTOR.APP_CONFIG)).subscribe((data) => {
      if (data) {
        this.dateFormat = data.dateFormat || "YYYY-MM-DD";
        this.timeFormat = data.timeFormat || "HH:mm:ss";
      }
    });
  }

  transform(value: unknown, formatType: string): unknown {
    if (value) {
      // if (formatType == 'date') {
      //   return moment(value).format(this.dateFormat);
      // } else if (formatType == 'time') {
      //   return moment(value, 'HH:mm:ss').format(this.timeFormat);
      // } else if (formatType == 'datetime') {
      //   return moment(value).format(this.dateFormat + ' ' + this.timeFormat);
      // } else if (formatType == 'relative') {
      //   return moment(value).fromNow();
      // } else {
      //   return value;
      // }
    } else {
      return '-';
    }
  }
}
