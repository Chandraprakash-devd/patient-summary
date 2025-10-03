// gantt-chart.component.ts
import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);
Chart.register(annotationPlugin);

interface GanttData {
  task: string;
  start: string;
  end: string;
}

interface GanttConfig {
  title?: string;
  barColor?: string;
  barColorLight?: string;
  barColorDark?: string;
  borderRadius?: number;
  dateFormat?: string;
  tooltipCallback?: (context: any, data: GanttData[]) => string;
}

interface ProcessedGanttItem {
  task: string;
  start: string;
  end: string;
  track: number;
  startTime: number;
  endTime: number;
}

@Component({
  selector: 'app-gantt-chart',
  standalone: true,
  template: `
    <div style="position: relative; min-height: 400px; width: 100%;">
      <canvas #ganttCanvas></canvas>
    </div>
  `,
})
export class GanttChartComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @ViewChild('ganttCanvas') ganttCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() data: GanttData[] = [];
  @Input() config: GanttConfig = {};
  chart!: Chart;
  private actualDurations: number[] = [];
  private minDurationDays: number = 0;
  private isSameDayScenario: boolean = false;
  private themeObserver!: MutationObserver;
  private processedData: ProcessedGanttItem[] = [];
  private taskNames: string[] = [];
  private chartInitialized: boolean = false;

  ngAfterViewInit(): void {
    if (!this.data || this.data.length === 0) {
      console.warn('No data provided for Gantt chart');
      return;
    }

    this.renderChart();
    this.setupThemeObserver();
    this.chartInitialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['data'] &&
      !changes['data'].firstChange &&
      this.chartInitialized
    ) {
      if (this.chart) {
        this.chart.destroy();
      }

      if (this.data && this.data.length > 0) {
        this.renderChart();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
    if (this.chart) {
      this.chart.destroy();
    }
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

    const isDark =
      html.classList.contains('dark') ||
      html.classList.contains('dark-theme') ||
      html.getAttribute('data-theme') === 'dark' ||
      body.classList.contains('dark') ||
      body.classList.contains('dark-theme') ||
      body.getAttribute('data-theme') === 'dark';

    return isDark;
  }

  private getThemeColors() {
    const isDark = this.isDarkTheme();

    let barColor: string;
    if (isDark && this.config.barColorDark) {
      barColor = this.config.barColorDark;
    } else if (!isDark && this.config.barColorLight) {
      barColor = this.config.barColorLight;
    } else {
      barColor = this.config.barColor || (isDark ? '#ec407a' : '#e23670');
    }

    return {
      barColor,
      titleColor: isDark ? 'white' : '#1a1a1a',
      tickColor: isDark ? '#979797ff' : '#666666',
      gridColor: isDark ? '#8b8b8bff' : '#cccccc',
      labelColor: isDark ? 'white' : '#1a1a1a',
    };
  }

  private updateChartTheme(): void {
    if (!this.chart) {
      return;
    }

    const colors = this.getThemeColors();

    if (this.chart.options.plugins?.title) {
      this.chart.options.plugins.title.color = colors.titleColor;
    }

    if (this.chart.data.datasets[1]) {
      const backgroundColors = Array(this.processedData.length).fill(
        colors.barColor
      );
      this.chart.data.datasets[1].backgroundColor = backgroundColors;
    }

    if (this.chart.options.scales?.['x']?.ticks) {
      this.chart.options.scales['x'].ticks.color = colors.tickColor;
    }

    if (this.chart.options.scales?.['x']?.grid) {
      this.chart.options.scales['x'].grid.color = colors.gridColor;
    }

    if (this.chart.options.plugins?.tooltip) {
      this.chart.options.plugins.tooltip.borderColor = colors.barColor;
    }

    if (this.chart.options.plugins?.datalabels) {
      (this.chart.options.plugins.datalabels as any).color = colors.labelColor;
    }

    this.chart.update('active');
  }

  private renderChart(): void {
    if (!this.data || this.data.length === 0) {
      console.warn('No data to render in Gantt chart');
      return;
    }

    this.processedData = this.assignTracksToOverlappingItems(this.data);

    const minHeight = 300;
    const barHeight = 45;
    const padding = 200;
    const calculatedHeight = Math.max(
      minHeight,
      this.processedData.length * barHeight + padding
    );

    const container = this.ganttCanvas.nativeElement.parentElement;
    if (container) {
      container.style.height = `${calculatedHeight}px`;
      container.style.overflow = 'visible';
    }

    const startDate = new Date(
      Math.min(...this.data.map((d) => new Date(d.start).getTime()))
    );

    const labels: string[] = [];
    const offsetData: number[] = [];
    const durationData: number[] = [];
    this.taskNames = [];

    const minDurationDays = 30;
    const colors = this.getThemeColors();
    const backgroundColors: string[] = [];

    this.processedData.forEach((item) => {
      labels.push(`Track ${item.track}: ${item.task}`);
      this.taskNames.push(item.task);

      const offset =
        (item.startTime - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const actualDuration =
        (item.endTime - item.startTime) / (1000 * 60 * 60 * 24);
      const displayDuration = Math.max(actualDuration, minDurationDays);

      this.actualDurations.push(actualDuration);
      offsetData.push(offset);
      durationData.push(displayDuration);
      backgroundColors.push(colors.barColor);
    });

    const ctx = this.ganttCanvas.nativeElement.getContext('2d')!;
    const dateFormat = this.config.dateFormat || 'en-GB';

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Offset',
            data: offsetData,
            backgroundColor: 'rgba(0,0,0,0)',
            stack: 'stack1',
          },
          {
            label: 'Duration',
            data: durationData,
            backgroundColor: backgroundColors,
            borderRadius: this.config.borderRadius || 6,
            stack: 'stack1',
            barThickness: 20,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        clip: false,
        elements: {
          bar: {
            borderSkipped: false,
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuad',
        },
        plugins: {
          legend: { display: false },
          title: {
            display: !!this.config.title,
            text: this.config.title,
            color: colors.titleColor,
            font: {
              size: 16,
              weight: 'bold',
            },
            align: 'start',
            padding: {
              bottom: 20,
            },
          },
          tooltip: {
            enabled: true,
            position: 'nearest',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            titleFont: { size: 14 },
            bodyFont: { size: 12 },
            padding: 12,
            cornerRadius: 8,
            borderColor: colors.barColor,
            borderWidth: 3,
            caretPadding: 10,
            callbacks: {
              title: (tooltipItems) =>
                this.taskNames[tooltipItems[0].dataIndex],
              label: (tooltipItem) => {
                const item = this.processedData[tooltipItem.dataIndex];
                const startDateStr = new Date(item.start).toLocaleDateString(
                  dateFormat,
                  {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }
                );
                const endDateStr = new Date(item.end).toLocaleDateString(
                  dateFormat,
                  {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }
                );
                return [`Start: ${startDateStr}`, `End: ${endDateStr}`];
              },
            },
          },
          datalabels: {
            display: true,
            color: colors.labelColor,
            align: 'center',
            anchor: 'center',
            font: {
              family: 'sans-serif',
              size: 11,
              weight: 'normal',
            },
            formatter: (value, context) => {
              if (context.dataset.label !== 'Duration') {
                return '';
              }

              const dataIndex = context.dataIndex;
              const actualDuration = this.actualDurations[dataIndex];

              if (actualDuration < this.minDurationDays) {
                return '...';
              }

              const chart = context.chart;
              const ctx = chart.ctx;
              const datasets = chart.data.datasets as {
                data: number[];
              }[];
              const offset = datasets[0].data[dataIndex] as number;
              const duration = datasets[1].data[dataIndex] as number;
              const startPixel = chart.scales['x'].getPixelForValue(offset);
              const endPixel = chart.scales['x'].getPixelForValue(
                offset + duration
              );

              if (endPixel <= startPixel) {
                return '';
              }

              let label = this.taskNames[dataIndex];

              const font = 'normal 11px sans-serif';
              ctx.save();
              ctx.font = font;
              let textWidth = ctx.measureText(label).width;
              ctx.restore();

              const padding = 16;
              const availableWidth = endPixel - startPixel - padding;

              if (availableWidth < 20) {
                return '...';
              }

              if (textWidth > availableWidth) {
                let truncated = label;
                while (textWidth > availableWidth && truncated.length > 0) {
                  truncated = truncated.slice(0, -1);
                  ctx.save();
                  ctx.font = font;
                  textWidth = ctx.measureText(truncated + '...').width;
                  ctx.restore();
                }
                if (truncated.length === 0) {
                  return '...';
                }
                return truncated + '...';
              }

              return label;
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            min: this.isSameDayScenario ? -45 : undefined,
            max: this.isSameDayScenario ? 45 : undefined,
            ticks: {
              color: colors.tickColor,
              callback: function (this, tickValue: string | number): string {
                if (typeof tickValue === 'number') {
                  const date = new Date(
                    startDate.getTime() + tickValue * 24 * 60 * 60 * 1000
                  );
                  return date.toLocaleDateString(dateFormat);
                }
                return tickValue.toString();
              },
            },
            grid: {
              color: colors.gridColor,
              lineWidth: 1,
              ...({ borderDash: [5, 5] } as any),
            },
          },
          y: {
            stacked: false,
            offset: true,
            grace: '20%',
            beforeFit: (axis: any) => {
              axis.paddingTop = 40; // Increased from 25 to 40
              axis.paddingBottom = 20; // Increased from 15 to 20
            },
            ticks: {
              display: false,
            },
            grid: {
              drawTicks: false,
              display: false,
            },
          },
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 70, // Increased from 30 to 40
            bottom: 20, // Increased from 10 to 20
          },
        },
      },
    });
  }

  private assignTracksToOverlappingItems(
    data: GanttData[]
  ): ProcessedGanttItem[] {
    if (!data || data.length === 0) {
      return [];
    }

    const items: ProcessedGanttItem[] = data
      .map((item) => ({
        task: item.task,
        start: item.start,
        end: item.end,
        track: 0,
        startTime: new Date(item.start).getTime(),
        endTime: new Date(item.end).getTime(),
      }))
      .sort((a, b) => {
        if (a.startTime !== b.startTime) {
          return a.startTime - b.startTime;
        }
        return a.endTime - b.endTime;
      });

    const trackEndTimes: number[] = [];

    items.forEach((item) => {
      let assignedTrack = -1;

      for (let i = 0; i < trackEndTimes.length; i++) {
        if (trackEndTimes[i] <= item.startTime) {
          assignedTrack = i;
          break;
        }
      }

      if (assignedTrack === -1) {
        assignedTrack = trackEndTimes.length;
        trackEndTimes.push(item.endTime);
      } else {
        trackEndTimes[assignedTrack] = item.endTime;
      }

      item.track = assignedTrack;
    });

    return items;
  }
}
