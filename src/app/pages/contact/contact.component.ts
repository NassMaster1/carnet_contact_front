import {Component, OnInit} from '@angular/core';
import {ContactService} from "../services/contact.service";
import {Contact, DetailContact} from "../model/contact.model";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PhoneNumbers} from "../model/phoneNumbers.model";
import {Adresse} from "../model/adresse.model";
import {ContactGroup} from "../model/contactGroup.model";
import {GroupService} from "../services/group.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contact!:Array<Contact>;

  detailContact!:DetailContact;

  phone!:PhoneNumbers;

  ListGroup!:Array<ContactGroup>;

  phoneNumber!:PhoneNumbers;

  errorMessage!:string;
  searchFormGroup! : FormGroup;

  ContactFormGroup!:FormGroup;

  AdresseFormGroup!:FormGroup;

  AddPhoneFormGroup!:FormGroup;

  AddGroupFormGroup!:FormGroup;
  UpdateFormContact!: FormGroup;

  closeResult!:string;
  UpdatePhoneFormGroup!: FormGroup;


  constructor( private contactService:ContactService , private groupService:GroupService ,private fp: FormBuilder , private modalService: NgbModal) { }

  ngOnInit(): void {

      this.searchFormGroup=this.fp.group({
      keyword: this.fp.control(null)
    })

    this.ContactFormGroup= this.fp.group(({
      firstName: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]),
      lastName: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]),
      email: this.fp.control(null,[Validators.required,Validators.minLength(5),Validators.maxLength(50),Validators.email]),
      phoneKind: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]),
      phoneNumber: this.fp.control(null,[Validators.required,Validators.minLength(8),Validators.maxLength(20)])
    }))

    this.UpdateFormContact= this.fp.group(({
      firstName: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]),
      lastName: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]),
      email: this.fp.control(null,[Validators.required,Validators.minLength(5),Validators.maxLength(50),Validators.email]),
      phoneKind: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]),
      phoneNumber: this.fp.control(null,[Validators.required,Validators.minLength(8),Validators.maxLength(20)]),
      street: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
      city: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]),
      zip: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(20)]),
      country: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(20)])
    }))

    this.AdresseFormGroup=this.fp.group(({
      street: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
      city: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]),
      zip: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(20)]),
      country: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(20)])
    }))

    this.AddPhoneFormGroup=this.fp.group(({
      phoneKind: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]),
      phoneNumber: this.fp.control(null,[Validators.required,Validators.minLength(8),Validators.maxLength(20)])
    }))

    this.UpdatePhoneFormGroup=this.fp.group(({
      phoneKind: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]),
      phoneNumber: this.fp.control(null,[Validators.required,Validators.minLength(8),Validators.maxLength(20)])
    }))

    this.AddGroupFormGroup=this.fp.group(({
      idGroup: this.fp.control(null,[Validators.required])
    }))

    this.handelGetAllContact()
  }

  getErrorMessage(name: string, error: ValidationErrors) {
    if(error['required']){
      return "Le champ "+name + " est obligatoire"
    }else if(error['minlength']){
      return "Le champ " + name + " doit contenir au moins "+error['minlength']['requiredLength']+ " caractères"
    }else if (error['email']){
      return "Le champ " + name + " est invalid"
    }

    else return "Champ invalid"
  }

  handelGetAllContact(){
    this.contactService.getAllContacts().subscribe(
      {
        next:(data)=>{
          this.contact=data;
        },
        error :(err)=> {
          this.errorMessage="une erreur serveur s'est produite";
        }
      });
  }

  handelDeleteContact(c:Contact) {
    let conf=confirm("Etes vous sur de vouloir supprmier le contact "+c.lastName +" "+c.firstName)
    if(conf==false) return;
    this.contactService.deleteContact(c.id).subscribe(
      {
        next:(data)=>{
          let index=this.contact.indexOf(c)
          this.contact.splice(index,1)
        }
      }
    )
  }

  handleSearchContact() {
    let keyword = this.searchFormGroup.value.keyword;
    this.contactService.searchContacts(keyword).subscribe( {
      next:(data)=>{
        this.contact=data;
      }
    })

  }

  handleAddContact() {
    let detailContact=this.ContactFormGroup.value
    let adresseForm=this.AdresseFormGroup.value

    let contact:Contact={id:0,firstName:detailContact["firstName"],lastName:detailContact["lastName"],email:detailContact["email"]}
    let phoneNumber:PhoneNumbers={id:0,phoneKind:detailContact["phoneKind"],phoneNumber:detailContact["phoneNumber"]}
    let adresse:Adresse={adresse_id:0,street:adresseForm["street"],city:adresseForm["city"],zip:adresseForm["zip"],country:adresseForm["country"]}


    console.log(adresse)
    const ContactJson={
    contactDTO:contact,
      phoneNumbers:Array(phoneNumber),
      adresse:adresse
    }
    this.contactService.AddContact(ContactJson).subscribe({
      next:(data)=>{
        this.modalService.dismissAll()
        this.handelGetAllContact()
      },error:err => {
        console.error(err)
      }
    })
  }

  handelDeletePhoneNumber(phone: PhoneNumbers) {
    let conf=confirm("Etes vous sur de vouloir supprmier le numéro "+phone.phoneNumber)
    if(conf==false) return;
    this.phoneNumber=phone;
    console.log(this.phoneNumber)
    this.contactService.deletePhoneNumber(this.detailContact.contactDTO.id, this.phoneNumber.id).subscribe(
      {
        next:(data)=>{
            this.modalService.dismissAll()
        }
      }
    )
  }

  handelAddPhoneNumber() {
    let phoneForm=this.AddPhoneFormGroup.value
    let phoneNumber:PhoneNumbers={id:0,phoneKind:phoneForm["phoneKind"],phoneNumber:phoneForm["phoneNumber"]}
    console.log(this.phoneNumber)
    this.contactService.AddPhoneNumber(this.detailContact.contactDTO.id,phoneNumber).subscribe(
      {
        next:(data)=>{
          this.modalService.dismissAll()
        }
      }
    )
  }

  handelgetAllGroup() {
    this.groupService.getAllContactGroup().subscribe(
      {
        next:(data)=>{
          this.ListGroup=data;
          console.log(data)
        },
        error :(err)=> {
          this.errorMessage="une erreur serveur s'est produite";
        }
      });
  }

  handelAddGroup() {
    console.log("sdsd")
    let groupForm=this.AddGroupFormGroup.value
    this.groupService.AddContactToGroup(this.detailContact.contactDTO.id,groupForm["idGroup"]).subscribe(
      {
        next:(data)=>{
          alert("Le contact a été ajouté au groupe")
          this.modalService.dismissAll()
        }
      }
    )
  }

  handleUpdateContact() {

    let detailContactUpdate=this.UpdateFormContact.value

    let contact:Contact={id:0,firstName:detailContactUpdate["firstName"],lastName:detailContactUpdate["lastName"],email:detailContactUpdate["email"]}
    let phoneNumber:PhoneNumbers={id:0,phoneKind:detailContactUpdate["phoneKind"],phoneNumber:detailContactUpdate["phoneNumber"]}
    let adresse:Adresse={adresse_id:0,street:detailContactUpdate["street"],city:detailContactUpdate["city"],zip:detailContactUpdate["zip"],country:detailContactUpdate["country"]}


    console.log(adresse)
    const ContactJson={
      contactDTO:contact,
      phoneNumbers:Array(phoneNumber),
      adresse:adresse
    }

    this.contactService.UpdateContact(this.detailContact.contactDTO.id,ContactJson).subscribe({
      next:(data)=>{
        this.modalService.dismissAll()
        this.handelGetAllContact()
      },error:err => {
        console.error(err)
      }
    })

  }

  handelUpdatePhoneNumber() {
    let phoneForm=this.UpdatePhoneFormGroup.value
    let phoneNumber:PhoneNumbers={id:0,phoneKind:phoneForm["phoneKind"],phoneNumber:phoneForm["phoneNumber"]}
    console.log(this.phoneNumber)
    this.contactService.UpdatePhone(this.detailContact.contactDTO.id,this.phoneNumber.id,phoneNumber).subscribe(
      {
        next:(data)=>{
          this.modalService.dismissAll()
          alert("Le numéro a été mis à jour")
          this.UpdatePhoneFormGroup.reset()
        }
      }
    )
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openlg(content:any) {
    this.ContactFormGroup.reset()
    this.modalService.open(content,{size:'lg',centered: true,backdrop: 'static'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  opensm(content:any) {
    this.AdresseFormGroup.reset()
    this.modalService.open(content,{centered: true,backdrop: 'static'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openAddPhone(content:any) {
    this.modalService.open(content,{centered: true,backdrop: 'static'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDetails(targetModal: any, co: Contact) {

    this.contactService.getDetailContactById(co.id).subscribe(
      {
        next:(data)=>{
          this.modalService.open(targetModal, {
            centered: true,
            backdrop: 'static',
            size: 'lg'
          });

          this.detailContact=data;
          console.log(this.detailContact)
          if(this.detailContact.contactDTO.firstName!=null)
          { // @ts-ignore
            document.getElementById('Dfirstname').setAttribute('value', this.detailContact.contactDTO.firstName);
          }
          if(this.detailContact.contactDTO.lastName!=null)
          { // @ts-ignore
            document.getElementById('Dlastname').setAttribute('value', this.detailContact.contactDTO.lastName);
          }
          if(this.detailContact.contactDTO.email!=null)
          { // @ts-ignore
            document.getElementById('Demail').setAttribute('value', this.detailContact.contactDTO.email);
          }

          if(this.detailContact.adresse.street!=null)
          { // @ts-ignore
            document.getElementById('Adresse').setAttribute('value', this.detailContact.adresse.street+" "+ this.detailContact.adresse.zip+", "+this.detailContact.adresse.city+" "+this.detailContact.adresse.country);
          }

          if(this.detailContact.phoneNumbers[0].phoneKind!=null || this.detailContact.phoneNumbers[0].phoneKind!=undefined )
          { // @ts-ignore
            document.getElementById('DtypeMobile').setAttribute('value', this.detailContact.phoneNumbers[0].phoneKind);
          }
          if(this.detailContact.phoneNumbers[0].phoneNumber!=null || this.detailContact.phoneNumbers[0].phoneNumber!=undefined)
          { // @ts-ignore
            document.getElementById('Dmobile').setAttribute('value', this.detailContact.phoneNumbers[0].phoneNumber);
          }

        }
      }
    )

  }

  openPhone(targetModal: any, co: Contact) {

    this.contactService.getDetailContactById(co.id).subscribe(
      {
        next:(data)=>{
          this.modalService.open(targetModal, {
            centered: true,
            backdrop: 'static'
          });
          this.detailContact=data;
        }
      }
    )
  }

  openAddGroup(contentAddgroup: any, co: Contact) {
    this.contactService.getDetailContactById(co.id).subscribe(
      {
        next:(data)=>{
          this.detailContact=data;
          this.handelgetAllGroup()
          this.modalService.open(contentAddgroup, {
            centered: true,
            backdrop: 'static'
          });
        },
        error :(err)=> {
          alert("Ce contact existe déja dans le groupe")
        }
      }
    )
  }

  openUpdate(contentUpdate: any, co: Contact) {
    this.contactService.getDetailContactById(co.id).subscribe(
      {
        next:(data)=>{
          this.modalService.open(contentUpdate, {
            centered: true,
            backdrop: 'static',
            size: 'lg'
          });
          this.detailContact=data;
          this.UpdateFormContact.patchValue({
            firstName:this.detailContact.contactDTO.firstName,
            lastName:this.detailContact.contactDTO.lastName,
            email:this.detailContact.contactDTO.email,
            phoneKind:this.detailContact.phoneNumbers[0].phoneKind,
            phoneNumber:this.detailContact.phoneNumbers[0].phoneNumber,
            street:this.detailContact.adresse.street,
            city:this.detailContact.adresse.city,
            zip:this.detailContact.adresse.zip,
            country:this.detailContact.adresse.country
          })
        }
      }
    )
  }

  openUpdatePhone(contentUpdatePhone: any, phone: PhoneNumbers) {
          this.phoneNumber=phone;
          this.modalService.open(contentUpdatePhone, {
            centered: true,
            backdrop: 'static'
      }
    )
    this.UpdatePhoneFormGroup.patchValue({
      phoneKind:this.phoneNumber.phoneKind,
      phoneNumber:this.phoneNumber.phoneNumber,
    })
  }

}


