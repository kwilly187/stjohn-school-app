import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {faqItems,faqCategories,searchFaq} from '../app/faq/faq-data.mjs';
test('FAQ answers have stable unique ids and official school evidence',()=>{assert.equal(new Set(faqItems.map(x=>x.id)).size,faqItems.length);for(const item of faqItems){assert.ok(['stjohnocala.org','maschiofood.com'].includes(new URL(item.source).hostname));assert.ok(item.answer);assert.ok(item.action.href);}});
test('FAQ search matches everyday keywords and multiple terms',()=>{assert.ok(searchFaq('food payment').some(x=>x.id==='lunch-account'));assert.ok(searchFaq('REPORT CARD').some(x=>x.id==='grades'));assert.equal(searchFaq('zzzznothing').length,0);assert.equal(searchFaq('   ').length,faqItems.length);});
test('FAQ topics combine with search without exposing unrelated results',()=>{assert.ok(faqCategories.includes('Daily life'));assert.ok(searchFaq('uniform','Daily life').length>0);assert.equal(searchFaq('uniform','Contact').length,0);assert.ok(searchFaq('','Activities').every(x=>x.category==='Activities'));});
test('FAQ is accessible, recoverable and discoverable from resources',()=>{const ui=readFileSync('app/faq/faq-explorer.tsx','utf8');assert.match(ui,/<details/);assert.match(ui,/<summary/);assert.match(ui,/aria-pressed/);assert.match(ui,/htmlFor="faq-search"/);assert.match(ui,/Show all questions/);assert.match(readFileSync('app/resources/page.tsx','utf8'),/href="\/faq"/);});

test("FAQ covers practical parent needs with current-year fees",()=>{assert.ok(faqItems.length>=35);for(const id of ["lunch-prices","annual-tuition","reenrollment","aftercare-details","supplies","sports-new-hs","clubs","teacher-contact"])assert.ok(faqItems.some(item=>item.id===id));assert.ok(searchFaq("scholarship").length);assert.match(faqItems.find(x=>x.id==="annual-tuition").question,/2026–27/);});
