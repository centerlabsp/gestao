import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, onSnapshot, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA3Xg_0LLGDVeRv5jVGnSFESc8I4Z1fsA8",
    authDomain: "projeto-atellica.firebaseapp.com",
    projectId: "projeto-atellica",
    storageBucket: "projeto-atellica.firebasestorage.app",
    messagingSenderId: "422526536640",
    appId: "1:422526536640:web:0afcb40f3e79ccf93e9625"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const boardRef = doc(db, "scrum_board", "agendamentos_db");

let currentCardsData = [];
let showingArchived = false;
let activeRegionFilter = "TODAS";
let currentEditingId = null;

// --- LISTA DE TÉCNICOS ---
const techniciansList = {
    "TÉCNICO SP": ["Daniel Ourique", "Daniel Serrano", "Eduardo Rafael", "Fabio Mazine", "Guilherme Yoshida", "Matheus Pereira", "Oseias Barbosa", "Rafael Rodrigues", "Robson Miranda", "Rubens Emerson", "Vanleno Câmara", "Wesley Monteiro"].sort(),
    "TÉCNICO RP": ["Alexandre Chiang", "Fred Shigeyo", "Mário Luiz", "Rafael Aihara", "Rainan Hanzi"],
    "TÉCNICO RS": ["Adilson Domingues", "Nilton Cesar Alves"],
    "TÉCNICO MINAS GERAIS": ["Fabricio Vallin"],
    "TÉCNICO GOIÁS": ["Luiz Bonazza"],
    "TÉCNICO OUTROS": ["OUTROS"]
};

const techPhones = {
    "Daniel Ourique": "5511999192506", "Daniel Serrano": "5511947243198", "Eduardo Rafael": "5511971267829",
    "Guilherme Yoshida": "5511947596822", "Matheus Pereira": "5511922280926", "Rafael Rodrigues": "5511947249934",
    "Robson Miranda": "5511932735459", "Rubens Emerson": "5511911533964", "Alexandre Chiang": "5511911534018",
    "Fred Shigeyo": "5511944880158", "Mário Luiz": "5511942368827", "Rafael Aihara": "5516997725520",
    "Rainan Hanzi": "5511930966411", "Adilson Domingues": "5511941978167", "Nilton Cesar Alves": "5516997355896",
    "Fabricio Vallin": "553192750275", "Luiz Bonazza": "556793227629", "Wesley Monteiro": "5511941227458",
    "Vanleno Câmara": "5511995488512", "Oseias Barbosa": "5511919120197", "Fabio Mazine": "5511957760321"
};

// --- FUNÇÕES DE EDIÇÃO E MODAL ---
window.openEditModal = function(id) {
    const card = currentCardsData.find(c => c.id === id);
    if (!card) return;
    currentEditingId = id;
    document.getElementById('modClient').value = card.client || "";
    document.getElementById('modCity').value = card.city || "";
    document.getElementById('modOs').value = card.osNum || "";
    document.getElementById('modMachine').value = card.machine || "";
    document.getElementById('modSn').value = card.sn || "";
    document.getElementById('modRegion').value = card.region || "";
    document.getElementById('editModal').style.display = 'flex';
};

window.closeEditModal = function() {
    document.getElementById('editModal').style.display = 'none';
    currentEditingId = null;
};

window.saveEditModal = function() {
    const idx = currentCardsData.findIndex(c => c.id === currentEditingId);
    if (idx > -1) {
        currentCardsData[idx].client = document.getElementById('modClient').value;
        currentCardsData[idx].city = document.getElementById('modCity').value;
        currentCardsData[idx].osNum = document.getElementById('modOs').value;
        currentCardsData[idx].machine = document.getElementById('modMachine').value;
        currentCardsData[idx].sn = document.getElementById('modSn').value;
        currentCardsData[idx].region = document.getElementById('modRegion').value;
        saveToCloud();
        window.closeEditModal();
    }
};

// --- FUNÇÃO PARA ATUALIZAR CAMPOS E STATUS AUTOMÁTICO ---
window.updateCardData = function(id, field, value) {
    const idx = currentCardsData.findIndex(c => c.id === id);
    if (idx > -1) {
        currentCardsData[idx][field] = value;
        
        // Lógica de transição automática de data
        if (field === 'dateSched' && value !== "" && currentCardsData[idx].manualStatus === "NÃO INICIADO") {
            currentCardsData[idx].manualStatus = "EM ANDAMENTO";
        }
        
        currentCardsData[idx].lastUpdated = new Date().toLocaleString('pt-BR');
        saveToCloud();
    }
};

window.updateStatus = function(id, newStatus) {
    const idx = currentCardsData.findIndex(c => c.id === id);
    if (idx > -1) {
        currentCardsData[idx].manualStatus = newStatus;
        currentCardsData[idx].lastUpdated = new Date().toLocaleString('pt-BR');
        saveToCloud();
    }
};

window.addNewCard = function() {
    const machine = document.getElementById('machineType').value;
    const client = document.getElementById('clientName').value;
    const dateSched = document.getElementById('schedDate').value;
    if (!machine || !client) { alert("Preencha Equipamento e Cliente!"); return; }

    const newCard = {
        id: 'agenda-' + Date.now(),
        machine,
        sn: document.getElementById('snField').value,
        osNum: document.getElementById('osField').value,
        client,
        city: document.getElementById('clientCity').value,
        serviceType: document.getElementById('serviceType').value,
        region: document.getElementById('serviceRegion').value,
        dateReq: document.getElementById('reqDate').value,
        dateSched: dateSched,
        desc: document.getElementById('descField').value,
        tech: "",
        manualStatus: (dateSched !== "") ? "EM ANDAMENTO" : "NÃO INICIADO",
        isArchived: false,
        lastUpdated: new Date().toLocaleString('pt-BR'),
        comments: []
    };

    currentCardsData.push(newCard);
    saveToCloud();
    clearInputs();
};

window.renderBoard = function() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const lists = {
        "NÃO INICIADO": document.getElementById('list-nao-iniciado'),
        "EM ANDAMENTO": document.getElementById('list-em-andamento'),
        "CONCLUÍDO": document.getElementById('list-concluido')
    };

    Object.values(lists).forEach(l => l.innerHTML = '');
    
    currentCardsData.forEach(c => {
        const matchesSearch = (c.client + c.machine + c.sn + c.tech).toLowerCase().includes(searchTerm);
        if (matchesSearch && c.isArchived === showingArchived) {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.innerHTML = `
                <div class="card-status-header">
                    <div class="status-tags">
                        <span class="st-tag ${c.manualStatus==='NÃO INICIADO'?'active-ni':''}" onclick="window.updateStatus('${c.id}', 'NÃO INICIADO')">N.I</span>
                        <span class="st-tag ${c.manualStatus==='EM ANDAMENTO'?'active-and':''}" onclick="window.updateStatus('${c.id}', 'EM ANDAMENTO')">ANDAM.</span>
                        <span class="st-tag ${c.manualStatus==='CONCLUÍDO'?'active-con':''}" onclick="window.updateStatus('${c.id}', 'CONCLUÍDO')">CONCL.</span>
                    </div>
                    <button class="edit-pencil" onclick="window.openEditModal('${c.id}')">✎</button>
                </div>

                <div class="card-client">${c.client}</div>
                <div class="card-info-compact"><strong>${c.machine}</strong> <span class="sn-text">SN: ${c.sn}</span></div>
                
                <div class="badge-group">
                    <span class="mini-badge bg-region">${c.region || 'SEM REGIÃO'}</span>
                    <span class="mini-badge bg-service">${c.serviceType}</span>
                    ${c.osNum ? `<span class="mini-badge bg-os">OS: ${c.osNum}</span>` : ''}
                </div>

                <div class="card-dates-row">
                    <div class="date-item"><label>Sol.</label><input type="date" value="${c.dateReq}" onchange="window.updateCardData('${c.id}', 'dateReq', this.value)"></div>
                    <div class="date-item"><label>Agend.</label><input type="date" value="${c.dateSched}" onchange="window.updateCardData('${c.id}', 'dateSched', this.value)"></div>
                </div>

                <div class="tech-row-compact">
                    <select onchange="window.updateCardData('${c.id}', 'tech', this.value)">
                        ${getTechSelectHTML(c.tech)}
                    </select>
                    <button class="btn-wa-compact" onclick="window.sendTechMsg('${c.id}')">📱</button>
                </div>

                <div class="comments-compact">
                    <div class="comm-in-row">
                        <input type="text" id="comm-in-${c.id}" placeholder="Nota...">
                        <button onclick="window.addAgendaComment('${c.id}')">💾</button>
                    </div>
                </div>
                ${c.manualStatus === 'CONCLUÍDO' && !c.isArchived ? `<button class="btn-archive-compact" onclick="window.archiveCard('${c.id}')">📦 Arquivar</button>` : ''}
            `;
            lists[c.manualStatus].appendChild(cardEl);
        }
    });
    document.getElementById('cardCount').innerText = currentCardsData.filter(c => !c.isArchived).length + " registros";
};

// Funções de filtro, whatsapp e cloud permanecem as mesmas
window.setRegionFilter = (r, b) => { activeRegionFilter = r; window.renderBoard(); };
window.filterCards = () => window.renderBoard();
window.toggleArchiveView = function() {
    showingArchived = !showingArchived;
    const btn = document.getElementById('archiveToggleBtn');
    btn.innerText = showingArchived ? "🔙 Ver Board Ativo" : "📦 Ver Arquivados";
    window.renderBoard();
};
window.archiveCard = function(id) {
    const idx = currentCardsData.findIndex(c => c.id === id);
    if (idx > -1) { currentCardsData[idx].isArchived = true; saveToCloud(); }
};
window.sendTechMsg = function(id) {
    const card = currentCardsData.find(c => c.id === id);
    if (!card || !card.tech) { alert("Selecione um técnico."); return; }
    const phone = techPhones[card.tech];
    const msg = `Olá *${card.tech}*, agendamento:\n*Cliente:* ${card.client}\n*Equipamento:* ${card.machine}\n*S/N:* ${card.sn}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
};
window.addAgendaComment = function(cardId) {
    const input = document.getElementById(`comm-in-${cardId}`);
    const text = input.value.trim();
    if (!text) return;
    const idx = currentCardsData.findIndex(c => c.id === cardId);
    if (idx > -1) {
        if (!currentCardsData[idx].comments) currentCardsData[idx].comments = [];
        currentCardsData[idx].comments.push({ text, time: new Date().toLocaleString('pt-BR') });
        input.value = '';
        saveToCloud();
    }
};

function getTechSelectHTML(sel) {
    let h = '<option value="">Técnico...</option>';
    for (const [reg, techs] of Object.entries(techniciansList)) {
        h += `<optgroup label="${reg}">`;
        techs.forEach(t => h += `<option value="${t}" ${sel === t ? 'selected' : ''}>${t}</option>`);
        h += `</optgroup>`;
    }
    return h;
}

async function saveToCloud() {
    document.getElementById('status-indicator').innerText = "Salvando... 🟠";
    try {
        await updateDoc(boardRef, { cards: currentCardsData });
    } catch (e) { console.error(e); }
}

function clearInputs() {
    ['snField', 'osField', 'clientName', 'clientCity', 'reqDate', 'schedDate', 'descField'].forEach(i => document.getElementById(i).value = '');
}

onSnapshot(boardRef, (snap) => {
    if (snap.exists()) {
        currentCardsData = snap.data().cards || [];
        document.getElementById('status-indicator').innerText = "Online 🟢";
        window.renderBoard();
    }
});