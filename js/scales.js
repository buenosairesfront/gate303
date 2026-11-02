/* Escalas de norns (lib/musicutil.lua): mismos nombres que en los scripts de norns, intervalos en semitonos desde la tónica. */
const SCALES=[
  ['Major',[0,2,4,5,7,9,11]],['Natural Minor',[0,2,3,5,7,8,10]],['Harmonic Minor',[0,2,3,5,7,8,11]],['Melodic Minor',[0,2,3,5,7,9,11]],
  ['Dorian',[0,2,3,5,7,9,10]],['Phrygian',[0,1,3,5,7,8,10]],['Lydian',[0,2,4,6,7,9,11]],['Mixolydian',[0,2,4,5,7,9,10]],['Locrian',[0,1,3,5,6,8,10]],
  ['Whole Tone',[0,2,4,6,8,10]],['Major Pentatonic',[0,2,4,7,9]],['Minor Pentatonic',[0,3,5,7,10]],
  ['Major Bebop',[0,2,4,5,7,8,9,11]],['Altered Scale',[0,1,3,4,6,8,10]],['Dorian Bebop',[0,2,3,4,5,7,9,10]],['Mixolydian Bebop',[0,2,4,5,7,9,10,11]],
  ['Blues Scale',[0,3,5,6,7,10]],['Diminished Whole Half',[0,2,3,5,6,8,9,11]],['Diminished Half Whole',[0,1,3,4,6,7,9,10]],
  ['Neapolitan Major',[0,1,3,5,7,9,11]],['Hungarian Major',[0,3,4,6,7,9,10]],['Harmonic Major',[0,2,4,5,7,8,11]],['Hungarian Minor',[0,2,3,6,7,8,11]],
  ['Lydian Minor',[0,2,4,6,7,8,10]],['Neapolitan Minor',[0,1,3,5,7,8,11]],['Major Locrian',[0,2,4,5,6,8,10]],['Leading Whole Tone',[0,2,4,6,8,10,11]],
  ['Six Tone Symmetrical',[0,1,4,5,8,9]],['Balinese',[0,1,3,7,8]],['Persian',[0,1,4,5,6,8,11]],['East Indian Purvi',[0,1,4,6,7,8,11]],
  ['Oriental',[0,1,4,5,6,9,10]],['Double Harmonic',[0,1,4,5,7,8,11]],['Enigmatic',[0,1,4,6,8,10,11]],['Overtone',[0,2,4,6,7,9,10]],
  ['Eight Tone Spanish',[0,1,3,4,5,6,8,10]],['Prometheus',[0,2,4,6,9,10]],['Gagaku Rittsu Sen Pou',[0,2,5,7,9,10]],['In Sen Pou',[0,1,5,7,10]],
  ['Okinawa',[0,4,5,7,11]],['Chromatic',[0,1,2,3,4,5,6,7,8,9,10,11]]
];
