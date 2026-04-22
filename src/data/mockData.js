export const CLIENTS = [
  'Grammer', 'Trucklight', 'Fujikura', 'Magna', 'Valeo', 'Gestamp', 'Faurecia',
];

export const PARTS_BY_CLIENT = {
  Grammer:    ['Dashboard Assembly', 'Center Console'],
  Trucklight: ['Reflector', 'Chrome Part'],
  Fujikura:   ['Plastic Component', 'Vinyl Trim'],
  Magna:      ['Door Panel', 'Stamped Metal Part'],
  Valeo:      ['Reflector', 'Plastic Component'],
  Gestamp:    ['Stamped Metal Part'],
  Faurecia:   ['Dashboard Assembly', 'Door Panel'],
};

export const DEFECT_TYPES = [
  'Scratch', 'Dent', 'Contamination', 'Color Mismatch',
  'Burr', 'Deformation', 'Poor Finish', 'Assembly Issue',
];

export const INSPECTORS = [
  'Carlos M.', 'Ana R.', 'Luis T.', 'Maria G.', 'Pedro S.', 'Sofia L.',
];

export const INITIAL_INSPECTIONS = [
  { id:  1, date: '2026-04-07', client: 'Grammer',    part: 'Dashboard Assembly',  inspector: 'Carlos M.', qtyInspected: 250, qtyGood: 238, qtyDefective: 12, defectType: 'Scratch',        hours: 4, notes: 'Surface scratches on outer panel.' },
  { id:  2, date: '2026-04-07', client: 'Magna',      part: 'Door Panel',          inspector: 'Ana R.',    qtyInspected: 180, qtyGood: 175, qtyDefective:  5, defectType: 'Dent',           hours: 3, notes: '' },
  { id:  3, date: '2026-04-07', client: 'Valeo',      part: 'Reflector',           inspector: 'Luis T.',   qtyInspected: 320, qtyGood: 314, qtyDefective:  6, defectType: 'Poor Finish',    hours: 5, notes: 'Rough surface texture on lens area.' },
  { id:  4, date: '2026-04-08', client: 'Trucklight', part: 'Reflector',           inspector: 'Pedro S.',  qtyInspected: 150, qtyGood: 142, qtyDefective:  8, defectType: 'Contamination',  hours: 3, notes: 'Oil residue detected on 8 units.' },
  { id:  5, date: '2026-04-08', client: 'Fujikura',   part: 'Plastic Component',   inspector: 'Sofia L.',  qtyInspected: 500, qtyGood: 492, qtyDefective:  8, defectType: 'Burr',           hours: 6, notes: '' },
  { id:  6, date: '2026-04-08', client: 'Gestamp',    part: 'Stamped Metal Part',  inspector: 'Carlos M.', qtyInspected: 200, qtyGood: 188, qtyDefective: 12, defectType: 'Deformation',    hours: 4, notes: 'Warping on bracket edges.' },
  { id:  7, date: '2026-04-09', client: 'Faurecia',   part: 'Dashboard Assembly',  inspector: 'Ana R.',    qtyInspected: 280, qtyGood: 272, qtyDefective:  8, defectType: 'Color Mismatch', hours: 4, notes: 'Shade variance vs. master sample.' },
  { id:  8, date: '2026-04-09', client: 'Grammer',    part: 'Center Console',      inspector: 'Maria G.',  qtyInspected: 120, qtyGood: 117, qtyDefective:  3, defectType: 'Poor Finish',    hours: 2, notes: '' },
  { id:  9, date: '2026-04-09', client: 'Magna',      part: 'Stamped Metal Part',  inspector: 'Luis T.',   qtyInspected: 350, qtyGood: 336, qtyDefective: 14, defectType: 'Dent',           hours: 5, notes: 'Dents on flange area.' },
  { id: 10, date: '2026-04-10', client: 'Valeo',      part: 'Plastic Component',   inspector: 'Pedro S.',  qtyInspected: 420, qtyGood: 410, qtyDefective: 10, defectType: 'Scratch',        hours: 6, notes: '' },
  { id: 11, date: '2026-04-10', client: 'Trucklight', part: 'Chrome Part',         inspector: 'Sofia L.',  qtyInspected:  90, qtyGood:  84, qtyDefective:  6, defectType: 'Poor Finish',    hours: 2, notes: 'Pitting on chrome surface.' },
  { id: 12, date: '2026-04-10', client: 'Fujikura',   part: 'Vinyl Trim',          inspector: 'Carlos M.', qtyInspected: 200, qtyGood: 196, qtyDefective:  4, defectType: 'Color Mismatch', hours: 3, notes: '' },
  { id: 13, date: '2026-04-11', client: 'Gestamp',    part: 'Stamped Metal Part',  inspector: 'Ana R.',    qtyInspected: 300, qtyGood: 285, qtyDefective: 15, defectType: 'Deformation',    hours: 6, notes: 'High deformation rate — flagged for process review.' },
  { id: 14, date: '2026-04-11', client: 'Faurecia',   part: 'Door Panel',          inspector: 'Maria G.',  qtyInspected: 160, qtyGood: 156, qtyDefective:  4, defectType: 'Assembly Issue', hours: 3, notes: '' },
  { id: 15, date: '2026-04-11', client: 'Grammer',    part: 'Dashboard Assembly',  inspector: 'Luis T.',   qtyInspected: 220, qtyGood: 215, qtyDefective:  5, defectType: 'Scratch',        hours: 4, notes: '' },
  { id: 16, date: '2026-04-12', client: 'Magna',      part: 'Door Panel',          inspector: 'Pedro S.',  qtyInspected: 190, qtyGood: 182, qtyDefective:  8, defectType: 'Dent',           hours: 3, notes: '' },
  { id: 17, date: '2026-04-12', client: 'Valeo',      part: 'Reflector',           inspector: 'Sofia L.',  qtyInspected: 380, qtyGood: 371, qtyDefective:  9, defectType: 'Contamination',  hours: 5, notes: 'Dust contamination during assembly.' },
  { id: 18, date: '2026-04-13', client: 'Trucklight', part: 'Reflector',           inspector: 'Carlos M.', qtyInspected: 140, qtyGood: 133, qtyDefective:  7, defectType: 'Poor Finish',    hours: 3, notes: '' },
  { id: 19, date: '2026-04-13', client: 'Fujikura',   part: 'Plastic Component',   inspector: 'Ana R.',    qtyInspected: 450, qtyGood: 441, qtyDefective:  9, defectType: 'Burr',           hours: 6, notes: '' },
  { id: 20, date: '2026-04-14', client: 'Gestamp',    part: 'Stamped Metal Part',  inspector: 'Maria G.',  qtyInspected: 250, qtyGood: 234, qtyDefective: 16, defectType: 'Deformation',    hours: 5, notes: 'Batch #G-2244 shows elevated deformation.' },
  { id: 21, date: '2026-04-14', client: 'Faurecia',   part: 'Dashboard Assembly',  inspector: 'Luis T.',   qtyInspected: 300, qtyGood: 294, qtyDefective:  6, defectType: 'Color Mismatch', hours: 4, notes: '' },
  { id: 22, date: '2026-04-14', client: 'Grammer',    part: 'Center Console',      inspector: 'Pedro S.',  qtyInspected: 130, qtyGood: 127, qtyDefective:  3, defectType: 'Poor Finish',    hours: 2, notes: '' },
  { id: 23, date: '2026-04-15', client: 'Magna',      part: 'Stamped Metal Part',  inspector: 'Sofia L.',  qtyInspected: 280, qtyGood: 268, qtyDefective: 12, defectType: 'Dent',           hours: 4, notes: '' },
  { id: 24, date: '2026-04-15', client: 'Valeo',      part: 'Plastic Component',   inspector: 'Carlos M.', qtyInspected: 400, qtyGood: 392, qtyDefective:  8, defectType: 'Scratch',        hours: 5, notes: '' },
  { id: 25, date: '2026-04-16', client: 'Trucklight', part: 'Chrome Part',         inspector: 'Ana R.',    qtyInspected:  80, qtyGood:  75, qtyDefective:  5, defectType: 'Assembly Issue', hours: 2, notes: 'Clip misalignment detected.' },
  { id: 26, date: '2026-04-16', client: 'Fujikura',   part: 'Vinyl Trim',          inspector: 'Maria G.',  qtyInspected: 220, qtyGood: 215, qtyDefective:  5, defectType: 'Color Mismatch', hours: 3, notes: '' },
  { id: 27, date: '2026-04-17', client: 'Gestamp',    part: 'Stamped Metal Part',  inspector: 'Luis T.',   qtyInspected: 320, qtyGood: 307, qtyDefective: 13, defectType: 'Deformation',    hours: 5, notes: '' },
  { id: 28, date: '2026-04-17', client: 'Faurecia',   part: 'Door Panel',          inspector: 'Pedro S.',  qtyInspected: 170, qtyGood: 166, qtyDefective:  4, defectType: 'Assembly Issue', hours: 3, notes: '' },
  { id: 29, date: '2026-04-18', client: 'Grammer',    part: 'Dashboard Assembly',  inspector: 'Sofia L.',  qtyInspected: 260, qtyGood: 253, qtyDefective:  7, defectType: 'Scratch',        hours: 4, notes: '' },
  { id: 30, date: '2026-04-18', client: 'Magna',      part: 'Door Panel',          inspector: 'Carlos M.', qtyInspected: 200, qtyGood: 193, qtyDefective:  7, defectType: 'Dent',           hours: 3, notes: '' },
  { id: 31, date: '2026-04-19', client: 'Valeo',      part: 'Reflector',           inspector: 'Ana R.',    qtyInspected: 360, qtyGood: 351, qtyDefective:  9, defectType: 'Poor Finish',     hours: 5, notes: '' },
  { id: 32, date: '2026-04-19', client: 'Trucklight', part: 'Reflector',           inspector: 'Maria G.',  qtyInspected: 130, qtyGood: 124, qtyDefective:  6, defectType: 'Contamination',  hours: 2, notes: '' },
  { id: 33, date: '2026-04-20', client: 'Fujikura',   part: 'Plastic Component',   inspector: 'Luis T.',   qtyInspected: 480, qtyGood: 470, qtyDefective: 10, defectType: 'Burr',           hours: 6, notes: '' },
  { id: 34, date: '2026-04-20', client: 'Gestamp',    part: 'Stamped Metal Part',  inspector: 'Pedro S.',  qtyInspected: 290, qtyGood: 274, qtyDefective: 16, defectType: 'Deformation',    hours: 5, notes: 'Second elevated batch this week.' },
  { id: 35, date: '2026-04-20', client: 'Faurecia',   part: 'Dashboard Assembly',  inspector: 'Sofia L.',  qtyInspected: 310, qtyGood: 304, qtyDefective:  6, defectType: 'Color Mismatch', hours: 4, notes: '' },
];
