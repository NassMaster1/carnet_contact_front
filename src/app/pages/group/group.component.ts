import {Component, OnInit} from '@angular/core';
import {Contact} from "../model/contact.model";
import {ContactGroup} from "../model/contactGroup.model";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GroupService} from "../services/group.service";
import {CdkDragDrop, moveItemInArray,transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {


  group!:Array<ContactGroup>;

  groupSingle!:ContactGroup;
  searchFormGroup! : FormGroup;

  groupForm!:FormGroup;
  groupUpdateForm!:FormGroup;
  errorMessage!:string;

  closeResult!:string;
  listeConatct!: Array<Contact>;



  drop(event: CdkDragDrop<ContactGroup[]>) {
      moveItemInArray( event.container.data, event.previousIndex, event.currentIndex
      );
    }


  constructor(private groupService:GroupService , private fp: FormBuilder , private modalService: NgbModal) { }

  ngOnInit(): void {

    this.searchFormGroup=this.fp.group({
      keyword: this.fp.control(null)
    })

    this.groupForm=this.fp.group(({
      groupName: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]),
    }))

    this.groupUpdateForm=this.fp.group(({
      groupUpdateForm: this.fp.control(null,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]),
    }))

      this.handelGetAllContactGroup()
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

  handelGetAllContactGroup(){
    this.groupService.getAllContactGroup().subscribe(
      {
        next:(data)=>{
          this.group=data;
        },
        error :(err)=> {
          this.errorMessage="une erreur serveur s'est produite";
        }
      });
  }


  handelDeleteContactInGroup(contact: Contact) {
    let conf=confirm("Etes vous sur de vouloir supprmier le numéro "+contact.lastName+ " "+contact.firstName)
    if(conf==false) return;
    this.groupService.deleteContactInGroup(contact.id, this.groupSingle.id).subscribe(
      {
        next:(data)=>{
          this.modalService.dismissAll()
        }
      }
    )
  }

  isAlpha(str: string): boolean {
    return /^[a-zA-Z][a-zA-Z\s]*$/.test(str);
  }
  handleSearchContactGroup() {
    let keyword = this.searchFormGroup.value.keyword;
    if(this.isAlpha(keyword)) {
      this.groupService.searchGroup(keyword).subscribe({
        next: (data) => {
          this.group = data;
        }
      })
    } else this.handelGetAllContactGroup()
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

  handleAddGroup() {
    let group=this.groupForm.value

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

  handleUpdateGroup() {
    let group=this.groupUpdateForm.value
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


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openAddGroup(content:any) {
    this.groupForm.reset()
    this.modalService.open(content,{centered: true,backdrop: 'static'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDetailGroup(content: any, g: ContactGroup) {

    this.groupSingle=g;
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
          this.groupUpdateForm.patchValue({
            groupUpdateForm:this.groupSingle.GroupName
          })
        }
      }
    )
  }



}
