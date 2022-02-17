import { Pipe, PipeTransform } from '@angular/core';

// todo no use
@Pipe({
    name: 'listFilter'
})
export class ListFilterPipe implements PipeTransform {
    transform(items: any[], filter: any) {
        if (!items || !filter) {
            return items;
        }
        return items.filter((item: any) => item[filter.key] === filter.value);
    }
}