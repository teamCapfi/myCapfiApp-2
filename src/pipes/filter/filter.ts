import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(array : Array<any>, text : string) {
    if(array != null){
      return array.filter((item)=> item.identity.name.toLowerCase().includes(text.toLowerCase()));
    }else{
      return array;
    }
  }
}
