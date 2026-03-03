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
