import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync('app/faq/faq-explorer.tsx','utf8');
test('Deep FAQ starts with expandable topic groups while search and filters show matching questions',()=>{assert.match(source,/browsing=category==='All'&&!query.trim\(\)/);assert.match(source,/className=\{styles.topic\}/);assert.match(source,/topicQuestions/);assert.match(source,/matches.map\(item=><Question/);assert.match(source,/aria-controls="faq-results"/);assert.match(source,/aria-pressed/);assert.doesNotMatch(source,/<details[^>]* open/);});
