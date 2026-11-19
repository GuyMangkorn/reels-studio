// Standalone proof entry for EDU-EP30 asset tickets, topic `paddock` (Boss T03, 2026-11-19). Each ticket that owns this topic adds its compositions to
// `PROOFS` (names from its own Proof section) and nothing else, so asset tickets never share an entry file with a plate ticket. Props `guides` and
// `tag` as in shots-index.tsx.
//   printf '<ID> <frame> out/edu30-T<nn>/<name>.png\n' | node scripts/stills.mjs src/painted/edu30/proof-paddock.tsx --gl=angle
import {createElement, Fragment} from 'react';
import {registerRoot} from 'remotion';
import {Proof30, type ProofDef} from './shot';

const PROOFS: ProofDef[] = [];

registerRoot(() => createElement(Fragment, null, ...PROOFS.map(Proof30)));
