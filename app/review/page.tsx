import {redirect} from 'next/navigation';
// Historical school-review links now open the parent experience. Handoff material lives in docs.
export default function Review(){redirect('/');}
