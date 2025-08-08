import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-patient-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent],
  templateUrl: './patient-summary.component.html',
  styleUrls: ['./patient-summary.component.css']
})
export class PatientSummaryComponent {
  patients = Array.from({ length: 9 }, (_, i) => `Patient ${i + 1}`);
  eyes = ['Right Eye', 'Left Eye', 'Both Eyes'];

  selectedPatient = this.patients[0];
  selectedEye = this.eyes[0];

  diseases = [
  { name: 'Hypertension', date: '02/2019' },
  { name: 'DM', date: '02/2019' },
  { name: 'Ischemic Heart Disease', date: '02/2019' }
];

procedures = [
  { type: 'Injection', item: 'Ozurdex (14x)' },
  { type: 'Retina Laser', item: 'Accessible PRP (1x)' },
  { type: 'Retina Laser', item: 'Focal (1x)' },
  { type: 'Injection', item: 'Tricort (14x)' },
  { type: 'Injection', item: 'Avastin (2x)' },
  { type: 'Injection', item: 'Pagenax (1x)' },
  { type: 'Injection', item: 'Accentrix (1x)' }
];
}
