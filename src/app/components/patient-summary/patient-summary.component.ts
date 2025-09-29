import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { GanttChartComponent } from '../gantt-chart/gantt-chart.component';
import { LineChartComponent, ChartData, MetricConfig, ProcedureData, TimeDataPoint } from '../line-chart/line-chart.component';
// import jsonData from './patient_complete_data (1).json'; // Adjust path as needed
import jsonData from '../../../../patient_complete_data.json'

@Component({
  selector: 'app-patient-summary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ThemeToggleComponent,
    GanttChartComponent,
    LineChartComponent
  ],
  templateUrl: './patient-summary.component.html',
  styleUrls: ['./patient-summary.component.css']
})
export class PatientSummaryComponent implements OnInit {
  jsonData: any = jsonData; // Loaded from file
  patientSummary: string = '';
  patients: string[] = [];
  eyes: string[] = ['Right Eye', 'Left Eye', 'Both Eyes'];
  selectedPatient: string = '';
  selectedEye: string = this.eyes[0];
  diseases: { name: string; date: string }[] = [];
  procedures: { type: string; item: string }[] = [];
  ganttData: { task: string; start: string; end: string }[] = [];

  ganttConfig = {
    title: 'Diagnoses',
    barColor: '#e23670',
    borderRadius: 3,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task}<br>Start: ${task.start}<br>End: ${task.end}`;
    }
  };

  lineChartData: ChartData = {
    procedures: [],
    visualAcuityData: [],
    iopData: [],
    cmtData: []
  };

  lineChartMetrics: MetricConfig[] = [
    {
      name: 'Dist : BCVA / Near : BCVA',
      color: '#4a9eff',
      min: 0.25,
      max: 1.75,
      step: 0.5,
      yAxisId: 'y1'
    },
    {
      name: 'IOP',
      color: '#4ade80',
      min: 4,
      max: 16,
      step: 4,
      yAxisId: 'y2'
    },
    {
      name: 'CMT',
      color: '#f472b6',
      min: 0,
      max: 1000,
      step: 250,
      yAxisId: 'y3'
    }
  ];

  colorMap = new Map<string, string>([
    ['Ozurdex', '#00bcd4'],
    ['Tricort', '#4ade80'],
    ['Avastin', '#06b6d4'],
    ['Pagenax', '#8b5cf6'],
    ['Accentrix', '#f472b6'],
    ['Retina Laser Accessible PRP', '#ef4444'],
    ['Retina Laser Focal', '#f97316']
  ]);

  ngOnInit(): void {
    if (!this.jsonData || !this.jsonData.patient_info) {
      console.error('Invalid JSON data structure');
      return;
    }
    this.patients = [`Patient ${this.jsonData.patient_info.uid}`];
    this.selectedPatient = this.patients[0];
    this.updateData();
  }

  updateData(): void {
    const eye = this.selectedEye === 'Right Eye' ? 'RE' : this.selectedEye === 'Left Eye' ? 'LE' : 'BE';
    this.patientSummary = this.generatePatientSummary();
    this.diseases = this.getDiseases();
    this.procedures = this.getProcedures(eye);
    this.ganttData = this.getGanttData(eye);
    this.lineChartData = this.getLineChartData(eye);
    // Debug logs
    console.log('Diseases:', this.diseases);
    console.log('Procedures:', this.procedures);
    console.log('Gantt Data:', this.ganttData);
    console.log('Line Chart Data:', this.lineChartData);
  }

  generatePatientSummary(): string {
    const eyeAbbr = this.selectedEye === 'Right Eye' ? 'RE' : this.selectedEye === 'Left Eye' ? 'LE' : 'eyes';
    // Dynamic summary based on diagnosis and procedures
    const diagnoses = this.getGanttData(eyeAbbr).map(d => d.task).join(', ');
    const procList = this.getProcedures(eyeAbbr).map(p => p.item).join(', ');
    return `The patient (UID: ${this.jsonData.patient_info.uid}) with conditions including ${diagnoses || 'no recorded diagnoses'} in the ${eyeAbbr} has undergone procedures such as ${procList || 'no recorded procedures'}. The patient's history includes ${this.diseases.length ? this.diseases.map(d => d.name).join(', ') : 'no systemic conditions'}. Visual acuity, IOP, and CMT have been monitored over ${this.jsonData.patient_info.total_visits} visits from ${this.jsonData.patient_info.first_visit.substring(0, 10)} to ${this.jsonData.patient_info.last_visit.substring(0, 10)}.`;
  }

  getDiseases(): { name: string; date: string }[] {
    const diseasesMap = new Map<string, string>();
    (this.jsonData.visits || []).forEach((visit: any) => {
      if (visit.systemic_history && visit.systemic_history.description) {
        const diseases = visit.systemic_history.description.split(';').filter((d: string) => d.trim());
        const visitDate = visit.visit_date.substring(0, 7).replace('-', '/');
        diseases.forEach((disease: string) => {
          const trimmed = disease.trim();
          if (trimmed && !diseasesMap.has(trimmed)) {
            diseasesMap.set(trimmed, visitDate);
          }
        });
      }
    });
    return Array.from(diseasesMap.entries()).map(([name, date]) => ({ name, date }));
  }

  getProcedures(eye: string): { type: string; item: string }[] {
    const procCount = new Map<string, number>();
    (this.jsonData.visits || []).forEach((visit: any) => {
      const procEye = visit.procedures ? visit.procedures[eye] || visit.procedures['BE'] : null;
      if (procEye) {
        procEye.forEach((proc: any) => {
          const name = proc.laser_type || proc.type;
          if (name) {
            procCount.set(name, (procCount.get(name) || 0) + 1);
          }
        });
      }
    });
    return Array.from(procCount.entries()).map(([name, count]) => {
      const type = /Inj|Ozurdex|Tricort|Avastin|Pagenax|Accentrix/i.test(name) ? 'Injection' : 'Retina Laser';
      return { type, item: `${name}${count > 1 ? ` (${count}x)` : ''}` };
    });
  }

  getGanttData(eye: string): { task: string; start: string; end: string }[] {
    const diagMap = new Map<string, { start: string; end: string }>();
    Object.keys(this.jsonData.diagnosis || {}).forEach(key => {
      const parts = key.split('_diagnosis_');
      if (parts.length !== 2) return;
      const baseTask = parts[0].replace(/_/g, ' ');
      const cond = this.jsonData.diagnosis[key];
      if (!cond) return;

      let include = false;
      let displayTask = baseTask;

      if (eye === 'BE') {
        include = true;
        if (cond.from_both_eyes) {
          displayTask = baseTask + ' (BE)';
        } else if (cond.eye) {
          displayTask = baseTask + ' (' + cond.eye + ')';
        }
      } else {
        if (cond.eye === eye || cond.from_both_eyes) {
          include = true;
          if (cond.from_both_eyes) {
            displayTask = baseTask + ' (BE)';
          }
        }
      }

      if (include) {
        let entry = diagMap.get(displayTask) || { start: '9999-12-31', end: '0001-01-01' };
        (cond.periods || []).forEach((p: any) => {
          if (p.start_date && p.end_date) {
            if (p.start_date < entry.start) entry.start = p.start_date;
            if (p.end_date > entry.end) entry.end = p.end_date;
          }
        });
        diagMap.set(displayTask, entry);
      }
    });
    return Array.from(diagMap.entries())
      .map(([task, { start, end }]) => ({
        task,
        start: start.substring(0, 10),
        end: end.substring(0, 10)
      }))
      .filter(d => d.start !== '9999-12-31' && d.end !== '0001-01-01');
  }

  getLineChartData(eye: string): ChartData {
    const procedures: ProcedureData[] = [];
    const visualAcuityData: TimeDataPoint[] = [];
    const iopData: TimeDataPoint[] = [];
    const cmtData: TimeDataPoint[] = [];

    (this.jsonData.visits || []).forEach((visit: any) => {
      const date = visit.visit_date?.substring(0, 10) || '';
      if (!date) return;

      // Procedures
      const procEye = visit.procedures ? visit.procedures[eye] || visit.procedures['BE'] : null;
      if (procEye) {
        procEye.forEach((proc: any) => {
          const type = proc.type?.includes('Inj') ? 'injection' : 'procedure';
          const name = proc.laser_type || proc.type;
          if (name) {
            const color = this.colorMap.get(name) || '#cccccc';
            procedures.push({ date, type, name, color });
          }
        });
      }

      // Visual Acuity
      if (visit.vision_iop && visit.vision_iop.dv_refraction) {
        const vaStr = visit.vision_iop.dv_refraction[eye]?.VA || visit.vision_iop.dv_refraction[eye]?.UCVA_VA;
        if (vaStr) {
          const y = this.convertVaToDecimal(vaStr);
          if (y !== null) {
            visualAcuityData.push({ x: date, y });
          }
        }
      }

      // IOP
      if (visit.investigations && visit.investigations.general_investigations) {
        const gens = visit.investigations.general_investigations.map((g: any) => g.name);
        const idx = gens.indexOf('IOP');
        if (idx >= 0) {
          const vals = visit.investigations.eye_specific_results[eye]?.split(';') || [];
          const valStr = vals[idx];
          const y = parseFloat(valStr);
          if (!isNaN(y) && y > 0) {
            iopData.push({ x: date, y });
          }
        }
      }

      // CMT
      if (visit.investigations && visit.investigations.general_investigations) {
        const gens = visit.investigations.general_investigations.map((g: any) => g.name);
        const idx = gens.indexOf('Optical Coherence Tomography');
        if (idx >= 0) {
          const vals = visit.investigations.eye_specific_results[eye]?.split(';') || [];
          const valStr = vals[idx];
          const y = parseFloat(valStr);
          if (!isNaN(y) && y > 0) {
            cmtData.push({ x: date, y });
          }
        }
      }
      if (visit.investigations && visit.investigations.special_notes && visit.investigations.special_notes.raw) {
        const cmt = this.extractCMT(visit.investigations.special_notes.raw, eye);
        if (cmt) {
          cmtData.push({ x: date, y: cmt });
        }
      }
    });

    const sortByDate = (a: { x?: string; date?: string }, b: { x?: string; date?: string }) =>
      (a.x || a.date || '').localeCompare(b.x || b.date || '');
    procedures.sort(sortByDate);
    visualAcuityData.sort(sortByDate);
    iopData.sort(sortByDate);
    cmtData.sort(sortByDate);

    return { procedures, visualAcuityData, iopData, cmtData };
  }

  convertVaToDecimal(vaStr: string): number | null {
    if (!vaStr) return null;
    vaStr = vaStr.trim().replace('P', '').toUpperCase();
    if (vaStr.includes('/')) {
      const [numer, denom] = vaStr.split('/').map(s => parseFloat(s));
      if (isNaN(numer) || isNaN(denom)) return null;
      return numer / denom;
    } else if (vaStr.includes('CF')) {
      return 0.01;
    } else if (vaStr === 'HM') {
      return 0.005;
    } else if (vaStr === 'PL') {
      return 0.001;
    } else if (vaStr === 'NO PL' || vaStr === 'NAS') {
      return 0;
    } else {
      const num = parseFloat(vaStr);
      return isNaN(num) ? null : num;
    }
  }

  extractCMT(text: string, eye: string): number | null {
    if (!text) return null;
    const regex = new RegExp(`${eye}\\s*(?:CMT|central macular thickness)\\s*[:=]?\\s*(\\d+)`, 'i');
    const match = text.match(regex);
    return match ? parseInt(match[1], 10) : null;
  }
}