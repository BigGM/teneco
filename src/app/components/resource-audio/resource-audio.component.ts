import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resource-audio',
  templateUrl: './resource-audio.component.html',
  styleUrls: ['./resource-audio.component.css']
})
export class ResourceAudioComponent implements OnInit {

  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png",
    maxSize: "1",
    uploadAPI:  {
      url:"https://example-file-upload-api",
      headers: {
     "Content-Type" : "text/plain;charset=UTF-8",
     //"Authorization" : `Bearer ${token}`
      }
    },
    theme: "dragNDrop",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: true
};


  constructor() { }

  ngOnInit() {
  }

}
