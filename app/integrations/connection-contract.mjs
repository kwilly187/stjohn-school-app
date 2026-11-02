// Configuration readiness only. This never authorizes a user or returns private data.
export const privateReadCapabilities = Object.freeze(['assignments','grades','memberships','announcements']);
export const connectionStates = Object.freeze(['not-configured','awaiting-approval','configured','verified','disabled','error']);
/**
 * Inputs must be maintained by a trusted server-side integration setup process.
 * Even ready=true requires independent per-request authentication, school scope,
 * active guardian/student grants and field-level permission checks before a read.
 * No current runtime imports this contract; all private sections remain disconnected.
 */
export function validateConnectionReadiness(connection, capability) {
 const result=reason=>({ready:reason==='ready',reason,perRequestAuthorizationRequired:true});
 if(!privateReadCapabilities.includes(capability))return result('unsupported-capability');
 if(!connection||!connectionStates.includes(connection.state))return result('not-configured');
 if(connection.state!=='verified')return result(connection.state);
 if(connection.schoolApproval!==true)return result('awaiting-approval');
 if(typeof connection.schoolId!=='string'||!connection.schoolId.trim())return result('missing-school');
 if(connection.activated!==true)return result('not-activated');
 if(!Array.isArray(connection.verifiedReadCapabilities)||!connection.verifiedReadCapabilities.includes(capability))return result('capability-unverified');
 return result('ready');
}
