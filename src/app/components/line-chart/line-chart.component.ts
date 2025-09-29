import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
Chart.register(...registerables);

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
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true })
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() chartData!: ChartData;
  @Input() metrics!: MetricConfig[];
  @Input() title: string = 'Clinical Metrics Over Time';

  private chart!: Chart;
  private minDate!: Date;
  private maxDate!: Date;
  private themeObserver!: MutationObserver;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    if (!this.chartData || !this.metrics) {
      throw new Error('chartData and metrics inputs are required for LineChartComponent');
    }

    const allDates = [
      ...this.chartData.visualAcuityData.map((d) => new Date(d.x)),
      ...this.chartData.procedures.map((p) => new Date(p.date)),
    ];
    this.minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    this.maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
  }

  ngAfterViewInit() {
    this.createChart();
    this.observeThemeChanges();
  }

  ngOnDestroy() {
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private observeThemeChanges() {
    this.ngZone.runOutsideAngular(() => {
      this.themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && 
              (mutation.attributeName === 'data-theme' || 
               mutation.attributeName === 'class')) {
            this.ngZone.run(() => {
              if (this.chart) {
                this.chart.destroy();
              }
              setTimeout(() => this.createChart(), 0);
            });
          }
        });
      });

      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'class']
      });
    });
  }

  getProcedurePosition(dateString: string): number {
    const date = new Date(dateString);
    const timeRange = this.maxDate.getTime() - this.minDate.getTime();
    const timeFromStart = date.getTime() - this.minDate.getTime();
    return (timeFromStart / timeRange) * 100;
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
      return [max, max - stepSize, max - (2 * stepSize), min].map(v => 
        Number(v.toFixed(2))
      );
    }
  }

  private isDarkTheme(): boolean {
    const dataTheme = document.documentElement.getAttribute('data-theme');
    const htmlClass = document.documentElement.className;
    const bodyClass = document.body?.className || '';
    
    return dataTheme === 'dark' || 
           htmlClass.includes('dark') || 
           bodyClass.includes('dark');
  }

  private getThemeColors() {
    const isDark = this.isDarkTheme();
    
    if (isDark) {
      return {
        gridColor: '#333333',
        tickColor: '#979797',
        borderColor: '#333333',
      };
    } else {
      return {
        gridColor: '#e0e0e0',
        tickColor: '#666666',
        borderColor: '#cccccc',
      };
    }
  }

  private createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;
    const colors = this.getThemeColors();

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        datasets: [
          {
            label: this.metrics[0].name,
            data: this.chartData.visualAcuityData as any,
            borderColor: this.metrics[0].color,
            backgroundColor: this.metrics[0].color,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: this.metrics[0].color,
            pointRadius: 2,
            pointHoverRadius: 4,
            borderWidth: 1,
            tension: 0.3,
            yAxisID: this.metrics[0].yAxisId,
          },
          {
            label: this.metrics[1].name,
            data: this.chartData.iopData as any,
            borderColor: this.metrics[1].color,
            backgroundColor: this.metrics[1].color,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: this.metrics[1].color,
            pointRadius: 2,
            pointHoverRadius: 4,
            borderWidth: 1,
            tension: 0.3,
            yAxisID: this.metrics[1].yAxisId,
          },
          {
            label: this.metrics[2].name,
            data: this.chartData.cmtData as any,
            borderColor: this.metrics[2].color,
            backgroundColor: this.metrics[2].color,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: this.metrics[2].color,
            pointRadius: 2,
            pointHoverRadius: 4,
            borderWidth: 1,
            tension: 0.3,
            yAxisID: this.metrics[2].yAxisId,
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
          },
          datalabels: {
            display: false,
          }
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
              color: colors.gridColor,
              lineWidth: 0.5,
            },
            ticks: {
              color: colors.tickColor,
              font: {
                size: 9,
              },
              maxTicksLimit: 15,
            },
            border: {
              color: colors.borderColor,
            },
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
              color: colors.gridColor,
              lineWidth: 0.5,
            },
          },
        },
        layout: {
          padding: {
            top: 5,
            right: 10,
            bottom: 10,
            left: 5,
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }
}