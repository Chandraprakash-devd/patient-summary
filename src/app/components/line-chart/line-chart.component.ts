// line-chart.component.ts
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../theme.service';

export interface ProcedureData {
  date: string;
  type: 'injection' | 'procedure';
  name: string;
  color: string;
  count?: number;
}

export interface TimeDataPoint {
  x: string;
  y: number;
}

export interface VADataPoint {
  x: string;
  y: string;
  yNumeric: number;
  nv: string | null;
}

export interface MetricConfig {
  name: string;
  color: string;
  colorLight?: string;
  colorDark?: string;
  min: number;
  max: number;
  step?: number;
  yAxisId: string;
}

export interface ChartData {
  visualAcuityData: VADataPoint[];
  iopData: TimeDataPoint[];
  cmtData: TimeDataPoint[];
  procedures: ProcedureData[];
}

interface PositionedProcedure extends ProcedureData {
  position: number;
  offsetIndex: number;
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild('chartCanvas', { static: true })
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() chartData!: ChartData;
  @Input() metrics!: MetricConfig[];
  @Input() title: string = 'Clinical Metrics Over Time';

  @Input() showVA: boolean = true;
  @Input() showIOP: boolean = true;
  @Input() showCMT: boolean = true;
  @Input() showProcedures: boolean = true;

  private chart!: Chart;
  private minDate!: Date;
  private maxDate!: Date;
  private themeSubscription!: Subscription;
  private themeObserver!: MutationObserver;
  public currentTheme: 'light' | 'dark' = 'light';

  public positionedProcedures: PositionedProcedure[] = [];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.currentTheme =
      (document.documentElement.getAttribute('data-theme') as
        | 'light'
        | 'dark') || 'light';

    if (!this.chartData || !this.metrics) {
      throw new Error(
        'chartData and metrics inputs are required for LineChartComponent'
      );
    }

    const allDates = [
      ...this.chartData.visualAcuityData.map((d) => new Date(d.x)),
      ...this.chartData.iopData.map((d) => new Date(d.x)),
      ...this.chartData.cmtData.map((d) => new Date(d.x)),
      ...this.chartData.procedures.map((p) => new Date(p.date)),
    ].filter((d) => !isNaN(d.getTime()));
    this.minDate = allDates.length
      ? new Date(Math.min(...allDates.map((d) => d.getTime())))
      : new Date();
    this.maxDate = allDates.length
      ? new Date(Math.max(...allDates.map((d) => d.getTime())))
      : new Date();

    this.calculateProcedurePositions();
  }

  ngAfterViewInit() {
    this.createChart();
    this.setupThemeObserver();
    this.themeSubscription = this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      if (this.chart) {
        this.chart.destroy();
      }
      this.createChart();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.chart &&
      changes['chartData'] &&
      !changes['chartData'].firstChange
    ) {
      const allDates = [
        ...this.chartData.visualAcuityData.map((d) => new Date(d.x)),
        ...this.chartData.iopData.map((d) => new Date(d.x)),
        ...this.chartData.cmtData.map((d) => new Date(d.x)),
        ...this.chartData.procedures.map((p) => new Date(p.date)),
      ].filter((d) => !isNaN(d.getTime()));

      if (allDates.length) {
        this.minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
        this.maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
      }

      this.calculateProcedurePositions();
      this.chart.destroy();
      this.createChart();
    }

    if (
      this.chart &&
      (changes['showVA'] || changes['showIOP'] || changes['showCMT']) &&
      !changes['chartData']
    ) {
      this.chart.data.datasets[0].hidden = !this.showVA;
      this.chart.data.datasets[1].hidden = !this.showIOP;
      this.chart.data.datasets[2].hidden = !this.showCMT;
      this.chart.update();
    }
  }

  ngOnDestroy() {
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private calculateProcedurePositions(): void {
    const procedures = this.chartData.procedures.map((proc) => ({
      ...proc,
      position: this.getProcedurePosition(proc.date),
      offsetIndex: 0,
    }));

    // Sort by position
    procedures.sort((a, b) => a.position - b.position);

    // Detect overlaps and assign horizontal offsets
    const OVERLAP_THRESHOLD = 1.2; // Procedures within 1.2% are considered overlapping

    for (let i = 0; i < procedures.length; i++) {
      const currentProc = procedures[i];
      let maxOffsetInRange = 0;

      // Check all previous procedures that might overlap
      for (let j = 0; j < i; j++) {
        const prevProc = procedures[j];
        const distance = Math.abs(currentProc.position - prevProc.position);

        // If procedures overlap, track the highest offset in this range
        if (distance < OVERLAP_THRESHOLD) {
          maxOffsetInRange = Math.max(
            maxOffsetInRange,
            prevProc.offsetIndex + 1
          );
        }
      }

      currentProc.offsetIndex = maxOffsetInRange;
    }

    this.positionedProcedures = procedures;
  }

  private setupThemeObserver(): void {
    this.themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          setTimeout(() => {
            this.updateChartTheme();
          }, 50);
        }
      });
    });

    const observerConfig = {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    };

    this.themeObserver.observe(document.documentElement, observerConfig);
    this.themeObserver.observe(document.body, observerConfig);
  }

  private isDarkTheme(): boolean {
    const html = document.documentElement;
    const body = document.body;

    return (
      html.classList.contains('dark') ||
      html.classList.contains('dark-theme') ||
      html.getAttribute('data-theme') === 'dark' ||
      body.classList.contains('dark') ||
      body.classList.contains('dark-theme') ||
      body.getAttribute('data-theme') === 'dark'
    );
  }

  private getMetricColor(metricIndex: number): string {
    const metric = this.metrics[metricIndex];
    const isDark = this.isDarkTheme();

    if (isDark && metric.colorDark) {
      return metric.colorDark;
    } else if (!isDark && metric.colorLight) {
      return metric.colorLight;
    }
    return metric.color;
  }

  private updateChartTheme(): void {
    if (!this.chart) {
      return;
    }

    const colors = this.getThemeColors();
    const isDark = this.isDarkTheme();

    const datasets = this.chart.data.datasets as any[];

    datasets[0].borderColor = this.getMetricColor(0);
    datasets[0].backgroundColor = this.getMetricColor(0);
    datasets[0].pointBorderColor = this.getMetricColor(0);
    datasets[0].pointBackgroundColor = isDark ? '#000000' : '#ffffff';

    datasets[1].borderColor = this.getMetricColor(1);
    datasets[1].backgroundColor = this.getMetricColor(1);
    datasets[1].pointBorderColor = this.getMetricColor(1);
    datasets[1].pointBackgroundColor = isDark ? '#000000' : '#ffffff';

    datasets[2].borderColor = this.getMetricColor(2);
    datasets[2].backgroundColor = this.getMetricColor(2);
    datasets[2].pointBorderColor = this.getMetricColor(2);
    datasets[2].pointBackgroundColor = isDark ? '#000000' : '#ffffff';

    const xScale = this.chart.options.scales?.['x'] as any;
    if (xScale) {
      if (xScale.ticks) {
        xScale.ticks.color = colors.tickColor;
      }
      if (xScale.grid) {
        xScale.grid.color = colors.gridColor;
      }
      if (xScale.border) {
        xScale.border.color = colors.borderColor;
      }
    }

    const yScale = this.chart.options.scales?.['y'] as any;
    if (yScale?.grid) {
      yScale.grid.color = colors.gridColor;
    }

    const tooltip = this.chart.options.plugins?.tooltip as any;
    if (tooltip) {
      tooltip.backgroundColor = colors.tooltipBackground;
      tooltip.titleColor = colors.tooltipTitleColor;
      tooltip.bodyColor = colors.tooltipBodyColor;
      tooltip.borderColor = colors.tooltipBorderColor;
    }

    this.chartCanvas.nativeElement.style.backgroundColor = isDark
      ? '#000000'
      : '#ffffff';

    this.chart.update('active');
  }

  getProcedurePosition(dateString: string): number {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 0;
    const timeRange = this.maxDate.getTime() - this.minDate.getTime();
    const timeFromStart = date.getTime() - this.minDate.getTime();
    return timeRange ? (timeFromStart / timeRange) * 100 : 0;
  }

  getScaleValues(metricIndex: number): string[] {
    const metric = this.metrics[metricIndex];

    if (metricIndex === 0) {
      return ['6/6', '6/18', '6/60', 'CF', 'HM', 'PL', 'No PL'];
    }

    const { min, max, step } = metric;

    if (step) {
      const values: string[] = [];
      for (let i = max; i >= min; i -= step) {
        values.push(i.toString());
      }
      return values;
    } else {
      const range = max - min;
      const stepSize = range / 3;
      return [
        max.toString(),
        (max - stepSize).toFixed(0),
        (max - 2 * stepSize).toFixed(0),
        min.toString(),
      ];
    }
  }

  private getThemeColors() {
    const isDarkTheme = this.isDarkTheme();
    return {
      gridColor: isDarkTheme
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)',
      tickColor: isDarkTheme ? '#ffffff' : '#000000',
      borderColor: isDarkTheme ? '#ffffff' : '#000000',
      tooltipBackground: isDarkTheme
        ? 'rgba(0, 0, 0, 0.8)'
        : 'rgba(255, 255, 255, 0.8)',
      tooltipTitleColor: isDarkTheme ? '#ffffff' : '#000000',
      tooltipBodyColor: isDarkTheme ? '#ffffff' : '#000000',
      tooltipBorderColor: isDarkTheme
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(0, 0, 0, 0.2)',
      isDarkTheme,
    };
  }

  private createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const {
      gridColor,
      tickColor,
      borderColor,
      isDarkTheme,
      tooltipBackground,
      tooltipTitleColor,
      tooltipBodyColor,
      tooltipBorderColor,
    } = this.getThemeColors();

    this.chartCanvas.nativeElement.style.backgroundColor = isDarkTheme
      ? '#000000'
      : '#ffffff';

    const normalizeVA = (value: number) => {
      const range = this.metrics[0].max - this.metrics[0].min;
      const normalized = (value - this.metrics[0].min) / range;
      return 66.67 + normalized * 33.33;
    };

    const normalizeIOP = (value: number) => {
      const range = this.metrics[1].max - this.metrics[1].min;
      const normalized = (value - this.metrics[1].min) / range;
      return 33.33 + normalized * 33.33;
    };

    const normalizeCMT = (value: number) => {
      const range = this.metrics[2].max - this.metrics[2].min;
      const normalized = (value - this.metrics[2].min) / range;
      return 0 + normalized * 33.33;
    };

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        datasets: [
          {
            label: this.metrics[0].name,
            data: this.chartData.visualAcuityData.map((d) => ({
              x: d.x,
              y: normalizeVA(d.yNumeric),
              originalY: d.y,
              originalYNumeric: d.yNumeric,
              nv: d.nv,
            })) as any,
            borderColor: this.getMetricColor(0),
            backgroundColor: this.getMetricColor(0),
            pointBackgroundColor: isDarkTheme ? '#000000' : '#ffffff',
            pointBorderColor: this.getMetricColor(0),
            pointRadius: 2,
            pointHoverRadius: 4,
            borderWidth: 2,
            tension: 0.3,
            yAxisID: 'y',
            hidden: !this.showVA,
          },
          {
            label: this.metrics[1].name,
            data: this.chartData.iopData.map((d) => ({
              x: d.x,
              y: normalizeIOP(d.y),
              originalY: d.y,
            })) as any,
            borderColor: this.getMetricColor(1),
            backgroundColor: this.getMetricColor(1),
            pointBackgroundColor: isDarkTheme ? '#000000' : '#ffffff',
            pointBorderColor: this.getMetricColor(1),
            pointRadius: 2,
            pointHoverRadius: 4,
            borderWidth: 2,
            tension: 0.3,
            yAxisID: 'y',
            hidden: !this.showIOP,
          },
          {
            label: this.metrics[2].name,
            data: this.chartData.cmtData.map((d) => ({
              x: d.x,
              y: normalizeCMT(d.y),
              originalY: d.y,
            })) as any,
            borderColor: this.getMetricColor(2),
            backgroundColor: this.getMetricColor(2),
            pointBackgroundColor: isDarkTheme ? '#000000' : '#ffffff',
            pointBorderColor: this.getMetricColor(2),
            pointRadius: 2,
            pointHoverRadius: 4,
            borderWidth: 2,
            tension: 0.3,
            yAxisID: 'y',
            hidden: !this.showCMT,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: tooltipBackground,
            titleColor: tooltipTitleColor,
            bodyColor: tooltipBodyColor,
            borderColor: tooltipBorderColor,
            borderWidth: 1,
            callbacks: {
              title: (tooltipItems) => {
                return tooltipItems[0].label;
              },
              label: (context) => {
                const datasetLabel = context.dataset.label || '';
                const rawData = context.raw as any;

                if (datasetLabel.includes('BCVA')) {
                  return `${datasetLabel}: ${rawData.originalY}${
                    rawData.nv ? ' / ' + rawData.nv : ''
                  }`;
                } else if (datasetLabel.includes('IOP')) {
                  return `${datasetLabel}: ${rawData.originalY.toFixed(
                    1
                  )} mm Hg`;
                } else if (datasetLabel.includes('CMT')) {
                  return `${datasetLabel}: ${rawData.originalY.toFixed(0)} μm`;
                }
                return `${datasetLabel}: ${rawData.originalY}`;
              },
            },
          },
          datalabels: {
            display: false,
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              displayFormats: {
                month: 'dd-MM-yyyy',
              },
            },
            grid: {
              color: gridColor,
              lineWidth: 0.5,
            },
            ticks: {
              color: tickColor,
              font: {
                size: 9,
              },
              maxTicksLimit: 15,
            },
            border: {
              color: borderColor,
            },
            min: this.minDate.toISOString().substring(0, 10),
            max: this.maxDate.toISOString().substring(0, 10),
          },
          y: {
            type: 'linear',
            display: false,
            position: 'left',
            min: 0,
            max: 100,
            grid: {
              color: gridColor,
              lineWidth: 0.5,
            },
          },
        },
        layout: {
          padding: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }
}
