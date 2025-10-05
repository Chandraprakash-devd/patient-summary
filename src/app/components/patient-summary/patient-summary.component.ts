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
  VADataPoint,
} from '../line-chart/line-chart.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import patient1Data from '../../../../patient_data/patient_complete_data.json';
import patient2Data from '../../../../patient_data/patient_1271481_summary.json';
import patient3Data from '../../../../patient_data/patient_11512248_summary.json';
import patient4Data from '../../../../patient_data/patient_1198643_summary.json';
import patient5Data from '../../../../patient_data/patient_1240726_summary.json';
import patient6Data from '../../../../patient_data/patient_1279381_summary.json';
import patient7Data from '../../../../patient_data/patient_1288057_summary.json';
import patient8Data from '../../../../patient_data/patient_1418045_summary.json';
import patient9Data from '../../../../patient_data/patient_1488606_summary.json';

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
  private patientDataMap = new Map<string, any>([
    ['Patient 1', patient1Data],
    ['Patient 2', patient2Data],
    ['Patient 3', patient3Data],
    ['Patient 4', patient4Data],
    ['Patient 5', patient5Data],
    ['Patient 6', patient6Data],
    ['Patient 7', patient7Data],
    ['Patient 8', patient8Data],
    ['Patient 9', patient9Data],
  ]);

  jsonData: any = patient1Data;
  patientSummary: string = '';
  patients: string[] = [];
  eyes: string[] = ['Right Eye', 'Left Eye'];
  selectedEye: string = this.eyes[0];
  selectedPatient: string = '';
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
  lensData: { task: string; start: string; end: string }[] = [];

  // Toggle booleans
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
    title: 'Diagnoses',
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
    barColorLight: '#e8c468',
    barColorDark: '#af57db',
    borderRadius: 3,
    dateFormat: 'en-US',
    tooltipCallback: (context: any, data: any[]) => {
      const index = context.dataIndex;
      const task = data[index];
      return `${task.task}<br>Start: ${task.start}<br>End: ${task.end}`;
    },
  };

  lensConfig = {
    title: 'Lens',
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
      colorLight: '#e76e50',
      colorDark: '#6bb6ff',
      min: -2.0,
      max: 1.6,
      step: 0.3,
      yAxisId: 'y1',
    },
    {
      name: 'IOP',
      color: '#4ade80',
      colorLight: '#2a9d90',
      colorDark: '#5fea9a',
      min: 0,
      max: 20,
      step: 5,
      yAxisId: 'y2',
    },
    {
      name: 'CMT',
      color: '#f472b6',
      colorLight: '#f4a462',
      colorDark: '#f78bc9',
      min: 0,
      max: 1000,
      step: 250,
      yAxisId: 'y3',
    },
  ];

  // Dynamic color assignment for procedures
  private procedureColorMap = new Map<string, string>();
  private colorPalette: string[] = [
    '#00bcd4', // Cyan
    '#4ade80', // Green
    '#06b6d4', // Teal
    '#8b5cf6', // Purple
    '#f472b6', // Pink
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#3b82f6', // Blue
    '#ec4899', // Fuchsia
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#6366f1', // Indigo
    '#14b8a6', // Teal
    '#a855f7', // Violet
  ];
  private colorIndex = 0;

  ngOnInit(): void {
    this.patients = Array.from(this.patientDataMap.keys());
    this.selectedPatient = this.patients[0];

    this.jsonData = this.patientDataMap.get(this.selectedPatient);

    if (!this.jsonData || !this.jsonData.patient_info) {
      console.error('Invalid JSON data structure');
      return;
    }
    // Initialize procedure colors
    this.initializeProcedureColors();

    this.updateData();
  }

  onPatientChange(): void {
    // Load the selected patient's data
    this.jsonData = this.patientDataMap.get(this.selectedPatient);

    if (!this.jsonData || !this.jsonData.patient_info) {
      console.error('Invalid JSON data for selected patient');
      return;
    }

    // Reinitialize procedure colors for new patient
    this.procedureColorMap.clear();
    this.colorIndex = 0;
    this.initializeProcedureColors();

    // Update all data for new patient
    this.updateData();
  }

  /**
   * Initialize colors for all unique procedures in the dataset
   */
  private initializeProcedureColors(): void {
    const uniqueProcedures = new Set<string>();

    (this.jsonData.visits || []).forEach((visit: any) => {
      if (visit.procedures) {
        ['RE', 'LE', 'BE'].forEach((eye) => {
          const procEye = visit.procedures[eye];
          if (procEye) {
            procEye.forEach((proc: any) => {
              const name = proc.laser_type || proc.type;
              if (name) {
                uniqueProcedures.add(name);
              }
            });
          }
        });
      }
    });

    // Assign colors to each unique procedure
    Array.from(uniqueProcedures).forEach((procedureName) => {
      this.procedureColorMap.set(
        procedureName,
        this.colorPalette[this.colorIndex % this.colorPalette.length]
      );
      this.colorIndex++;
    });

    console.log('Procedure colors initialized:', this.procedureColorMap);
  }

  /**
   * Get color for a procedure name
   */
  private getProcedureColor(procedureName: string): string {
    let color = this.procedureColorMap.get(procedureName);

    if (!color) {
      // If procedure not found, assign a new color
      color = this.colorPalette[this.colorIndex % this.colorPalette.length];
      this.procedureColorMap.set(procedureName, color);
      this.colorIndex++;
    }

    return color;
  }

  onEyeChange(): void {
    this.updateData();
  }

  updateData(): void {
    const eye =
      this.selectedEye === 'Right Eye'
        ? 'RE'
        : this.selectedEye === 'Left Eye'
        ? 'LE'
        : 'BE';

    this.patientSummary = this.generatePatientSummary();
    this.diseases = this.getDiseases();
    this.procedures = this.getProcedures(eye);

    this.ganttData = [...this.getGanttData('diagnosis', eye)];

    this.backgroundRetinaData = [
      ...this.getGanttData('background_retina', eye),
    ];
    this.maculaFovealReflexData = [...this.getGanttData('foveal_reflex', eye)];
    this.conjunctivaData = [...this.getGanttData('conjunctiva', eye)];
    this.mediaData = [...this.getGanttData('media', eye)];
    this.anteriorChamberData = [...this.getGanttData('anterior_chamber', eye)];
    this.irisData = [...this.getGanttData('iris', eye)];
    this.discData = [...this.getGanttData('disc', eye)];
    this.pupilData = [...this.getGanttData('pupil', eye)];
    this.vesselsData = [...this.getGanttData('vessels', eye)];
    this.undilatedFundusData = [...this.getGanttData('undilated_fundus', eye)];
    this.medicationsData = [...this.getMedicationsGanttData(eye)];
    this.lensData = [...this.getGanttData('lens', eye)];
    this.lineChartData = { ...this.getLineChartData(eye) };
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
    // Remove count suffix to get base procedure name
    const name = procedureItem.replace(/\s*\(\d+x\)$/, '');

    // Determine if it's an injection or laser procedure
    const isInjection = /Inj|Ozurdex|Tricort|Avastin|Pagenax|Accentrix/i.test(
      name
    );

    return {
      svg: isInjection ? 'injection' : 'procedure',
      color: this.getProcedureColor(name),
    };
  }

  getGanttData(
    section: string,
    eye: string
  ): { task: string; start: string; end: string }[] {
    const ganttSection =
      this.jsonData.gantt_charts?.[section] ||
      (section === 'diagnosis' ? this.jsonData.diagnosis : null);

    if (!ganttSection) {
      console.warn(`No data found for section: ${section}`);
      return [];
    }

    const diagMap = new Map<string, { start: string; end: string }>();
    const processedBilateralConditions = new Set<string>();

    Object.keys(ganttSection).forEach((key) => {
      const cond = ganttSection[key];
      if (!cond) return;

      let baseTask = '';
      if (cond.condition) {
        baseTask = cond.condition;
      } else if (key.includes('_diagnosis_') || key.includes('_')) {
        const parts = key.split('_diagnosis_');
        if (parts.length === 2) {
          baseTask = parts[0].replace(/_/g, ' ');
        } else {
          baseTask = key.replace(/_/g, ' ');
        }
      } else {
        baseTask = key;
      }

      if (!baseTask || !cond.periods) return;

      if (cond.from_both_eyes) {
        const bilateralKey = baseTask + '_bilateral';

        if (!processedBilateralConditions.has(bilateralKey)) {
          processedBilateralConditions.add(bilateralKey);

          const displayTask = baseTask + ' (BE)';
          let entry = diagMap.get(displayTask) || {
            start: '9999-12-31',
            end: '0001-01-01',
          };

          (cond.periods || []).forEach((p: any) => {
            if (p.start_date && p.end_date) {
              if (p.start_date < entry.start) entry.start = p.start_date;
              if (p.end_date > entry.end) entry.end = p.end_date;
            }
          });

          diagMap.set(displayTask, entry);
        }
        return;
      }

      let include = false;
      let displayTask = baseTask;

      if (eye === 'BE') {
        include = true;
        displayTask = baseTask + ' (' + cond.eye + ')';
      } else {
        if (cond.eye === eye) {
          include = true;
          displayTask = baseTask;
        }
      }

      if (include) {
        let entry = diagMap.get(displayTask) || {
          start: '9999-12-31',
          end: '0001-01-01',
        };

        (cond.periods || []).forEach((p: any) => {
          if (p.start_date && p.end_date) {
            if (p.start_date < entry.start) entry.start = p.start_date;
            if (p.end_date > entry.end) entry.end = p.end_date;
          }
        });

        diagMap.set(displayTask, entry);
      }
    });

    const ganttData = Array.from(diagMap.entries())
      .map(([task, { start, end }]) => ({
        task,
        start: start.substring(0, 10),
        end: end.substring(0, 10),
      }))
      .filter((d) => d.start !== '9999-12-31' && d.end !== '0001-01-01');

    return ganttData;
  }

  getMedicationsGanttData(
    eye: string
  ): { task: string; start: string; end: string }[] {
    const medMap = new Map<string, { start: string; end: string }>();
    (this.jsonData.visits || []).forEach((visit: any) => {
      if (visit.medications) {
        visit.medications.forEach((med: any) => {
          const task = med.drug?.trim();
          if (!task) return;

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

    return ganttData;
  }

  getLineChartData(eye: string): ChartData {
    console.log('=== Getting Line Chart Data for eye:', eye, '===');

    const procedures: ProcedureData[] = [];
    const visualAcuityData: VADataPoint[] = [];
    const iopData: TimeDataPoint[] = [];
    const cmtData: TimeDataPoint[] = [];

    (this.jsonData.visits || []).forEach((visit: any) => {
      const date = visit.visit_date?.substring(0, 10) || '';
      if (!date) return;

      // Extract Procedures with dynamic colors
      const procEye = visit.procedures
        ? visit.procedures[eye] || visit.procedures['BE']
        : null;
      if (procEye) {
        procEye.forEach((proc: any) => {
          const type = proc.type?.includes('Inj') ? 'injection' : 'procedure';
          const name = proc.laser_type || proc.type;
          if (name) {
            const color = this.getProcedureColor(name);
            procedures.push({ date, type, name, color });
          }
        });
      }

      // Extract Visual Acuity (DV for plotting, NV for tooltip)
      if (visit.vision_iop) {
        let dvVA: string | null = null;
        let nvVA: string | null = null;

        if (
          visit.vision_iop.dv_refraction &&
          visit.vision_iop.dv_refraction[eye]
        ) {
          const dvData = visit.vision_iop.dv_refraction[eye];
          const rawDV = dvData.VA || dvData.UCVA_VA;
          if (rawDV) {
            dvVA = this.normalizeVAString(rawDV);
          }
        }

        if (
          visit.vision_iop.nv_refraction &&
          visit.vision_iop.nv_refraction[eye]
        ) {
          const nvData = visit.vision_iop.nv_refraction[eye];
          if (nvData.VA) {
            nvVA = this.normalizeVAString(nvData.VA);
          }
        }

        if (dvVA) {
          const numericValue = this.convertVAToNumeric(dvVA);
          if (numericValue !== null) {
            visualAcuityData.push({
              x: date,
              y: dvVA,
              yNumeric: numericValue,
              nv: nvVA,
            });
          }
        }
      }

      // Extract IOP (Intraocular Pressure)
      if (visit.investigations && visit.investigations.general_investigations) {
        const gens = visit.investigations.general_investigations.map(
          (g: any) => g.name
        );
        const idx = gens.indexOf('IOP');
        if (idx >= 0) {
          const eyeResults = visit.investigations.eye_specific_results?.[eye];

          if (typeof eyeResults === 'string') {
            const vals = eyeResults.split(';');
            const valStr = vals[idx];
            const y = parseFloat(valStr);
            if (!isNaN(y) && y > 0) {
              iopData.push({ x: date, y });
            }
          } else if (eyeResults) {
            const y = parseFloat(eyeResults);
            if (!isNaN(y) && y > 0) {
              iopData.push({ x: date, y });
            }
          }
        }
      }

      // Extract CMT - Try multiple sources in priority order
      let cmtValue: number | null = null;

      if (visit.investigations) {
        if (visit.investigations.general_investigations) {
          const gens = visit.investigations.general_investigations.map(
            (g: any) => g.name
          );
          const octIndex = gens.indexOf('Optical Coherence Tomography');

          if (octIndex >= 0 && visit.investigations.eye_specific_results) {
            const eyeResults = visit.investigations.eye_specific_results[eye];

            if (typeof eyeResults === 'string') {
              const vals = eyeResults.split(';');
              const valStr = vals[octIndex];
              const parsed = parseFloat(valStr);
              if (!isNaN(parsed) && parsed >= 150 && parsed <= 1500) {
                cmtValue = parsed;
              }
            } else if (eyeResults) {
              const parsed = parseFloat(eyeResults);
              if (!isNaN(parsed) && parsed >= 150 && parsed <= 1500) {
                cmtValue = parsed;
              }
            }
          }
        }

        if (!cmtValue && visit.investigations.special_notes) {
          // Use the new Python-like extraction from raw note if available
          if (visit.investigations.special_notes.raw) {
            const extracted = this.extractCMTFromText(
              visit.investigations.special_notes.raw
            );
            cmtValue = eye === 'RE' ? extracted.RE : extracted.LE;
          }

          // Fallback to eye-specific note if raw extraction didn't yield a value
          if (cmtValue === null) {
            const eyeNote = visit.investigations.special_notes[eye];
            if (eyeNote) {
              const extracted = this.extractCMTFromText(eyeNote);
              cmtValue = eye === 'RE' ? extracted.RE : extracted.LE;
            }
          }
        }
      }

      if (cmtValue) {
        cmtData.push({ x: date, y: cmtValue });
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

    console.log(`VA Data Points for ${eye}:`, visualAcuityData.length);
    console.log(
      'VA Values:',
      visualAcuityData.map((d) => `${d.x}: ${d.y} (${d.yNumeric})`)
    );
    console.log(`IOP Data Points for ${eye}:`, iopData.length);
    console.log(
      'IOP Values:',
      iopData.map((d) => `${d.x}: ${d.y}`)
    );
    console.log(`CMT Data Points for ${eye}:`, cmtData.length);
    console.log(
      'CMT Values:',
      cmtData.map((d) => `${d.x}: ${d.y}`)
    );
    console.log('=== End Line Chart Data ===\n');

    return { procedures, visualAcuityData, iopData, cmtData };
  }

  normalizeVAString(vaStr: string): string | null {
    if (!vaStr) return null;
    let normalized = vaStr.trim().replace(/P$/i, '').trim();
    if (!normalized) return null;
    return normalized;
  }

  convertVAToNumeric(vaStr: string): number | null {
    if (!vaStr) return null;

    const upper = vaStr.toUpperCase().trim();

    const snellenToLogMAR: { [key: string]: number } = {
      '6/6': 0.0,
      '6/7.5': 0.1,
      '6/9': 0.18,
      '6/12': 0.3,
      '6/15': 0.4,
      '6/18': 0.48,
      '6/24': 0.6,
      '6/30': 0.7,
      '6/36': 0.78,
      '6/48': 0.9,
      '6/60': 1.0,
      '6/120': 1.3,
      '20/20': 0.0,
      '20/25': 0.1,
      '20/30': 0.18,
      '20/40': 0.3,
      '20/50': 0.4,
      '20/60': 0.48,
      '20/80': 0.6,
      '20/100': 0.7,
      '20/120': 0.78,
      '20/160': 0.9,
      '20/200': 1.0,
    };

    if (snellenToLogMAR[upper]) {
      return 1.5 - snellenToLogMAR[upper];
    }

    if (upper.includes('/')) {
      const parts = upper.split('/');
      if (parts.length === 2) {
        const numerator = parseFloat(parts[0]);
        const denominator = parseFloat(parts[1]);
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
          const logMAR = Math.log10(denominator / numerator);
          return 1.5 - logMAR;
        }
      }
    }

    if (upper.startsWith('N')) {
      const num = parseFloat(upper.substring(1));
      if (!isNaN(num)) {
        const logMAR = Math.log10(num / 6);
        return 1.5 - logMAR;
      }
    }

    if (upper.includes('CF')) return -0.5;
    if (upper === 'HM') return -1.0;
    if (upper === 'PL') return -1.5;
    if (upper === 'NO PL' || upper === 'NAS') return -2.0;

    return null;
  }

  extractCMTFromText(text: string): { RE: number | null; LE: number | null } {
    if (!text || ['none', 'nan', 'no data'].includes(text.toLowerCase())) {
      return { RE: null, LE: null };
    }

    const noteNorm = text.trim().replace(/\s+/g, ' ');

    let reValue: string | null = null;
    let leValue: string | null = null;

    // --- Explicit RE/LE extraction ---
    const explicitRegex =
      /\b(RE|LE)\s*[-:;,]?\s*['"]?(\d+\s*(?:µm|um|mm|Mm|M)?)/gi;
    let match;
    while ((match = explicitRegex.exec(noteNorm)) !== null) {
      const eye = match[1].toUpperCase();
      const value = match[2].replace(/\s+/g, '').toUpperCase();
      if (eye === 'RE') {
        reValue = value;
      } else if (eye === 'LE') {
        leValue = value;
      }
    }

    // --- Foveal Thickness extraction ---
    const fovealRegex =
      /Foveal\sThickness\s[-:;,]?\s*(\d+\s*(?:µm|um|mm|Mm|M)?)/gi;
    const fovealMatches: string[] = [];
    while ((match = fovealRegex.exec(noteNorm)) !== null) {
      fovealMatches.push(match[1].replace(/\s+/g, '').toUpperCase());
    }

    if (reValue && leValue) {
      // pass
    } else if (reValue && !leValue && fovealMatches.length === 1) {
      leValue = fovealMatches[0];
    } else if (!reValue && leValue && fovealMatches.length === 1) {
      reValue = fovealMatches[0];
    } else if (!reValue && !leValue && fovealMatches.length === 2) {
      reValue = fovealMatches[0];
      leValue = fovealMatches[1];
    }

    // Parse values to numbers, stripping non-digits
    const parseValue = (val: string | null): number | null => {
      if (!val) return null;
      const numericStr = val.replace(/[^0-9]/g, '');
      const numeric = parseInt(numericStr, 10);
      if (isNaN(numeric) || numeric < 150 || numeric > 1500) {
        return null;
      }
      return numeric;
    };

    return {
      RE: parseValue(reValue),
      LE: parseValue(leValue),
    };
  }
}
