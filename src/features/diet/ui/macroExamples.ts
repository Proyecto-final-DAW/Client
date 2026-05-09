/**
 * Macro food-equivalent generator. Given the target grams figure for a
 * macro, returns three example food combos that roughly sum to it.
 * Used by the diet card to anchor the abstract gram figure with
 * something tangible: "216g de proteina ≈ 4 pechugas + 7 huevos +
 * 1 lata de atun" gives the user actionable shopping cues instead of
 * an opaque number.
 *
 * Each combo allocates the target across 2-3 staple ingredients with
 * a fixed percentage split (so the three combos read as different
 * styles of meal-planning), converts grams of macro → units of food
 * via a per-unit table, and rounds to integer counts. Totals are
 * approximate; the goal is "tangible enough to plan a meal", not
 * lab-grade nutrition.
 *
 * Per-unit nutrient figures are typical mid-range values for raw or
 * cooked staples (USDA-ish, rounded to whole grams). They get re-tuned
 * if a user reports a combo reads off — exact ratios matter less than
 * making the suggestions feel realistic.
 */

export type MacroKey = 'PROTEINA' | 'GRASA' | 'CARBOS';

const pluralize = (count: number, singular: string, pluralForm: string): string =>
  count === 1 ? singular : pluralForm;

/** Round to the nearest multiple, with a floor so we never render
 *  "0g salmon" on tiny targets. */
const roundToMultiple = (value: number, multiple: number, min: number): number =>
  Math.max(min, Math.round(value / multiple) * multiple);

/** Round to nearest whole, with a min of 1 so combos never render
 *  "0 huevos". */
const atLeastOne = (value: number): number => Math.max(1, Math.round(value));

const proteinExamples = (grams: number): readonly string[] => {
  // Per-unit protein (g): pechuga (raw 150g) ≈ 40, huevo grande ≈ 6,
  // lata atun en agua (~80g) ≈ 25, salmon ≈ 0.22/g, yogur griego
  // alto en proteina ≈ 0.10/g, filete ternera (~150g) ≈ 30, queso
  // fresco ≈ 0.13/g.
  const pechugas = atLeastOne((grams * 0.7) / 40);
  const huevos = atLeastOne((grams * 0.2) / 6);
  const latas = atLeastOne((grams * 0.1) / 25);

  const salmon = roundToMultiple((grams * 0.6) / 0.22, 25, 50);
  const yogur = roundToMultiple((grams * 0.4) / 0.1, 50, 100);

  const filetes = atLeastOne((grams * 0.7) / 30);
  const queso = roundToMultiple((grams * 0.3) / 0.13, 25, 50);

  return [
    `≈ ${pechugas} ${pluralize(pechugas, 'pechuga', 'pechugas')} + ${huevos} ${pluralize(huevos, 'huevo', 'huevos')} + ${latas} ${pluralize(latas, 'lata', 'latas')} de atun`,
    `≈ ${salmon}g salmon + ${yogur}g yogur griego`,
    `≈ ${filetes} ${pluralize(filetes, 'filete', 'filetes')} ternera + ${queso}g queso fresco`,
  ];
};

const fatExamples = (grams: number): readonly string[] => {
  // Per-unit fat (g): aguacate medio ≈ 22, puñado frutos secos
  // (30g) ≈ 18, cda aceite oliva (14g) ≈ 14, almendras ≈ 0.50/g,
  // puñado nueces (30g) ≈ 19, cda mantequilla (14g) ≈ 12.
  const aguacates = atLeastOne((grams * 0.6) / 22);
  const punadosFs = atLeastOne((grams * 0.4) / 18);

  const cdasOliva = atLeastOne((grams * 0.5) / 14);
  const almendras = roundToMultiple((grams * 0.5) / 0.5, 5, 15);

  const punadosNueces = atLeastOne((grams * 0.6) / 19);
  const cdasMant = atLeastOne((grams * 0.4) / 12);

  return [
    `≈ ${aguacates} ${pluralize(aguacates, 'aguacate', 'aguacates')} + ${punadosFs} ${pluralize(punadosFs, 'puñado', 'puñados')} de frutos secos`,
    `≈ ${cdasOliva} ${pluralize(cdasOliva, 'cda', 'cdas')} aceite oliva + ${almendras}g almendras`,
    `≈ ${punadosNueces} ${pluralize(punadosNueces, 'puñado', 'puñados')} nueces + ${cdasMant} ${pluralize(cdasMant, 'cda', 'cdas')} mantequilla`,
  ];
};

const carbExamples = (grams: number): readonly string[] => {
  // Per-unit carbs (g): tazon arroz cocido (~200g) ≈ 50, fruta media
  // ≈ 20, rebanada pan integral ≈ 12, platano medio ≈ 27, taza avena
  // cruda (~40g) ≈ 27, plato pasta cocida (~200g) ≈ 60, patata
  // mediana (~200g) ≈ 36.
  const tazones = atLeastOne((grams * 0.8) / 50);
  const frutas = atLeastOne((grams * 0.2) / 20);

  const rebanadas = atLeastOne((grams * 0.4) / 12);
  const platanos = atLeastOne((grams * 0.3) / 27);
  const tazasAvena = atLeastOne((grams * 0.3) / 27);

  const platosPasta = atLeastOne((grams * 0.6) / 60);
  const patatas = atLeastOne((grams * 0.4) / 36);

  return [
    `≈ ${tazones} ${pluralize(tazones, 'tazon', 'tazones')} de arroz cocido + ${frutas} ${pluralize(frutas, 'fruta', 'frutas')}`,
    `≈ ${rebanadas} rebanadas pan integral + ${platanos} ${pluralize(platanos, 'platano', 'platanos')} + ${tazasAvena} ${pluralize(tazasAvena, 'taza', 'tazas')} avena`,
    `≈ ${platosPasta} ${pluralize(platosPasta, 'plato', 'platos')} de pasta + ${patatas} ${pluralize(patatas, 'patata', 'patatas')}`,
  ];
};

export const buildMacroExamples = (
  grams: number,
  macro: MacroKey
): readonly string[] => {
  if (grams <= 0) return [];
  if (macro === 'PROTEINA') return proteinExamples(grams);
  if (macro === 'GRASA') return fatExamples(grams);
  return carbExamples(grams);
};
