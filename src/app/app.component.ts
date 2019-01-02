import { Component,OnInit } from '@angular/core';
import {DataService} from "./data-service";
import {Person} from "./model/person";
import {FormGroup, FormControl,FormArray, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  public people:Person[];
  public person: Person=null;
  public currentPersonEdit: Person;
  public currentLocation=null;
  public currentLocationAddress=null;
  public locationAdd='';
  public toggle=false;
  public addPersonToggle=false;
  personForm: FormGroup;
  constructor(private dataService:DataService) {
  }

  ngOnInit() {
    this.getPeople();
    this.person= new Person();
    this.initForm();
    this.getLocation();

    }


  getLocation(){
    this.dataService.getLocation().subscribe((item)=> {

        this.currentLocation = item['results'][0]['geometry']['location'];
      },
      error => console.log('oops', error)
    )
  }
  getPersonLocation(){

    this.dataService.getLocationBylatLong(this.currentLocation['lat'],this.currentLocation['lng']).subscribe((data)=>{
      console.log(data)
       this.locationAdd=data['results'][3]['formatted_address'];

    });
  }


  getPeople() {
    this.dataService.getData().subscribe((item)=> {

      this.people = item['peoples'];

      this.people.forEach((item)=>{
       this.dataService.getLocationBylatLong(item['location']['lat'],item['location']['lng']).subscribe((data)=>{ item['location']=data['results'][3]['formatted_address']})
      })



      },
      error => console.log('oops', error)
    )
  }

  deletePerson(id:number) {
    console.log('person del')
    this.people = this.people.filter((item)=> {

      return item._id != id
    })
  }
  editPerson(id:number){

    this.currentPersonEdit=this.people.filter((item)=>{return item._id==id})[0];
    this.initForm();
    this.toggle=true;
    this.addPersonToggle=false;
    console.log('this.currentPersonEdit',this.currentLocation);
  }

  //Forms model
  private initForm(){

    let _id=null;
    let full_name='';
    let location=this.currentLocation;
    let company=null;
    let position='';
    let address_street=null;
    let address_city=null;
    let phone =null;
    let img =null;

    if(this.currentPersonEdit!=undefined){

      _id=this.currentPersonEdit._id;
      full_name=this.currentPersonEdit.full_name;
      location=this.currentLocation;
      company=this.currentPersonEdit.company;
      position=this.currentPersonEdit.position;
      address_street=this.currentPersonEdit.address_street;
      address_city=this.currentPersonEdit.address_city;
      phone =this.currentPersonEdit.phone;
      img =this.currentPersonEdit.img;

    }
    //noinspection TypeScriptValidateTypes
    this.personForm= new FormGroup({
      'full_name': new FormControl(full_name,[Validators.required, Validators.pattern(/^[A-Z]/)] ),
      '_id': new FormControl(_id,[Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      'location': new FormControl(location),
      'company': new FormControl(company,Validators.required ),
      'position': new FormControl(position,Validators.required ),
      'address_street': new FormControl(address_street,Validators.required ),
      'address_city': new FormControl(address_city,Validators.required ),
      'phone' : new FormControl(phone,[Validators.required, Validators.pattern(/^\([0-9]*\)[ \t]+[0-9]*[-][0-9]*/)]),
      'img': new FormControl(img,Validators.required ),

    })
  }
  onSubmit(){
    if(!this.addPersonToggle){
      console.log(this.personForm.value)
      for(let i=0;i<this.people.length;i++){
        if(this.personForm.value._id==this.people[i]['_id']){
          this.people[i]=this.personForm.value;
          this.dataService.getLocationBylatLong(this.people[i]['location']['lat'],this.people[i]['location']['lng']).subscribe((data)=>{ this.people[i]['location']=data['results'][3]['formatted_address']})

        }
      }
    }
    if(this.addPersonToggle){
      const person=this.personForm.value;
      person._id=this.people.length+1;
      person.location=this.currentPersonEdit.location;
      this.dataService.getLocationBylatLong(person['location']['lat'],person['location']['lng']).subscribe((data)=>{ person['location']=data['results'][3]['formatted_address']})
      this.people.push(person);
      console.log('this.people',this.people);


    }

    this.toggle=false;

  }

  addPerson(){
    this.getPersonLocation();
    this.currentPersonEdit=new Person();
    this.initForm();
    this.toggle=true;
    this.getLocation();
    this.currentPersonEdit=this.personForm.value;
    this.currentPersonEdit['location']=this.currentLocation;
    console.log('add add',this.currentPersonEdit);
    this.addPersonToggle=true;

  }
  onClosePopUp(){
    this.toggle=false;
  }

}
