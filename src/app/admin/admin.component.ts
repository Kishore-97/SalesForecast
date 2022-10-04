import { Binary } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { PredictService } from '../predict.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  dataset: [][] = [];
  headers: [] = [];
  target_var = ''
  range: Number = 0
  periodicity_options = ['Days', 'Weeks', 'Months','Years']
  periodicity = ''
  date_var= ''
  sheet:any

  constructor(private pred:PredictService,
              private router:Router) { }

  ngOnInit(): void {
    
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target)
    if (target.files.length !== 1) {
      throw new Error("Cannot use more than 1 file")
    }

    const reader: FileReader = new FileReader()

    reader.onload = (e: any) => {
      const bstr: string = e.target.result

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' })
      const wsname: string = wb.SheetNames[0]
      const ws: XLSX.WorkSheet = wb.Sheets[wsname]
      console.log(ws)
      this.sheet = ws
      console.log("sheet:",this.sheet)
      this.dataset = (XLSX.utils.sheet_to_json(ws, { header: 1 }))
      console.log(this.dataset)
      this.headers = this.dataset[0]
      console.log(this.headers)
    }

    reader.readAsBinaryString(target.files[0])
  }

  targetSubmit(t: any) {
    this.target_var = t.target.querySelector('#targetvar').value
    this.periodicity = t.target.querySelector('#periodicity').value
    this.range = t.target.querySelector('#range').value
    this.date_var = t.target.querySelector('#datevar').value
    this.pred.populate(this.sheet,this.target_var,this.date_var, this.periodicity, this.range)
    this.router.navigate(['/output'])
  }

}
