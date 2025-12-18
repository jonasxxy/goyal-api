<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Goyal Boarding House</title>
<style>
body { font-family: Arial; padding:20px; background:#f4f6f8; }

.nav {
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:15px;
}

.nav a {
    text-decoration:none;
    background:#007bff;
    color:white;
    padding:8px 12px;
    border-radius:4px;
    font-size:14px;
}

button { padding: 5px 10px; margin:2px; cursor:pointer; border:none; border-radius:3px; }
table { width:100%; border-collapse: collapse; margin-top:10px; background:white; }
th, td { border:1px solid #ddd; padding:8px; text-align:center; }
th { background:#f0f0f0; }

.modal {
    display: none;  
    position: fixed;
    top:0; left:0;
    width:100%; height:100%;
    background: rgba(0,0,0,0.5);
    align-items: center;
    justify-content: center;
    z-index:1000;
}
.modal-content {
    background:white;
    width:350px;
    padding:20px;
    border-radius:5px;
    text-align:center;
}
input {
    width: 90%;
    padding: 8px;
    margin: 5px 0;
}
.cancel { background:#ccc; }
.edit-btn { background:#4CAF50; color:white; }
.delete-btn { background:#f44336; color:white; }
</style>
</head>
<body>

 <div class="nav">
    <h1>Goyal Boarding House</h1>
    <a href="docs.html">API Documentation</a>
</div>

<button onclick="openForm()">Add Tenant</button>

<table>
<thead>
<tr>
<th>ID</th>
<th>Name</th>
<th>Room</th>
<th>Contact</th>
<th>Rent</th>
<th>Actions</th>
</tr>
</thead>
<tbody id="tenantTable"></tbody>
</table>

 <div class="modal" id="formModal">
<div class="modal-content">
<h2 id="modalTitle">Add Tenant</h2>
<input type="hidden" id="tenantId">
<input id="name" placeholder="Full Name">
<input id="room" placeholder="Room Number">
<input id="contact" placeholder="Contact">
<input id="rent" placeholder="Monthly Rent">
<br><br>
<button onclick="saveTenant()">Save</button>
<button class="cancel" onclick="closeForm()">Cancel</button>
</div>
</div>

 <div class="modal" id="deleteModal">
<div class="modal-content">
<p>Delete this tenant?</p>
<button id="confirmDelete">Yes</button>
<button class="cancel" onclick="closeDeleteModal()">No</button>
</div>
</div>

<script>
const API = "/api/tenants";

const tenantTable = document.getElementById("tenantTable");
const name = document.getElementById("name");
const room = document.getElementById("room");
const contact = document.getElementById("contact");
const rent = document.getElementById("rent");
const tenantId = document.getElementById("tenantId");
const modalTitle = document.getElementById("modalTitle");

let deleteTenantId = null;

function loadTenants() {
fetch(API)
.then(res => res.json())
.then(data => {
tenantTable.innerHTML = "";
data.forEach(t => {
tenantTable.innerHTML += `
<tr>
<td>${t.id}</td>
<td>${t.name}</td>
<td>${t.room_number}</td>
<td>${t.contact}</td>
<td>${t.monthly_rent}</td>
<td>
<button class="edit-btn" onclick="editTenant(${t.id},'${t.name}','${t.room_number}','${t.contact}',${t.monthly_rent})">Edit</button>
<button class="delete-btn" onclick="openDeleteModal(${t.id})">Delete</button>
</td>
</tr>`;
});
});
}

function openForm(){
document.getElementById("formModal").style.display="flex";
modalTitle.innerText="Add Tenant";
tenantId.value="";
}
function closeForm(){
document.getElementById("formModal").style.display="none";
clearForm();
}
function clearForm(){
name.value=room.value=contact.value=rent.value="";
}

function saveTenant(){
const tenant={
name:name.value,
room_number:room.value,
contact:contact.value,
monthly_rent:Number(rent.value)
};
const method = tenantId.value ? "PUT":"POST";
const url = tenantId.value ? `${API}/${tenantId.value}`:API;

fetch(url,{
method,
headers:{"Content-Type":"application/json"},
body:JSON.stringify(tenant)
}).then(()=>{closeForm();loadTenants();});
}

function editTenant(id,n,r,c,rentVal){
openForm();
modalTitle.innerText="Edit Tenant";
tenantId.value=id;
name.value=n;
room.value=r;
contact.value=c;
rent.value=rentVal;
}

function openDeleteModal(id){
deleteTenantId=id;
document.getElementById("deleteModal").style.display="flex";
}
function closeDeleteModal(){
document.getElementById("deleteModal").style.display="none";
deleteTenantId=null;
}
document.getElementById("confirmDelete").onclick=()=>{
fetch(`${API}/${deleteTenantId}`,{method:"DELETE"})
.then(()=>{closeDeleteModal();loadTenants();});
};

loadTenants();
</script>
</body>
</html>
