import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Contact, DetailContact} from "../model/contact.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Adresse} from "../model/adresse.model";
import {PhoneNumbers} from "../model/phoneNumbers.model";

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private contacts!:Array<Contact>

  private readonly contactBaseUrl = `${environment.baseUrl}/contact`
  private readonly PhoneBaseUrl = `${environment.baseUrl}/PhoneNumber`

  constructor( private httpClient: HttpClient ) {
  }

  public getAllContacts():Observable<Array<Contact>>{
    return this.httpClient.get<Array<Contact>>(this.contactBaseUrl+'/all')
  }

  public deleteContact(id:number):Observable<boolean>{
   return this.httpClient.delete<boolean>(this.contactBaseUrl+'/'+id)
  }

  public searchContacts(Keyword:string):Observable<Contact[]>{
    return this.httpClient.get<Array<Contact>>(this.contactBaseUrl+'/findbyKeyWord/'+Keyword)
  }

  public AddContact(contact: {contactDTO: Contact, phoneNumbers: PhoneNumbers[] ,adresse: Adresse }):Observable<DetailContact>{

     return  this.httpClient.post<DetailContact>(this.contactBaseUrl,contact)
  }

  getDetailContactById(id: number):Observable<DetailContact> {
    return this.httpClient.get<DetailContact>(this.contactBaseUrl+'/'+id)
  }

  deletePhoneNumber(idcontact: number, idPhone: number) {
    return this.httpClient.delete<boolean>(this.PhoneBaseUrl+'/deletePhoneNumber/'+idcontact+'/'+idPhone)
  }

  AddPhoneNumber(idcontact: number,phoneNumbers: PhoneNumbers):Observable<PhoneNumbers> {
    return this.httpClient.post<PhoneNumbers>(this.PhoneBaseUrl+'/AddPhoneNumber/'+idcontact,phoneNumbers)
  }


  UpdateContact(idContact:number,ContactUpdate: { contactDTO: Contact, phoneNumbers: PhoneNumbers[],adresse: Adresse }) {
    return  this.httpClient.put<DetailContact>(this.contactBaseUrl+'/'+idContact,ContactUpdate)
  }

  UpdatePhone(idContact: number, idPhone: number,phoneUpdate:PhoneNumbers) {
    return  this.httpClient.put<DetailContact>(this.PhoneBaseUrl+'/updatePhoneNumber/'+idContact+'/'+idPhone,phoneUpdate)
  }
}
