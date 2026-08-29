
function copyText(id){
  const el=document.getElementById(id);
  const text=("value" in el)?el.value:el.textContent;
  navigator.clipboard.writeText(text).then(()=>{const old=el.dataset.copied||"";});
}
function escJson(s){return String(s||"").replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n")}
