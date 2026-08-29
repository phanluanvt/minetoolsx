const $=id=>document.getElementById(id);
const input=$("username"),grab=$("grab"),statusEl=$("status"),box=$("viewer"),download=$("download"),downloadHead=$("downloadHead"),avatar=$("avatar"),front=$("frontRender"),back=$("backRender"),head=$("headRender"),capeBox=$("showCape"),elytraBox=$("showElytra"),capeStatus=$("capeStatus");
let viewer=null,current=null,walking=true,rotating=true;
function setStatus(msg,type=""){statusEl.textContent=msg;statusEl.className="status "+type}
function mcHeads(path,name){return "https://mc-heads.net/"+path+"/"+encodeURIComponent(name)}
function initViewer(skinUrl){
 if(!viewer){box.innerHTML="";const canvas=document.createElement("canvas");viewer=new skinview3d.SkinViewer({canvas,width:380,height:440,skin:skinUrl});box.appendChild(canvas);viewer.zoom=.86;viewer.fov=52;viewer.animation=new skinview3d.WalkingAnimation();viewer.animation.speed=.35;viewer.autoRotate=true;viewer.autoRotateSpeed=.5}
 else viewer.loadSkin(skinUrl);
}
async function loadProfile(name){
 name=(name||"").trim();
 if(!/^[A-Za-z0-9_]{1,16}$/.test(name)){setStatus("Enter a valid Minecraft Java username (1–16 letters, numbers or underscores).","error");return}
 setStatus("Looking up "+name+"…");grab.disabled=true;
 try{
   const res=await fetch("/api/profile/"+encodeURIComponent(name));
   if(!res.ok)throw new Error(res.status===404?"Minecraft player not found.":"Profile lookup failed.");
   const p=await res.json();current=p;
   $("profileName").textContent=p.name||name;$("profileUuid").textContent=p.id||"—";$("profileModel").textContent=p.model||"classic";$("profileCape").textContent=p.capeUrl?"Available":"None found";
   avatar.src=mcHeads("avatar",p.name||name);front.src=mcHeads("body",p.name||name)+"/300";back.src=mcHeads("body",p.name||name)+"/300?direction=back";head.src=mcHeads("head",p.name||name)+"/220";
   const skin=p.skinUrl||mcHeads("skin",p.name||name);initViewer(skin);
   if(viewer&&p.capeUrl){await viewer.loadCape(p.capeUrl);capeBox.disabled=false;elytraBox.disabled=false;capeStatus.textContent="Cape found — toggle cape or elytra.";try{viewer.playerObject.backEquipment="cape";capeBox.checked=true}catch(e){}}
   else{capeBox.checked=false;elytraBox.checked=false;capeBox.disabled=true;elytraBox.disabled=true;capeStatus.textContent="No official cape found for this profile."}
   download.href=mcHeads("skin",p.name||name);download.download=(p.name||name)+"-skin.png";downloadHead.href=mcHeads("head",p.name||name)+"/220";downloadHead.download=(p.name||name)+"-head.png";
   setStatus("Loaded "+(p.name||name)+" successfully.","ok");
 }catch(err){setStatus(err.message||"Could not load this player.","error")}
 finally{grab.disabled=false}
}
grab.addEventListener("click",()=>loadProfile(input.value));input.addEventListener("keydown",e=>{if(e.key==="Enter")loadProfile(input.value)});
$("copyUuid").addEventListener("click",()=>{if(current?.id){navigator.clipboard.writeText(current.id);setStatus("UUID copied.","ok")}});
$("autoRotate").addEventListener("click",()=>{rotating=!rotating;viewer&&(viewer.autoRotate=rotating);$("autoRotate").classList.toggle("active",rotating)});
$("walkToggle").addEventListener("click",()=>{walking=!walking;if(viewer)viewer.animation=walking?new skinview3d.WalkingAnimation():null;$("walkToggle").classList.toggle("active",walking)});
$("resetView").addEventListener("click",()=>{if(viewer){viewer.zoom=.86;viewer.fov=52;try{viewer.playerObject.rotation.y=0}catch(e){}}});
capeBox.addEventListener("change",()=>{if(!viewer||!current?.capeUrl)return;try{viewer.playerObject.backEquipment=capeBox.checked?"cape":null}catch(e){}if(capeBox.checked)elytraBox.checked=false});
elytraBox.addEventListener("change",()=>{if(!viewer||!current?.capeUrl)return;try{viewer.playerObject.backEquipment=elytraBox.checked?"elytra":null}catch(e){}if(elytraBox.checked)capeBox.checked=false});
loadProfile("Notch");