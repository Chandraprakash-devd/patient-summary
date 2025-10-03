// patient-summary.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { GanttChartComponent } from '../gantt-chart/gantt-chart.component';
import {
  LineChartComponent,
  ChartData,
  MetricConfig,
  ProcedureData,
  TimeDataPoint,
} from '../line-chart/line-chart.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import jsonData from '../../../../patient_1271481_summary.json';

@Component({
  selector: 'app-patient-summary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ThemeToggleComponent,
    GanttChartComponent,
    LineChartComponent,
    SidebarComponent,
  ],
  templateUrl: './patient-summary.component.html',
  styleUrls: ['./patient-summary.component.css'],
})
export class PatientSummaryComponent implements OnInit {
  jsonData: any = jsonData; // Loaded from file
  patientSummary: string = '';
  patients: string[] = [];
  eyes: string[] = ['Right Eye', 'Left Eye'];
  selectedPatient: string = '';
  selectedEye: string = this.eyes[0];
  diseases: { name: string; date: string }[] = [];
  procedures: { type: string; item: string }[] = [];
  ganttData: { task: string; start: string; end: string }[] = [];
  backgroundRetinaData: { task: string; start: string; end: string }[] = [];
  maculaFovealReflexData: { task: string; start: string; end: string }[] = [];
  conjunctivaData: { task: string; start: string; end: string }[] = [];
  mediaData: { task: string; start: string; end: string }[] = [];
  anteriorChamberData: { task: string; start: string; end: string }[] = [];
  irisData: { task: string; start: string; end: string }[] = [];
  discData: { task: string; start: string; end: string }[] = [];
  pupilData: { task: string; start: string; end: string }[] = [];
  vesselsData: { task: string; start: string; end: string }[] = [];
  undilatedFundusData: { task: string; start: string; end: string }[] = [];
  medicationsData: { task: string; start: string; end: string }[] = [];

  // Newly added toggle booleans
  showVA: boolean = true;
  showIOP: boolean = true;
  showCMT: boolean = true;
  showProcedures: boolean = true;
  showDiagnosis: boolean = true;
  showMedication: boolean = true;
  showObservations: boolean = true;
  showLens: boolean = true;
  showBackgroundRetina: boolean = true;
  showMaculaFovealReflex: boolean = true;
  showConjunctiva: boolean = true;
  showMedia: boolean = true;
  showAnteriorChamber: boolean = true;
  showIris: boolean = true;
  showDisc: boolean = true;
  showPupil: boolean = true;
  showVessels: boolean = true;
  showUndilatedFundus: boolean = true;

  ganttConfig = {
    title: 'Diagnoses Timeline',
    barColorLight: '#f4a462', // Lighter/different shade for light theme
    barColorDark: '#e23670', // Original color for dark theme
    borderRadius: 3,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task}<br>Start: ${task.start}<br>End: ${task.end}`;
    },
  };

  backgroundRetinaConfig = {
    title: 'Background Retina',
    barColorLight: '#f4a462',
    barColorDark: '#e23670',
    borderRadius: 3,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task}<br>Start: ${task.start}<br>End: ${task.end}`;
    },
  };

  maculaFovealReflexConfig = {
    title: 'Macula Foveal Reflex',
    barColorLight: '#f4a462',
    barColorDark: '#e23670',
    borderRadius: 3,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task}<br>Start: ${task.start}<br>End: ${task.end}`;
    },
  };

  conjunctivaConfig = {
    title: 'Conjunctiva',
    barColorLight: '#f4a462',
    barColorDark: '#e23670',
    borderRadius: 3,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task}<br>Start: ${task.start}<br>End: ${task.end}`;
    },
  };

  mediaConfig = {
    title: 'Media',
    barColorLight: '#f4a462',
    barColorDark: '#e23670',
    borderRadius: 3,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task}<br>Start: ${task.start}<br>End: ${task.end}`;
    },
  };

  anteriorChamberConfig = {
    title: 'Anterior Chamber',
    barColorLight: '#f4a462',
    barColorDark: '#e23670',
    borderRadius: 3,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task}<br>Start: ${task.start}<br>End: ${task.end}`;
    },
  };

  irisConfig = {
    title: 'Iris',
    barColorLight: '#f4a462',
    barColorDark: '#e23670',
    borderRadius: 3,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task}<br>Start: ${task.start}<br>End: ${task.end}`;
    },
  };

  discConfig = {
    title: 'Disc',
    barColorLight: '#f4a462',
    barColorDark: '#e23670',
    borderRadius: 3,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task}<br>Start: ${task.start}<br>End: ${task.end}`;
    },
  };

  pupilConfig = {
    title: 'Pupil',
    barColorLight: '#f4a462',
    barColorDark: '#e23670',
    borderRadius: 3,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task}<br>Start: ${task.start}<br>End: ${task.end}`;
    },
  };

  vesselsConfig = {
    title: 'Vessels',
    barColorLight: '#f4a462',
    barColorDark: '#e23670',
    borderRadius: 3,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task}<br>Start: ${task.start}<br>End: ${task.end}`;
    },
  };

  undilatedFundusConfig = {
    title: 'Undilated Fundus',
    barColorLight: '#f4a462',
    barColorDark: '#e23670',
    borderRadius: 3,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task}<br>Start: ${task.start}<br>End: ${task.end}`;
    },
  };

  medicationsConfig = {
    title: 'Medications',
    barColorLight: '#e8c468', // Purple for light theme
    barColorDark: '#af57db', // Lighter purple for dark theme
    borderRadius: 3,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task}<br>Start: ${task.start}<br>End: ${task.end}`;
    },
  };

  lineChartData: ChartData = {
    procedures: [],
    visualAcuityData: [],
    iopData: [],
    cmtData: [],
  };

  lineChartMetrics: MetricConfig[] = [
    {
      name: 'Dist : BCVA / Near : BCVA',
      color: '#4a9eff',
      min: 0.25,
      max: 1.75,
      step: 0.5,
      yAxisId: 'y1',
    },
    {
      name: 'IOP',
      color: '#4ade80',
      min: 4,
      max: 16,
      step: 4,
      yAxisId: 'y2',
    },
    {
      name: 'CMT',
      color: '#f472b6',
      min: 0,
      max: 1000,
      step: 250,
      yAxisId: 'y3',
    },
  ];

  colorMap = new Map<string, string>([
    ['Ozurdex', '#00bcd4'],
    ['Tricort', '#4ade80'],
    ['Avastin', '#06b6d4'],
    ['Pagenax', '#8b5cf6'],
    ['Accentrix', '#f472b6'],
    ['Accessible PRP', '#ef4444'],
    ['Focal', '#f97316'],
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
    const eye =
      this.selectedEye === 'Right Eye'
        ? 'RE'
        : this.selectedEye === 'Left Eye'
        ? 'LE'
        : 'BE';
    console.log(eye);
    this.patientSummary = this.generatePatientSummary();
    this.diseases = this.getDiseases();
    this.procedures = this.getProcedures(eye);
    this.ganttData = this.getGanttData('diagnosis', eye);
    this.backgroundRetinaData = this.getGanttData('background_retina', eye);
    this.maculaFovealReflexData = this.getGanttData('foveal_reflex', eye);
    this.conjunctivaData = this.getGanttData('conjunctiva', eye);
    this.mediaData = this.getGanttData('media', eye);
    this.anteriorChamberData = this.getGanttData('anterior_chamber', eye);
    this.irisData = this.getGanttData('iris', eye);
    this.discData = this.getGanttData('disc', eye);
    this.pupilData = this.getGanttData('pupil', eye);

    this.vesselsData = this.getGanttData('vessels', eye);
    this.undilatedFundusData = this.getGanttData('undilated_fundus', eye);
    this.medicationsData = this.getMedicationsGanttData();
    this.lineChartData = this.getLineChartData(eye);
    console.log('Diseases:', this.diseases);
    console.log('Procedures:', this.procedures);
    console.log('Gantt Data:', this.ganttData);
    console.log('Line Chart Data:', this.lineChartData);
  }

  generatePatientSummary(): string {
    const eyeAbbr =
      this.selectedEye === 'Right Eye'
        ? 'RE'
        : this.selectedEye === 'Left Eye'
        ? 'LE'
        : 'eyes';
    const diagnoses =
      this.ganttData.map((d) => d.task).join(', ') || 'no recorded diagnoses';
    const procList =
      this.procedures.map((p) => p.item).join(', ') || 'no recorded procedures';
    const systemicConditions =
      this.diseases.map((d) => d.name).join(', ') || 'no systemic conditions';
    return `The patient (UID: ${
      this.jsonData.patient_info.uid
    }) with conditions including ${diagnoses} in the ${eyeAbbr} has undergone procedures such as ${procList}. The patient's history includes ${systemicConditions}. Visual acuity, IOP, and CMT have been monitored over ${
      this.jsonData.patient_info.total_visits
    } visits from ${this.jsonData.patient_info.first_visit.substring(
      0,
      10
    )} to ${this.jsonData.patient_info.last_visit.substring(0, 10)}.`;
  }

  getDiseases(): { name: string; date: string }[] {
    const diseasesMap = new Map<string, string>();
    (this.jsonData.visits || []).forEach((visit: any) => {
      if (visit.systemic_history && visit.systemic_history.description) {
        const diseases = visit.systemic_history.description
          .split(';')
          .filter((d: string) => d.trim());
        const visitDate =
          visit.visit_date?.substring(0, 7).replace('-', '/') || '';
        diseases.forEach((disease: string) => {
          const trimmed = disease.trim();
          if (trimmed && !diseasesMap.has(trimmed)) {
            diseasesMap.set(trimmed, visitDate);
          }
        });
      }
    });
    return Array.from(diseasesMap.entries()).map(([name, date]) => ({
      name,
      date,
    }));
  }

  getProcedures(eye: string): { type: string; item: string }[] {
    const procCount = new Map<string, number>();
    (this.jsonData.visits || []).forEach((visit: any) => {
      const procEye = visit.procedures
        ? visit.procedures[eye] || visit.procedures['BE']
        : null;
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
      const type = /Inj|Ozurdex|Tricort|Avastin|Pagenax|Accentrix/i.test(name)
        ? 'Injection'
        : 'Retina Laser';
      return { type, item: `${name}${count > 1 ? ` (${count}x)` : ''}` };
    });
  }

  getSvgForProcedure(procedureItem: string): { svg: string; color: string } {
    // Check if it's an injection type
    if (/Inj|Ozurdex|Tricort|Avastin|Pagenax|Accentrix/i.test(procedureItem)) {
      // Extract the medication name to get the color
      const name = procedureItem.replace(/\s*\(\d+x\)$/, ''); // Remove count suffix
      const color = this.colorMap.get(name) || '#00bcd4'; // Default injection color
      return {
        svg: 'injection',
        color: color,
      };
    } else {
      // It's a laser procedure
      const name = procedureItem.replace(/\s*\(\d+x\)$/, '');
      const color = this.colorMap.get(name) || '#ef4444'; // Default laser color
      return {
        svg: 'procedure',
        color: color,
      };
    }
  }

  getGanttData(
    section: string,
    eye: string
  ): { task: string; start: string; end: string }[] {
    // Define eye based on selectedEye
    // const eye = this.selectedEye === 'Right Eye' ? 'RE' : this.selectedEye === 'Left Eye' ? 'LE' : 'BE';

    const ganttSection = this.jsonData.gantt_charts[section];
    console.log(section);

    if (!ganttSection) {
      console.warn('No gantt_charts.diagnoses or diagnosis section found');
      return [];
    }

    const diagMap = new Map<string, { start: string; end: string }>();
    Object.keys(ganttSection).forEach((key) => {
      const cond = ganttSection[key];
      if (!cond || !cond.condition || !cond.periods) return;

      const task = cond.condition;
      const matchesEye =
        cond.eye === eye || (eye === 'BE' && cond.from_both_eyes);
      if (!matchesEye) return;

      let entry = diagMap.get(task) || {
        start: '9999-12-31',
        end: '0001-01-01',
      };
      cond.periods.forEach((p: any) => {
        if (p.start_date && p.end_date) {
          if (p.start_date < entry.start) entry.start = p.start_date;
          if (p.end_date > entry.end) entry.end = p.end_date;
        }
      });
      diagMap.set(task, entry);
    });

    const ganttData = Array.from(diagMap.entries())
      .map(([task, { start, end }]) => ({
        task,
        start: start.substring(0, 10),
        end: end.substring(0, 10),
      }))
      .filter((d) => d.start !== '9999-12-31' && d.end !== '0001-01-01');

    console.log('Processed Gantt Data from gantt_charts.diagnoses:', ganttData);
    return ganttData;
  }
  getMedicationsGanttData(): { task: string; start: string; end: string }[] {
    const medMap = new Map<string, { start: string; end: string }>();
    (this.jsonData.visits || []).forEach((visit: any) => {
      if (visit.medications) {
        visit.medications.forEach((med: any) => {
          const task = med.drug?.trim();
          if (!task) return;

          // Prefer duration_start and duration_end if available (dd/mm/yyyy format)
          let start = '';
          if (med.duration_start) {
            const parts = med.duration_start.split('/');
            if (parts.length === 3) {
              start = `${parts[2]}-${parts[1].padStart(
                2,
                '0'
              )}-${parts[0].padStart(2, '0')}`;
            }
          } else if (med.start_date) {
            start = med.start_date.substring(0, 10);
          }

          let end = '';
          if (med.duration_end) {
            const parts = med.duration_end.split('/');
            if (parts.length === 3) {
              end = `${parts[2]}-${parts[1].padStart(
                2,
                '0'
              )}-${parts[0].padStart(2, '0')}`;
            }
          } else if (med.start_date && med.duration_days) {
            const startDate = new Date(med.start_date.substring(0, 10));
            const endDate = new Date(
              startDate.getTime() + med.duration_days * 86400000
            );
            end = endDate.toISOString().substring(0, 10);
          }

          if (start && end) {
            const entry = medMap.get(task) || {
              start: '9999-12-31',
              end: '0001-01-01',
            };
            if (start < entry.start) entry.start = start;
            if (end > entry.end) entry.end = end;
            medMap.set(task, entry);
          }
        });
      }
    });

    const ganttData = Array.from(medMap.entries())
      .map(([task, { start, end }]) => ({
        task,
        start,
        end,
      }))
      .filter((d) => d.start !== '9999-12-31' && d.end !== '0001-01-01');

    console.log('Processed Medications Gantt Data:', ganttData);
    return ganttData;
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
      const procEye = visit.procedures
        ? visit.procedures[eye] || visit.procedures['BE']
        : null;
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
        const vaStr =
          visit.vision_iop.dv_refraction[eye]?.VA ||
          visit.vision_iop.dv_refraction[eye]?.UCVA_VA;
        if (vaStr) {
          const y = this.convertVaToDecimal(vaStr);
          if (y !== null) {
            visualAcuityData.push({ x: date, y });
          }
        }
      }

      // IOP
      if (visit.investigations && visit.investigations.general_investigations) {
        const gens = visit.investigations.general_investigations.map(
          (g: any) => g.name
        );
        const idx = gens.indexOf('IOP');
        if (idx >= 0) {
          const vals =
            visit.investigations.eye_specific_results[eye]?.split(';') || [];
          const valStr = vals[idx];
          const y = parseFloat(valStr);
          if (!isNaN(y) && y > 0) {
            iopData.push({ x: date, y });
          }
        }
      }

      // CMT
      if (visit.investigations && visit.investigations.general_investigations) {
        const gens = visit.investigations.general_investigations.map(
          (g: any) => g.name
        );
        const idx = gens.indexOf('Optical Coherence Tomography');
        if (idx >= 0) {
          const vals =
            visit.investigations.eye_specific_results[eye]?.split(';') || [];
          const valStr = vals[idx];
          const y = parseFloat(valStr);
          if (!isNaN(y) && y > 0) {
            cmtData.push({ x: date, y });
          }
        }
      }
      if (
        visit.investigations &&
        visit.investigations.special_notes &&
        visit.investigations.special_notes.raw
      ) {
        const cmt = this.extractCMT(
          visit.investigations.special_notes.raw,
          eye
        );
        if (cmt) {
          cmtData.push({ x: date, y: cmt });
        }
      }
    });

    const sortByDate = (
      a: { x?: string; date?: string },
      b: { x?: string; date?: string }
    ) => (a.x || a.date || '').localeCompare(b.x || b.date || '');
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
      const [numer, denom] = vaStr.split('/').map((s) => parseFloat(s));
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
  const regex = new RegExp(
    `(?:${eye}\\s*)?(?:CMT|central macular thickness)\\s*[:=]?\\s*(\\d+)\\s*um?`,
    'i'
  );
  const match = text.match(regex);
  return match ? parseInt(match[1], 10) : null;
}
}
