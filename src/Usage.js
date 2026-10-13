import {useState} from 'react';
import {fd, h, num} from './data';
import {Bar, Kpi, Line, Table, sum} from './components';
/* Page: Usage */
export function UsageV({cus,plans,cur,prev}){
 const [q,setQ]=useState(''),[ov,setOv]=useState('all'),pf=id=>plans.find(p=>p.id===id)||{api:1,name:'—'};
 const rows=cus.filter(c=>c.status!=='canceled'&&c.company.toLowerCase().includes(q.toLowerCase())&&(ov==='all'||(ov==='over'?c.usage>1:c.usage<=1))).map(c=>({...c,calls:Math.round(c.usage*pf(c.planId).api)}));
 return h`<div class="grid"><div class="grid g4"><${Kpi} label="API calls" val=${num(sum(cur,'api'))} a=${sum(cur,'api')} b=${sum(prev,'api')}/><${Kpi} label="Avg storage (GB)" val=${num(sum(cur,'gb')/Math.max(1,cur.length))} a=${sum(cur,'gb')} b=${sum(prev,'gb')}/><${Kpi} label="Over limit" val=${cus.filter(c=>c.usage>1&&c.status!=='canceled').length}/></div>
 <div class="card"><h3>API calls per day</h3><${Line} series=${[{name:'Current',data:cur.map(d=>d.api),color:'#6366f1'},{name:'Previous',data:prev.map(d=>d.api),color:'#94a3b8',dash:'4 3'}]} labels=${cur.map(d=>fd(d.t))}/></div>
 <div class="card"><h3>Usage by customer</h3><${Bar} q=${q} setQ=${setQ} filters=${[{label:'Limit',v:ov,set:setOv,opts:[['over','Over limit'],['under','Within limit']]}]}/><${Table} rows=${rows} cols=${[{k:'company',label:'Customer'},{k:'planId',label:'Plan',render:r=>pf(r.planId).name,val:r=>pf(r.planId).name},{k:'calls',label:'API calls',render:r=>num(r.calls)},{k:'usage',label:'% of limit',render:r=>h`<div class="row"><div class="bar"><i style=${{width:Math.min(100,r.usage*100)+'%',background:r.usage>1?'var(--bad)':''}}></i></div>${(r.usage*100).toFixed(0)}%</div>`}]}/></div></div>`}
