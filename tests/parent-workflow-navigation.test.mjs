
import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
const read=path=>readFile(new URL('../app/'+path,import.meta.url),'utf8');
test('Parent actions is discoverable in Resources and keeps its navigation context',async()=>{assert.match(await read('resources/page.tsx'),/href="\/parent-actions">Parent actions/);assert.match(await read('navigation.tsx'),/'\/parent-actions'/)});
test('calendar source switch remounts transfer state and selection clears obsolete feedback',async()=>{assert.match(await read('calendar/view.tsx'),/CalendarTransfer key={state.source}/);assert.match(await read('calendar/calendar-transfer-panel.tsx'),/\[source,eventSelection\]/)});
