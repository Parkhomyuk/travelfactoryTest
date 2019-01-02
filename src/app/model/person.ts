export class Person {
  public _id :number;
  public full_name :string;
  public location:{};
  public company:string;
  public position:string;
  public address_street:string;
  public address_city:string;
  public phone :string;
  public img :string;

  constructor(id: number=null, full_name: string='', location={lat: 48.856614, lng: 2.3522219}, company: string='', position: string='', address_street: string='' ,
              address_city: string='',phone: string='', img=''  ) {

    this._id = id;
    this.full_name = full_name;
    this.location = location;
    this.company = company;
    this.position = position;
    this.address_city = address_city;
    this.address_street = address_street;
    this.phone = phone;
    this.img = img;
  }
}
