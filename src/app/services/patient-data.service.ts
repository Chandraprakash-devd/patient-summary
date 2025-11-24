// patient-data.service.ts (JSON APPROACH - Final Version)
import { Injectable } from '@angular/core';
import json from '../../assets/patient-summaries.json';

export interface PatientSummary {
  re: string;
  le: string;
}

@Injectable({
  providedIn: 'root',
})
export class PatientDataService {
  // List all your patient JSON filenames here
  private readonly PATIENT_FILES = [
    '0003332771',
    '0005655098',
    '0009687282',
    '0010904095',
    '0011285844',
    '0011400902',
    '0012275037',
    '0013650399',
    '0014857333',
    '0014944010',
    '0015256042',
    '0015544396',
    '0016092240',
    '0016565877',
    '0016669482',
    '0016712107',
    '0017373092',
    '0017659198',
    '0017684556',
    '0017826959',
    '0018069526',
    '0018576839',
    '0018672756',
    '0018778471',
    '0018851656',
    '0019023751',
    '0019104480',
    '0019382550',
    '0019551250',
    '0019718733',
    '0020058637',
    '0020163579',
    '0020264606',
    '0020319841',
    '0020408193',
    '0020956509',
    '0021016408',
    '0021034319',
    '0022577896',
    '0023111959',
  ];

  // Cache for loaded patient data
  private patientCache = new Map<string, any>();

  // Map of UID to patient data
  private patientDataMap = new Map<string, any>();

  // Map of UID to summaries
  private summariesMap = new Map<string, PatientSummary>();

  // Flags
  private allPatientsLoaded = false;
  private summariesLoaded = false;

  constructor() {}

  /**
   * Load a single patient file by filename
   */
  private async loadPatientFile(filename: string): Promise<any> {
    if (this.patientCache.has(filename)) {
      return this.patientCache.get(filename);
    }

    try {
      const data = await import(
        `../../../patient_data/patient_data_all/${filename}.json`
      );
      const patientData = data.default || data;
      this.patientCache.set(filename, patientData);

      // Also add to patientDataMap by UID if available
      if (patientData?.p?.uid) {
        this.patientDataMap.set(patientData.p.uid.toString(), patientData);
      }

      return patientData;
    } catch (error) {
      console.error(`Failed to load patient file ${filename}:`, error);
      return null;
    }
  }

  /**
   * Load summaries from pre-converted JSON file
   * Much simpler and more reliable than Excel parsing!
   */
  async loadSummaries(): Promise<void> {
    if (this.summariesLoaded) {
      return;
    }

    try {
      console.log('📖 Loading patient summaries from JSON...');

      // Import the pre-converted JSON file
      const summariesData = await import('../../assets/patient-summaries.json');
      const raw = summariesData.default || summariesData;
      const data = raw as Record<string, { re?: string; le?: string }>;

      // Convert object to Map for fast lookup
      Object.keys(data).forEach((uid) => {
        const item = data[uid] || { re: '', le: '' };
        this.summariesMap.set(uid, {
          re: item.re ?? '',
          le: item.le ?? '',
        });
      });

      this.summariesLoaded = true;
      console.log(`✅ Loaded ${this.summariesMap.size} patient summaries`);
    } catch (error) {
      console.error('❌ Failed to load patient summaries:', error);
      console.error(
        '💡 Make sure you have run: node convert-summaries-to-json.js'
      );
      console.error(
        '💡 And the file exists at: src/assets/patient-summaries.json'
      );
      // Don't throw - app can work without summaries
    }
  }

  /**
   * Get summary for a specific patient UID
   */
  getSummary(uid: string): PatientSummary {
    const summary = this.summariesMap.get(uid);
    if (summary) {
      return summary;
    }
    return { re: '', le: '' };
  }

  /**
   * Check if summary exists for UID
   */
  hasSummary(uid: string): boolean {
    return this.summariesMap.has(uid);
  }

  /**
   * Get all UIDs that have summaries
   */
  getAllSummaryUIDs(): string[] {
    return Array.from(this.summariesMap.keys());
  }

  /**
   * Reload summaries (useful when JSON file is updated)
   */
  async reloadSummaries(): Promise<void> {
    this.summariesMap.clear();
    this.summariesLoaded = false;
    await this.loadSummaries();
  }

  /**
   * Find patient by UID - loads files on-demand until found
   */
  async findPatientByUID(uid: string): Promise<any> {
    // Check if already loaded
    if (this.patientDataMap.has(uid)) {
      return this.patientDataMap.get(uid);
    }

    // Search through cached files first
    for (const [filename, data] of this.patientCache.entries()) {
      if (data?.p?.uid?.toString() === uid) {
        this.patientDataMap.set(uid, data);
        return data;
      }
    }

    // Load files one by one until we find the UID
    for (const filename of this.PATIENT_FILES) {
      if (!this.patientCache.has(filename)) {
        const data = await this.loadPatientFile(filename);
        if (data?.p?.uid?.toString() === uid) {
          return data;
        }
      }
    }

    return null;
  }

  /**
   * Get patient data map (for compatibility with existing code)
   */
  async getPatientDataMap(): Promise<Map<string, any>> {
    if (!this.allPatientsLoaded) {
      await this.loadAllPatients();
    }
    return this.patientDataMap;
  }

  /**
   * Load all patient files (useful for initial loading or preloading)
   */
  async loadAllPatients(): Promise<void> {
    if (this.allPatientsLoaded) {
      return;
    }

    const loadPromises = this.PATIENT_FILES.map((filename) =>
      this.loadPatientFile(filename)
    );

    await Promise.all(loadPromises);
    this.allPatientsLoaded = true;

    console.log(`✅ Loaded ${this.patientDataMap.size} patients`);
  }

  /**
   * Get all available patient UIDs
   */
  async getAllPatientUIDs(): Promise<string[]> {
    if (!this.allPatientsLoaded) {
      await this.loadAllPatients();
    }
    return Array.from(this.patientDataMap.keys());
  }

  /**
   * Check if a patient exists by UID
   */
  async hasPatient(uid: string): Promise<boolean> {
    const patient = await this.findPatientByUID(uid);
    return patient !== null;
  }

  /**
   * Clear the cache (useful for memory management)
   */
  clearCache(): void {
    this.patientCache.clear();
    this.patientDataMap.clear();
    this.summariesMap.clear();
    this.allPatientsLoaded = false;
    this.summariesLoaded = false;
  }

  /**
   * Get patient count
   */
  getPatientFileCount(): number {
    return this.PATIENT_FILES.length;
  }

  /**
   * Preload specific patients by UID
   */
  async preloadPatients(uids: string[]): Promise<void> {
    const loadPromises = uids.map((uid) => this.findPatientByUID(uid));
    await Promise.all(loadPromises);
  }
}
