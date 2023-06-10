import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-guide';
  sideNavOpened = false;
  isSmallScreen = false;

  private resizeSubject = new Subject<number>();

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.resizeSubject.next(window.innerWidth);
  }

  constructor() {}

  ngOnInit(): void {
    this.isSmallScreen = window.innerWidth < 800;
    this.sideNavOpened = !this.isSmallScreen;
    this.resizeSubject.pipe(debounceTime(200)).subscribe((event) => {
      this.isSmallScreen = window.innerWidth < 800;
    });
  }

  decodeURL() {
    const base64Encoded = btoa('7f62e3b9729525ac4002588e17fd0cac');
    console.log(encodeURIComponent(base64Encoded));

    return encodeURIComponent(base64Encoded);
  }

  ngOnDestroy() {
    this.resizeSubject.unsubscribe();
  }
}
