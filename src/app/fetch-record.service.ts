import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchRecordService {

  datetime = ''


  server_address = "http://localhost:5000/record"

  constructor(private http: HttpClient) { }

  populate(datetime:string){
    this.datetime = datetime
    //console.log(this.datetime)
  }

  getRecord():Observable<any>{

    if (!this.datetime) {
      return new Observable<any>(observer => {
        observer.next('no data');
        //console.log("no data")
        observer.complete();
      });
    }

    let headers = new HttpHeaders({
      'Authorization' : <string>localStorage.getItem('Authorization')
    })

    return this.http.post(this.server_address,{'date and time': this.datetime},{headers:headers})
  }
}
