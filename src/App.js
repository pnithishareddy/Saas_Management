import {useState,useMemo,useEffect,useRef} from 'react';
import {CUS0, DAY, DAYS, PLANS0, TODAY, USR0, fd, h, pd} from './data';
import {Customers} from './Customers';
import {Dashboard} from './Dashboard';
import {Plans} from './Plans';
import {Profile} from './Profile';
import {RevenueV} from './Revenue';
import {Settings} from './Settings';
import {Subs} from './Subscriptions';
import {UsageV} from './Usage';
import {Users} from './Users';
/* App shell: navigation, date range, toasts, routing */
/* ---------- app ---------- */
const NAV=[['overview','Dashboard'],['customers','Customers'],['users','Users'],['subs','Subscriptions'],['plans','Plans'],['usage','Usage'],['revenue','Revenue'],['profile','Profile'],['settings','Settings']];
export default function App(){
 const [view,setView]=useState('overview'),[plans,setPlans]=useState(PLANS0),[cus,setCus]=useState(CUS0),[users,setUsers]=useState(USR0),[open,setOpen]=useState(false);
 const [toasts,setToasts]=useState([]),[tick,setTick]=useState(0),[stt,setStt]=useState('loading'),fail=useRef(false);
 const [profile,setProfile]=useState({name:'Aarav Sharma',email:'email@mysaas.in',phone:'+91 98765 43210',company:'MySaas Technologies',city:'Hyderabad',role:'Workspace Admin'}),[settings,setSettings]=useState({workspace:'MySaas',notifyEmail:true,notifyBilling:true,notifyUsage:false,weekly:true});
 const [rg,setRg]=useState({n:30,from:TODAY-29*DAY,to:TODAY}),[theme,setTheme]=useState('');
 const toast=(m,type='ok')=>{const id=Math.random();setToasts(t=>[...t,{id,m,type}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3200)};
 useEffect(()=>{setStt('loading');const t=setTimeout(()=>{if(fail.current){fail.current=false;setStt('error')}else setStt('ok')},450);return()=>clearTimeout(t)},[view,tick]);
 useEffect(()=>{if(theme)document.documentElement.dataset.theme=theme},[theme]);
 const cur=useMemo(()=>DAYS.filter(d=>d.t>=rg.from&&d.t<=rg.to),[rg]);
 const prev=useMemo(()=>{const l=cur.length;return DAYS.filter(d=>d.t>=rg.from-l*DAY&&d.t<rg.from)},[rg,cur]);
 const preset=n=>setRg({n,from:TODAY-(n-1)*DAY,to:TODAY});
 const custom=(k,v)=>{if(!v)return;const t=pd(v),r={...rg,n:0,[k]:t};if(r.from>r.to||r.from<DAYS[0].t+DAY||r.to>TODAY)return toast('Choose a valid date range within the last two years','error');setRg(r)};
 const needsRange=['overview','usage','revenue'].includes(view);
 const common={cus,setCus,plans,setPlans,users,setUsers,toast,cur,prev,profile,setProfile,settings,setSettings,theme,setTheme};
 const V={overview:Dashboard,customers:Customers,users:Users,subs:Subs,plans:Plans,usage:UsageV,revenue:RevenueV,profile:Profile,settings:Settings}[view];
 return h`<div class="app"><aside class=${'side'+(open?' open':'')}><div class="logo"><i></i>MySaas</div><nav class="nav">${NAV.map(n=>h`<button key=${n[0]} class=${view===n[0]?'on':''} onClick=${()=>{setView(n[0]);setOpen(false)}}>${n[1]}</button>`)}</nav></aside>
 <main class="main"><div class="top"><div class="row"><button class="btn burger" aria-label="Menu" onClick=${()=>setOpen(!open)}>☰</button><h1>${NAV.find(n=>n[0]===view)[1]}</h1></div>
 <div class="row"><button class="btn s" onClick=${()=>{fail.current=true;toast('Next page load will fail (demo)')}}>Simulate error</button><button class="btn s" onClick=${()=>setTheme((document.documentElement.dataset.theme==='dark'||(!theme&&window.matchMedia('(prefers-color-scheme:dark)').matches))?'light':'dark')}>Theme</button></div></div>
 ${needsRange&&h`<div class="row" style=${{marginBottom:14}}><div class="pill">${[7,30,90,365].map(n=>h`<button key=${n} class=${rg.n===n?'on':''} onClick=${()=>preset(n)}>${n===365?'12m':n+'d'}</button>`)}</div><input type="date" aria-label="From" value=${fd(rg.from)} max=${fd(rg.to)} onChange=${e=>custom('from',e.target.value)}/><span>to</span><input type="date" aria-label="To" value=${fd(rg.to)} max=${fd(TODAY)} onChange=${e=>custom('to',e.target.value)}/></div>`}
 ${stt==='loading'?h`<div class="grid g4"><div class="sk"></div><div class="sk"></div><div class="sk"></div><div class="sk"></div></div>`:stt==='error'?h`<div class="card empty"><div style=${{fontSize:30}}>⚠</div><p>We couldn't load this page. Check your connection and try again.</p><button class="btn p" onClick=${()=>setTick(tick+1)}>Retry</button></div>`:h`<${V} ...${common} go=${setView}/>`}</main>
 <div class="toasts" aria-live="polite">${toasts.map(t=>h`<div key=${t.id} class=${'toast '+t.type}>${t.m}</div>`)}</div></div>`}
