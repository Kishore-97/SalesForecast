import { Component, OnInit } from '@angular/core';
import { PredictService } from '../predict.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DowloadService } from '../dowload.service';
import { ngxCsv } from 'ngx-csv';
import { ActivatedRoute, Router } from '@angular/router';
import { FetchRecordService } from '../fetch-record.service';
import { DebugService } from '../debug.service';
import { SessionService } from '../session.service';
import { LogoutPopupComponent } from '../logout-popup/logout-popup.component';
import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./pure.css', './output.component.css']
})
export class OutputComponent implements OnInit {

  constructor(private predict: PredictService,
    private santize: DomSanitizer,
    private download: DowloadService,
    private router: Router,
    private record: FetchRecordService,
    private actRoute: ActivatedRoute,
    private decode : DebugService,
    private session: SessionService,
    private matdialog: MatDialog) {
  }

  isSessionValid = this.session.checkSessionValid()
  data: any
  predictions: any
  pred_array: any[] = [];
  full_array: any[] = []
  pred_file = []
  full_file = []
  full: any
  img_data: any
  pred_img: any
  full_img: any
  best_model_name = ''
  best_params = ''
  best_trans = ''
  error_rate = ''
  EDA: any
  EDA_html!: SafeHtml;
  pred_keys = []
  full_keys = []
  pred_toggle = false
  load_toggle = false
  img_slider: any[] = []
  back_f_rmse = ''

  ngOnInit(): void {

    this.actRoute.queryParams.subscribe(params => {
      let fetchDataFromPredict = params['fetchDataFromPredict']
      console.log(fetchDataFromPredict)
      if (fetchDataFromPredict) {
        this.forecastNew()
      }
      else {
        this.showRecord()
      }
    })
  }

  forecastNew(): void {
    this.pred_toggle = true
    this.load_toggle = true
    console.log("from out:", this.predict.dataset)
    this.predict.send_post()
      .subscribe((data) => {
        if (data == "no data") {
          this.load_toggle = false
          // window.alert("There is no data present to predict with")
          // this.router.navigateByUrl('/admin')
        } 
        else {
          console.log(data)
          this.load_toggle = false
          // data = data
          if (data['message'] == 'token present') {
            console.log('token present and working +', data['message'])
            this.data = data
            this.DisplayData()
          }
          else {
            console.log(data['message'])
          } 
        }
      },onerror => this.predictionError(onerror))
  }

  showRecord(): void {
    this.pred_toggle = true
    this.load_toggle = true
    this.record.getRecord()
      .subscribe((data) => {
        if (data == "no data") {
          this.load_toggle = false
          window.alert("There is no data present to show")
          // this.router.navigateByUrl('/admin')
        }
        else {
          console.log(data)
          this.load_toggle = false
          // data = data
          if (data['message'] == 'token present') {
            console.log('token present and working +', data['message'])
            this.data = data
            this.DisplayData()
          }
          else {
            console.log(data['message'])
            this.session.setSessionValidity(false)
            localStorage.removeItem('Authorization')
          }
        }
      }
      )
  }

  // onSubmit() {
  //   this.pred_toggle = true
  //   this.load_toggle = true
  //   console.log("from out:", this.predict.dataset)
  //   this.predict.send_post(this.predict.dataset, this.predict.target_var, this.predict.date_var,
  //     this.predict.periodicity, this.predict.range).subscribe((data) => {
  //       console.log(data)

  //       this.load_toggle = false

  //       data = data

  //       this.predictions = data[0]
  //       this.full = data[1]
  //       this.img_data = data[2]
  //       this.best_model_name = data[3]
  //       this.best_params = data[4]
  //       this.best_trans = data[5]
  //       this.error_rate = data[6]
  //       this.EDA = data[7]
  //       this.pred_keys = data[8]
  //       this.full_keys = data[9]
  //       this.back_f_rmse = data[10]
  //       console.log(this.full_keys)

  //       this.EDA_html = this.santize.bypassSecurityTrustHtml(this.EDA)
  //       console.log(this.error_rate)

  //       console.log(typeof (this.predictions))
  //       this.predictions = JSON.parse(this.predictions)
  //       this.full = JSON.parse(this.full)
  //       this.best_params = JSON.stringify(this.best_params)
  //       this.best_trans = JSON.stringify(this.best_trans)
  //       this.error_rate = this.error_rate.slice(-58)

  //       console.log(this.predictions)



  //       this.best_params = this.best_params.replace(",", "\n")
  //       this.best_trans = this.best_trans.replace(",", "\n")

  //       this.pred_img = this.img_data['pred']
  //       this.full_img = this.img_data['full']
  //       console.log(this.predictions, this.full, this.img_data)


  //       for (let col in this.predictions) {
  //         let sub_array = Array()
  //         for (let val in this.predictions[col]) {
  //           sub_array.push(this.predictions[col][val])
  //         }
  //         this.pred_array.push(sub_array)
  //       }
  //       for (let col in this.full) {
  //         let sub_array = Array()
  //         for (let val in this.full[col]) {
  //           sub_array.push(this.full[col][val])
  //         }
  //         this.full_array.push(sub_array)
  //       }

  //       console.log('pred array:', this.pred_array)
  //       console.log('full array:', this.full_array)

  //       function transpose(a: any) {
  //         return a[0].map(function (_: any, c: string | number) { return a.map(function (r: { [x: string]: any; }) { return r[c]; }); });
  //       }

  //       this.pred_file = transpose(this.pred_array)
  //       this.full_file = transpose(this.full_array)
  //       console.log(this.pred_file)

  //       for (let img in this.img_data) {
  //         img = this.img_data[img]
  //         this.img_slider.push({ image: 'data:image/jpeg;base64,' + img, thumbImage: 'data:image/jpeg;base64,' + img })
  //       }
  //     })
  // }

  DisplayData(): void {

    this.predictions = this.data['pred_json']
    this.full = this.data['full_json']
    this.img_data = this.data['img_data']
    this.best_model_name = this.data['best_mod']
    this.best_params = this.data['best_par']
    this.best_trans = this.data['best_trans']
    this.error_rate = this.data['error_rate']
    this.EDA = this.data['EDA']
    this.pred_keys = this.data['pred_head']
    this.full_keys = this.data['full_head']
    this.back_f_rmse = this.data['rmse']
    console.log(this.full_keys)

    this.EDA_html = this.santize.bypassSecurityTrustHtml(this.EDA)
    console.log(this.EDA_html)
    console.log(this.error_rate)

    console.log(typeof (this.predictions))
    this.predictions = JSON.parse(this.predictions)
    this.full = JSON.parse(this.full)
    this.best_params = JSON.stringify(this.best_params)
    this.best_trans = JSON.stringify(this.best_trans)
    this.error_rate = this.error_rate.slice(-58)

    console.log(this.predictions)


    this.best_params = this.best_params.replace(",", "\n")
    this.best_trans = this.best_trans.replace(",", "\n")

    this.pred_img = this.img_data['pred']
    this.full_img = this.img_data['full']
    console.log(this.predictions, this.full, this.img_data)


    for (let col in this.predictions) {
      let sub_array = Array()
      for (let val in this.predictions[col]) {
        sub_array.push(this.predictions[col][val])
      }
      this.pred_array.push(sub_array)
    }
    for (let col in this.full) {
      let sub_array = Array()
      for (let val in this.full[col]) {
        sub_array.push(this.full[col][val])
      }
      this.full_array.push(sub_array)
    }

    console.log('pred array:', this.pred_array)
    console.log('full array:', this.full_array)

    function transpose(a: any) {
      return a[0].map(function (_: any, c: string | number) { return a.map(function (r: { [x: string]: any; }) { return r[c]; }); });
    }

    this.pred_file = transpose(this.pred_array)
    this.full_file = transpose(this.full_array)
    console.log(this.pred_file)

    for (let img in this.img_data) {
      img = this.img_data[img]
      this.img_slider.push({ image: 'data:image/jpeg;base64,' + img, thumbImage: 'data:image/jpeg;base64,' + img })
    }
  }

  predSave() {
    let options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      noDownload: false,
      headers: this.pred_keys
    }
    new ngxCsv(this.pred_file, 'predictions', options)
  }

  fullSave() {
    let options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      noDownload: false,
      headers: this.full_keys
    }
    new ngxCsv(this.full_file, 'Original & predictions', options)
  }

  viewEDA() {
    this.download.downloadFile(this.EDA_html)
  }

  predictionError(e: any) {
    this.load_toggle = false
    this.decode.sendpost().subscribe((data)=>{
      console.log(data)
      if(data['message'] == 'token valid'){
        window.alert('An error occured while predicting. Please try again')
      }
      else{
        this.session.setSessionValidity(false)
        localStorage.removeItem('Authorization')
      }
    })
  }
  
  openLogout(e:any){
    console.log('clicked')
    this.matdialog.open(LogoutPopupComponent)
  }
}