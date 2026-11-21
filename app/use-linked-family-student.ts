'use client';
import {useSyncExternalStore} from 'react';
import {linkedFamilySnapshot,subscribeLinkedFamily,resolveLinkedFamilyStudent} from './linked-family-selection.mjs';
import type {getLocalLinkedFamily} from './linked-family.server.mjs';
const blank=()=>'';
export default function useLinkedFamilyStudent(students:ReturnType<typeof getLocalLinkedFamily>){return resolveLinkedFamilyStudent(students,useSyncExternalStore(subscribeLinkedFamily,linkedFamilySnapshot,blank));}
