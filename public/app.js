const API = "/api/tenants";
const tenantTable = document.getElementById("tenantTable");
const name = document.getElementById("name");
const room = document.getElementById("room");
const contact = document.getElementById("contact");
const rent = document.getElementById("rent");
const tenantId = document.getElementById("tenantId");
const modalTitle = document.getElementById("modalTitle");

function loadTenants() {
    fetch(API)
    .then(res => res.json())
    .then(data => {
        tenantTable.innerHTML = "";
        if (!Array.isArray(data)) data = [data];  
        data.forEach(t => {
            tenantTable.innerHTML += `
            <tr>
                <td>${t.id}</td>
                <td>${t.name}</td>
                <td>${t.room_number}</td>
                <td>${t.contact}</td>
                <td>${t.monthly_rent}</td>
                <td>
                    <button onclick="editTenant(${t.id},'${t.name}','${t.room_number}','${t.contact}',${t.monthly_rent})">Edit</button>
                    <button onclick="deleteTenant(${t.id})">Delete</button>
                </td>
            </tr>`;
        });
    })
    .catch(err => console.error("Error loading tenants:", err));
}

function openForm() { document.getElementById("formModal").style.display="block"; modalTitle.innerText="Add Tenant"; tenantId.value=""; }
function closeForm() { document.getElementById("formModal").style.display="none"; clearForm(); }
function showAlert(msg){ document.getElementById("alertMsg").innerText=msg; document.getElementById("alertModal").style.display="block"; }
function closeAlert(){ document.getElementById("alertModal").style.display="none"; }

function saveTenant(){
    const tenant = {
        name: name.value.trim(),
        room_number: room.value.trim(),
        contact: contact.value.trim(),
        monthly_rent: Number(rent.value)
    };
    if(!tenant.name || !tenant.room_number || !tenant.contact || !tenant.monthly_rent){
        showAlert(" Please fill all fields");
        return;
    }

    const method = tenantId.value ? "PUT" : "POST";
    const url = tenantId.value ? `${API}/${tenantId.value}` : API;

    fetch(url, {
        method,
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(tenant)
    })
    .then(res=>res.json())
    .then(()=>{ 
        showAlert(" Tenant saved"); 
        closeForm(); 
        loadTenants(); 
    })
    .catch(()=>showAlert("Error saving tenant"));
}

function editTenant(id,nameVal,roomVal,contactVal,rentVal){
    openForm();
    modalTitle.innerText="Update Tenant";
    tenantId.value=id;
    name.value=nameVal;
    room.value=roomVal;
    contact.value=contactVal;
    rent.value=rentVal;
}

function deleteTenant(id){
    if(!confirm("Delete this tenant?")) return;
    fetch(`${API}/${id}`,{method:"DELETE"})
    .then(()=>{ showAlert("🗑 Tenant deleted"); loadTenants(); })
    .catch(()=>showAlert(" Delete failed"));
}

function clearForm(){ name.value=room.value=contact.value=rent.value=""; }

 loadTenants();
