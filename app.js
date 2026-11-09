const INGREDIENTS = {
  "Mäso a ryby": ["Kuracie prsia","Kuracie stehná","Morčacie mäso","Bravčové mäso","Hovädzie mäso","Mleté mäso","Slanina","Šunka","Klobása","Párky","Tuniak","Losos","Treska","Sardinky"],
  "Mliečne výrobky a vajcia": ["Mlieko","Maslo","Smotana na varenie","Smotana na šľahanie","Biely jogurt","Grécky jogurt","Tvrdý syr","Mozzarella","Parmezán","Tvaroh","Bryndza","Vajcia"],
  "Zelenina a huby": ["Zemiaky","Cibuľa","Cesnak","Mrkva","Petržlen","Zeler","Pór","Paprika","Paradajky","Cherry paradajky","Uhorka","Cuketa","Baklažán","Brokolica","Karfiol","Špenát","Šalát","Kapusta","Kyslá kapusta","Kukurica","Hrášok","Fazuľa","Šampiňóny","Huby"],
  "Ovocie": ["Jablká","Banány","Hrušky","Jahody","Maliny","Čučoriedky","Citrón","Pomaranč"],
  "Prílohy a pečivo": ["Ryža","Cestoviny","Špagety","Múka hladká","Múka polohrubá","Múka hrubá","Strúhanka","Ovsené vločky","Kuskus","Bulgur","Quinoa","Chlieb","Toastový chlieb","Tortilla","Listové cesto","Lístkové cesto","Zemiakové gnocchi"],
  "Ostatné": ["Olej","Olivový olej","Ocot","Soľ","Čierne korenie","Sladká paprika","Údená paprika","Kari korenie","Rasca","Majorán","Oregano","Bazalka","Škorica","Cukor","Práškový cukor","Med","Džem","Paradajkový pretlak","Kečup","Horčica","Majonéza","Sóda bikarbóna","Prášok do pečiva","Droždie","Kakao","Čokoláda","Kokos","Orechy","Vlašské orechy","Mandle","Vývar","Kokosové mlieko","Sója omáčka"]
};
const ALL_INGREDIENTS = Object.values(INGREDIENTS).flat();
const DEFAULT_RECIPES = [
 {id:"r1",name:"Kuracie rizoto",category:"Hlavné jedlo",ingredients:["Kuracie prsia","Ryža","Cibuľa","Cesnak","Mrkva","Olej","Soľ","Čierne korenie"]},
 {id:"r2",name:"Špagety s paradajkovou omáčkou",category:"Hlavné jedlo",ingredients:["Špagety","Paradajky","Cesnak","Cibuľa","Olivový olej","Oregano","Parmezán"]},
 {id:"r3",name:"Zemiaková polievka",category:"Polievka",ingredients:["Zemiaky","Mrkva","Petržlen","Cibuľa","Cesnak","Smotana na varenie","Majorán"]},
 {id:"r4",name:"Palacinky",category:"Koláč",ingredients:["Mlieko","Vajcia","Múka hladká","Cukor","Olej","Džem"]},
 {id:"r5",name:"Pečené zemiaky s kuracím mäsom",category:"Hlavné jedlo",ingredients:["Zemiaky","Kuracie stehná","Olej","Sladká paprika","Soľ","Čierne korenie"]},
 {id:"r6",name:"Cesnačka",category:"Polievka",ingredients:["Zemiaky","Cesnak","Cibuľa","Vývar","Soľ","Čierne korenie","Chlieb"]},
 {id:"r7",name:"Jablkový koláč",category:"Koláč",ingredients:["Jablká","Múka polohrubá","Vajcia","Maslo","Cukor","Škorica","Prášok do pečiva"]},
 {id:"r8",name:"Tuniakové cestoviny",category:"Hlavné jedlo",ingredients:["Cestoviny","Tuniak","Cibuľa","Cesnak","Paradajkový pretlak","Olivový olej"]}
];
const $ = id => document.getElementById(id);
const STORAGE_KEY = "moje-recepty-v1";
let recipes = loadRecipes(), selected = new Set(), activeCategory = "Všetky", showAll = false, chosen = new Set();

function loadRecipes(){try{const raw=localStorage.getItem(STORAGE_KEY);return raw?JSON.parse(raw):DEFAULT_RECIPES.slice()}catch{return DEFAULT_RECIPES.slice()}}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(recipes))}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderPantry(){
 const q=$("ingredientSearch").value.trim().toLocaleLowerCase("sk");
 $("ingredientGroups").innerHTML=Object.entries(INGREDIENTS).map(([group,items])=>{
  const filtered=items.filter(x=>x.toLocaleLowerCase("sk").includes(q));
  if(!filtered.length)return "";
  return `<div class="ingredient-group"><h3>${esc(group)}</h3><div class="ingredient-grid">${filtered.map(x=>`<label class="ingredient-option"><input type="checkbox" data-pantry="${esc(x)}" ${selected.has(x)?"checked":""}>${esc(x)}</label>`).join("")}</div></div>`;
 }).join("");
 $("selectedCount").textContent=`${selected.size} surovín vybraných`;
}
function renderRecipes(){
 const sort=$("sortSelect").value;
 let list=recipes.filter(r=>activeCategory==="Všetky"||r.category===activeCategory).map(r=>{
  const have=r.ingredients.filter(i=>selected.has(i)).length, missing=r.ingredients.length-have;
  return {...r,have,missing,percent:r.ingredients.length?Math.round(have/r.ingredients.length*100):0};
 });
 list.sort((a,b)=>sort==="az"?a.name.localeCompare(b.name,"sk"):sort==="missing"?a.missing-b.missing||b.percent-a.percent:b.percent-a.percent||a.missing-b.missing);
 $("recipeCount").textContent=`${list.length} ${list.length===1?"recept":list.length<5?"recepty":"receptov"}`;
 $("recipeList").innerHTML=list.map(r=>`<article class="recipe-card">
  <div class="recipe-card-top"><div><span class="category-tag">${esc(r.category)}</span><h3>${esc(r.name)}</h3></div><span class="match">${r.percent}%</span></div>
  <div class="progress"><span style="width:${r.percent}%"></span></div>
  <div class="recipe-meta"><strong>Máš:</strong> ${r.have} z ${r.ingredients.length} surovín<br><strong class="missing">Chýba:</strong> ${r.missing? r.ingredients.filter(i=>!selected.has(i)).map(esc).join(", "):"nič – môžeš variť!"}</div>
  <div class="card-bottom"><span class="category-tag">${r.ingredients.length} surovín</span><button class="delete-btn" data-delete="${esc(r.id)}">Odstrániť</button></div>
 </article>`).join("");
 $("emptyState").hidden=list.length!==0;
}
function renderAll(){renderPantry();renderRecipes()}
$("ingredientSearch").addEventListener("input",renderPantry);
$("ingredientGroups").addEventListener("change",e=>{const x=e.target.dataset.pantry;if(!x)return;e.target.checked?selected.add(x):selected.delete(x);renderRecipes();$("selectedCount").textContent=`${selected.size} surovín vybraných`});
$("clearIngredients").onclick=()=>{selected.clear();renderAll()};
$("showAllIngredients").onclick=()=>{$("ingredientSearch").value="";renderPantry()};
$("categoryFilters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderRecipes()});
$("sortSelect").onchange=renderRecipes;
$("recipeList").addEventListener("click",e=>{const id=e.target.dataset.delete;if(!id)return;if(confirm("Naozaj chceš odstrániť tento recept?")){recipes=recipes.filter(r=>r.id!==id);save();renderRecipes()}});
const dialog=$("recipeDialog");
function openDialog(){chosen.clear();$("recipeForm").reset();$("recipeIngredientSearch").value="";$("formError").textContent="";renderChoices();renderChosen();dialog.showModal()}
$("addRecipeBtn").onclick=openDialog;
$("closeDialog").onclick=$("cancelDialog").onclick=()=>dialog.close();
function renderChoices(){
 const q=$("recipeIngredientSearch").value.trim().toLocaleLowerCase("sk");
 const items=ALL_INGREDIENTS.filter(x=>x.toLocaleLowerCase("sk").includes(q));
 $("recipeIngredientChoices").innerHTML=items.map(x=>`<label><input type="checkbox" data-choice="${esc(x)}" ${chosen.has(x)?"checked":""}>${esc(x)}</label>`).join("");
}
function renderChosen(){$("chosenIngredients").innerHTML=[...chosen].map(x=>`<span class="chosen-chip">${esc(x)} <button type="button" data-remove-choice="${esc(x)}">×</button></span>`).join("")}
$("recipeIngredientSearch").oninput=renderChoices;
$("recipeIngredientChoices").onchange=e=>{const x=e.target.dataset.choice;if(!x)return;e.target.checked?chosen.add(x):chosen.delete(x);renderChosen()};
$("chosenIngredients").onclick=e=>{const x=e.target.dataset.removeChoice;if(x){chosen.delete(x);renderChoices();renderChosen()}};
$("addCustomIngredient").onclick=()=>{const x=$("customIngredient").value.trim();if(!x)return;chosen.add(x);$("customIngredient").value="";renderChoices();renderChosen()};
$("recipeForm").onsubmit=e=>{
 e.preventDefault();const name=$("recipeName").value.trim();
 if(!name){$("formError").textContent="Zadaj názov receptu.";return}
 if(!chosen.size){$("formError").textContent="Vyber aspoň jednu surovinu.";return}
 recipes.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,category:$("recipeCategory").value,ingredients:[...chosen]});
 save();dialog.close();renderRecipes();
};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(recipes,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="moje-recepty-zaloha.json";a.click();URL.revokeObjectURL(url)};
$("importFile").onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!Array.isArray(data)||!data.every(r=>r.name&&r.category&&Array.isArray(r.ingredients)))throw Error();if(confirm("Import nahradí aktuálny zoznam receptov. Pokračovať?")){recipes=data;save();renderRecipes()}}catch{$("importFile").value="";alert("Súbor nie je platná záloha receptov.")}};
renderAll();
