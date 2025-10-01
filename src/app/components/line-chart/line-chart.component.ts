// line-chart.component.ts
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnDestroy,
  SimpleChanges, // Newly added import
  OnChanges, // Newly added import
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

export interface MetricConfig {
  name: string;
  color: string;
  min: number;
  max: number;
  step?: number;
  yAxisId: string;
}

export interface ChartData {
  visualAcuityData: TimeDataPoint[];
  iopData: TimeDataPoint[];
  cmtData: TimeDataPoint[];
  procedures: ProcedureData[];
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges { // Added OnChanges
  @ViewChild('chartCanvas', { static: true })
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() chartData!: ChartData;
  @Input() metrics!: MetricConfig[];
  @Input() title: string = 'Clinical Metrics Over Time';

  // Newly added inputs for toggles
  @Input() showVA: boolean = true;
  @Input() showIOP: boolean = true;
  @Input() showCMT: boolean = true;
  @Input() showProcedures: boolean = true;

  private chart!: Chart;
  private minDate!: Date;
  private maxDate!: Date;
  private themeSubscription!: Subscription;
  public currentTheme: 'light' | 'dark' = 'light';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.currentTheme = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';

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
  }

  ngAfterViewInit() {
    this.createChart();
    this.themeSubscription = this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      if (this.chart) {
        this.chart.destroy();
      }
      this.createChart();
    });
  }

  // Newly added to handle toggle changes
  ngOnChanges(changes: SimpleChanges) {
    if (this.chart && (changes['showVA'] || changes['showIOP'] || changes['showCMT'])) {
      this.chart.data.datasets[0].hidden = !this.showVA;
      this.chart.data.datasets[1].hidden = !this.showIOP;
      this.chart.data.datasets[2].hidden = !this.showCMT;
      this.chart.update();
    }
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  getProcedurePosition(dateString: string): number {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 0;
    const timeRange = this.maxDate.getTime() - this.minDate.getTime();
    const timeFromStart = date.getTime() - this.minDate.getTime();
    return timeRange ? (timeFromStart / timeRange) * 100 : 0;
  }

  getScaleValues(metricIndex: number): number[] {
    const metric = this.metrics[metricIndex];
    const { min, max, step } = metric;

    if (step) {
      const values = [];
      for (let i = max; i >= min; i -= step) {
        values.push(i);
      }
      return values;
    } else {
      const range = max - min;
      const stepSize = range / 3;
      return [max, max - stepSize, max - 2 * stepSize, min];
    }
  }

  private getThemeColors() {
    const isDarkTheme = this.currentTheme === 'dark';
    return {
      gridColor: isDarkTheme
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)',
      tickColor: isDarkTheme ? '#ffffff' : '#000000',
      borderColor: isDarkTheme ? '#ffffff' : '#000000',
      tooltipBackground: isDarkTheme ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      tooltipTitleColor: isDarkTheme ? '#ffffff' : '#000000',
      tooltipBodyColor: isDarkTheme ? '#ffffff' : '#000000',
      tooltipBorderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
      isDarkTheme,
    };
  }

  private createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const { gridColor, tickColor, borderColor, isDarkTheme, tooltipBackground, tooltipTitleColor, tooltipBodyColor, tooltipBorderColor } = this.getThemeColors();

    // Set canvas background explicitly
    this.chartCanvas.nativeElement.style.backgroundColor = isDarkTheme ? '#000000' : '#ffffff';

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        datasets: [
          {
            label: this.metrics[0].name,
            data: this.chartData.visualAcuityData as any,
            borderColor: this.metrics[0].color,
            backgroundColor: this.metrics[0].color,
            pointBackgroundColor: isDarkTheme ? '#ffffff' : '#000000',
            pointBorderColor: this.metrics[0].color,
            pointRadius: 2,
            pointHoverRadius: 4,
            borderWidth: 1,
            tension: 0.3,
            yAxisID: this.metrics[0].yAxisId,
            hidden: !this.showVA, // Updated with toggle
          },
          {
            label: this.metrics[1].name,
            data: this.chartData.iopData as any,
            borderColor: this.metrics[1].color,
            backgroundColor: this.metrics[1].color,
            pointBackgroundColor: isDarkTheme ? '#ffffff' : '#000000',
            pointBorderColor: this.metrics[1].color,
            pointRadius: 2,
            pointHoverRadius: 4,
            borderWidth: 1,
            tension: 0.3,
            yAxisID: this.metrics[1].yAxisId,
            hidden: !this.showIOP, // Updated with toggle
          },
          {
            label: this.metrics[2].name,
            data: this.chartData.cmtData as any,
            borderColor: this.metrics[2].color,
            backgroundColor: this.metrics[2].color,
            pointBackgroundColor: isDarkTheme ? '#ffffff' : '#000000',
            pointBorderColor: this.metrics[2].color,
            pointRadius: 2,
            pointHoverRadius: 4,
            borderWidth: 1,
            tension: 0.3,
            yAxisID: this.metrics[2].yAxisId,
            hidden: !this.showCMT, // Updated with toggle
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
          [this.metrics[0].yAxisId]: {
            type: 'linear',
            display: false,
            position: 'left',
            min: this.metrics[0].min,
            max: this.metrics[0].max,
            grid: {
              drawOnChartArea: false,
            },
          },
          [this.metrics[1].yAxisId]: {
            type: 'linear',
            display: false,
            position: 'left',
            min: this.metrics[1].min,
            max: this.metrics[1].max,
            grid: {
              drawOnChartArea: false,
            },
          },
          [this.metrics[2].yAxisId]: {
            type: 'linear',
            display: false,
            position: 'left',
            min: this.metrics[2].min,
            max: this.metrics[2].max,
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