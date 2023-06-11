import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  @Input() isSmallScreen: boolean = true;
  @Input() sideNavOpened: boolean = false;

  @Output() sidenav_closed = new EventEmitter();

  constructor() {}
}
