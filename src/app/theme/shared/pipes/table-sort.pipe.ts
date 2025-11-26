import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableSort',
  pure: true,
})
export class TableSortPipe implements PipeTransform {
  transform(array: any[], field: string, sortOrder: string = 'asc'): any[] {
    if (!Array.isArray(array) || !field) {
      return array;
    }

    const sampleValue = this.resolveField(array.find(item => this.resolveField(item, field) != null) || {}, field);
    const valueType = this.detectValueType(sampleValue);

    return [...array].sort((a, b) => {
      const valueA = this.resolveField(a, field);
      const valueB = this.resolveField(b, field);

      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return sortOrder === 'asc' ? -1 : 1;
      if (valueB == null) return sortOrder === 'asc' ? 1 : -1;

      let comparison = 0;

      if (valueType === 'date') {
        const timeA = this.parseDate(valueA)?.getTime() || 0;
        const timeB = this.parseDate(valueB)?.getTime() || 0;
        comparison = timeA - timeB;
      } else if (valueType === 'number') {
        comparison = Number(valueA) - Number(valueB);
      } else {
        comparison = valueA.toString().localeCompare(
          valueB.toString(),
          undefined,
          { numeric: true, sensitivity: 'base' }
        );
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  private detectValueType(value: any): 'date' | 'number' | 'string' {
    if (value == null) return 'string';

    if (typeof value === 'number') return 'number';

    if (typeof value === 'string') {
      if (!isNaN(Number(value))) return 'number';
      if (this.isValidDate(value)) return 'date';
      return 'string';
    }

    if (value instanceof Date) return 'date';

    return 'string';
  }

  private isValidDate(value: any): boolean {
    if (value == null) return false;
    const d = new Date(value);
    return d instanceof Date && !isNaN(d.getTime());
  }

  private parseDate(value: any): Date | null {
    if (value instanceof Date) return value;
    if (typeof value === 'string' && this.isValidDate(value)) {
      return new Date(value);
    }
    return null;
  }

  private resolveField(obj: any, field: string): any {
    return field.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
}
