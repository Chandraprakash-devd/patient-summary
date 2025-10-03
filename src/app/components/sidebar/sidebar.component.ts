// sidebar.component.ts
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() showVA: boolean = true;
  @Output() showVAChange = new EventEmitter<boolean>();

  @Input() showIOP: boolean = true;
  @Output() showIOPChange = new EventEmitter<boolean>();

  @Input() showCMT: boolean = true;
  @Output() showCMTChange = new EventEmitter<boolean>();

  @Input() showProcedures: boolean = true;
  @Output() showProceduresChange = new EventEmitter<boolean>();

  @Input() showDiagnosis: boolean = true;
  @Output() showDiagnosisChange = new EventEmitter<boolean>();

  @Input() showMedication: boolean = true;
  @Output() showMedicationChange = new EventEmitter<boolean>();

  @Input() showObservations: boolean = true;
  @Output() showObservationsChange = new EventEmitter<boolean>();

  @Input() showLens: boolean = true;
  @Output() showLensChange = new EventEmitter<boolean>();

  @Input() showBackgroundRetina: boolean = true;
  @Output() showBackgroundRetinaChange = new EventEmitter<boolean>();

  @Input() showMaculaFovealReflex: boolean = true;
  @Output() showMaculaFovealReflexChange = new EventEmitter<boolean>();

  @Input() showConjunctiva: boolean = true;
  @Output() showConjunctivaChange = new EventEmitter<boolean>();

  @Input() showMedia: boolean = true;
  @Output() showMediaChange = new EventEmitter<boolean>();

  @Input() showAnteriorChamber: boolean = true;
  @Output() showAnteriorChamberChange = new EventEmitter<boolean>();

  @Input() showIris: boolean = true;
  @Output() showIrisChange = new EventEmitter<boolean>();

  @Input() showDisc: boolean = true;
  @Output() showDiscChange = new EventEmitter<boolean>();

  @Input() showPupil: boolean = true;
  @Output() showPupilChange = new EventEmitter<boolean>();

  @Input() showVessels: boolean = true;
  @Output() showVesselsChange = new EventEmitter<boolean>();

  @Input() showUndilatedFundus: boolean = true;
  @Output() showUndilatedFundusChange = new EventEmitter<boolean>();

  isExpanded: boolean = false;
  currentTheme: 'light' | 'dark' = 'light';

  private themeSubscription!: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.currentTheme =
      (document.documentElement.getAttribute('data-theme') as
        | 'light'
        | 'dark') || 'light';
    this.themeSubscription = this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  onShowObservationsChange(value: boolean) {
    this.showObservations = value;
    this.showObservationsChange.emit(value);

    // Check/uncheck all sub-items based on parent state
    this.showLens = value;
    this.showLensChange.emit(value);

    this.showBackgroundRetina = value;
    this.showBackgroundRetinaChange.emit(value);

    this.showMaculaFovealReflex = value;
    this.showMaculaFovealReflexChange.emit(value);

    this.showConjunctiva = value;
    this.showConjunctivaChange.emit(value);

    this.showMedia = value;
    this.showMediaChange.emit(value);

    this.showAnteriorChamber = value;
    this.showAnteriorChamberChange.emit(value);

    this.showIris = value;
    this.showIrisChange.emit(value);

    this.showDisc = value;
    this.showDiscChange.emit(value);

    this.showPupil = value;
    this.showPupilChange.emit(value);

    this.showVessels = value;
    this.showVesselsChange.emit(value);

    this.showUndilatedFundus = value;
    this.showUndilatedFundusChange.emit(value);
  }
}
