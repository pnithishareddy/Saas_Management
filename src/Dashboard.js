import {fd, h, money, num, planMrr} from './data';
import {COLORS, Donut, Kpi, Line, sum} from './components';
/* Page: Dashboard */
export function Dashboard({cus,plans,cur,prev,go}){
 const act=cus.filter(c=>c.status==='active'||c.status==='past_due'),pm=id=>plans.find(p=>p.id===id);
 const mrr=act.reduce((s,c)=>s+planMrr(pm(c.planId)||{price:0}),0),churn=cus.filter(c=>c.status==='canceled').length/cus.length*100;
 const byPlan=plans.map((p,i)=>({l:p.name,v:act.filter(c=>c.planId===p.id).length,c:COLORS[i%5]}));
 return h`<div class="grid"><div class="grid g4"><${Kpi} label="MRR" val=${money(mrr)}/><${Kpi} label="Revenue (range)" val=${money(sum(cur,'rev'))} a=${sum(cur,'rev')} b=${sum(prev,'rev')}/><${Kpi} label="API calls (range)" val=${num(sum(cur,'api'))} a=${sum(cur,'api')} b=${sum(prev,'api')}/><${Kpi} label="Churned customers" val=${churn.toFixed(1)+'%'}/></div>
 <div class="grid g2"><div class="card"><h3>Revenue — current vs previous period</h3><${Line} series=${[{name:'Current',data:cur.map(d=>d.rev),color:'#0f766e'},{name:'Previous',data:prev.map(d=>d.rev),color:'#d9822b',dash:'4 3'}]} labels=${cur.map(d=>fd(d.t))} fmt=${money}/></div>
 <div class="card"><h3>Active subscriptions by plan</h3><${Donut} items=${byPlan}/><div style=${{marginTop:14}}><button class="btn s" onClick=${()=>go('plans')}>Manage plans</button></div></div></div></div>`}
