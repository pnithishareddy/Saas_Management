import {useState} from 'react';
import {h} from './data';
import {Form, Modal} from './components';
/* Page: Profile */
export function Profile({profile,setProfile,toast}){
 const [pw,setPw]=useState(false);
 const F=[{k:'name',label:'Full name',check:v=>v.trim().length<2&&'Name needs at least 2 characters'},{k:'email',label:'Email',check:v=>!/^\S+@\S+\.\S+$/.test(v)&&'Enter a valid email'},{k:'phone',label:'Mobile number',check:v=>!/^(\+91-?)?[6-9]\d{9}$/.test(v.replace(/\s/g,''))&&'Enter a valid Indian mobile number'},{k:'company',label:'Company',check:v=>!v.trim()&&'Company is required'},{k:'city',label:'City',check:v=>!v.trim()&&'City is required'}];
 const PF=[{k:'current',label:'Current password',type:'password',check:v=>!v&&'Enter your current password'},{k:'next',label:'New password',type:'password',check:v=>(v.length<8||!/\d/.test(v))&&'Use 8+ characters including a number'},{k:'confirm',label:'Confirm new password',type:'password',check:(v,a)=>v!==a.next&&'Passwords do not match'}];
 const ini=profile.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();
 return h`<div class="grid g2"><div class="card"><div class="row" style=${{gap:16,marginBottom:14}}><div class="av">${ini}</div><div><h2 style=${{margin:0,fontSize:18}}>${profile.name}</h2><span style=${{color:'var(--mut)'}}>${profile.role}</span></div></div>
 <div class="set"><span>Email</span><b>${profile.email}</b></div><div class="set"><span>Mobile</span><b>${profile.phone}</b></div><div class="set"><span>Company</span><b>${profile.company}</b></div><div class="set"><span>City</span><b>${profile.city}</b></div>
 <div style=${{marginTop:14}}><button class="btn" onClick=${()=>setPw(true)}>Change password</button></div></div>
 <div class="card"><h3>Edit profile</h3><${Form} key=${JSON.stringify(profile)} fields=${F} init=${profile} onCancel=${()=>toast('No changes made')} onSave=${v=>{setProfile({...profile,...v});toast('Profile updated')}}/></div>
 ${pw&&h`<${Modal} title="Change password" onClose=${()=>setPw(false)}><${Form} fields=${PF} init=${{current:'',next:'',confirm:''}} submit="Update password" onCancel=${()=>setPw(false)} onSave=${()=>{setPw(false);toast('Password updated')}}/><//>`}</div>`}
