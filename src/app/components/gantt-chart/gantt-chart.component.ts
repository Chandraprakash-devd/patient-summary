import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
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
  borderRadius?: number;
  dateFormat?: string;
  tooltipCallback?: (context: any, data: GanttData[]) => string;
}

@Component({
  selector: 'app-gantt-chart',
  standalone: true,
  template: `
    <div style="position: relative; height: 400px; width: 100%;">
      <canvas #ganttCanvas></canvas>
    </div>
  `,
})
export class GanttChartComponent implements AfterViewInit {
  @ViewChild('ganttCanvas') ganttCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() data: GanttData[] = [];
  @Input() config: GanttConfig = {};
  chart!: Chart;

  ngAfterViewInit(): void {
    if (!this.data || this.data.length === 0) {
      console.warn('No data provided for Gantt chart');
      return;
    }

    const startDate = new Date(
      Math.min(...this.data.map((d) => new Date(d.start).getTime()))
    );
    const offsetData = this.data.map(
      (d) =>
        (new Date(d.start).getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const durationData = this.data.map(
      (d) =>
        (new Date(d.end).getTime() - new Date(d.start).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const labels = this.data.map((d) => d.task);

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
            backgroundColor: this.config.barColor || '#ec407a',
            borderRadius: this.config.borderRadius || 6,
            stack: 'stack1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
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
            text: this.config.title || 'Gantt Chart',
            color: 'white',
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
            enabled: false, // Disable default tooltip
            external: (context) => {
              this.customTooltip(context, dateFormat);
            },
          },
          datalabels: {
            display: true,
            color: 'white',
            align: 'center',
            anchor: 'center',
            formatter: (value: any, context: any) => {
              if (context.dataset.label === 'Duration') {
                return labels[context.dataIndex];
              }
              return '';
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: '#ccc',
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
              color: '#ccc',
            },
          },
          y: {
            stacked: true,
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
            top: 10,
            bottom: 10,
          },
        },
      },
    });
  }

  private customTooltip(context: any, dateFormat: string): void {
    const { chart, tooltip } = context;

    // Get or create tooltip element
    let tooltipEl = chart.canvas.parentNode.querySelector('div.custom-tooltip');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'custom-tooltip';
      tooltipEl.style.background = 'rgba(0, 0, 0, 0.9)';
      tooltipEl.style.borderRadius = '8px';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = '0';
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, -100%)'; // Position above the bar
      tooltipEl.style.transition = 'all .1s ease';
      tooltipEl.style.padding = '12px 16px';
      tooltipEl.style.fontSize = '13px';
      tooltipEl.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      tooltipEl.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
      tooltipEl.style.zIndex = '1000';
      tooltipEl.style.borderLeft = `3px solid ${this.config.barColor || '#ec407a'}`;
      tooltipEl.style.minWidth = '160px';
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = '0';
      return;
    }

    // Set content
    if (tooltip.body) {
      const dataIndex = tooltip.dataPoints[0].dataIndex;
      const task = this.data[dataIndex];

      // Format dates
      const startDate = new Date(task.start);
      const endDate = new Date(task.end);
      const formatOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      };

      const formattedStart = startDate.toLocaleDateString(dateFormat, formatOptions);
      const formattedEnd = endDate.toLocaleDateString(dateFormat, formatOptions);

      // Use custom tooltip callback if provided
      if (this.config.tooltipCallback) {
        const customContent = this.config.tooltipCallback(tooltip.dataPoints[0], this.data);
        tooltipEl.innerHTML = `<div style="text-align: left;">${customContent}</div>`;
      } else {
        // Default tooltip content
        tooltipEl.innerHTML = `
          <div style="text-align: left;">
            <div style="font-weight: 600; margin-bottom: 8px; font-size: 14px; line-height: 1.2;">
              ${task.task}
            </div>
            <div style="font-size: 12px; color: rgba(255, 255, 255, 0.8); line-height: 1.3;">
              <div style="margin-bottom: 2px;">Start: ${formattedStart}</div>
              <div>End: ${formattedEnd}</div>
            </div>
          </div>
        `;
      }
    }

    // Position tooltip
    const canvasPosition = chart.canvas.getBoundingClientRect();
    const tooltipWidth = tooltipEl.offsetWidth || 160; // Use minWidth if offsetWidth is not yet available
    let left = canvasPosition.left + tooltip.caretX;

    // Adjust for transform translate(-50%)
    left -= tooltipWidth / 2;

    // Ensure tooltip doesn't go off screen
    if (left + tooltipWidth > window.innerWidth) {
      left = window.innerWidth - tooltipWidth - 10;
    } else if (left < 0) {
      left = 10;
    }

    const top = canvasPosition.top + tooltip.caretY - tooltipEl.offsetHeight - 10;

    // Apply positioning
    tooltipEl.style.opacity = '1';
    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = top + 'px';
  }
}