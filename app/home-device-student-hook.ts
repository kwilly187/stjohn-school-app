'use client';
import {useSyncExternalStore} from 'react';
import {parseDeviceStudent,readDeviceStudentSnapshot,subscribeDeviceStudent} from './home-device-student.mjs';
const empty=()=>'';
export default function useDeviceStudent(){return parseDeviceStudent(useSyncExternalStore(subscribeDeviceStudent,readDeviceStudentSnapshot,empty));}
