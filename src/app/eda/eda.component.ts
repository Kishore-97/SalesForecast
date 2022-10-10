import { Component,OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-eda',
  templateUrl: './eda.component.html',
  styleUrls: ['./eda.component.css']
})
export class EDAComponent implements OnInit {
  EDA!:SafeHtml
  constructor() { }

  ngOnInit(): void {
  }
populate(eda:any){
  this.EDA = eda
}
}
