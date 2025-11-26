import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pagination',
  pure: true,
})
export class PaginationPipe implements PipeTransform {
  transform(array: any[], currentPage: number, pageSize: number, useApiPagination): any[] {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }

    if(useApiPagination) {
      return array;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + (+pageSize);
    return array.slice(startIndex, endIndex);
  }
}
