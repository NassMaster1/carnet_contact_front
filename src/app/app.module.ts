import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GroupComponent} from './pages/group/group.component';
import {AboutComponent} from './pages/about/about.component';
import {AcceuilComponent} from './pages/acceuil/acceuil.component';
import {NavBarComponent} from './sharePages/nav-bar/nav-bar.component';
import {FooterComponent} from './sharePages/footer/footer.component';
import {ContactComponent} from "./pages/contact/contact.component";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DragDropModule} from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    GroupComponent,
    AboutComponent,
    AcceuilComponent,
    NavBarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
