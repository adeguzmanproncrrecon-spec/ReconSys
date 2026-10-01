// js for u_dashboard.html
const files = [
 {name:'MJH PHIC RECON CLAIMS_ICS.xlsx',type:'ICS',hospital:'Mary Johnston Hospital, Inc.',by:'Jane Dela Cruz',date:'May 14, 2025  10:32 AM',status:'Processed'},
 {name:'EXTRACT DATA MARY JOHNSTON...',type:'Extraction',hospital:'Mary Johnston Hospital, Inc.',by:'Jane Dela Cruz',date:'May 14, 2025  09:58 AM',status:'Processed'},
 {name:'MJH SPARKS.xlsx',type:'Sparks',hospital:'Mary Johnston Hospital, Inc.',by:'Jane Dela Cruz',date:'May 13, 2025  04:21 PM',status:'Processed'},
 {name:'MJH PAYMENT DETAILS.xlsx',type:'Payment',hospital:'Mary Johnston Hospital, Inc.',by:'Jane Dela Cruz',date:'May 12, 2025  02:17 PM',status:'Processed'},
 {name:'MJH TRAIL.xlsx',type:'Trail',hospital:'Mary Johnston Hospital, Inc.',by:'Jane Dela Cruz',date:'May 12, 2025  01:05 PM',status:'Processing'},
 {name:'MJH ICDCODE.xlsx',type:'ICD',hospital:'Mary Johnston Hospital, Inc.',by:'Jane Dela Cruz',date:'May 11, 2025  11:36 AM',status:'Processed'},
 {name:'MJH ICS.xlsx',type:'ICS',hospital:'Mary Johnston Hospital, Inc.',by:'Jane Dela Cruz',date:'May 10, 2025  03:12 PM',status:'Failed'},
 {name:'MJH CLAIMS APRIL.xlsx',type:'ICS',hospital:'Mary Johnston Hospital, Inc.',by:'Jane Dela Cruz',date:'May 09, 2025  09:45 AM',status:'Processed'},
 {name:'MJH EXTRACTION APRIL.xlsx',type:'Extraction',hospital:'Mary Johnston Hospital, Inc.',by:'Jane Dela Cruz',date:'May 08, 2025  01:15 PM',status:'Processed'},
 {name:'MJH PAYMENT APRIL.xlsx',type:'Payment',hospital:'Mary Johnston Hospital, Inc.',by:'Jane Dela Cruz',date:'May 07, 2025  11:02 AM',status:'Processed'},
 {name:'MJH SPARKS APRIL.xlsx',type:'Sparks',hospital:'Mary Johnston Hospital, Inc.',by:'Jane Dela Cruz',date:'May 06, 2025  02:44 PM',status:'Processed'},
 {name:'MJH ICD APRIL.xlsx',type:'ICD',hospital:'Mary Johnston Hospital, Inc.',by:'Jane Dela Cruz',date:'May 05, 2025  08:30 AM',status:'Processed'}
];
const activities=[
 {kind:'success',icon:'fa-check',title:'File processed successfully',detail:'MJH PHIC RECON CLAIMS_ICS.xlsx',date:'May 14, 2025  10:32 AM'},
 {kind:'upload',icon:'fa-upload',title:'File uploaded',detail:'EXTRACT DATA MARY JOHNSTON...',date:'May 14, 2025  09:58 AM'},
 {kind:'reconcile',icon:'fa-gear',title:'Reconciliation completed',detail:'Run #R2025-001',date:'May 14, 2025  04:45 AM'},
 {kind:'failure',icon:'fa-triangle-exclamation',title:'File processing failed',detail:'MJH TRAIL.xlsx',date:'May 12, 2025  01:05 PM'},
 {kind:'success',icon:'fa-check',title:'File processed successfully',detail:'MJH PAYMENT DETAILS.xlsx',date:'May 12, 2025  02:17 PM'}
];
let state={query:'',status:'All',page:1,pageSize:7};
const body=document.querySelector('#filesBody');
const pagination=document.querySelector('#pagination');
const showing=document.querySelector('#showingText');
const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function filteredFiles(){return files.filter(f=>(state.status==='All'||f.status===state.status)&&f.name.toLowerCase().includes(state.query.toLowerCase()))}
function renderFiles(){const data=filteredFiles(),pages=Math.max(1,Math.ceil(data.length/state.pageSize));state.page=Math.min(state.page,pages);const start=(state.page-1)*state.pageSize,end=Math.min(start+state.pageSize,data.length);body.innerHTML=data.slice(start,end).map(f=>`<tr><td><span class="file-cell"><i class="fa-regular fa-file-lines"></i>${esc(f.name)}</span></td><td><span class="type-pill type-${f.type.toLowerCase()}">${esc(f.type)}</span></td><td>${esc(f.hospital)}</td><td>${esc(f.by)}</td><td>${esc(f.date)}</td><td><span class="status-pill status-${f.status.toLowerCase()}">${esc(f.status)}</span></td><td><button class="more-button" aria-label="Actions for ${esc(f.name)}"><i class="fa-solid fa-ellipsis-vertical"></i></button></td></tr>`).join('')||'<tr><td colspan="7">No files found.</td></tr>';showing.textContent=data.length?`Showing ${start+1}–${end} of ${data.length} files`:'Showing 0 files';pagination.innerHTML=`<button class="page-button" ${state.page===1?'disabled':''} data-page="${state.page-1}"><i class="fa-solid fa-chevron-left"></i></button>${Array.from({length:pages},(_,i)=>`<button class="page-button ${state.page===i+1?'active':''}" data-page="${i+1}">${i+1}</button>`).join('')}<button class="page-button" ${state.page===pages?'disabled':''} data-page="${state.page+1}"><i class="fa-solid fa-chevron-right"></i></button>`}
function renderActivities(){document.querySelector('#activityList').innerHTML=activities.map(a=>`<div class="activity-item"><span class="activity-icon ${a.kind}"><i class="fa-solid ${a.icon}"></i></span><div class="activity-copy"><strong>${a.title}</strong><span>${a.detail}</span><small>${a.date}</small></div></div>`).join('')}
function toast(message,type=''){const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=message;document.querySelector('#toastContainer').append(el);setTimeout(()=>el.remove(),3200)}
function openPicker(){document.querySelector('#fileInput').click()}
function acceptFiles(list){[...list].forEach(file=>{if(!/\.xlsx?$/i.test(file.name)){toast(`${file.name}: only Excel files are allowed.`,'error');return}if(file.size>100*1024*1024){toast(`${file.name}: file is larger than 100 MB.`,'error');return}files.unshift({name:file.name,type:'ICS',hospital:'Mary Johnston Hospital, Inc.',by:'Jane Dela Cruz',date:new Date().toLocaleString(),status:'Processing'});activities.unshift({kind:'upload',icon:'fa-upload',title:'File uploaded',detail:file.name,date:new Date().toLocaleString()});toast(`${file.name} added to the processing queue.`,'success')});state.page=1;renderFiles();renderActivities()}
document.querySelector('#fileSearch').addEventListener('input',e=>{state.query=e.target.value;state.page=1;renderFiles()});
document.querySelector('#statusFilter').addEventListener('change',e=>{state.status=e.target.value;state.page=1;renderFiles()});
pagination.addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b&&!b.disabled){state.page=Number(b.dataset.page);renderFiles()}});
document.querySelector('#browseButton').addEventListener('click',e=>{e.stopPropagation();openPicker()});document.querySelector('#quickUpload').addEventListener('click',openPicker);document.querySelector('#fileInput').addEventListener('change',e=>acceptFiles(e.target.files));
const drop=document.querySelector('#dropZone');drop.addEventListener('click',e=>{if(!e.target.closest('button'))openPicker()});drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')openPicker()});['dragenter','dragover'].forEach(n=>drop.addEventListener(n,e=>{e.preventDefault();drop.classList.add('dragging')}));['dragleave','drop'].forEach(n=>drop.addEventListener(n,e=>{e.preventDefault();drop.classList.remove('dragging')}));drop.addEventListener('drop',e=>acceptFiles(e.dataTransfer.files));
document.querySelector('#profileButton').addEventListener('click',()=>document.querySelector('#profileMenu').classList.toggle('open'));document.addEventListener('click',e=>{if(!e.target.closest('.topbar-actions'))document.querySelector('#profileMenu').classList.remove('open')});
document.querySelector('#mobileMenu').addEventListener('click',()=>document.querySelector('#sidebar').classList.toggle('open'));document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('.nav-link').forEach(x=>x.classList.remove('active'));a.classList.add('active');document.querySelector('#sidebar').classList.remove('open')}));
document.querySelectorAll('.quick-actions button:not(#quickUpload), .assistance button, .outline-dark-button').forEach(b=>b.addEventListener('click',()=>toast('Connect this control to your project route or API.')));
renderFiles();renderActivities();

// js for a_dashboard.html
const hospitals = [
 {name:'Mary Johnston Hospital, Inc.',code:'MJH',status:'Completed',date:'May 14, 2025 14:26',file:'EXTRACT DATA ...2025.xlsx',records:'1,245,678',rate:97.2},
 {name:"St. Luke's Medical Center",code:'SLMC',status:'Completed',date:'May 14, 2025 11:03',file:'EXTRACT DATA ...2025.xlsx',records:'842,331',rate:96.8},
 {name:'Riverside Community Hospital',code:'RCH',status:'Running',date:'May 14, 2025 16:42',file:'EXTRACT DATA ...2025.xlsx',records:'624,112',rate:null},
 {name:"St. Anne's Hospital",code:'SAH',status:'Completed',date:'May 13, 2025 09:17',file:'EXTRACT DATA ...2025.xlsx',records:'1,103,559',rate:95.4},
 {name:'General Hospital',code:'GH',status:'Failed',date:'May 12, 2025 15:33',file:'EXTRACT DATA ...2025.xlsx',records:'221,440',rate:null},
 {name:'City Medical Center',code:'CMC',status:'Completed',date:'May 13, 2025 13:20',file:'EXTRACT DATA ...2025.xlsx',records:'987,665',rate:98.1},
 {name:'Valley Health Hospital',code:'VHH',status:'Completed',date:'May 11, 2025 10:05',file:'EXTRACT DATA ...2025.xlsx',records:'756,332',rate:96.3},
 {name:'Metro General Hospital',code:'MGH',status:'Completed',date:'May 10, 2025 17:45',file:'EXTRACT DATA ...2025.xlsx',records:'512,887',rate:94.7}
];
const activities1=[
 ['green','circle-check-big','Reconciliation Completed','Mary Johnston Hospital, Inc.','May 14, 2025 14:58'],
 ['blue','upload','File Uploaded','EXTRACT DATA MARY JOHNSTON...','May 14, 2025 14:26'],
 ['blue','loader-circle','Reconciliation Running','Riverside Community Hospital','May 14, 2025 16:42'],
 ['purple','file-text','Report Generated','NRT NCR NORTH - AS OF DEC 31, 2025...','May 14, 2025 16:15'],
 ['red','triangle-alert','File Processing Failed','General Hospital','May 12, 2025 15:33']
];
const rows=document.querySelector('#hospitalRows'), search=document.querySelector('#searchInput'), status=document.querySelector('#statusFilter');
function renderRows(){
 const q=search.value.trim().toLowerCase(), s=status.value.toLowerCase();
 const list=hospitals.filter(h=>(h.name.toLowerCase().includes(q)||h.code.toLowerCase().includes(q))&&(s==='all'||h.status.toLowerCase()===s));
 rows.innerHTML=list.map((h,i)=>`<tr><td><div class="hospital-name"><i data-lucide="building-2"></i><div><strong>${h.name}</strong><small>${h.code}</small></div></div></td><td><span class="status ${h.status.toLowerCase()}">${h.status}</span></td><td><div class="file-cell"><span>${h.date}</span><small>${h.file}</small></div></td><td>${h.records}</td><td><div class="rate"><span>${h.rate===null?'-':h.rate.toFixed(1)+'%'}</span><div class="bar"><i style="width:${h.rate||0}%"></i></div></div></td><td><div class="table-actions"><button title="View" data-view="${h.code}"><i data-lucide="${h.status==='Running'?'square':'eye'}"></i></button>${h.status!=='Running'?'<button title="Download"><i data-lucide="download"></i></button>':''}<button title="More"><i data-lucide="more-vertical"></i></button></div></td></tr>`).join('');
 document.querySelector('#resultCount').textContent=`Showing 1–${list.length} of ${hospitals.length} hospitals`; lucide.createIcons();
}
function renderActivity(){document.querySelector('#activityList').innerHTML=activities1.map(a=>`<div class="activity-item"><div class="activity-icon ${a[0]}"><i data-lucide="${a[1]}"></i></div><div><strong>${a[2]}</strong><span>${a[3]}</span><small>${a[4]}</small></div></div>`).join('')}
function showToast(message){const t=document.querySelector('#toast');t.textContent=message;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2200)}
search.addEventListener('input',renderRows);status.addEventListener('change',renderRows);
document.querySelector('#menuButton').addEventListener('click',()=>document.querySelector('#sidebar').classList.toggle('open'));
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{const action=button.dataset.action;if(action==='upload')document.querySelector('#fileInput').click();else showToast(action==='reconcile'?'Reconciliation queued successfully.':action==='report'?'Report generation started.':'Template download started.')}));
document.querySelector('#fileInput').addEventListener('change',e=>e.target.files[0]&&showToast(`${e.target.files[0].name} selected for upload.`));
const backdrop=document.querySelector('#modalBackdrop');
function closeModal(){backdrop.hidden=true}
document.querySelector('#addHospital').addEventListener('click',()=>backdrop.hidden=false);document.querySelector('#closeModal').addEventListener('click',closeModal);document.querySelector('#cancelModal').addEventListener('click',closeModal);backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeModal()});
document.querySelector('#hospitalForm').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);hospitals.unshift({name:data.get('name'),code:data.get('code').toUpperCase(),status:'Running',date:'Just now',file:'Waiting for source file',records:'0',rate:null});e.currentTarget.reset();closeModal();renderRows();showToast('Hospital added.');});
document.addEventListener('click',e=>{const button=e.target.closest('[data-view]');if(button)showToast(`Opening ${button.dataset.view} details.`)});
renderActivity();renderRows();lucide.createIcons();



