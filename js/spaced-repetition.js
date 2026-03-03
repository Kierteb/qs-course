/**
 * spaced-repetition.js — SR algorithm, state management, and question bank
 * QS Learning Platform
 */

const SR_KEY = 'qs_sr_state';

// ============================================================
// Question Bank
// ============================================================
// 5 questions per module, added as each module is built.
// Each question: { id, moduleSource, question, type, options,
//   correctIndex, explanation }
// State (interval, nextReview, easeFactor, timesAnswered,
//   timesCorrect) is stored separately in localStorage.

const QUESTION_BANK = [

  // ── Module 01 ──────────────────────────────────────────────
  {
    id: 'q-01-01',
    moduleSource: '01',
    question: 'What is the difference between measured works and preliminary items in a BoQ?',
    type: 'multiple-choice',
    options: [
      'Measured works are the permanent works priced by unit rate; preliminaries cover site establishment, supervision, and management costs',
      'Measured works are priced as lump sums; preliminaries are priced per unit',
      'Measured works cover labour only; preliminaries cover plant and materials',
      'There is no difference — both describe the same category of work',
    ],
    correctIndex: 0,
    explanation: 'Measured works are the physical, quantified items in the BoQ — priced at a unit rate multiplied by a quantity. Preliminaries (Class A in CESMM4) cover the costs of running the site: welfare, offices, supervision, insurances, bonds, and management.',
  },
  {
    id: 'q-01-02',
    moduleSource: '01',
    question: 'What does a provisional sum represent in a civil engineering BoQ?',
    type: 'multiple-choice',
    options: [
      'A fixed allowance for work that cannot be fully defined at tender stage',
      'The contractor\'s profit allowance built into the tender',
      'The total value of all measured earthworks items',
      'A deduction applied when the contractor underperforms',
    ],
    correctIndex: 0,
    explanation: 'A provisional sum is an allowance for work that cannot be fully specified at tender. The actual cost is settled during the contract — it is not a fixed price. Defined provisional sums have a rough scope; undefined ones are genuinely unknown.',
  },
  {
    id: 'q-01-03',
    moduleSource: '01',
    question: 'In the pricing hierarchy, what sits between a unit rate and the tender total?',
    type: 'multiple-choice',
    options: [
      'Section totals for each part of the BoQ',
      'The overhead and profit percentage',
      'The PC sum allowances',
      'The dayworks schedule',
    ],
    correctIndex: 0,
    explanation: 'The hierarchy is: Unit Rate × Quantity = Item Total → Section Total → Tender Total (plus prelims and OH&P). Section totals group related items — earthworks, drainage, concrete — before they are summed to the tender total.',
  },
  {
    id: 'q-01-04',
    moduleSource: '01',
    question: 'What should you do if you find what appears to be an error in a BoQ before tender?',
    type: 'multiple-choice',
    options: [
      'Raise a query via the tender query process and price the item as written in the meantime',
      'Price it as you think it should be and note the correction in your submission',
      'Ignore it and price exactly what is written without comment',
      'Withdraw from the tender immediately',
    ],
    correctIndex: 0,
    explanation: 'Always raise BoQ errors via the formal tender query process. Price the item as written unless you receive a formal instruction otherwise — silently correcting the BoQ creates contractual problems.',
  },
  {
    id: 'q-01-05',
    moduleSource: '01',
    question: 'What does "dayworks" mean in a civil engineering contract?',
    type: 'multiple-choice',
    options: [
      'Work instructed and paid on actual time, labour, plant, and materials used — not a unit rate',
      'Work completed during daylight hours as opposed to night shifts',
      'Daily output targets agreed at the start of a contract',
      'A summary of work completed each day for programme purposes',
    ],
    correctIndex: 0,
    explanation: 'Dayworks is a method of valuing work where the contractor is reimbursed for actual resources used (labour, plant, materials) plus an agreed percentage for overhead and profit. It is used where work cannot be measured and valued in the normal way.',
  },

  // ── Module 02 ──────────────────────────────────────────────
  {
    id: 'q-02-01',
    moduleSource: '02',
    question: 'What does CESMM4 stand for?',
    type: 'multiple-choice',
    options: [
      'Civil Engineering Standard Method of Measurement, 4th Edition',
      'Construction Estimation and Site Measurement Manual, 4th Edition',
      'Civil Engineering Site Management Manual, version 4',
      'Contracted Engineering Standard for Material Measurement, 4th Edition',
    ],
    correctIndex: 0,
    explanation: 'CESMM4 — Civil Engineering Standard Method of Measurement, 4th Edition — defines how civil engineering work is measured and described in a Bill of Quantities.',
  },
  {
    id: 'q-02-02',
    moduleSource: '02',
    question: 'Which CESMM4 class covers earthworks?',
    type: 'multiple-choice',
    options: ['Class E', 'Class D', 'Class F', 'Class G'],
    correctIndex: 0,
    explanation: 'Class E is Earthworks in CESMM4, covering excavation, filling, and disposal.',
  },
  {
    id: 'q-02-03',
    moduleSource: '02',
    question: 'Which CESMM4 class covers pipe runs specifically?',
    type: 'multiple-choice',
    options: ['Class I', 'Class J', 'Class K', 'Class L'],
    correctIndex: 0,
    explanation: 'Class I is Pipework: Pipes — pipe runs measured by type, nominal bore, and depth band. Class J covers fittings, Class K covers manholes, Class L covers pipe supports and protection.',
  },
  {
    id: 'q-02-04',
    moduleSource: '02',
    question: 'Which CESMM4 class covers manholes and chambers?',
    type: 'multiple-choice',
    options: ['Class K', 'Class I', 'Class J', 'Class L'],
    correctIndex: 0,
    explanation: 'Class K is Pipework: Manholes & Ancillaries. Each manhole or chamber is a separately priced item, measured by number (nr), with depth captured in the item description.',
  },
  {
    id: 'q-02-05',
    moduleSource: '02',
    question: 'What section of a BoQ should always be read before pricing any item?',
    type: 'multiple-choice',
    options: ['The Preambles', 'The Appendices', 'Class A — General Items', 'The Tender Summary'],
    correctIndex: 0,
    explanation: 'The Preambles define how items are measured, what is included in rates, and any project-specific rules. They can modify standard CESMM4 coverage rules — skipping them is one of the most common and expensive tendering mistakes.',
  },

  // ── Module 03 ──────────────────────────────────────────────
  {
    id: 'q-03-01',
    moduleSource: '03',
    question: 'Excavated clay bulks by approximately what percentage?',
    type: 'multiple-choice',
    options: ['10%', '25%', '40%', '50%'],
    correctIndex: 1,
    explanation: 'Clay typically bulks by 20–30%. Use 25% as the standard tender figure for typical cohesive clay. Sandy soils bulk less; rock bulks more. Always state the material type alongside the factor.',
  },
  {
    id: 'q-03-02',
    moduleSource: '03',
    question: 'Granular fill compacts by approximately what percentage when placed and compacted?',
    type: 'multiple-choice',
    options: ['2–5%', '10–15%', '25–30%', '40%'],
    correctIndex: 1,
    explanation: 'Granular fill shrinks by 10–15% when compacted. You need to order approximately 12% more tonnes than the net m³ in the BoQ to achieve the specified compacted volume.',
  },
  {
    id: 'q-03-03',
    moduleSource: '03',
    question: 'If you have 100 m³ net of clay excavation, approximately how many m³ loose will you cart away?',
    type: 'multiple-choice',
    options: ['100 m³', '110 m³', '125 m³', '150 m³'],
    correctIndex: 2,
    explanation: '100 m³ × 1.25 = 125 m³ loose. The 25% bulking factor means every m³ dug becomes 1.25 m³ to dispose of. This directly drives your wagon count, disposal cost, and programme.',
  },
  {
    id: 'q-03-04',
    moduleSource: '03',
    question: 'What unit is used to measure manholes in a CESMM4 BoQ?',
    type: 'multiple-choice',
    options: ['Linear metres (m)', 'Cubic metres (m³)', 'Number (nr)', 'Tonnes (t)'],
    correctIndex: 2,
    explanation: 'Manholes in Class K are measured by number (nr). Each manhole is a separate item; depth is captured in the item description, not as a separate linear measurement.',
  },
  {
    id: 'q-03-05',
    moduleSource: '03',
    question: 'What unit is used to measure pipe runs in a CESMM4 BoQ?',
    type: 'multiple-choice',
    options: ['Cubic metres (m³)', 'Linear metres (m)', 'Number (nr)', 'Square metres (m²)'],
    correctIndex: 1,
    explanation: 'Pipe runs in Class I are always measured in linear metres (m). The depth tranche, pipe material, and nominal bore appear in the description. Your per-metre rate must account for all work in the trench.',
  },

  // ── Module 04 ──────────────────────────────────────────────
  {
    id: 'q-04-01',
    moduleSource: '04',
    question: 'Which of the following is a complete list of components in a contractor\'s all-in labour rate, beyond basic pay?',
    type: 'multiple-choice',
    options: [
      'Employer\'s NI, holiday pay, pension, CITB levy, and insurance loading',
      'Basic pay and pension only',
      'Basic pay, overtime, and a 10% uplift',
      'Employer\'s NI only — all other costs are the operative\'s responsibility',
    ],
    correctIndex: 0,
    explanation: 'The all-in rate to the contractor includes: employer\'s NI (13.8%), auto-enrolment pension, holiday pay accrual, CITB levy (0.35% for PAYE employees), insurance loading, and a small productivity allowance. Each component must be calculated individually — never use a rough percentage uplift.',
  },
  {
    id: 'q-04-02',
    moduleSource: '04',
    question: 'A drainage gang of 3 operatives has an all-in cost of £84/hr. They lay 28 m of pipe per 8-hour day. What is the labour cost per metre of pipe laid?',
    type: 'multiple-choice',
    options: ['£12.00/m', '£18.00/m', '£24.00/m', '£32.00/m'],
    correctIndex: 2,
    explanation: '(3 operatives × £84/hr all-in cost is for the gang, so: £84/hr × 8 hrs) ÷ 28 m = £672 ÷ 28 = £24.00/m. The formula is: (Gang all-in rate × Hours per day) ÷ Daily output.',
  },
  {
    id: 'q-04-03',
    moduleSource: '04',
    question: 'What does CPCS stand for in the context of plant operators?',
    type: 'multiple-choice',
    options: [
      'Construction Plant Competence Scheme',
      'Civil Project Contract Standards',
      'Contractor Personnel Certification Service',
      'Construction Project Compliance System',
    ],
    correctIndex: 0,
    explanation: 'CPCS — Construction Plant Competence Scheme — is the card scheme that certifies plant operators. An operator with a CPCS card commands a higher all-in rate than an uncertified operative. Most civil contracts require CPCS-certified operators for excavators and other plant.',
  },
  {
    id: 'q-04-04',
    moduleSource: '04',
    question: 'Why might a drainage gang\'s daily output be significantly lower than the standard benchmark?',
    type: 'multiple-choice',
    options: [
      'Deep trench, poor ground conditions, restricted access, or adverse weather',
      'Output rates never vary — benchmarks are always achievable',
      'Only if the gang size is reduced below 3 operatives',
      'Only on night shifts where lighting is required',
    ],
    correctIndex: 0,
    explanation: 'Output rates are highly contextual. Deep trenches (3 m+) require more excavation time and shoring. Poor ground (running sand, groundwater) slows all operations. Restricted access limits plant manoeuvre. Always frame output rates as benchmarks under average conditions, not absolutes.',
  },
  {
    id: 'q-04-05',
    moduleSource: '04',
    question: 'Where should site foreman cost be priced in a civil tender?',
    type: 'multiple-choice',
    options: [
      'In the unit rates for the measured works sections',
      'In preliminaries (Class A), not buried in unit rates',
      'In the dayworks schedule',
      'Split 50/50 between unit rates and preliminaries',
    ],
    correctIndex: 1,
    explanation: 'Site foreman and site manager costs are preliminaries costs — they supervise the whole site, not individual work items. Burying them in unit rates distorts those rates and makes it impossible to price properly when the programme changes. Always price supervision in Class A.',
  },

  // ── Module 05 ──────────────────────────────────────────────
  {
    id: 'q-05-01',
    moduleSource: '05',
    question: 'What does the "all-in" hourly cost of owning and operating a 13-tonne excavator include?',
    type: 'multiple-choice',
    options: [
      'Machine depreciation, maintenance, insurance, fuel, and the operator\'s all-in rate',
      'Fuel and the operator\'s basic pay only',
      'Machine purchase price divided by the number of working days',
      'Hire rate from the plant supplier only',
    ],
    correctIndex: 0,
    explanation: 'The all-in plant cost covers: depreciation (purchase price ÷ economic life), servicing and maintenance, insurance, fuel and oils, mobilisation/demobilisation, and the operator\'s all-in labour rate. Never add the operator rate twice if using an inclusive hire rate.',
  },
  {
    id: 'q-05-02',
    moduleSource: '05',
    question: 'A hired 13T excavator costs £850/day. Fuel is £85/day. An operator costs £280/day all-in. What is the total plant cost per day?',
    type: 'multiple-choice',
    options: ['£1,215/day', '£935/day', '£1,130/day', '£850/day'],
    correctIndex: 0,
    explanation: '£850 (hire) + £85 (fuel) + £280 (operator) = £1,215/day. When a plant hire rate is "dry" (excludes operator and fuel), you must add them separately. A "wet" rate includes the operator — always check which applies.',
  },
  {
    id: 'q-05-03',
    moduleSource: '05',
    question: 'A 13T excavator achieves 180 m³/day output in bulk clay excavation. The all-in daily cost is £1,215. What is the plant cost per m³?',
    type: 'multiple-choice',
    options: ['£6.75/m³', '£5.50/m³', '£8.00/m³', '£10.00/m³'],
    correctIndex: 0,
    explanation: '£1,215 ÷ 180 m³ = £6.75/m³. The formula is: (Total plant cost per day) ÷ (Daily output in BoQ units). Always use the net BoQ quantity unit, not the loose volume.',
  },
  {
    id: 'q-05-04',
    moduleSource: '05',
    question: 'Which factor most reduces an excavator\'s daily output when digging a trench compared to bulk excavation?',
    type: 'multiple-choice',
    options: [
      'Restricted swing arc and the need for precise dig profile control',
      'Trenches are always in harder material than bulk areas',
      'Plant operators work fewer hours in trench operations',
      'Trench work requires a larger machine, which moves more slowly',
    ],
    correctIndex: 0,
    explanation: 'In trench work, the excavator cannot swing freely — it must track along, reposition frequently, and work to a precise profile. This cuts output significantly versus open-bulk excavation where the machine swings unimpeded. Output might drop from 180 m³/day bulk to 60–80 m³/day in trench.',
  },
  {
    id: 'q-05-05',
    moduleSource: '05',
    question: 'Where should plant mobilisation and demobilisation costs be priced in a civil tender?',
    type: 'multiple-choice',
    options: [
      'In Preliminaries (Class A) as a time-related or fixed charge',
      'Spread across all unit rates for that plant type',
      'In the dayworks schedule',
      'Not priced separately — included automatically in hire rates',
    ],
    correctIndex: 0,
    explanation: 'Mob/demob is a fixed cost — it does not vary with the quantity of work done. It belongs in Preliminaries (Class A) as a fixed or method-related charge. Burying it in unit rates distorts those rates and exposes you if quantities change significantly.',
  },

  // ── Module 06 ──────────────────────────────────────────────
  {
    id: 'q-06-01',
    moduleSource: '06',
    question: 'Type 1 granular sub-base is quoted at £18/tonne. Its bulk density is 2.1 t/m³. What is the approximate cost per m³ delivered and compacted?',
    type: 'multiple-choice',
    options: ['£37.80/m³', '£18.00/m³', '£21.00/m³', '£8.57/m³'],
    correctIndex: 0,
    explanation: '£18/t × 2.1 t/m³ = £37.80/m³. Material prices are often quoted by weight (tonnes); you must convert to the BoQ unit (m³) using bulk density. The BoQ quantity is compacted volume — you also need to account for compaction shrinkage when ordering.',
  },
  {
    id: 'q-06-02',
    moduleSource: '06',
    question: 'Why do material quantities in a tender include a wastage allowance above the net BoQ quantity?',
    type: 'multiple-choice',
    options: [
      'To account for handling losses, overbreak, contamination, and breakages during transit and placing',
      'To build in additional profit on materials',
      'Because CESMM4 requires all material quantities to be uplifted by 10%',
      'Wastage allowances are not standard practice in civil tenders',
    ],
    correctIndex: 0,
    explanation: 'Wastage covers real losses: concrete splashed out of formwork, aggregate lost in transit, pipes broken during handling, and overbreak beyond the theoretical trench profile. Typical allowances: concrete 2–5%, granular fill 5–10%, pipe bedding 10%. Failing to allow for wastage means buying more material mid-contract at spot price.',
  },
  {
    id: 'q-06-03',
    moduleSource: '06',
    question: 'What is the difference between a material\'s "quarry gate price" and its "delivered price"?',
    type: 'multiple-choice',
    options: [
      'Quarry gate is the ex-works price; delivered price adds haulage, tipping, and unloading',
      'Quarry gate is for rock only; delivered price applies to imported fill',
      'They are the same — haulage is always included in the quoted rate',
      'Delivered price is always cheaper due to volume discounts',
    ],
    correctIndex: 0,
    explanation: 'Quarry gate (ex-works) is the cost of the material at source. Delivered price adds transport to site (typically priced per tonne per mile or as a fixed haul rate), plus any unloading or tipping charges. Always confirm whether a supplier quote is ex-works or delivered — the difference can be £5–15/t for aggregate.',
  },
  {
    id: 'q-06-04',
    moduleSource: '06',
    question: 'Ready-mixed concrete C25/30 is quoted at £130/m³ delivered. You need 45 m³ with a 3% wastage allowance. What quantity should you order?',
    type: 'multiple-choice',
    options: ['46.35 m³', '45.00 m³', '48.00 m³', '43.65 m³'],
    correctIndex: 0,
    explanation: '45 m³ × 1.03 = 46.35 m³. The wastage-adjusted order quantity = net BoQ volume × (1 + wastage fraction). Always round up to the nearest 0.5 m³ load to avoid short delivery.',
  },
  {
    id: 'q-06-05',
    moduleSource: '06',
    question: 'Which of the following best describes a "PC sum" for a specialist material?',
    type: 'multiple-choice',
    options: [
      'A Prime Cost sum — an allowance in the BoQ for a supply-only material whose exact specification isn\'t fixed at tender',
      'A Plant Cost sum — the estimated cost of operating specialist equipment',
      'A Provisional Cost — the contractor\'s best guess at material cost',
      'A Price Cap — the maximum the employer will pay for that material',
    ],
    correctIndex: 0,
    explanation: 'PC (Prime Cost) sums are allowances for materials or goods to be supplied by the contractor but whose exact specification or brand is not fixed at tender stage. The contractor adds their handling, fixing, and profit percentage on top. PC sums are adjusted to actual cost when the material is confirmed and ordered.',
  },

  // ── Module 07 ──────────────────────────────────────────────
  {
    id: 'q-07-01',
    moduleSource: '07',
    question: 'What are the three main cost components in a bulk excavation unit rate?',
    type: 'multiple-choice',
    options: [
      'Excavator cost per m³, disposal cost per m³ (loose volume × haulage), and any tipping or gate fee',
      'Labour, concrete, and formwork',
      'Pipe material, bedding, and reinstatement',
      'Surveyor, project manager, and site agent',
    ],
    correctIndex: 0,
    explanation: 'Bulk excavation rate = excavator cost/m³ + disposal cost/m³. Disposal cost = loose volume (net × bulking factor) × (haulage rate + gate fee). The bulking factor converts net m³ to loose m³ for haulage; forgetting it understates disposal cost significantly.',
  },
  {
    id: 'q-07-02',
    moduleSource: '07',
    question: 'An excavator digs 200 m³/day (net). Clay bulks 25%. 8 m³ tipper wagons are used. How many wagon loads does 200 m³ of clay produce?',
    type: 'multiple-choice',
    options: ['31.25 loads (round to 32)', '25 loads', '40 loads', '200 loads'],
    correctIndex: 0,
    explanation: '200 m³ × 1.25 = 250 m³ loose ÷ 8 m³/load = 31.25 loads (round up to 32). This determines the number of wagons needed per day and directly sets your haulage cost. Underestimating loose volume is one of the most common earthworks pricing errors.',
  },
  {
    id: 'q-07-03',
    moduleSource: '07',
    question: 'What does "stripped topsoil" mean in earthworks, and where is it usually measured?',
    type: 'multiple-choice',
    options: [
      'Removal of the upper organic layer (typically 150–200 mm) before bulk excavation; measured separately in m³ or m²',
      'Excavation of topsoil from the bottom of a trench',
      'Removal of pavement and surfacing layers',
      'Stripping is not measured separately — it is included in bulk excavation rates',
    ],
    correctIndex: 0,
    explanation: 'Topsoil stripping removes the organic-rich surface layer (grass, roots, organic matter) before bulk earthworks begin. Stripped topsoil cannot be used as structural fill and is usually stockpiled for later reinstatement or disposed of. CESMM4 Class E measures it separately because its output rate and disposal route differ from bulk subsoil.',
  },
  {
    id: 'q-07-04',
    moduleSource: '07',
    question: 'Why is excavation within 0.5 m of existing services priced at a higher rate per m³ than open bulk excavation?',
    type: 'multiple-choice',
    options: [
      'Machine excavation must be replaced with hand digging to avoid striking live services, dramatically reducing output',
      'Services areas always have harder ground material',
      'The measurement rules change within service corridors',
      'Insurance premiums double when working near services',
    ],
    correctIndex: 0,
    explanation: 'Within 0.5 m (or as specified) of known services, machine excavation must be replaced with careful hand digging. A person digging by hand may shift 1–2 m³/day vs 150–200 m³/day by machine. This dramatically increases the labour cost per m³ and must be priced separately if the BoQ identifies it.',
  },
  {
    id: 'q-07-05',
    moduleSource: '07',
    question: 'What is the purpose of "cut to fill" earthworks strategy and why does it reduce cost?',
    type: 'multiple-choice',
    options: [
      'Excavated material from cuttings is reused as embankment fill, avoiding disposal and imported fill costs',
      'Cutting the ground to a flat level before importing all fill',
      'A method of pricing where cuts are subtracted from fills in the final account',
      'Using a smaller machine to cut thin layers for precise grading',
    ],
    correctIndex: 0,
    explanation: 'Cut-to-fill reuses excavated material within the same site: material cut from high areas is carted and placed as fill in low areas. This avoids double costs (disposal of cut + purchase of imported fill). The earthworks balance must account for bulking and compaction — 1 m³ cut may not equal 1 m³ fill.',
  },

  // ── Module 08 ──────────────────────────────────────────────
  {
    id: 'q-08-01',
    moduleSource: '08',
    question: 'What cost components must a pipe-laying unit rate include under CESMM4 Class I?',
    type: 'multiple-choice',
    options: [
      'Excavation, pipe supply, pipe bedding, laying and jointing, backfill, and compaction',
      'Pipe supply only — all other costs are in separate BoQ items',
      'Labour only — plant and materials are measured separately',
      'Trench excavation and pipe supply; backfill is priced at provisional sum',
    ],
    correctIndex: 0,
    explanation: 'A CESMM4 Class I pipe rate is a "super-rate" — it must include everything in the trench: excavation, disposal, imported bedding, pipe supply, laying and jointing, backfill, compaction, and reinstatement. The preambles confirm what is included. Pricing only the pipe itself and missing trench costs is a serious tendering error.',
  },
  {
    id: 'q-08-02',
    moduleSource: '08',
    question: 'A trench is 0.6 m wide × 1.5 m deep × 80 m long. What is the excavation volume in m³?',
    type: 'multiple-choice',
    options: ['72 m³', '48 m³', '120 m³', '96 m³'],
    correctIndex: 0,
    explanation: '0.6 m × 1.5 m × 80 m = 72 m³. Trench volume = width × depth × length. The CESMM4 depth band (e.g., 1–1.5 m, 1.5–2 m) determines the rate band; always check which depth tranche applies to your pipe invert depth.',
  },
  {
    id: 'q-08-03',
    moduleSource: '08',
    question: 'What is "dewatering" and when must it be separately priced in a drainage tender?',
    type: 'multiple-choice',
    options: [
      'Removal of groundwater or surface water from excavations; priced when the water table is within or above the trench depth',
      'Cleaning and flushing newly laid pipes before handover',
      'Removing silted material from existing manholes',
      'Testing pipe joints under water pressure',
    ],
    correctIndex: 0,
    explanation: 'Dewatering keeps excavations dry enough to work in. When groundwater is encountered (water table within trench depth), sumps, wellpoints, or pumps are needed. CESMM4 Class A or E may include a dewatering item, or it may be a provisional sum. If ground investigation data shows high water table, price dewatering explicitly — it can cost more than the pipe itself.',
  },
  {
    id: 'q-08-04',
    moduleSource: '08',
    question: 'A CESMM4 Class K manhole item reads "Brick manhole depth 1.5–2.0 m, 1200 mm internal dia". What unit is used for this item?',
    type: 'multiple-choice',
    options: ['Number (nr)', 'Linear metres (m)', 'Cubic metres (m³)', 'Square metres (m²)'],
    correctIndex: 0,
    explanation: 'Manholes in Class K are always measured by number (nr). The description captures the key variables: construction type (brick/precast), internal diameter, and depth band. Your lump-sum rate per manhole must cover all work — excavation, base slab, rings/brickwork, frame and cover, benching, and backfill.',
  },
  {
    id: 'q-08-05',
    moduleSource: '08',
    question: 'Why does pipe-laying output (m/day) drop sharply for pipe installed deeper than 2 m?',
    type: 'multiple-choice',
    options: [
      'Deeper trenches require more excavation time, trench support (shoring), and slower safer working conditions',
      'Deeper pipes are always larger diameter and heavier to handle',
      'CESMM4 rules require hand-laying for all pipes below 2 m',
      'Insurance prohibits machine excavation below 2 m depth',
    ],
    correctIndex: 0,
    explanation: 'Deep trenches (>2 m) require: more excavation volume per metre run, trench support (timber, steel sheet piling, or drag boxes) to prevent collapse, slower working due to confined space and access restrictions, and sometimes dewatering. Output might drop from 25–30 m/day in shallow trenches to 10–15 m/day at 3 m+, with significantly higher cost per metre.',
  },

  // ── Module 09 ──────────────────────────────────────────────
  {
    id: 'q-09-01',
    moduleSource: '09',
    question: 'What are the three cost elements of every in-situ concrete item in a civil BoQ?',
    type: 'multiple-choice',
    options: [
      'Formwork, reinforcement, and concrete supply and placing',
      'Concrete, labour, and plant only',
      'Mix design, curing, and finishing',
      'Excavation, blinding, and structural pour',
    ],
    correctIndex: 0,
    explanation: 'Every in-situ concrete item has three cost elements: formwork (temporary mould), reinforcement (steel mesh or bar), and the concrete itself (supply, pump if needed, place, compact, cure). CESMM4 measures each separately under Classes F and G. Missing any one of the three is a pricing error.',
  },
  {
    id: 'q-09-02',
    moduleSource: '09',
    question: 'What does DPM stand for, and where is it installed in a ground slab build-up?',
    type: 'multiple-choice',
    options: [
      'Damp Proof Membrane — laid on the blinding concrete, below reinforcement and the structural slab',
      'Dry Pile Mix — a lean concrete used under piled foundations',
      'Drainage Pipe Marker — a tape indicating the location of buried services',
      'Depth Profile Measurement — a survey record of excavation levels',
    ],
    correctIndex: 0,
    explanation: 'DPM (Damp Proof Membrane) is a polyethylene sheet laid on the blinding concrete to prevent ground moisture rising into the structural slab. The correct build-up from bottom is: formation → blinding (C10) → DPM → reinforcement → structural slab concrete.',
  },
  {
    id: 'q-09-03',
    moduleSource: '09',
    question: 'What is blinding concrete and what is its typical strength class?',
    type: 'multiple-choice',
    options: [
      'A thin layer of lean-mix concrete poured on prepared formation to create a clean working surface; typically C10 or C16/20',
      'A high-strength concrete used to blind the ends of reinforcing bars',
      'The final power-floated finish applied to a structural slab',
      'A protective concrete layer applied over buried services',
    ],
    correctIndex: 0,
    explanation: 'Blinding is a thin (50–75 mm) lean-mix layer poured on stripped formation. Its purpose is to create a clean, level surface for setting out and placing reinforcement — not to provide structural strength. C10 (1:3:6 mix) or C16/20 ready-mix is typical. It is a separate CESMM4 Class F item.',
  },
  {
    id: 'q-09-04',
    moduleSource: '09',
    question: 'Why do retaining walls cost significantly more per m³ of concrete than a simple ground slab?',
    type: 'multiple-choice',
    options: [
      'Complex two-sided formwork, higher reinforcement content, restricted access for pours, and the need for temporary propping',
      'Retaining walls use a higher concrete strength class which costs more',
      'Retaining walls are always thicker than slabs, so material cost per m³ is higher',
      'Retaining walls require a concrete pump, which slabs do not',
    ],
    correctIndex: 0,
    explanation: 'Retaining walls require formwork to both faces (compared to one face for a slab or no face for blinding), typically contain significantly more reinforcement to resist lateral earth pressure, and often have restricted access for concrete placing. The formwork labour content alone can exceed the concrete material cost.',
  },
  {
    id: 'q-09-05',
    moduleSource: '09',
    question: 'When would a concrete pump be required on a civil groundworks project?',
    type: 'multiple-choice',
    options: [
      'When concrete cannot be discharged directly from the ready-mix truck — due to restricted access, long horizontal distance, or height above ground level',
      'Only when the concrete mix contains reinforcement fibres',
      'Pumps are always required — direct truck discharge is not permitted on civil contracts',
      'When the concrete specification requires C32/40 or above',
    ],
    correctIndex: 0,
    explanation: 'A concrete pump is required when the truck cannot get close enough to pour directly. This includes narrow site access, elevated pours (above truck chute height), and long horizontal distances. Pump cost (£350–600/day) must be priced separately — it is not included in the ready-mix supply rate.',
  },

  // ── Module 10 ──────────────────────────────────────────────
  {
    id: 'q-10-01',
    moduleSource: '10',
    question: 'What are the five layers in a standard flexible road construction, from bottom to top?',
    type: 'multiple-choice',
    options: [
      'Formation, capping/sub-base, roadbase, binder course, surface course',
      'Topsoil, sub-base, concrete base, tarmac, line marking',
      'Excavation, compaction, aggregate, bitumen, surfacing',
      'Foundation, blinding, mesh, screed, surface dressing',
    ],
    correctIndex: 0,
    explanation: 'The standard flexible pavement build-up (bottom to top): formation (prepared subgrade) → capping/sub-base (granular — Type 1 or 6F5) → roadbase (dense bituminous macadam, DBM) → binder course (DBM) → surface course (wearing course, often SMA or HRA). Each layer has a specified thickness and material standard.',
  },
  {
    id: 'q-10-02',
    moduleSource: '10',
    question: 'What CESMM4 class covers roads, paving, and surfacing?',
    type: 'multiple-choice',
    options: ['Class R', 'Class E', 'Class F', 'Class X'],
    correctIndex: 0,
    explanation: 'Class R — Roads & Paving — covers all road construction items including sub-base, roadbase, binder course, surface course, kerbs, edgings, and road markings. Sub-base filling may appear in Class E (Earthworks) if measured as filling rather than a road layer — check the preamble.',
  },
  {
    id: 'q-10-03',
    moduleSource: '10',
    question: 'What does "adoptable standard" mean for a new road on a development site?',
    type: 'multiple-choice',
    options: [
      'Built to a specification and standard that the local highway authority will accept for adoption and future maintenance',
      'A road built using only locally sourced materials',
      'A road that has been accepted by the site owner as complete',
      'A temporary access road adopted for use during construction',
    ],
    correctIndex: 0,
    explanation: 'An adoptable road is designed and built to standards set by the local highway authority (typically under Section 38 of the Highways Act). Once adopted, the authority takes over maintenance responsibility. Adoptable standard usually means thicker construction, higher specification materials, and specific drainage requirements — all of which increase cost vs a private access road.',
  },
  {
    id: 'q-10-04',
    moduleSource: '10',
    question: 'What is the binder course in a road build-up and what is its purpose?',
    type: 'multiple-choice',
    options: [
      'The penultimate bituminous layer below the surface course — it provides structural support and a regulated surface for the wearing course',
      'A chemical primer applied to the sub-base before placing bituminous layers',
      'The base course immediately above the sub-base',
      'A bituminous seal coat applied after the surface course to prevent water ingress',
    ],
    correctIndex: 0,
    explanation: 'The binder course (formerly "base course" or "DBM binder") sits between the roadbase and surface course. It provides structural support to the surface course, regulates the surface level, and distributes load. Typical thickness: 60–100 mm. It is priced per tonne or per m² at a specified thickness.',
  },
  {
    id: 'q-10-05',
    moduleSource: '10',
    question: 'What unit is used to measure kerbs and edgings in a CESMM4 BoQ?',
    type: 'multiple-choice',
    options: ['Linear metres (m)', 'Square metres (m²)', 'Number (nr)', 'Tonnes (t)'],
    correctIndex: 0,
    explanation: 'Kerbs, edgings, and channel units are measured in linear metres (m) under CESMM4 Class R. The description identifies the type and size (e.g., precast concrete kerb 125 × 255 mm). Your per-metre rate must include the kerb unit supply, bedding, haunching, and joint filling.',
  },

  // ── Module 11 ──────────────────────────────────────────────
  {
    id: 'q-11-01',
    moduleSource: '11',
    question: 'What is the most common error when pricing civil engineering preliminaries?',
    type: 'multiple-choice',
    options: [
      'Using a rough percentage of measured works value rather than building up each item from first principles',
      'Including too many items — experienced contractors price very few prelims',
      'Pricing supervision costs in unit rates rather than prelims',
      'Failing to include the cost of concrete testing',
    ],
    correctIndex: 0,
    explanation: 'Applying a blanket percentage (e.g., "10% for prelims") to the measured works total is the most dangerous prelims mistake. Prelims are time-related and fixed costs — they do not scale proportionally with the value of measured work. A short intensive contract may have higher prelims as a percentage than a long spread-out one. Always build up item by item.',
  },
  {
    id: 'q-11-02',
    moduleSource: '11',
    question: 'What is a performance bond in construction and who pays for it?',
    type: 'multiple-choice',
    options: [
      'A financial guarantee from a bank or insurer that the contractor will complete the works; the contractor pays the premium and it is a prelims cost',
      'A financial guarantee provided by the client that they will pay the contractor',
      'A document signed by the contractor\'s performance manager confirming site productivity targets',
      'A bond posted by the subcontractor to guarantee their works are defect-free',
    ],
    correctIndex: 0,
    explanation: 'A performance bond is typically 10% of contract value. It is provided by a bank or surety on behalf of the contractor to the client. If the contractor defaults, the client can call the bond to cover completion costs. The contractor pays the premium (typically 0.5–2% of the bond value per year) — this is a prelims cost, not OH&P.',
  },
  {
    id: 'q-11-03',
    moduleSource: '11',
    question: 'What does CAR stand for in construction insurance?',
    type: 'multiple-choice',
    options: [
      'Contractor\'s All Risks — covers physical loss or damage to the contract works during construction',
      'Contract Administration Record — the document trail for variations and instructions',
      'Civil Authority Requirements — local authority consents and compliance costs',
      'Confirmed Adjudication Resolution — the outcome of a dispute',
    ],
    correctIndex: 0,
    explanation: 'CAR (Contractor\'s All Risks) insurance covers the contract works against physical damage during construction — fire, flood, storm, accidental damage, theft of materials. It is distinct from Employer\'s Liability (covers workers) and Public Liability (covers third parties). The premium is typically 0.1–0.5% of contract value and is a prelims cost.',
  },
  {
    id: 'q-11-04',
    moduleSource: '11',
    question: 'How do you calculate your overhead recovery percentage?',
    type: 'multiple-choice',
    options: [
      'Total annual overhead costs ÷ total annual turnover × 100',
      'Annual profit ÷ total annual costs × 100',
      'Site costs ÷ head office costs × 100',
      'The percentage is set by industry convention at 7.5%',
    ],
    correctIndex: 0,
    explanation: 'Overhead recovery % = (Total annual overhead costs ÷ Total annual turnover) × 100. For example, if your company has £800,000 in overheads and £8,000,000 turnover, the OH% is 10%. This percentage is then applied to the measured works + prelims total in each tender to recover those central costs.',
  },
  {
    id: 'q-11-05',
    moduleSource: '11',
    question: 'Under CDM Regulations 2015, who is responsible for producing the Construction Phase Plan?',
    type: 'multiple-choice',
    options: [
      'The Principal Contractor',
      'The Principal Designer',
      'The Client',
      'The Health & Safety Executive (HSE)',
    ],
    correctIndex: 0,
    explanation: 'The Principal Contractor must produce and maintain the Construction Phase Plan (CPP) before construction work begins. The CPP sets out how health and safety will be managed during construction. For a groundworks contractor acting as PC, the CPP must be in place before the first spade goes in. On smaller projects, the contractor may act as both PC and PD.',
  },

  // ── Module 12 ──────────────────────────────────────────────
  {
    id: 'q-12-01',
    moduleSource: '12',
    question: 'What should always be done before pricing a single item in a new BoQ?',
    type: 'multiple-choice',
    options: [
      'Read the preambles in full — they define what is included in rates, how items are measured, and any project-specific departures from CESMM4',
      'Price the largest items first to establish the main cost structure',
      'Request clarification from the client on every unclear item before starting',
      'Prepare the tender summary page so you know the totals structure before pricing',
    ],
    correctIndex: 0,
    explanation: 'Preambles define the rules of the game for that specific tender. They can modify CESMM4 coverage rules, change measurement methods, specify inclusions or exclusions from rates, and define the risk allocation. Reading preambles before pricing prevents double-counting and missing inclusions. Skipping them is one of the most expensive tendering mistakes.',
  },
  {
    id: 'q-12-02',
    moduleSource: '12',
    question: 'Under the Construction Act 1996 (as amended), what is a Pay Less Notice?',
    type: 'multiple-choice',
    options: [
      'A notice issued by the paying party stating their intention to pay less than the previously notified sum, specifying the basis and amount of any deduction',
      'A notice from the contractor requesting a reduction in the contract price due to scope reduction',
      'A penalty notice issued by an adjudicator when a party fails to comply with a payment decision',
      'A notice from HMRC to a contractor regarding unpaid payroll taxes',
    ],
    correctIndex: 0,
    explanation: 'A Pay Less Notice must be issued not later than the prescribed period before the final date for payment. It must state the sum the payer considers due and the basis of calculation. If no valid Pay Less Notice is served, the payer must pay the full sum in the Payment Notice (or Default Payment Notice). Failure to serve correctly means the payer cannot reduce the payment.',
  },
  {
    id: 'q-12-03',
    moduleSource: '12',
    question: 'What is the correct sequence for building up a complete tender price?',
    type: 'multiple-choice',
    options: [
      'Price measured works first, then build prelims item by item, then apply overheads and profit',
      'Price prelims first, then measured works, then deduct overheads already in unit rates',
      'Apply OH&P percentage first, then build measured works and prelims to fit',
      'Price all items simultaneously and sum to tender total in one pass',
    ],
    correctIndex: 0,
    explanation: 'The correct sequence is: (1) Price all measured works sections (unit rates × quantities = section totals), (2) Build the prelims section item by item from first principles, (3) Sum to a sub-total, (4) Apply your overhead recovery percentage, (5) Apply your profit margin. This sequence ensures each cost element is calculated independently and correctly before the final adjudication.',
  },
  {
    id: 'q-12-04',
    moduleSource: '12',
    question: 'Why should a tender be priced in construction sequence rather than BoQ order?',
    type: 'multiple-choice',
    options: [
      'To identify programme logic, resource clashes, and critical path dependencies — pricing in BoQ order can hide sequencing costs and planning conflicts',
      'Because CESMM4 requires all items to be priced in programme order',
      'To match the order in which invoices will be submitted',
      'BoQ order and construction sequence are always identical',
    ],
    correctIndex: 0,
    explanation: 'BoQ order is alphabetical by CESMM4 class (A, B, C...) which does not reflect when work happens on site. Pricing in construction sequence reveals: whether you have enough plant for concurrent operations, whether your programme is achievable, where the critical path is, and whether time-related costs (standing time, prolonged prelims) are correctly captured.',
  },
  {
    id: 'q-12-05',
    moduleSource: '12',
    question: 'What is a benchmark rate and how is it used in tender sense-checking?',
    type: 'multiple-choice',
    options: [
      'An expected market rate range for a given BoQ item, used to verify your calculated rate is commercially realistic before submission',
      'The rate submitted by the lowest tenderer on the previous contract',
      'A fixed rate set by the client that cannot be altered in the tender',
      'The maximum rate a contractor is allowed to bid for an item',
    ],
    correctIndex: 0,
    explanation: 'Benchmark rates are your or your industry\'s expected ranges for common items — e.g., "bulk excavation £20–35/m³, drainage pipe 150mm £50–70/m at 1m depth." After pricing from first principles, you compare your calculated rates against benchmarks. If a rate is outside the expected range, investigate before submitting — either your inputs are wrong, or there is a genuine site-specific reason for the variation.',
  },

];

// ============================================================
// SR State Management
// ============================================================

/**
 * Load SR state from localStorage, merging in any questions newly added
 * to the bank since the state was last saved.
 */
function loadSRState() {
  let state = {};
  const raw = localStorage.getItem(SR_KEY);

  if (raw) {
    try { state = JSON.parse(raw); } catch (e) { state = {}; }
  }

  // Ensure every question in the bank has a state entry.
  // This handles the case where questions are added after a user's first session.
  let needsSave = !raw;
  QUESTION_BANK.forEach(q => {
    if (!state[q.id]) {
      state[q.id] = {
        interval: 1,
        nextReview: null,
        easeFactor: 2.5,
        timesAnswered: 0,
        timesCorrect: 0,
      };
      needsSave = true;
    }
  });

  if (needsSave) saveSRState(state);
  return state;
}

function saveSRState(state) {
  localStorage.setItem(SR_KEY, JSON.stringify(state));
}

/**
 * Get all questions due for review today, from completed modules only.
 * @returns {Array} question objects ready to display
 */
function getDueQuestions() {
  const state = loadSRState();
  const today = new Date().toISOString().slice(0, 10);

  return QUESTION_BANK.filter(q => {
    if (!isModuleComplete(q.moduleSource)) return false;
    const qState = state[q.id];
    if (!qState || !qState.nextReview) return false;
    return qState.nextReview <= today;
  });
}

/**
 * Record an answer and update the review interval.
 * @param {string}  questionId
 * @param {boolean} correct
 */
function recordSRAnswer(questionId, correct) {
  const state = loadSRState();
  let qState = state[questionId];
  if (!qState) {
    // Guard: create entry if somehow missing
    qState = { interval: 1, nextReview: null, easeFactor: 2.5, timesAnswered: 0, timesCorrect: 0 };
    state[questionId] = qState;
  }

  qState.timesAnswered++;
  if (correct) qState.timesCorrect++;

  let newInterval;
  if (!correct) {
    newInterval = 1;
  } else if (qState.timesCorrect === 1) {
    newInterval = 3;
  } else if (qState.timesCorrect === 2) {
    newInterval = 7;
  } else {
    newInterval = Math.min(Math.round(qState.interval * qState.easeFactor), 30);
  }

  qState.interval = newInterval;
  const next = new Date();
  next.setDate(next.getDate() + newInterval);
  qState.nextReview = next.toISOString().slice(0, 10);

  saveSRState(state);
}

/**
 * Activate SR questions for a module when it is completed for the first time.
 * Sets nextReview to tomorrow for any question not yet activated.
 * @param {string} moduleId
 */
function activateSRQuestionsForModule(moduleId) {
  const state = loadSRState();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  QUESTION_BANK
    .filter(q => q.moduleSource === moduleId)
    .forEach(q => {
      if (!state[q.id]) {
        state[q.id] = { interval: 1, easeFactor: 2.5, timesAnswered: 0, timesCorrect: 0 };
      }
      if (!state[q.id].nextReview) {
        state[q.id].nextReview = tomorrowStr;
      }
    });

  saveSRState(state);
}

/**
 * Return SR stats for a given module (for diagnostics / admin use).
 * @param {string} moduleId
 * @returns {{ total: number, activated: number, mastered: number }}
 */
function getSRStatsForModule(moduleId) {
  const state = loadSRState();
  const questions = QUESTION_BANK.filter(q => q.moduleSource === moduleId);
  const activated = questions.filter(q => state[q.id]?.nextReview).length;
  const mastered  = questions.filter(q => (state[q.id]?.timesCorrect || 0) >= 3).length;
  return { total: questions.length, activated, mastered };
}
