import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'recipe-angular';
  currentUrl: string = '';
  components: string[] = ['/', 'sign-up', 'login'];
  currentPath: string = '';
  authComponents: boolean = false;
  router = inject(Router);
  location = inject(Location);

  constructor() {
    this.currentPath = this.location.path();
  }

  ngOnInit() {
    this.isCheckAuthComp();
  }

  isCheckAuthComp() {
    // console.log(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = this.router.url;
          // console.log('this.currentUrl', this.currentUrl);

          const lastSegment =
            this.currentUrl === '/'
              ? this.currentUrl
              : this.currentUrl.split('/').pop() || '';
          this.authComponents = this.components.includes(lastSegment);
        }
      });
  }
}
