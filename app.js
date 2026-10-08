// 教学阶段快照：本阶段仅包含已列出的功能实现。
/* PickStar: classic script supports Chrome file:// without a server. */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const areas=['图书馆','教学区','生活区','运动场','北门'];
const categories=['电子产品','证件卡包','钥匙','书籍文具','衣物配饰','其他'];
const labels={seeking:'寻找中',claimed:'待认领',found:'已找回',returned:'已归还'};
const coords={'图书馆':[68,39],'教学区':[60,27],'生活区':[28,56],'运动场':[50,80],'北门':[72,12]};
const pages={home:'01 天枢·星图首页',map:'02 校园星图',search:'03 天璇·寻觅星点',detail:'04 天玑·观星识物',publish:'05 天权·登记星启',success:'06 星启发布成功',profile:'07 我的星册',bind:'08 绑定手机',verify:'09 校园实名认证',progress:'10 认证进度与结果',return:'11 开阳·星物归还',thanks:'12 摇光·赠玫瑰致谢'};
const slogans=[['Pick the lost stars, send roses in return.','拾起散落星辰，归还赠以玫瑰。'],['PickStar · Retrieve your lost star.','PickStar · 寻回属于你的星辰。'],['Pick a star, reunite belongings.','拾取星光，物归原主。']];
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const seed=[];
function read(key,fallback){return fallback}
let items=read('pickstar-v2-items',seed), user=read('pickstar-v2-user',{bound:false,phone:'',verification:'none'});
if(!Array.isArray(items))items=seed;if(!user||typeof user!=='object')user={bound:false,phone:'',verification:'none'};
const accountNames=['Nova','小面包','星星同学'];
let activeAccount=read('pickstar-active-account','Nova');
if(!accountNames.includes(activeAccount))activeAccount='Nova';
const storedAccounts=read('pickstar-accounts',{});
const accounts=Object.fromEntries(accountNames.map(name=>[name,storedAccounts?.[name]|| (name==='Nova'?user:{bound:false,phone:'',verification:'none'})]));
user=accounts[activeAccount];
const accountDrafts={};
function isOwner(item){return item.publisher===activeAccount}
function recipientOf(item){return item.recipient==='me'?'Nova':item.recipient}

// Add supplied photos to existing demo records without resetting saved status or user uploads.
let route='home',selected='s1',mapMode='browse',backTo='profile',draft={},filter={keyword:'',category:'',area:'',date:'',status:''},codeSent=false;
function save(){accounts[activeAccount]=user;return true}
function modal(title,body){$('#modal-body').innerHTML=`<h2>${title}</h2>${body}`;if(!$('#modal').open)$('#modal').showModal()}
const star=(status,extra='')=>`<span class="star ${status} ${extra}" aria-label="${labels[status]}">✦</span>`;
const button=(text,go,cls='')=>`<button class="${cls}" data-go="${go}">${text}</button>`;
const dipper=`<svg class="dipper" viewBox="0 0 330 185" aria-hidden="true"><path d="M20 140 L80 110 L140 120 L188 84 L240 100 L290 45 L235 20 L188 84" fill="none" stroke="#9b91c9" stroke-width="1.5" stroke-dasharray="4 5"/>${[[20,140],[80,110],[140,120],[188,84],[240,100],[290,45],[235,20]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="#b4a2dc"/><text x="${x-8}" y="${y+7}" fill="#a99cd1" font-size="25">✧</text>`).join('')}</svg>`;
function hero(title,index=0){return `<section class="hero">${dipper}<div class="eyebrow">PICKSTAR / FOLLOW THE BIG DIPPER</div><h1>${title}</h1><p class="english">${slogans[index][0]}</p><p class="art">${slogans[index][1]}</p></section>`}
function options(list,value,first='全部'){return `<option value="">${first}</option>`+list.map(x=>`<option ${value===x?'selected':''}>${esc(x)}</option>`).join('')}
function current(){return items.find(x=>x.id===selected)||items[0]}
function render(){const x=current();let html='';
 if(route==='home')html=hero('天枢 · 星图首页')+`<section class="panel"><h2>让遗失的星星找到归途</h2><p>本阶段完成页面布局与导航。地图、便签和业务逻辑会在后续阶段逐项加入。</p></section>`;
 if(!html)html=hero(pages[route]||'拾星')+'<section class="panel"><p>本教学阶段尚未实现此功能，请按阶段说明继续学习。</p></section>';
 $('#app').innerHTML=html;document.title=`${pages[route]} · 拾星`;}
function verificationName(){return '尚未加入认证功能'}
function canThank(){return false}
function go(page){if(!pages[page])page='home';route=page;render();window.scrollTo(0,0)}
function captureDraft(){const form=$('[data-form="publish"]');if(form){const data=Object.fromEntries(new FormData(form));delete data.photo;draft={...draft,...data};}}
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.go){$('#modal').close();go(b.dataset.go);return}if(b.dataset.item){selected=b.dataset.item;go('detail');return}
 if(b.dataset.pin){const x=items.find(i=>i.id===b.dataset.pin);modal(`${star(x.status)} ${esc(x.title)}`,`<p>${esc(x.area)} · ${labels[x.status]}</p><p>${esc(x.description)}</p><button data-preview="${esc(x.id)}">查看详情</button>`);return}
 if(b.dataset.preview){selected=b.dataset.preview;$('#modal').close();go('detail');return}
 const a=b.dataset.action;
});
document.addEventListener('submit',e=>{const form=e.target,kind=form.dataset.form;if(!kind)return;e.preventDefault();const d=Object.fromEntries(new FormData(form));
});
const navigationStars=[
 ['home','天枢','星图首页',86,25],['search','天璇','寻觅星点',78,66],
 ['detail','天玑','观星识物',57,61],['publish','天权','登记星启',53,20],
 ['profile','玉衡','我的星册',36,32],['return','开阳','星物归还',22,55],
 ['thanks','摇光','赠玫瑰致谢',8,43]
];
// 连线和按钮共用同一组坐标，星点的中心即连线顶点。
const navigationPath=[0,1,2,3,0,3,4,5,6].map((index,i)=>`${i?'L':'M'}${navigationStars[index][3]} ${navigationStars[index][4]}`).join(' ');
$('#page-links').innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${navigationPath}"/></svg>`+navigationStars.map(([page,name,label,left,top])=>`<button class="nav-star" data-go="${page}" style="left:${left}%;top:${top}%" aria-label="${name}·${label}"><span class="nav-star-icon" aria-hidden="true">✦</span><span class="nav-star-label">${name} · ${label}</span></button>`).join('');
window.addEventListener('hashchange',()=>go(location.hash.slice(1)));go(pages[location.hash.slice(1)]?location.hash.slice(1):'home');
