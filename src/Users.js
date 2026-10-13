import {useState} from 'react';
import {TODAY, fd, h} from './data';
import {Badge, Bar, Confirm, Form, Modal, Table} from './components';
/* Page: Users */
export function Users({users,setUsers,cus,toast}){
 const [q,setQ]=useState(''),[st,setSt]=useState('all'),[ro,setRo]=useState('all'),[mod,setMod]=useState(null),[del,setDel]=useState(null);
 const cn=id=>(cus.find(c=>c.id===id)||{company:'—'}).company;
 const rows=users.filter(u=>(st==='all'||u.status===st)&&(ro==='all'||u.role===ro)&&(u.name+u.email).toLowerCase().includes(q.toLowerCase()));
 const F=[{k:'name',label:'Full name',check:v=>v.trim().length<2&&'Name needs at least 2 characters'},{k:'email',label:'Email',check:(v,a)=>!/^\S+@\S+\.\S+$/.test(v)?'Enter a valid email':users.some(u=>u.email===v&&u.id!==a.id)&&'Email already in use'},{k:'role',label:'Role',opts:['Admin','Member','Viewer'].map(r=>[r,r])},{k:'customerId',label:'Customer',opts:cus.map(c=>[c.id,c.company])},{k:'status',label:'Status',opts:['active','invited','suspended'].map(s=>[s,s])}];
 const save=v=>{if(mod==='new'){setUsers([{...v,id:'u'+Date.now(),last:TODAY},...users]);toast('User added')}else{setUsers(users.map(u=>u.id===v.id?v:u));toast('User updated')}setMod(null)};
 return h`<div class="card"><${Bar} q=${q} setQ=${setQ} filters=${[{label:'Role',v:ro,set:setRo,opts:['Admin','Member','Viewer'].map(r=>[r,r])},{label:'Status',v:st,set:setSt,opts:['active','invited','suspended'].map(s=>[s,s])}]}><button class="btn p" onClick=${()=>setMod('new')}>+ Add user</button><//>
 <${Table} rows=${rows} cols=${[{k:'name',label:'Name'},{k:'email',label:'Email'},{k:'role',label:'Role'},{k:'customerId',label:'Customer',render:r=>cn(r.customerId),val:r=>cn(r.customerId)},{k:'status',label:'Status',render:r=>h`<${Badge} s=${r.status}/>`},{k:'last',label:'Last active',render:r=>fd(r.last)},{k:'x',label:'',val:()=>0,render:r=>h`<span class="row"><button class="btn s" onClick=${()=>setMod(r)}>Edit</button><button class="btn s" onClick=${()=>setDel(r)}>Delete</button></span>`}]}/>
 ${mod&&h`<${Modal} title=${mod==='new'?'Add user':'Edit user'} onClose=${()=>setMod(null)}><${Form} fields=${F} init=${mod==='new'?{name:'',email:'',role:'Member',customerId:cus[0]?.id||'',status:'invited'}:mod} onSave=${save} onCancel=${()=>setMod(null)}/><//>`}
 ${del&&h`<${Confirm} title="Delete user?" text=${'Remove '+del.name+'? They will lose access immediately.'} onNo=${()=>setDel(null)} onYes=${()=>{setUsers(users.filter(x=>x.id!==del.id));setDel(null);toast('User deleted')}}/>`}</div>`}
