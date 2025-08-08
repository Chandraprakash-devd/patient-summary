import { Component, OnInit } from '@angular/core';
import { ThemeService } from './theme.service';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { PatientSummaryComponent } from './components/patient-summary/patient-summary.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ThemeToggleComponent,
    PatientSummaryComponent // ✅ Import your patient-summary component
  ],
  template: `
    <div class="container-fluid">

      <div class="app-header" style="display:flex; align-items:center; gap:12px;">
        <!-- Patient Summary Row -->
        <app-patient-summary></app-patient-summary>
</div>

      <!-- rest of UI rows -->
      <main style="margin-top:16px">
        <!-- Other rows go here -->
      </main>
    </div>
  `
})
export class AppComponent implements OnInit {
  constructor(private theme: ThemeService) {}

  ngOnInit() {
    this.theme.init();
  }
}
