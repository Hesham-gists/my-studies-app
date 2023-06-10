import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-gist',
  templateUrl: './gist.component.html',
  styleUrls: ['./gist.component.css'],
})
export class GistComponent implements OnInit {
  safeUrl: SafeResourceUrl = '';
  @Input() gistId: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `assets/html/gist_${this.gistId}.html`
    );
  }
}
