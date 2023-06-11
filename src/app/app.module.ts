import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GistComponent } from './components/gist/gist.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { RouterModule } from '@angular/router';
import { MenuBtnComponent } from './components/menu-btn/menu-btn.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

@NgModule({
  declarations: [AppComponent, GistComponent, SideNavComponent, MenuBtnComponent, WelcomeComponent],
  imports: [BrowserModule, AppRoutingModule, RouterModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
