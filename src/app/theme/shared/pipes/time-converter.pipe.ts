import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeConverter'
})
export class TimeConverterPipe implements PipeTransform {

  transform(total: number, format: string = 'hours'): string {
    if (total === null || isNaN(total)) {
      return '';
    }
    let totalMinutes = 0;
    if(format == 'minutes') {
     totalMinutes = total;
    } else {
      totalMinutes = total * 60;
    }
    const days = Math.floor(totalMinutes / (24 * 60));
    const remainingMinutesAfterDays = totalMinutes % (24 * 60);

    const hours = Math.floor(remainingMinutesAfterDays / 60);
    const minutes = Math.round(remainingMinutesAfterDays % 60);
    let result = '';
    if (days > 0) {
      result += `${days} days `;
    }
    if (hours > 0 || (days === 0 && minutes === 0)) {
      result += `${hours} hours `;
    }
    if (minutes > 0 || (days === 0 && hours === 0)) {
      result += `${minutes} minutes`;
    }

    console.log(result);
    

    return result.trim();
  }
}


@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(inputDate: any): string {
    if (!inputDate) return '';

    const now = new Date().getTime();
    const date = new Date(inputDate).getTime();
    const diff = now - date;

    if (diff < 0) return 'in the future';

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    if (months < 12) return `${months} months ago`;

    return `${years} years ago`;
  }
}


@Pipe({
  name: 'timeOrDate',
  standalone: true,
})
export class TimeOrDatePipe implements PipeTransform {
  transform(value: any, type: string = ''): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();

    // Check if same day (year, month, day)
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (!isToday) {
      // Return formatted date: DD-MM-YYYY
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }

    // --- Time Ago Logic ---
    const diffMs = now.getTime() - date.getTime();
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;

    return `${hours} hours ago`;
    
  }
}

