import { Component, Input, OnInit, Output } from '@angular/core';
import { PredictService } from '../predict.service';
import { EDAComponent } from '../eda/eda.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DowloadService } from '../dowload.service';
import { ngxCsv } from 'ngx-csv';
import { Router } from '@angular/router';
@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./pure.css','./output.component.css']
})
export class OutputComponent implements OnInit {



  constructor(private predict: PredictService,
    private santize:DomSanitizer,
    private download: DowloadService) {
  }
  data: any
  predictions: any
  pred_array:any[] = [];
  full_array:any[] = []
  pred_file=[]
  full_file=[]
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
  img_slider:any[]=[]
  back_f_rmse = ''

  ngOnInit(): void { }


  onSubmit() {
    this.pred_toggle = true
    this.load_toggle = true
    console.log("from out:", this.predict.dataset)
    this.predict.send_post(this.predict.dataset, this.predict.target_var, this.predict.date_var,
      this.predict.periodicity, this.predict.range).subscribe((data) => {
        console.log(data)

        this.load_toggle=false

        this.data = data

        this.predictions = this.data[0]
        this.full = this.data[1]
        this.img_data = this.data[2]
        this.best_model_name = this.data[3]
        this.best_params = this.data[4]
        this.best_trans = this.data[5]
        this.error_rate = this.data[6]
        this.EDA = this.data[7]
        this.pred_keys=this.data[8]
        this.full_keys=this.data[9]
        this.back_f_rmse = this.data[10]
        console.log(this.full_keys)
        
        this.EDA_html = this.santize.bypassSecurityTrustHtml(this.EDA)
        console.log(this.error_rate)

        console.log(typeof(this.predictions))
        this.predictions = JSON.parse(this.predictions)
        this.full = JSON.parse(this.full)
        this.best_params=JSON.stringify(this.best_params)
        this.best_trans=JSON.stringify(this.best_trans)
        this.error_rate=this.error_rate.slice(-58)

        console.log(this.predictions)

        

        this.best_params=this.best_params.replace(",","\n")
        this.best_trans=this.best_trans.replace(",","\n")

        this.pred_img = this.img_data['pred']
        this.full_img = this.img_data['full']
        console.log(this.predictions,this.full,this.img_data)
        

        for(let col in this.predictions){
         let sub_array = Array()
         for(let val in this.predictions[col]){
            sub_array.push(this.predictions[col][val])
         }
         this.pred_array.push(sub_array)
        }
        for(let col in this.full){
          let sub_array = Array()
          for(let val in this.full[col]){
             sub_array.push(this.full[col][val])
          }
          this.full_array.push(sub_array)
         }

        console.log('pred array:',this.pred_array)
        console.log('full array:',this.full_array)

        function transpose(a:any) {
          return a[0].map(function (_: any, c: string | number) { return a.map(function (r: { [x: string]: any; }) { return r[c]; }); });
      }

      this.pred_file = transpose(this.pred_array)
      this.full_file = transpose(this.full_array)
      console.log(this.pred_file)

      for(let img in this.img_data){
        img = this.img_data[img]
        this.img_slider.push({image:'data:image/jpeg;base64,'+img,thumbImage:'data:image/jpeg;base64,'+img})
      }
      })
  }
  predSave(){
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
    new ngxCsv(this.pred_file,'predictions',options)
  }

  fullSave(){
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
    new ngxCsv(this.full_file,'predictions',options)
  }

  viewEDA(){
    this.download.downloadFile(this.EDA_html)
  }

}