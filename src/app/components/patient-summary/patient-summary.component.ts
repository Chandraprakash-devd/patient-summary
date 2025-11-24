import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
import { PatientDataService } from '../../services/patient-data.service';
import patient1Data from '../../../../patient_data/new/13543756.json';
import patient2Data from '../../../../patient_data/new/16218255.json';
import patient3Data from '../../../../patient_data/new/17905548.json';
import patient4Data from '../../../../patient_data/new/19045292.json';
import patient5Data from '../../../../patient_data/new/22683697.json';
import patient6Data from '../../../../patient_data/new/22696638.json';
import patient7Data from '../../../../patient_data/new/22764362.json';
import patient8Data from '../../../../patient_data/new/22777163.json';
import patient9Data from '../../../../patient_data/new/23366760.json';
// import file from '../../../../patient_data/patient_data_all'

// OLD imports for reference
// import patient1Data from '../../../../patient_data/patient_complete_data.json';
// import patient2Data from '../../../../patient_data/patient_1271481_summary.json';
// import patient3Data from '../../../../patient_data/patient_11512248_summary.json';
// import patient4Data from '../../../../patient_data/patient_1198643_summary.json';
// import patient5Data from '../../../../patient_data/patient_1240726_summary.json';
// import patient6Data from '../../../../patient_data/patient_1279381_summary.json';
// import patient7Data from '../../../../patient_data/patient_1288057_summary.json';
// import patient8Data from '../../../../patient_data/patient_1418045_summary.json';
// import patient9Data from '../../../../patient_data/patient_1488606_summary.json';

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
  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private patientDataService: PatientDataService
  ) {}

  // private patientDataMap = new Map<string, any>([
  //   ['Patient 1', patient8Data],
  //   ['Patient 2', patient2Data],
  //   ['Patient 3', patient5Data],
  //   ['Patient 4', patient6Data],
  //   ['Patient 5', patient4Data],
  //   ['Patient 6', patient1Data],
  //   ['Patient 7', patient9Data],
  //   ['Patient 8', patient3Data],
  //   ['Patient 9', patient7Data],
  // ]);

  jsonData: any = null;
  selectedPatient: string = '';
  selectedEye: string = 'Right Eye';
  eyes: string[] = ['Right Eye', 'Left Eye', 'Both Eyes'];
  patientSummary: string = '';
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

  async ngOnInit() {
    await this.patientDataService.loadSummaries();
    this.route.queryParams.subscribe(async (params: { [key: string]: any }) => {
      const uid = params['uid'];
      console.log('Query param UID:', uid);

      if (!uid) {
        this.jsonData = null;
        this.patientSummary = 'No UID provided in URL';
        this.clearAllData();
        this.cdr.detectChanges();
        return;
      }

      // Use the service to find patient by UID
      const foundPatient = await this.patientDataService.findPatientByUID(uid);

      this.ngZone.run(() => {
        if (foundPatient) {
          this.jsonData = foundPatient;
          this.selectedPatient = uid;

          console.log('✅ Found patient data for UID:', uid);

          this.initializeProcedureColors();
          this.updateData();
          this.cdr.detectChanges();
        } else {
          console.warn('⚠️ No patient data found for UID:', uid);
          this.jsonData = null;
          this.patientSummary = `No records found for UID: ${uid}`;
          this.clearAllData();
          this.cdr.detectChanges();
        }

        console.log('Loaded jsonData:', this.jsonData);
        console.log('Gantt diagnosis data length:', this.ganttData?.length);
      });
    });
  }

  private clearAllData(): void {
    this.ganttData = [];
    this.backgroundRetinaData = [];
    this.maculaFovealReflexData = [];
    this.conjunctivaData = [];
    this.mediaData = [];
    this.anteriorChamberData = [];
    this.irisData = [];
    this.discData = [];
    this.pupilData = [];
    this.vesselsData = [];
    this.undilatedFundusData = [];
    this.medicationsData = [];
    this.lensData = [];
    this.lineChartData = {
      procedures: [],
      visualAcuityData: [],
      iopData: [],
      cmtData: [],
    };
  }

  // onPatientChange(): void {
  //   // Load the selected patient's data
  //   this.jsonData = this.patientDataMap.get(this.selectedPatient);

  //   // NEW: Check p instead of patient_info
  //   if (!this.jsonData || !this.jsonData.p) {
  //     console.error('Invalid JSON data for selected patient');
  //     return;
  //   }

  //   // Reinitialize procedure colors for new patient
  //   this.procedureColorMap.clear();
  //   this.colorIndex = 0;
  //   this.initializeProcedureColors();

  //   // Update all data for new patient
  //   this.updateData();
  // }

  /**
   * Initialize colors for all unique procedures in the dataset
   * NEW: Updated to work with new pr structure
   */
  private initializeProcedureColors(): void {
    const uniqueProcedures = new Set<string>();

    (this.jsonData.visits || []).forEach((visit: any) => {
      if (visit.pr) {
        // Check both advised (adv) and actual (act) procedures
        ['adv', 'act'].forEach((procType) => {
          const procData = visit.pr[procType];
          if (procData && Array.isArray(procData)) {
            // procData is [[RE_procedures], [LE_procedures]]
            procData.forEach((eyeProcs: any) => {
              // eyeProcs can be null or an array
              if (eyeProcs && Array.isArray(eyeProcs)) {
                // Flatten if nested (handle [[["Green"]]] cases)
                const flattenedProcs = this.flattenProcedureArray(eyeProcs);
                flattenedProcs.forEach((proc: string) => {
                  // Filter out placeholder strings and validate
                  if (
                    proc &&
                    typeof proc === 'string' &&
                    proc.trim() &&
                    !this.isProcedurePlaceholder(proc)
                  ) {
                    uniqueProcedures.add(proc.trim());
                  }
                });
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
   * Helper to check if a procedure string is a placeholder
   */
  private isProcedurePlaceholder(proc: string): boolean {
    const normalized = proc.trim().toLowerCase();
    return (
      normalized.includes('no re procedure') ||
      normalized.includes('no le procedure') ||
      normalized.includes('no be procedure') ||
      normalized === 'no procedure' ||
      normalized === 'none' ||
      normalized === 'nil' ||
      normalized === 'n/a' ||
      normalized === '-'
    );
  }

  /**
   * Helper to flatten nested procedure arrays
   * Handles cases like [["Green"]] or [[["Green"]]]
   */
  private flattenProcedureArray(arr: any[]): string[] {
    const result: string[] = [];

    arr.forEach((item: any) => {
      if (typeof item === 'string') {
        result.push(item);
      } else if (Array.isArray(item)) {
        // Recursively flatten nested arrays
        result.push(...this.flattenProcedureArray(item));
      }
    });

    return result;
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
    console.log('=== updateData called ===');
    console.log('jsonData available:', !!this.jsonData);
    console.log('jsonData.p:', this.jsonData?.p);
    console.log('jsonData.visits count:', this.jsonData?.visits?.length);

    const eyeIndex =
      this.selectedEye === 'Right Eye'
        ? 0
        : this.selectedEye === 'Left Eye'
        ? 1
        : 2; // BE uses index 2 for diagnosis

    const eye =
      this.selectedEye === 'Right Eye'
        ? 'RE'
        : this.selectedEye === 'Left Eye'
        ? 'LE'
        : 'BE';

    console.log('Selected eye:', this.selectedEye, '→ eyeIndex:', eyeIndex);

    // NEW: Access UID from p.uid
    const uid = this.jsonData.p.uid.toString();
    // const eyeSummary = this.summaries.get(uid);
    const eyeSummary = this.patientDataService.getSummary(uid);
    if (eyeSummary) {
      this.patientSummary =
        this.selectedEye === 'Right Eye' ? eyeSummary.re : eyeSummary.le;
    } else {
      this.patientSummary = this.generatePatientSummary();
    }

    console.log('Getting diseases...');
    this.diseases = this.getDiseases();
    console.log('Diseases found:', this.diseases.length);

    console.log('Getting procedures...');
    this.procedures = this.getProcedures(eyeIndex);
    console.log('Procedures found:', this.procedures.length);

    console.log('Getting gantt data...');
    this.ganttData = [...this.getGanttData('diagnosis', eyeIndex)];

    this.backgroundRetinaData = [
      ...this.getGanttData('background_retina', eyeIndex),
    ];
    this.maculaFovealReflexData = [
      ...this.getGanttData('foveal_reflex', eyeIndex),
    ];
    this.conjunctivaData = [...this.getGanttData('conjunctiva', eyeIndex)];
    this.mediaData = [...this.getGanttData('media', eyeIndex)];
    this.anteriorChamberData = [
      ...this.getGanttData('anterior_chamber', eyeIndex),
    ];
    this.irisData = [...this.getGanttData('iris', eyeIndex)];
    this.discData = [...this.getGanttData('disc', eyeIndex)];
    this.pupilData = [...this.getGanttData('pupil', eyeIndex)];
    this.vesselsData = [...this.getGanttData('vessels', eyeIndex)];
    this.undilatedFundusData = [
      ...this.getGanttData('undilated_fundus', eyeIndex),
    ];
    this.medicationsData = [...this.getMedicationsGanttData()];
    this.lensData = [...this.getGanttData('lens', eyeIndex)];

    console.log('Getting line chart data...');
    this.lineChartData = { ...this.getLineChartData(eyeIndex) };
    console.log('Line chart data:', {
      procedures: this.lineChartData.procedures.length,
      va: this.lineChartData.visualAcuityData.length,
      iop: this.lineChartData.iopData.length,
      cmt: this.lineChartData.cmtData.length,
    });

    console.log('=== updateData complete ===');
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

    // NEW: Access patient info from p
    return `The patient (UID: ${this.jsonData.p.uid}) with conditions including ${diagnoses} in the ${eyeAbbr} has undergone procedures such as ${procList}. The patient's history includes ${systemicConditions}. Visual acuity, IOP, and CMT have been monitored over ${this.jsonData.p.v} visits from ${this.jsonData.p.f} to ${this.jsonData.p.l}.`;
  }

  /**
   * NEW: Extract diseases from systemic conditions (s.h field)
   */
  getDiseases(): { name: string; date: string }[] {
    const diseasesMap = new Map<string, string>();

    (this.jsonData.visits || []).forEach((visit: any) => {
      // NEW: systemic data is in visit.s.h
      if (visit.s && visit.s.h) {
        const diseases = visit.s.h.split(';').filter((d: string) => d.trim());

        // Format visit date (already in YYYY-MM-DD format)
        const formattedDate = this.formatDate(visit.d);

        diseases.forEach((disease: string) => {
          const trimmed = disease.trim();
          if (trimmed && !diseasesMap.has(trimmed)) {
            diseasesMap.set(trimmed, formattedDate);
          }
        });
      }
    });

    return Array.from(diseasesMap.entries()).map(([name, date]) => ({
      name,
      date,
    }));
  }

  /**
   * NEW: Extract procedures from pr.act (actual procedures)
   * @param eyeIndex 0 for RE, 1 for LE, 2 for BE
   */
  getProcedures(eyeIndex: number): { type: string; item: string }[] {
    const procCount = new Map<string, number>();

    console.log('🔍 getProcedures called for eyeIndex:', eyeIndex);

    (this.jsonData.visits || []).forEach((visit: any, visitIdx: number) => {
      if (visit.pr && visit.pr.act) {
        const actProcs = visit.pr.act;

        // Debug first visit
        if (visitIdx === 0) {
          console.log(
            '📋 First visit procedure data:',
            JSON.stringify(actProcs, null, 2)
          );
        }

        if (Array.isArray(actProcs)) {
          let proceduresToCheck: string[] = [];

          // For BE (Both Eyes), check both RE and LE procedures
          if (eyeIndex === 2) {
            if (actProcs[0] && Array.isArray(actProcs[0])) {
              const flattened = this.flattenProcedureArray(actProcs[0]);
              proceduresToCheck = proceduresToCheck.concat(
                flattened.filter((p: any) => p && typeof p === 'string')
              );
            }
            if (actProcs[1] && Array.isArray(actProcs[1])) {
              const flattened = this.flattenProcedureArray(actProcs[1]);
              proceduresToCheck = proceduresToCheck.concat(
                flattened.filter((p: any) => p && typeof p === 'string')
              );
            }
          } else {
            // For specific eye (RE or LE)
            if (actProcs[eyeIndex] && Array.isArray(actProcs[eyeIndex])) {
              const flattened = this.flattenProcedureArray(actProcs[eyeIndex]);
              proceduresToCheck = flattened.filter(
                (p: any) => p && typeof p === 'string'
              );
            }
          }

          proceduresToCheck.forEach((proc: string) => {
            const name = proc.trim();
            const isPlaceholder = this.isProcedurePlaceholder(name);

            // Debug logging
            if (name.toLowerCase().includes('no ')) {
              console.log('🔍 Checking procedure:', name);
              console.log('  - Is placeholder?', isPlaceholder);
              console.log('  - Normalized:', name.trim().toLowerCase());
            }

            // Filter out placeholders
            if (name && !isPlaceholder) {
              procCount.set(name, (procCount.get(name) || 0) + 1);
            } else if (isPlaceholder) {
              console.log('  ✅ Filtered out placeholder:', name);
            }
          });
        }
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

  /**
   * NEW: Build gantt data from visit observations
   * This builds timeline data from fundus, anterior segment, etc. observations
   */
  getGanttData(
    section: string,
    eyeIndex: number
  ): { task: string; start: string; end: string }[] {
    console.log(
      `Generating Gantt data for section: ${section}, eyeIndex: ${eyeIndex}`
    );

    const conditionMap = new Map<string, { start: string; end: string }>();

    // Map section names to JSON field paths
    const sectionFieldMap: {
      [key: string]: { parent: string; field: string };
    } = {
      diagnosis: { parent: 'diag', field: '' }, // Special handling for diagnosis
      background_retina: { parent: 'fu', field: 'br' },
      foveal_reflex: { parent: 'fu', field: 'mf' },
      conjunctiva: { parent: 'at', field: 'cj' },
      media: { parent: 'fu', field: 'me' },
      anterior_chamber: { parent: 'at', field: 'ac' },
      iris: { parent: 'at', field: 'ir' },
      disc: { parent: 'fu', field: 'di' },
      pupil: { parent: 'at', field: 'pu' },
      vessels: { parent: 'fu', field: 've' },
      undilated_fundus: { parent: 'fu', field: 'rem' }, // remarks field
      lens: { parent: 'at', field: 'lens' },
    };

    const mapping = sectionFieldMap[section];
    if (!mapping) {
      console.warn(`No field mapping found for section: ${section}`);
      return [];
    }

    // Special handling for diagnosis
    if (section === 'diagnosis') {
      return this.getDiagnosisGanttData(eyeIndex);
    }

    // Process visits to build timelines
    let currentCondition: string | null = null;
    let conditionStart: string | null = null;

    const sortedVisits = [...(this.jsonData.visits || [])].sort((a, b) =>
      a.d.localeCompare(b.d)
    );

    sortedVisits.forEach((visit: any, index: number) => {
      const visitDate = visit.d;
      const parentObj = visit[mapping.parent];

      if (!parentObj) return;

      let value: any = parentObj[mapping.field];

      // Handle array format (value can be string or array)
      if (Array.isArray(value)) {
        value = value[eyeIndex] || value[0]; // Fall back to first element if eyeIndex not available
      }

      // Skip if no value
      if (!value || value.trim() === '') {
        // If we had a condition running, end it at previous visit
        if (currentCondition && conditionStart) {
          const prevDate = sortedVisits[index - 1]?.d || visitDate;
          this.updateConditionMap(
            conditionMap,
            currentCondition,
            conditionStart,
            prevDate
          );
          currentCondition = null;
          conditionStart = null;
        }
        return;
      }

      const normalizedValue = this.normalizeConditionName(value);

      // If condition changed
      if (normalizedValue !== currentCondition) {
        // End previous condition
        if (currentCondition && conditionStart) {
          const prevDate = sortedVisits[index - 1]?.d || visitDate;
          this.updateConditionMap(
            conditionMap,
            currentCondition,
            conditionStart,
            prevDate
          );
        }

        // Start new condition
        currentCondition = normalizedValue;
        conditionStart = visitDate;
      }
    });

    // Close any remaining open condition
    if (currentCondition && conditionStart) {
      const lastVisit = sortedVisits[sortedVisits.length - 1];
      this.updateConditionMap(
        conditionMap,
        currentCondition,
        conditionStart,
        lastVisit.d
      );
    }

    // Convert to gantt data format
    const ganttData = Array.from(conditionMap.entries())
      .map(([task, { start, end }]) => ({
        task,
        start,
        end,
      }))
      .filter((d) => d.start && d.end);

    console.log(`${section} gantt data:`, ganttData);
    return ganttData;
  }

  /**
   * NEW: Extract diagnosis data and build gantt timelines
   */
  private getDiagnosisGanttData(
    eyeIndex: number
  ): { task: string; start: string; end: string }[] {
    const diagMap = new Map<string, { start: string; end: string }>();

    // Track diagnosis over time
    const diagTracker = new Map<string, { start: string; lastSeen: string }>();

    const sortedVisits = [...(this.jsonData.visits || [])].sort((a, b) =>
      a.d.localeCompare(b.d)
    );

    sortedVisits.forEach((visit: any) => {
      const visitDate = visit.d;

      if (visit.diag && Array.isArray(visit.diag)) {
        // diag format: [RE_diagnoses, LE_diagnoses, BE_diagnoses]
        const diagArray = visit.diag[eyeIndex];

        if (diagArray && Array.isArray(diagArray)) {
          const currentDiagnoses = new Set<string>();

          diagArray.forEach((diag: string) => {
            if (diag && diag.trim()) {
              const normalizedDiag = this.normalizeConditionName(diag.trim());
              currentDiagnoses.add(normalizedDiag);

              // Track this diagnosis
              if (!diagTracker.has(normalizedDiag)) {
                diagTracker.set(normalizedDiag, {
                  start: visitDate,
                  lastSeen: visitDate,
                });
              } else {
                const tracking = diagTracker.get(normalizedDiag)!;
                tracking.lastSeen = visitDate;
              }
            }
          });

          // Check for diagnoses that are no longer present
          diagTracker.forEach((tracking, diag) => {
            if (
              !currentDiagnoses.has(diag) &&
              tracking.lastSeen !== visitDate
            ) {
              // Diagnosis no longer present, finalize it
              this.updateConditionMap(
                diagMap,
                diag,
                tracking.start,
                tracking.lastSeen
              );
              diagTracker.delete(diag);
            }
          });
        }
      }
    });

    // Finalize any remaining diagnoses
    diagTracker.forEach((tracking, diag) => {
      this.updateConditionMap(diagMap, diag, tracking.start, tracking.lastSeen);
    });

    return Array.from(diagMap.entries())
      .map(([task, { start, end }]) => ({ task, start, end }))
      .filter((d) => d.start && d.end);
  }

  /**
   * Helper to update condition map with merged date ranges
   */
  private updateConditionMap(
    map: Map<string, { start: string; end: string }>,
    condition: string,
    start: string,
    end: string
  ): void {
    if (!condition || !start || !end) return;

    const existing = map.get(condition);
    if (!existing) {
      map.set(condition, { start, end });
    } else {
      // Merge date ranges
      if (start < existing.start) existing.start = start;
      if (end > existing.end) existing.end = end;
    }
  }

  /**
   * Normalize condition names for consistent grouping
   */
  private normalizeConditionName(name: string): string {
    return name
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[;,]+$/, ''); // Remove trailing semicolons/commas
  }

  /**
   * NEW: Build medications gantt from visit medications
   */
  getMedicationsGanttData(): { task: string; start: string; end: string }[] {
    const medMap = new Map<string, { start: string; end: string }>();

    (this.jsonData.visits || []).forEach((visit: any) => {
      if (visit.m && Array.isArray(visit.m)) {
        // m format: [[drug, frequency, duration_days, start_date, end_date], ...]
        visit.m.forEach((med: any[]) => {
          if (!Array.isArray(med) || med.length < 5) return;

          const [drug, frequency, durationDays, startDate, endDate] = med;
          const task = drug?.trim();

          if (!task) return;

          let start = startDate || visit.d;
          let end = endDate;

          // Calculate end date if not provided but duration is available
          if (!end && durationDays && start) {
            const startDateObj = new Date(start);
            const endDateObj = new Date(
              startDateObj.getTime() + parseInt(durationDays) * 86400000
            );
            end = endDateObj.toISOString().substring(0, 10);
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

  /**
   * NEW: Extract line chart data (VA, IOP, CMT, Procedures)
   */
  getLineChartData(eyeIndex: number): ChartData {
    console.log('=== Getting Line Chart Data for eyeIndex:', eyeIndex, '===');

    const procedures: ProcedureData[] = [];
    const visualAcuityData: VADataPoint[] = [];
    const iopData: TimeDataPoint[] = [];
    const cmtData: TimeDataPoint[] = [];

    (this.jsonData.visits || []).forEach((visit: any) => {
      const date = visit.d;
      if (!date) return;

      // Extract Procedures with dynamic colors
      if (visit.pr && visit.pr.act) {
        const actProcs = visit.pr.act;
        if (Array.isArray(actProcs) && actProcs[eyeIndex]) {
          const eyeProcs = actProcs[eyeIndex];
          if (Array.isArray(eyeProcs)) {
            // Flatten nested arrays
            const flattened = this.flattenProcedureArray(eyeProcs);
            flattened.forEach((proc: any) => {
              // Type check: ensure proc is a string and not a placeholder
              if (
                proc &&
                typeof proc === 'string' &&
                proc.trim() &&
                !this.isProcedurePlaceholder(proc)
              ) {
                const name = proc.trim();
                const type =
                  /Inj|Ozurdex|Tricort|Avastin|Pagenax|Accentrix/i.test(name)
                    ? 'injection'
                    : 'procedure';
                const color = this.getProcedureColor(name);
                procedures.push({ date, type, name, color });
              }
            });
          }
        }
      }

      // Extract Visual Acuity
      if (visit.vi) {
        let dvVA: string | null = null;
        let nvVA: string | null = null;

        // Distance VA from vi.dist
        if (
          visit.vi.dist &&
          Array.isArray(visit.vi.dist) &&
          visit.vi.dist[eyeIndex]
        ) {
          const distData = visit.vi.dist[eyeIndex];
          const rawVA = distData.va || distData.ucva;
          if (rawVA) {
            dvVA = this.decompressVision(rawVA);
          }
        }

        // Near VA from vi.nr
        if (
          visit.vi.nr &&
          Array.isArray(visit.vi.nr) &&
          visit.vi.nr[eyeIndex]
        ) {
          const nrData = visit.vi.nr[eyeIndex];
          if (nrData.va) {
            nvVA = this.decompressVision(nrData.va);
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

      // Extract IOP
      if (visit.inv && visit.inv.iop) {
        let iopValue: number | null = null;

        if (Array.isArray(visit.inv.iop)) {
          // Array format: [RE_value, LE_value]
          const iopStr = visit.inv.iop[eyeIndex];
          if (iopStr && iopStr !== 'Not Measurable') {
            iopValue = parseFloat(iopStr);
          }
        } else if (typeof visit.inv.iop === 'string') {
          // Single value for both eyes
          if (visit.inv.iop !== 'Not Measurable') {
            iopValue = parseFloat(visit.inv.iop);
          }
        }

        if (iopValue !== null && !isNaN(iopValue) && iopValue > 0) {
          iopData.push({ x: date, y: iopValue });
        }
      }

      // Extract CMT from special notes
      if (visit.inv && visit.inv.sp && visit.inv.sp.r) {
        const cmtValues = this.extractCMTFromText(visit.inv.sp.r);
        const cmtValue = eyeIndex === 0 ? cmtValues.RE : cmtValues.LE;

        if (cmtValue !== null) {
          cmtData.push({ x: date, y: cmtValue });
        }
      }
    });

    console.log('Line chart data extracted:', {
      procedures: procedures.length,
      va: visualAcuityData.length,
      iop: iopData.length,
      cmt: cmtData.length,
    });

    return {
      procedures,
      visualAcuityData,
      iopData,
      cmtData,
    };
  }

  /**
   * NEW: Decompress vision string from "618P" to "6/18P"
   */
  private decompressVision(compressed: string): string {
    if (!compressed) return '';

    // Handle special cases
    const upper = compressed.toUpperCase().trim();
    if (['CF', 'HM', 'PL', 'LP', 'NLP', 'NPL', 'FCMF', 'FCF'].includes(upper)) {
      return upper;
    }

    // Check if already in fraction format
    if (compressed.includes('/')) {
      return compressed;
    }

    // Decompress: "618P" -> "6/18P", "66" -> "6/6"
    const match = compressed.match(/^(\d)(\d+)(.*)$/);
    if (match) {
      const [, first, rest, suffix] = match;
      return `${first}/${rest}${suffix}`;
    }

    return compressed;
  }

  /**
   * Normalize VA string for consistent processing
   */
  private normalizeVAString(raw: string): string {
    if (!raw) return '';
    return raw.trim().toUpperCase().replace(/\s+/g, '');
  }

  /**
   * Convert VA to numeric value for plotting
   */
  convertVAToNumeric(va: string): number | null {
    if (!va) return null;

    const upper = va.toUpperCase().trim();

    // LogMAR conversion lookup
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
    if (upper === 'PL' || upper === 'LP') return -1.5;
    if (
      upper === 'NLP' ||
      upper === 'NO PL' ||
      upper === 'NAS' ||
      upper === 'NPL'
    )
      return -2.0;

    return null;
  }

  /**
   * Extract CMT values from text using regex
   */
  /**
   * Extract CMT values from text using comprehensive pattern matching
   * Handles: "RE: 231", "cmt 231um", "Foveal Thickness 231um", etc.
   */
  extractCMTFromText(text: string): { RE: number | null; LE: number | null } {
    if (!text || ['none', 'nan', 'no data'].includes(text.toLowerCase())) {
      return { RE: null, LE: null };
    }

    const noteNorm = text.trim().replace(/\s+/g, ' ');

    let reValue: string | null = null;
    let leValue: string | null = null;

    // --- Pattern 1: Explicit RE/LE extraction ---
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

    // --- Pattern 2: CMT pattern extraction (e.g., "cmt 231um") ---
    const cmtRegex = /\bcmt\s+(\d+)\s*(?:µm|um|mm)?/gi;
    const cmtMatches: string[] = [];
    while ((match = cmtRegex.exec(noteNorm)) !== null) {
      cmtMatches.push(match[1]);
    }

    // --- Pattern 3: Foveal Thickness extraction ---
    const fovealRegex =
      /Foveal\s+Thickness\s*[-:;,]?\s*(\d+\s*(?:µm|um|mm|Mm|M)?)/gi;
    const fovealMatches: string[] = [];
    while ((match = fovealRegex.exec(noteNorm)) !== null) {
      fovealMatches.push(match[1].replace(/\s+/g, '').toUpperCase());
    }

    // Combine all non-explicit matches
    const allMatches = [...cmtMatches, ...fovealMatches];

    // Assign values based on what we found
    if (reValue && leValue) {
      // Both eyes explicitly labeled, use them
    } else if (reValue && !leValue && allMatches.length === 1) {
      // RE labeled, one value found - assume it's LE
      leValue = allMatches[0];
    } else if (!reValue && leValue && allMatches.length === 1) {
      // LE labeled, one value found - assume it's RE
      reValue = allMatches[0];
    } else if (!reValue && !leValue && allMatches.length >= 2) {
      // No labels, multiple values - assume first is RE, second is LE
      reValue = allMatches[0];
      leValue = allMatches[1];
    } else if (!reValue && !leValue && allMatches.length === 1) {
      // No labels, single value - use for both eyes
      reValue = allMatches[0];
      leValue = allMatches[0];
    }

    // Parse values to numbers, stripping non-digits
    const parseValue = (val: string | null): number | null => {
      if (!val) return null;
      const numericStr = val.replace(/[^0-9]/g, '');
      const numeric = parseInt(numericStr, 10);
      if (isNaN(numeric) || numeric < 0 || numeric > 1500) {
        return null;
      }
      return numeric;
    };

    return {
      RE: parseValue(reValue),
      LE: parseValue(leValue),
    };
  }

  /**
   * Format date from YYYY-MM-DD to DD/MM/YYYY
   */
  private formatDate(dateStr: string): string {
    if (!dateStr) return '';

    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
}
