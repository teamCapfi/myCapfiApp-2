import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(array : Array<any>, text : string) {
    if(array != null){
      console.log('Array',array);
      return array;
      //return array.filter((item)=> item.name.toLowerCase().includes(text.toLowerCase()));
    }else{
      return array;
    }
  }
}
