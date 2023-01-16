import {PhoneNumbers} from "./phoneNumbers.model";
import {Adresse} from "./adresse.model";

export interface Contact{
  id:number;
  firstName:string;
  lastName:string;
  email:string;


}


export interface DetailContact{
  contactDTO:Contact;
  phoneNumbers:PhoneNumbers[];
  adresse:Adresse;
}
