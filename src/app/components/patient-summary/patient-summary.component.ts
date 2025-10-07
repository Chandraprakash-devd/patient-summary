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
    ['Patient 1', patient8Data],
    ['Patient 2', patient2Data],
    ['Patient 3', patient5Data],
    ['Patient 4', patient6Data],
    ['Patient 5', patient4Data],
    ['Patient 6', patient1Data],
    ['Patient 7', patient9Data],
    ['Patient 8', patient3Data],
    ['Patient 9', patient7Data],
  ]);

  private summaries: Map<string, { re: string; le: string }> = new Map([
    [
      '1198643',
      {
        re: `The patient initially presented with normal vision (6/6) until February 2018, when moderate NPDR and elevated IOP (26 mmHg) were diagnosed. IOP was controlled with Betabrim (18–20 mmHg), and vision remained stable. By January 2020, the condition progressed to POAG and PDR, with vision at 6/9 and IOP at 26 mmHg. Treatment included Betabrim and Dortas, reducing IOP to 15 mmHg.

In July 2022, PDR advanced with vitreous hemorrhage (VH), necessitating cataract surgery with PCIOL implantation, restoring vision to 6/6. PRP was initiated for NVE and dot-and-blot hemorrhages. Despite ongoing PRP, vision deteriorated to NIP by October 2022, with persistent VH, NVE, and elevated IOP (28 mmHg). Latoprost was added, and subsequent follow-ups showed gradual improvement in vision (6/12 to 6/6P) and IOP stabilization (17–20 mmHg).

By September 2023, additional PRP was performed for unstable PDR and inferior VH. Vision remained stable at 6/6, with IOP controlled at 20 mmHg. However, by December 2023, vision declined slightly to 6/9, with persistent retinal hemorrhages and NVE despite treatment. The final status was 6/9 vision, controlled IOP (18 mmHg), and ongoing management for unstable PDR.`,
        le: `The patient initially presented with normal vision (6/6) until February 2018, when moderate NPDR and elevated IOP (28 mmHg) were diagnosed. IOP was controlled with Betabrim (15 mmHg), and vision remained stable at 6/6P until May 2019, when it declined to 6/9P. By January 2020, the condition progressed to POAG and severe NPDR, with vision at 6/9 and IOP at 31 mmHg. Betabrim and Dortas reduced IOP to 18 mmHg.

By July 2022, the eye developed PDR with immature cataract (IMC), and vision deteriorated to 6/60 due to media haze. PRP was initiated but limited by the cataract. In October 2022, combined trabeculectomy and phacoemulsification with PCIOL implantation were performed, improving vision to 6/9P. IOP remained elevated (28 mmHg), requiring laser suture lysis (LSL). Persistent dot-and-blot hemorrhages and a CDR of 0.7 were noted.

By February 2023, vision improved to 6/6P, and IOP was controlled at 10 mmHg. CME was identified, requiring ongoing management. By September 2023, vision stabilized at 6/6, but IOP increased to 30 mmHg, prompting escalation of glaucoma therapy. Additional PRP was performed for unstable PDR and inferior VH. As of December 2023, vision was 6/9, with IOP controlled at 20 mmHg. The final status included stable vision, controlled IOP, and ongoing management for glaucoma and unresolved PDR-related complications.`,
      },
    ],
    [
      '1840416',
      {
        re: `The right eye has a history of proliferative diabetic retinopathy (PDR) with diabetic macular edema (DME) and pseudophakia following cataract surgery with posterior chamber intraocular lens (PCIOL) implantation. Management included multiple intravitreal injections (Ozurdex, Avastin, Tricort), panretinal photocoagulation (PRP), focal laser therapy, and pars plana vitrectomy (PPV) with membrane peeling and endolaser (February 2019). Despite these interventions, DME persisted with fluctuating foveal thickness (286–1204 µm) and OCT findings of subfoveal detachment, hard exudates, epiretinal membrane (ERM), and a lamellar macular hole.

Vision progressively declined from 6/6P in August 2017 to 6/60 by September 2018 and further to 3/60 by June 2021, with a slight improvement to 6/60 (6/36 with refraction) by February 2024. Fundus examination consistently revealed PRP laser marks, waxy disc pallor, sclerotic vessels, and persistent macular edema with a large cystic elevation at the fovea. The anterior segment showed occasional anterior chamber cells but no neovascularization of the iris (NVI).

Intraocular pressure (IOP) remained stable within normal limits (7–15 mmHg). Despite aggressive surgical and medical management, the eye exhibits significant structural damage with limited visual prognosis.`,
        le: `The left eye has a history of proliferative diabetic retinopathy (PDR) with diabetic macular edema (DME) and pseudophakia following cataract surgery with posterior chamber intraocular lens (PCIOL) implantation. Treatment included pars plana vitrectomy (PPV) with fluid-air exchange (FAE) and endolaser, 360-degree panretinal photocoagulation (PRP), and intravitreal injections (Ozurdex). OCT findings demonstrated persistent DME with hard exudates, cystic changes, a lamellar macular hole, and loss of foveal contour.

Vision improved from unmeasurable in September 2016 to 6/24 by February 2021, fluctuating between 6/24 and 6/36P through 2023, and stabilizing at 6/18 by January 2024. Fundus examination revealed regressing neovascularization of the disc (NVD), PRP laser marks, arteriosclerotic vascular changes, and a dull foveal reflex. Imaging showed resolving macular edema with reduced foveal thickness but persistent structural abnormalities, including an epiretinal membrane (ERM).

Intraocular pressure (IOP) remained within normal limits (10–17 mmHg). While macular edema has shown partial resolution, the visual outcome remains limited, and the eye continues to require close monitoring for PDR and macular stability.`,
      },
    ],
    [
      '1288057',
      {
        re: `The right eye, pseudophakic with a posterior chamber intraocular lens (PCIOL) implanted eight years prior to July 2017, initially presented with BCVA of 6/9 and elevated IOP of 31 mmHg. Secondary glaucoma was diagnosed in October 2018 when the IOP increased to 38 mmHg, and treatment with MISOPT was initiated. The IOP progressively improved, stabilizing at 14 mmHg by May 2021, with BCVA improving to 6/6P. Fundus examination consistently showed a dull foveal reflex, a cup-to-disc ratio of 0.4–0.5, and inferior chorioretinal scars, while the anterior segment remained quiet with a deep anterior chamber and no signs of inflammation or neovascularization.

By August 2021, BCVA remained 6/6P, and IOP fluctuated between 15–23 mmHg. Chronic retinal artery (CRA) scars and vasculitis were noted in October 2023, but BCVA remained stable at 6/6, and IOP was controlled within 18–28 mmHg. No significant surgical interventions or complications occurred, and the right eye remains stable with good visual acuity and controlled IOP as of October 2023.`,
        le: `The left eye has a history of progressive visual decline and secondary glaucoma, diagnosed in October 2018 with an IOP of 28 mmHg and BCVA of 6/9. Despite IOP control with MISOPT, BCVA deteriorated to 6/18P by August 2019, with fundus findings of a cup-to-disc ratio of 0.6 and an epiretinal membrane (ERM). Vision further declined to 6/24 later that year.

In May 2021, branch retinal vein occlusion (BRVO) and rhegmatogenous retinal detachment (RRD) were diagnosed, with OCT findings of serous macular detachment, a macular hole, and internal limiting membrane (ILM) folds. BCVA worsened to 6/60, prompting pars plana vitrectomy (PPV) with silicone oil injection (SOI) and sectoral panretinal photocoagulation (PRP). Recurrent retinal detachment (ReRD) and tractional retinal detachment (TRD) necessitated further surgeries, including silicone oil removal (SOR) and re-injection of silicone oil.

By August 2021, BCVA had declined to 4/60, and IOP spiked to 35 mmHg due to corticosteroid-induced ocular hypertension and silicone oil-related glaucoma. This was managed with Alphagan-Z and MISOPT, achieving IOP stabilization between 12–19 mmHg. Fundus findings included a pale optic disc (cup-to-disc ratio of 0.6–0.7), silicone oil-filled media, subretinal fluid (SRF), and retinal scarring.

As of October 2023, BCVA remains poor at 6/60, with stable IOP and an attached retina. Vasculitis and sequelae of BRVO were noted, but no further surgical interventions have been performed. Despite controlled IOP and anatomical stability, the visual prognosis remains poor due to extensive retinal pathology and optic nerve damage.`,
      },
    ],
    [
      '11512248',
      {
        re: `The right eye has a history of proliferative diabetic retinopathy (PDR) complicated by tractional retinal detachment (TRD), neovascular glaucoma (NVG), and advanced glaucomatous optic neuropathy. Initial interventions in *June 2017* included panretinal photocoagulation (PRP), phacoemulsification with intraocular lens implantation (Phaco+IOL), pars plana vitrectomy (PPV) with membrane peeling (MP), endolaser (EL), and silicone oil injection (SOI), followed by silicone oil removal (SOR). Despite these efforts, vision declined from 5/60 in *June 2017* to hand movements (HM) by *November 2017*.

By *2018*, primary open-angle glaucoma (POAG) was diagnosed, with a vertical cup-to-disc ratio (VCDR) of 0.9, pale optic disc, attenuated vessels, and fibrous tractional bands noted. IOP was controlled with MISOPT (12–19 mmHg), but vision remained severely impaired (HM to finger counting close to face [FCF]).

In *2021*, a YAG peripheral iridotomy (PI) was performed for pupillary block caused by posterior synechiae, but vision remained poor. By *2023*, NVG developed with persistent neovascularization of the iris (NVI) and 360° peripheral anterior synechiae (PAS). IOP spiked to 53 mmHg in *May 2023*, requiring diode cyclophotocoagulation (CPC) for refractory NVG, though vision remained HM.

By *February 2024*, the eye had deteriorated to light perception with projection (LP+). Anterior segment findings included circumferential NVI, PAS, and posterior capsular opacification (PCO), while the fundus showed optic atrophy, sclerosed vessels, extensive PRP scars, and persistent fibrous tractional bands. IOP was reduced to 10 mmHg with antiglaucoma medications, but the eye was functionally absolute with no potential for visual recovery.`,
        le: `The left eye also has a history of PDR and POAG. At presentation in *June 2017*, visual acuity was 6/6P, and prior PRP had been performed. Additional PRP sessions were required over time for persistent neovascularization elsewhere (NVE). Through *2018*, visual acuity remained stable (6/9–6/12), with IOP controlled at 11–17 mmHg.

By *2019*, glaucomatous changes were noted, including a cup-to-disc ratio (CDR) of 0.7, though visual acuity remained 6/9. Early cataract changes, including nuclear sclerosis (NS) and posterior subcapsular cataract (PSCC), were documented.

In *2021*, persistent NVE within the superotemporal arcade required additional PRP and focal laser treatments. Vision declined to 6/12, and mild macular edema was noted. By *2023*, neovascularization of the iris (NVI) was observed but regressed with ongoing PRP. Visual acuity fluctuated between 6/6 and 6/18, with stable IOP (10–17 mmHg).

By *February 2024*, macular edema showed chronic cystic changes and hard exudates on OCT, with a foveal thickness of 413 µm. An intravitreal injection of Eylea was administered, resulting in improvement. Anterior segment findings included NS grade 1–2 and PSCC, while the fundus showed regressed NVE, PRP laser marks, and a CDR of 0.75 with inferior neuroretinal rim thinning. IOP remained stable at 16 mmHg, and visual acuity improved to 6/12P.

The final status as of *February 2024* reflects stable retinal findings with controlled macular edema and regressed NVE. Early cataract changes may require surgical intervention to optimize visual outcomes.`,
      },
    ],
    [
      '1418045',
      {
        re: `The patient initially presented with normal vision and IOP but was diagnosed with an immature cataract and lattice degeneration by January 2018. Lattice degeneration was treated with barrage laser photocoagulation, though vision declined to 6/36 by mid-2018 due to cataract progression. Cataract surgery with PCIOL implantation in February 2019 restored BCVA to 6/6P by March 2019, stabilizing at 6/6 by late 2019. IOP remained controlled (16–18 mmHg), though a CDR of 0.6 with an inferior retinal slope raised suspicion for glaucoma.

By August 2021, PCO developed and was treated with YAG capsulotomy, restoring BCVA to 6/6P. The retina remained stable with prior laser marks and no new pathology. The patient was labeled a glaucoma suspect and started on Dorsun-T for IOP management, which remained stable at 16–19 mmHg. Additional findings included a transient hordeolum externum in late 2021, managed conservatively, and a temporal pterygium noted in February 2024, which required no intervention. The anterior and posterior segments remained stable, with BCVA of 6/6, IOP of 18 mmHg, and a structurally stable retina as of the last visit in February 2024.`,
        le: `The left eye has been non-functional since July 2017 due to absolute glaucoma following failed retinal detachment surgery and trabeculectomy. The eye has remained NLP, with anterior segment findings of ciliary staphyloma at 11 o’clock, a fixed non-reactive pupil, and a pseudophakic lens. The fundus has been non-visualized due to media opacities and advanced glaucomatous damage. IOP was elevated at 39 mmHg in February 2020 but decreased to 8 mmHg by January 2021, likely reflecting prior surgical interventions.

By February 2024, the left eye exhibited significant structural compromise, including corneal decompensation with bullous keratopathy, epithelial defects, and diffuse congestion. The patient was referred to the cornea clinic for further management and prescribed topical antibiotics, lubricants, and atropine for symptomatic relief. The eye remains in a state of absolute glaucoma with NLP and no planned surgical or laser interventions. It is considered non-functional as of the last evaluation in February 2024.`,
      },
    ],
    [
      '1240726',
      {
        re: `The patient has a history of Wet Age-Related Macular Degeneration (ARMD) and Central Serous Chorioretinopathy (CSCR) with a macular scar. Prior cataract surgery with posterior chamber intraocular lens (PCIOL) implantation was uneventful. Initial BCVA was 6/60 in February 2017, progressively declining to 3/60 by February 2021 and further to 1/60 by June 2022, remaining unchanged as of May 2023. Fundus examination consistently showed a scarred choroidal neovascular membrane (CNVM) at the fovea with geographic atrophy and intermittent parafoveal retinal hemorrhages, indicating CNVM reactivation. Optical coherence tomography (OCT) confirmed regressing CNVM with resolving subretinal fluid (SRF) and subretinal hemorrhage (SRH) following intravitreal Avastin injections in October and November 2018, though small retinal hemorrhages persisted.

The anterior segment remained stable, with a well-positioned PCIOL and no neovascularization of the iris (NVI). IOP ranged from 10 to 20 mmHg across visits. Medications included Omega-3 supplements (Omegared Caps) and Novoret Neo Softgel Caps for retinal health. Despite treatment, the visual prognosis was poor due to the macular scar and chronicity of the disease. Final BCVA was 1/60 with normal IOP as of May 2023.`,
        le: `The left eye also has a history of Wet ARMD and CSCR with a macular scar, as well as prior cataract surgery with PCIOL implantation. BCVA was 6/60 at initial presentation in February 2017, deteriorating to 1/60 by January 2018 before transient improvement to 5/60 by April 2018. Subsequent decline was noted, with BCVA at 3/60 by February 2019 and 2/60 by June 2019, stabilizing at 5/60 from October 2021 through May 2023. Fundus examination revealed a scarred CNVM at the fovea with dense pigmentary changes and asteroid hyalosis. Flame-shaped hemorrhages near the disc in October 2021 raised suspicion of superonasal branch retinal vein occlusion (SNQ RVO), though OCT confirmed a stable scarred CNVM without active SRF or hemorrhage.

The anterior segment was stable, with a well-positioned PCIOL and no NVI. IOP ranged from 12 to 19 mmHg. Omega-3 supplements (Omegared Caps) and Novoret Neo Softgel Caps were initiated in June 2022. Despite stable IOP and no treatable lesions on fundus evaluation, visual prognosis remained poor due to the macular scar and chronicity of the disease. Final BCVA was 5/60 with normal IOP as of May 2023.`,
      },
    ],
    [
      '1488606',
      {
        re: `The patient has a history of central serous chorioretinopathy (CSCR) diagnosed in *April 2018*, which progressed to include polypoidal choroidal vasculopathy (PCV) by *August 2019* and choroidal neovascular membrane (CNVM) by *September 2020*. Fundus findings consistently demonstrated focal retinal pigment epithelium (RPE) degeneration, multiple serous pigment epithelial detachments (PEDs), and regressing fibrovascular PEDs (FVPEDs). Optical coherence tomography (OCT) revealed fluctuating subretinal fluid (SRF), subretinal hemorrhage (SRH), and cystoid changes.

Management included a series of intravitreal anti-VEGF injections: bevacizumab (Avastin) initiated in *August 2019*, Razumab starting in *2021*, and aflibercept (Eylea) from *February 2022*. Despite treatment, visual acuity (VA) fluctuated, improving to 6/6P by *March 2021* but declining to 6/24 by *December 2021*. Following continued anti-VEGF therapy, VA stabilized at 6/12 by *June 2022*, with resolving SRF and SRH, but further declined to 6/24 by *December 2022*.

The patient underwent cataract surgery with posterior chamber intraocular lens (PCIOL) implantation (date unspecified). By *October 2022*, VA improved to 6/9P, with stable IOP (16–20 mmHg) and no new complications. However, subsequent follow-ups revealed persistent SRF activity and a decline in VA to 6/24 by *February 2024*. Supportive therapy included Macugold Plus tablets and topical Nepacent or Nepastar-OD.

As of *February 2024*, the right eye had a VA of 6/24, stable IOP at 18 mmHg, and evidence of partial regression of the CNVM with persistent subretinal changes.`,
        le: `The left eye has longstanding visual impairment secondary to a spontaneously settled inferior bullous retinal detachment (RD) with associated subretinal fibrosis and diffuse retinal atrophy, first documented in *October 2016*. Fundus findings consistently showed a pale optic disc, attenuated vessels, inferior pigmentation with a demarcation line, and chronic subretinal fibrosis. OCT revealed foveal thinning, IS/OS disruption, and RPE atrophy.

The patient is pseudophakic with a posterior chamber intraocular lens (PCIOL) in place. Anterior segment findings included vitreous and haptic material in the anterior chamber, likely from prior surgical interventions. There was no evidence of neovascularization of the iris (NVI).

Visual acuity remained poor, fluctuating between 1/60 and 2/60 from *2017* to *2023*. By *November 2022*, VA declined to 4/60 and further to 2/60 by *August 2023*, where it stabilized. IOP was generally stable (15–20 mmHg) but transiently elevated to 28 mmHg in *May 2023*, subsequently normalizing with no documented intervention.

No active treatments were initiated for the left eye during the recorded period. Supportive therapy included Macugold Plus tablets and topical Nepacent or Nepastar-OD. The visual prognosis remains poor due to chronic retinal and optic nerve damage. As of *February 2024*, the left eye had a VA of 2/60, stable IOP at 19 mmHg, and no evidence of active retinal or anterior segment pathology.`,
      },
    ],
    [
      '1279381',
      {
        re: `The patient has a history of Wet Age-Related Macular Degeneration (Wet ARMD) with a choroidal neovascular membrane (CNVM) diagnosed in February 2018. Initial BCVA was 6/36, but despite intravitreal Avastin injections (at least four by March 2020), vision progressively declined to 6/60 by April 2018 and further to 5/60 by July 2023, stabilizing at this level through January 2024. OCT findings initially showed subfoveal hyperreflective irregular RPE lesions with cystic changes, later evolving to resolving subretinal fluid (SRF) and macular edema by February 2021. Persistent macular scarring and hard exudates were noted throughout, with the CNVM described as regressing and predominantly scarred by 2024.

The lens status is pseudophakia with a posterior chamber intraocular lens (PCIOL), though posterior capsular opacification (PCO) contributed to hazy media by 2023. IOP remained stable between 11 mmHg and 20 mmHg, with a final reading of 15 mmHg in January 2024. Despite intermittent Avastin therapy and LUTIVIT NF supplementation initiated in January 2024, the final BCVA was 5/60, limited by macular scarring and edema.`,
        le: `The left eye has a history of Dry Age-Related Macular Degeneration (Dry ARMD) first documented in October 2016. Initial BCVA improved to 6/6 by November 2016 and remained stable through 2018. Fundus findings consistently showed drusen and RPE irregularities without fluid or hemorrhage. OCT findings confirmed parafoveal RPE changes, and no progression to Wet ARMD was observed.

From 2019 to 2021, vision remained stable at 6/6 to 6/9. By 2022, BCVA began to decline slightly, reaching 6/12 by July 2023. As of January 2024, corrected visual acuity was 6/6P, with uncorrected vision at 6/18. Fundus examination showed RPE degeneration and drusen at the fovea, with hazy media attributed to PCO. The lens status is pseudophakia with a PCIOL, and IOP remained within normal limits (12–20 mmHg), with a final reading of 15 mmHg in January 2024. LUTIVIT NF supplementation was initiated in July 2023. The final BCVA of 6/6P reflects relatively preserved vision despite macular changes associated with Dry ARMD.`,
      },
    ],
    [
      '1271481',
      {
        re: `The patient has a history of moderate non-proliferative diabetic retinopathy (NPDR) complicated by chronic diabetic macular edema (DME) and macular degeneration. Visual acuity declined from 6/36 in July 2016 to 6/60 by May 2017, remaining stable at 6/60 except for a transient drop to 5/60 in March 2023. The eye is pseudophakic with a posterior chamber intraocular lens (PCIOL).

Fundus findings consistently showed vitreo-papillary traction, a cup-to-disc ratio (CDR) of 0.75, dot hemorrhages, retinal pigment epithelium (RPE) degeneration, and chronic macular edema with hard exudates. OCT demonstrated fluctuating foveal thickness (220–642 µm). Despite focal laser treatment for DME and medical therapy (TIMOLET-OD, NEVANAC, ILEVRO), the macular edema persisted without significant structural or functional improvement.

As of February 2024, the right eye remains stable with chronic DME and macular degeneration, BCVA of 6/60, and controlled IOP (13–17 mmHg).`,
        le: `The left eye has a history of proliferative diabetic retinopathy (PDR) with chronic diabetic macular edema (DME). The patient underwent pan-retinal photocoagulation (PRP) and focal laser treatment for DME, alongside multiple intravitreal injections (Ozurdex, Accentrix, Pagenax). Visual acuity initially measured 6/6P in July 2016, fluctuated over time, and stabilized at 6/12P from August 2023 to December 2023, with a transient improvement to 6/18 in February 2024 following an Ozurdex injection. The eye is pseudophakic with a posterior chamber intraocular lens (PCIOL).

Fundus findings included PRP laser marks, resolving macular edema with hard exudates, epiretinal membrane (ERM), and a CDR of 0.7. OCT revealed chronic macular edema with fluctuating foveal thickness (405–628 µm). Notable complications included inferior vitreous hemorrhage (VH) with minimal subhyaloid hemorrhage (SHH) in July 2019 and acute conjunctivitis in November 2022, both managed appropriately. Despite treatment, the macular edema remains chronic, with partial resolution following intravitreal therapy.

As of February 2024, the left eye demonstrates stable PDR with chronic DME, BCVA of 6/18, and controlled IOP (12–15 mmHg).`,
      },
    ],
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
    const uid = this.jsonData.patient_info.uid.toString(); // Convert to string if uid is a number
    const eyeSummary = this.summaries.get(uid);
    if (eyeSummary) {
      this.patientSummary =
        this.selectedEye === 'Right Eye' ? eyeSummary.re : eyeSummary.le;
    } else {
      this.patientSummary = this.generatePatientSummary(); // Fallback if no match
    }
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

        // Parse and format visit date
        let formattedDate = '';
        if (visit.visit_date) {
          const dateObj = new Date(visit.visit_date);
          const day = String(dateObj.getDate()).padStart(2, '0');
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const year = dateObj.getFullYear();
          formattedDate = `${day}/${month}/${year}`;
        }

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
          // Prioritize direct eye-specific value if available (e.g., "RE": "244M")
          const eyeKey = eye; // 'RE' or 'LE'
          const directNote = visit.investigations.special_notes[eyeKey];
          if (
            directNote &&
            typeof directNote === 'string' &&
            directNote.trim()
          ) {
            const parsedDirect = this.parseCMTValue(directNote);
            if (parsedDirect !== null) {
              cmtValue = parsedDirect;
            }
          }

          // If direct not found or invalid, fallback to raw extraction
          if (cmtValue === null && visit.investigations.special_notes.raw) {
            const extracted = this.extractCMTFromText(
              visit.investigations.special_notes.raw
            );
            cmtValue = eye === 'RE' ? extracted.RE : extracted.LE;
          }

          // Final fallback to eye-specific note text extraction (if not a direct value)
          if (cmtValue === null) {
            const eyeNote = visit.investigations.special_notes[eye];
            if (
              eyeNote &&
              typeof eyeNote === 'string' &&
              eyeNote.trim() &&
              eyeNote !== directNote
            ) {
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

  private parseCMTValue(val: string | null): number | null {
    if (!val) return null;
    const numericStr = val.replace(/[^0-9]/g, '');
    const numeric = parseInt(numericStr, 10);
    if (isNaN(numeric) || numeric < 150 || numeric > 1500) {
      return null;
    }
    return numeric;
  }

  normalizeVAString(vaStr: string): string | null {
    if (!vaStr) return null;

    const trimmed = vaStr.trim();
    if (!trimmed) return null;

    // Special cases that should not have 'P' removed
    const specialCases = ['NLP', 'HM', 'CF', 'PL', 'NAS', 'NO PL'];
    const upper = trimmed.toUpperCase();

    for (const special of specialCases) {
      if (upper === special || upper.startsWith(special + ' ')) {
        return upper;
      }
    }

    // For normal Snellen values, remove trailing P
    let normalized = trimmed.replace(/P$/i, '').trim();
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
    if (upper === 'NLP' || upper === 'NO PL' || upper === 'NAS') return -2.0; // Added NLP here

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
