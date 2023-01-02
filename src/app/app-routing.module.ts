import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContactComponent} from "./pages/contact/contact.component";
import {GroupComponent} from "./pages/group/group.component";
import {AboutComponent} from "./pages/about/about.component";
import {AcceuilComponent} from "./pages/acceuil/acceuil.component";

const routes: Routes = [
  {path:"",component: AcceuilComponent},
  {path:"contact",component: ContactComponent},
  {path:"groupe",component: GroupComponent},
  {path:"about",component: AboutComponent},
  {path:"accueil",component: AcceuilComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
