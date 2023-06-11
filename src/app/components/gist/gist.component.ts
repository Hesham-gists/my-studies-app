import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gist',
  templateUrl: './gist.component.html',
  styleUrls: ['./gist.component.css'],
})
export class GistComponent implements OnInit {
  safeUrl: SafeResourceUrl = '';
  gistId: string = '';
  loading = true;

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute) {
    route.params.subscribe((params) => {
      this.gistId = params['gistId'];
    });
  }

  ngOnInit(): void {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `assets/html/gist_${this.gistId}.html`
    );
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
