import { Component, OnInit } from '@angular/core';
import {Contact} from "../model/contact.model";
import {ContactGroup} from "../model/contactGroup.model";
import {ContactService} from "../services/contact.service";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GroupService} from "../services/group.service";
import {PhoneNumbers} from "../model/phoneNumbers.model";
import {Adresse} from "../model/adresse.model";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {


  group!:Array<ContactGroup>;
  groupSingle!:ContactGroup;

  groupForm!:FormGroup;
  groupUpdateForm!:FormGroup;
  errorMessage!:string;

  closeResult!:string;
  listeConatct!: Array<Contact>;


  constructor(private groupService:GroupService , private fp: FormBuilder , private modalService: NgbModal) { }

  ngOnInit(): void {

    this.groupForm=this.fp.group(({
      groupName: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]),
    }))

    this.groupUpdateForm=this.fp.group(({
      groupUpdateForm: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]),
    }))

    this.handelGetAllContactGroup()
  }

  handelGetAllContactGroup(){
    this.groupService.getAllContactGroup().subscribe(
      {
        next:(data)=>{
          this.group=data;
          console.log(data)
        },
        error :(err)=> {
          this.errorMessage="une erreur serveur s'est produite";
        }
      });
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

  openAddGroup(content:any) {
    this.groupForm.reset()
    this.modalService.open(content,{centered: true,backdrop: 'static'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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


    handleAddGroup() {
      let group=this.groupForm.value
      console.log(group)

      let contactGroup:ContactGroup={id:0,GroupName:group["groupName"]}

      this.groupService.AddContactgroup(contactGroup).subscribe({
        next:(data)=>{
          this.modalService.dismissAll()
          this.handelGetAllContactGroup()
        },error:err => {
          console.error(err)
        }
      })
  }

  openDetailGroup(content: any, g: ContactGroup) {

    this.groupService.getlistContactBygroup(g).subscribe({
      next:(data)=>{
        this.listeConatct=data;


        this.modalService.open(content,{centered: true,backdrop: 'static'}).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });


      },error:err => {
        console.error(err)
      }
    })

  }

  handelDeleteGroup(g: ContactGroup) {
    let conf=confirm("Etes vous sur de vouloir supprmier le group "+g.GroupName)
    if(conf==false) return;
    this.groupService.deleteGroup(g.id).subscribe(
      {
        next:(data)=>{
          let index=this.group.indexOf(g)
          this.group.splice(index,1)
        }
      }
    )

  }

  openupdateGroup(content: any, g: ContactGroup) {
    this.groupUpdateForm.reset()
    this.groupService.getGroupById(g.id).subscribe(
      {
        next:(data)=>{
          this.modalService.open(content, {
            centered: true,
            backdrop: 'static'
          });

          this.groupSingle=data;

          if(this.groupSingle.GroupName!=null)
          {
            // @ts-ignore
            document.getElementById('updateGroupInput').setAttribute('value',this.groupSingle.GroupName);
          }

        }
      }
    )
  }

  handleUpdateGroup() {
    let group=this.groupUpdateForm.value
    console.log(group)

    let contactGroup:ContactGroup={id:0,GroupName:group["groupUpdateForm"]}

    this.groupService.UpdateContactgroup(this.groupSingle.id, contactGroup).subscribe({
      next:(data)=>{
        this.modalService.dismissAll()
        this.handelGetAllContactGroup()
      },error:err => {
        console.error(err)
      }
    })
  }
}
