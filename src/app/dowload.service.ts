import { Injectable } from '@angular/core';

import { convertArrayToCSV } from 'convert-array-to-csv';

@Injectable({
  providedIn: 'root'
})
export class DowloadService {
  constructor() { }
  
  downloadFile(data:any, filename='data') {
    // let csvData = convertArrayToCSV(data,{header:headers,separator:','})
    // console.log(csvData)
    let blob = new Blob(['\ufeff' + data], { type: 'text/html;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".html");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}
// ConvertToCSV(objArray:any, headerList:any) {
//      let array = typeof objArray != 'object' ?  JSON.parse(objArray)  : objArray;
//      let str = '';
//      let row = 'S.No,';
// for (let index in headerList) {
//          row += headerList[index] + ',';
//      }
//      row = row.slice(0, -1);
//      str += row + '\r\n';
//      let keys = Object.keys(array)
//      console.log(keys.length)
//      for (let i = 0; i < keys.length; i++) {
//          let line = (i+1)+'';
//          for (let index in headerList) {
//             let head = headerList[index];
//             line += ',' + array[i][head];
//             console.log(line)
//          }
//          str += line + '\r\n';
//      }
//      return str;
//  }
 }

