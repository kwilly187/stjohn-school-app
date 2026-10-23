import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { filterByCategory, products, wishLists } from "../app/demo-data.mjs";

test("Saints Store filters apparel and accessories independently and All restores every product", () => {
  const apparel = filterByCategory(products, "Apparel", "kind");
  const accessories = filterByCategory(products, "Accessories", "kind");
  const all = filterByCategory(products, "All", "kind");

  assert.deepEqual(apparel.map((product) => product.name), ["Saints Tee", "Saints Crewneck"]);
  assert.deepEqual(accessories.map((product) => product.name), ["Saints Cap", "Saints Water Bottle"]);
  assert.deepEqual(all, products);
});

test("teacher and team wish lists filter independently and All restores both lists", () => {
  const teachers = filterByCategory(wishLists, "Teachers", "type");
  const teams = filterByCategory(wishLists, "Teams", "type");
  const all = filterByCategory(wishLists, "All", "type");

  assert.deepEqual(teachers.map((list) => list.name), ["Classroom supplies"]);
  assert.deepEqual(teams.map((list) => list.name), ["Saints athletics"]);
  assert.deepEqual(all, wishLists);
});

test("each rendered category control updates the state used by its own results", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(source, /\[storeFilter,setStoreFilter\]=useState\("All"\)/);
  assert.match(source, /className=\{storeFilter===x\?"active":""\} onClick=\{\(\)=>setStoreFilter\(x\)\}/);
  assert.match(source, /filterByCategory\(products,storeFilter,"kind"\)/);
  assert.match(source, /\[wishFilter,setWishFilter\]=useState\("All"\)/);
  assert.match(source, /className=\{wishFilter===x\?"active":""\} onClick=\{\(\)=>setWishFilter\(x\)\}/);
  assert.match(source, /filterByCategory\(wishLists,wishFilter,"type"\)/);
  assert.doesNotMatch(source, /\[filter,setFilter\]=useState/);
});

test("primary navigation clears section details and the back control returns to its parent or Home", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(source, /const go=\(p:Page,d=""\)=>\{setPage\(p\);setDetail\(d\)/);
  assert.match(source, /nav\.map\(\(x,i\)=><button[^]*?onClick=\{\(\)=>go\(x\)\}/);
  assert.match(source, /onClick=\{\(\)=>detail\?go\(page\):go\("Home"\)\}/);
  assert.match(source, /onClick=\{\(\)=>setDetail\(detail==="Bag"\?"":"Bag"\)\}/);
  assert.ok(source.includes('onClick={()=>setDetail("")}>← Community'));
  assert.ok(source.includes('onClick={()=>setDetail("")}>← Family'));
});
