import { Component, Input, OnInit, Output } from '@angular/core';
import { PredictService } from '../predict.service';
import { AdminComponent } from '../admin/admin.component';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit {

  

  constructor(private predict:PredictService,
              private admin: AdminComponent) { 
              }
  output = ''

  
  ngOnInit(): void {}

  
  onSubmit(){
    console.log("from out:",this.predict.dataset)
    this.predict.send_post(this.predict.dataset,this.predict.target_var,this.predict.date_var,
    this.predict.periodicity,this.predict.range).subscribe(data =>{
      console.log(data)
    })
  }

}