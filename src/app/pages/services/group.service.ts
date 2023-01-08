import { Injectable } from '@angular/core';
import {Contact, DetailContact} from "../model/contact.model";
import {HttpClient} from "@angular/common/http";
import {ContactGroup} from "../model/contactGroup.model";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private readonly contactGroupBaseUrl = `${environment.baseUrl}/contactGroup`

  constructor(private httpClient: HttpClient) { }

  getAllContactGroup() :Observable<Array<ContactGroup>>{
    return this.httpClient.get<Array<ContactGroup>>(this.contactGroupBaseUrl+'/all')
  }

  AddContactgroup(contactGroup: ContactGroup):Observable<ContactGroup>{
    return  this.httpClient.post<ContactGroup>(this.contactGroupBaseUrl,contactGroup)
  }

  getlistContactBygroup(contactGroup: ContactGroup):Observable<Array<Contact>>{
    return this.httpClient.get<Array<Contact>>(this.contactGroupBaseUrl+'/findContactsFromGroup/'+contactGroup.id)
  }

  deleteGroup(id: number):Observable<boolean>{
    return this.httpClient.delete<boolean>(this.contactGroupBaseUrl+'/'+id)
  }

  getGroupById(id: number) :Observable<ContactGroup> {
    return this.httpClient.get<ContactGroup>(this.contactGroupBaseUrl+'/'+id)
  }

  UpdateContactgroup(id: number , updateForm:ContactGroup) {
    return this.httpClient.put<ContactGroup>(this.contactGroupBaseUrl+'/'+id,updateForm)
  }

  AddContactToGroup(id: number, groupId: number) {
    return this.httpClient.post<ContactGroup>(this.contactGroupBaseUrl+'/addListContact/'+id+'/'+groupId,null)
  }

  searchGroup(keyword: String):Observable<ContactGroup[]>  {
    return this.httpClient.get<Array<ContactGroup>>(this.contactGroupBaseUrl+'/findbyKeyWord/'+keyword)
  }
}
