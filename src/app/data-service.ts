import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

import {Person} from "./model/person";

@Injectable()
export class DataService{

  configUrl = 'assets/data.json';
  goolgeLocation='https://maps.googleapis.com/maps/api/geocode/json?address=paris&key=AIzaSyCzZdedrabAs_Hol-zkOCL7sJN-YnOgjXQ';
  detectLocation='https://maps.googleapis.com/maps/api/geocode/json?latlng=';
  googleKey='&key=AIzaSyCzZdedrabAs_Hol-zkOCL7sJN-YnOgjXQ'
  people:Person[]=[];
  lng=null;
  lat=null;

  constructor(private http: HttpClient) {
    this.getData().subscribe((data)=>{

      this.people=data['peoples'];
    })
    this.getLocation().subscribe((data)=>{

      console.log(data);
    })


  }
  getData(){
    return this.http.get('assets/data.json');
  }

  getLocation(){
    return this.http.get(this.goolgeLocation)
    /*console.log(this.http.get(this.goolgeLocation));*/
  }
  getLocationBylatLong(lng,lat){


    return this.http.get(this.detectLocation+lng+','+lat+this.googleKey)
    /*console.log(this.http.get(this.goolgeLocation));*/
  }




}
