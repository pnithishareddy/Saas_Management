import {useState} from 'react';
import {CUS0, PLANS0, USR0, h} from './data';
import {Confirm, Form} from './components';
/* Page: Settings */
export function Toggle({on,set,label}){return h`<button type="button" role="switch" aria-checked=${on} aria-label=${label} class=${'sw'+(on?' on':'')} onClick=${()=>set(!on)}></button>`}
export function Settings({settings,setSettings,theme,setTheme,setCus,setUsers,setPlans,toast}){
 const [rs,setRs]=useState(false);
 const tg=(k,label)=>h`<div class="set"><span>${label}</span><${Toggle} label=${label} on=${settings[k]} set=${v=>{setSettings({...settings,[k]:v});toast(label+(v?' enabled':' disabled'))}}/></div>`;
 const dark=theme?theme==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;
 return h`<div class="grid g2"><div class="card"><h3>Workspace</h3><${Form} key=${settings.workspace} fields=${[{k:'workspace',label:'Workspace name',check:v=>v.trim().length<2&&'Name needs at least 2 characters'}]} init=${{workspace:settings.workspace}} onCancel=${()=>toast('No changes made')} onSave=${v=>{setSettings({...settings,workspace:v.workspace.trim()});toast('Workspace saved')}}/></div>
 <div class="card"><h3>Appearance</h3><div class="pill" style=${{display:'inline-flex'}}><button class=${!dark?'on':''} onClick=${()=>setTheme('light')}>Light</button><button class=${dark?'on':''} onClick=${()=>setTheme('dark')}>Dark</button></div></div>
 <div class="card"><h3>Notifications</h3>${tg('notifyEmail','Email alerts')}${tg('notifyBilling','Billing and payment failures')}${tg('notifyUsage','Usage limit warnings')}${tg('weekly','Weekly revenue summary')}</div>
 <div class="card"><h3>Demo data</h3><p style=${{color:'var(--mut)'}}>Restore the original customers, users and plans.</p><button class="btn d" onClick=${()=>setRs(true)}>Reset demo data</button></div>
 ${rs&&h`<${Confirm} label="Reset" title="Reset demo data?" text="All changes to customers, users and plans will be lost." onNo=${()=>setRs(false)} onYes=${()=>{setCus(CUS0);setUsers(USR0);setPlans(PLANS0);setRs(false);toast('Demo data restored')}}/>`}</div>`}
