// Checks the exhibit catalog: shape, unique titles, plausible years.
const HALLS=require("../dist/catalog.js");
let bad=0;const seen=new Set();
const fail=m=>{console.error("✗ "+m);bad++};
for(const h of HALLS){
  if(!h.id||!h.name||!h.items.length)fail("hall incomplete: "+h.id);
  for(const [y,t,l,n,k] of h.items){
    if(!Number.isInteger(y)||y<1950||y>2030)fail(`bad year for ${t}`);
    if(!t||!l||!n||!k)fail(`missing field in ${t||"(untitled)"}`);
    if(seen.has(t))fail("duplicate title: "+t);seen.add(t);
  }
}
if(bad)process.exit(1);
console.log(`✓ ${HALLS.length} halls, ${seen.size} unique exhibits`);
