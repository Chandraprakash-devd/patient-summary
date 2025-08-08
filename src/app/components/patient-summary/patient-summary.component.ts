import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { GanttChartComponent } from "../gantt-chart/gantt-chart.component";

@Component({
  selector: 'app-patient-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent, GanttChartComponent],
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

  ganttData = [
    { task: 'CME', start: '2018-01-01', end: '2020-06-30' },
    { task: 'PDR', start: '2018-05-01', end: '2023-01-01' },
    { task: 'CSME', start: '2019-01-01', end: '2022-11-30' },
    { task: 'Episcleritis/Scleritis', start: '2021-09-01', end: '2022-09-01' },
    { task: 'DME', start: '2023-10-01', end: '2023-12-01' },
  ];

  ganttConfig = {
    title: 'Diagnoses',
    barColor: '#e23670',
    borderRadius: 8,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task} <br>
              Start: ${task.start}  <br>
              End: ${task.end}`;
    },
  };
}
