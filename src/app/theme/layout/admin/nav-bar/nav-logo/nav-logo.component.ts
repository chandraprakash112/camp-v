// Angular import
import { Component, Input, output, inject } from '@angular/core';
import { Router } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-logo',
  imports: [SharedModule],
  templateUrl: './nav-logo.component.html',
  styleUrl: './nav-logo.component.scss',
})
export class NavLogoComponent {
  router = inject(Router);

  @Input() navCollapsed!: boolean;
  NavCollapse = output();
  themeMode!: boolean;

  constructor() {}

  navCollapse() {
    this.NavCollapse.emit();
  }

  returnToHome() {
    this.router.navigate(['/default']);
  }
}
