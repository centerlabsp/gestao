const firebaseConfig = {
    apiKey: 'AIzaSyA3Xg_0LLGDVeRv5jVGnSFESc8I4Z1fsA8',
    authDomain: 'projeto-atellica.firebaseapp.com',
    projectId: 'projeto-atellica',
    storageBucket: 'projeto-atellica.firebasestorage.app',
    messagingSenderId: '422526536640',
    appId: '1:422526536640:web:0afcb40f3e79ccf93e9625'
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const techniciansList = [
    "Alexandre Chiang", "Daniel Ourique", "Fabio Mazine", "Fred Shigeyo",
    "Guilherme Gomes", "Gustavo Castro", "Jonatã Barbosa", "Kleber Cecilio",
    "Márcio Pincinato", "Matheus Pereira", "Oseias Barbosa", "Wesley Monteiro"
];

function populateTechSelects() {
    const allSelects = Array.from(document.querySelectorAll('.tech-select'));
    const headerSelect = document.getElementById('technician');
    if(headerSelect) allSelects.push(headerSelect);
    allSelects.forEach(sel => {
        const currentVal = sel.value;
        sel.innerHTML = '<option value="" selected disabled>-</option>';
        techniciansList.forEach(tech => {
            sel.innerHTML += `<option value="${tech}">${tech}</option>`;
        });
        if(currentVal) sel.value = currentVal;
    });
}

const commonDay0 = { day: 0, title: "Dia 0 - Admin", tasks: ["Recebimento", "Início do Processo Administrativo"] };
const finalizationTask = { title: "Finalização", tasks: ["Fim do Processo Administrativo", "Enviado para Faturamento"] };

const shTasks = [
    commonDay0,
    { day: 1, title: "Dia 1", tasks: ["Conferência e recebimento/ Placa de Patrimônio", "Verificar cabos", "Verificar peças danificadas", "Verificar a estrutura", "Desmontagem das tampas", "Envio de tampas para pintura"] },
    { day: 2, title: "Dia 2", tasks: ["Gavetas de amostra: Limpeza geral", "Limpeza geral do compartimento", "Limpeza da lente das DVSs", "Verificar mecanismo de freio das gavetas"] },
    { day: 3, title: "Dia 3", tasks: ["Compartimento CQCS: Limpeza", "Limpeza das tampas de evaporação", "Verificar quais as tampas do Combo", "Verificar termistores", "Limpeza dos drenos"] },
    { day: 4, title: "Dia 4", tasks: ["ROBOT: Limpar os eixos X/Y/Z dos motores", "Limpar as guias lineares do eixos X/Y", "Revisar o Gantry", "Sistema Elétrico: Verificar condições das placas", "Verificar conexões dos cabos", "Verificar MM Computer", "Limpeza da fonte e UPS e transformador"] },
    { day: 5, title: "Dia 5", tasks: ["Geral: Troca dos filtros de ar", "Montagem dos módulos", "Montagem das tampas", "Limpeza dos FAN's"] },
    { day: 6, title: "Dia 6", tasks: ["Computador/Periféricos: Limpeza do teclado e mouse", "Limpeza de cabos e leitor manual", "Limpeza da impressora", "Limpeza do monitor", "Instalação de Software"] },
    { day: 7, title: "Dia 7", tasks: ["Inicialização: Rotina de inicialização", "Verificar funcionamento dos módulos", "Verificação das temperaturas", "Alinhamentos: Alinhamento do ROBOT", "Alinhamento das DVSs", "Testes Mecânicos: Realizar Autocheck", "Teste de performance do ROBOT"] },
    { day: 8, title: "Dia 8 e 9", tasks: ["Após validação: Realizar o travamento dos mecanismos", "Realizar limpeza do equipamento", "Iniciar Upload dos documentos no Planner", "Embalagem: Embalar os acessórios", "Retirar todo o lixo do equipamento", "Embalar o equipamento", "Identificação do equipamento"] },
    finalizationTask
];

const chTasks = [
    commonDay0,
    { day: 1, title: "Dia 1", tasks: ["Conferência e recebimento - Téc + Patrimônio", "Verificar cabos", "Verificar peças danificadas", "Verificar a estrutura", "Verificar integridade das Tampas / Desmontagem", "Envio de tampas para pintura"] },
    { day: 2, title: "Dia 2", tasks: ["Desmontagem dos módulos", "Limpeza do chassis", "Preparação do chassis", "Pintura do chassis"] },
    { day: 3, title: "Dia 3", tasks: ["Verificar condições das placas", "Verificar conexões dos cabos", "Verificar DCM's e Drives", "Limpeza da fonte e UPS e transformador", "Verificar MM Computer", "Verificar photometer lamp power supply"] },
    { day: 4, title: "Dia 4", tasks: ["Áreas de Compartimento de Reagentes 1 e 2: Limpeza geral"] },
    { day: 5, title: "Dia 5", tasks: ["Verificação dos termistores", "Verificar os sensores", "Verificar TED", "Trocar tubulação do dreno", "Revisar Reagent Loader Arm", "Revisar Manual Load Station", "Probes R1/R2: Revisar braço", "Probes R1/R2: Verificar roldanas e correias", "Probes R1/R2: Verificar as tubulações", "Probes R1/R2: Verificar conexões cabos", "Probes R1/R2: Verificar sensores", "Trocar probes", "Trocar cabo P41 (11075549)"] },
    { day: 6, title: "Dia 6", tasks: ["Dilution Arm: Revisar braço", "Dilution Arm: Verificar roldanas e correias", "Dilution Arm: Verificar as tubulações", "Dilution Arm: Verificar conexões cabos", "Dilution Arm: Verificar sensores", "Trocar probe", "Verificar manifold", "Verificar válvula", "Limpeza Lysing Agent", "Trocar cabo P41 (11075549)"] },
    { day: 7, title: "Dia 7", tasks: ["Sample Arm: Revisar braço", "Sample Arm: Verificar roldanas e correias", "Sample Arm: Verificar tubulações", "Sample Arm: Verificar conexões cabos", "Sample Arm: Verificar sensores", "Sample Arm: Trocar probe", "Sample Arm: Trocar cabo P41 (11075549)"] },
    { day: 8, title: "Dia 8", tasks: ["Dilution Washer: Revisar engrenagens", "Dilution Washer: Verificar suporte probes", "Dilution Washer: Condições das probes", "Dilution Washer: Troca da probe secadora", "Dilution Washer: Troca das tubulações", "Reaction Washer: Revisar engrenagens", "Reaction Washer: Verificar suporte probes", "Reaction Washer: Condições das probes", "Reaction Washer: Troca da probe secadora", "Reaction Washer: Troca das tubulações"] },
    { day: 9, title: "Dia 9", tasks: ["Anel de Diluição: Limpeza geral", "Anel de Diluição: Nivelamento", "Anel de Diluição: Troca segmentos", "Anel de Reação: Limpeza geral", "Anel de Reação: Limpeza filtro de dreno", "Verificação sensores bath level", "Verificação termistor", "Verificar resistência aquecimento", "Verificar se há obstrução no overflow", "Espectrofotômetro: Limpeza geral", "Espectrofotômetro: Troca lâmpada", "Drenar todo sistema de refrigeração", "Limpeza interna reservatório de água", "Refrigeração: Drenar e limpar", "Consumíveis: Limpeza manifolds/válvulas", "Consumíveis: Limpeza gaveta"] },
    { day: 10, title: "Dia 10 ao 12", tasks: ["IMT: Limpeza bomba peristaltica", "IMT: Troca tubulação bomba", "IMT: Limpeza Manifold Plumbing", "IMT: Verificação multisensor", "IMT: Verificação motores", "IMT: Válvulas e Vacuum Sensor", "IMT: Limpeza Diluent Pump", "IMT: Verificação tubulações e cabos", "Bomba de Vácuo: Limpeza geral", "Bomba de Vácuo: Troca kit reparo"] },
    { day: 13, title: "Dia 13", tasks: ["Water/Waste: Limpeza geral", "Water/Waste: Galão de água (troca se nec.)", "Water/Waste: Limpeza Bomba Waste", "Water/Waste: Tubulação/Cabos/Termistor", "Limpeza do bottle level detector senses", "Verificação de válvula e Low pressure pump", "Vacuum Manifold: Limpeza geral", "Vacuum Manifold: Válvulas/Sensores/Transducer", "Vacuum Manifold: Waste pump/bottle", "Montagem módulos", "Troca filtros ar", "Montagem tampas", "Limpeza FAN's"] },
    { day: 14, title: "Dia 14 e 15", tasks: ["Limpeza teclado e mouse", "Limpeza cabos e leitor", "Limpeza impressora/monitor", "Instalação de Software", "Inicialização", "Verificar módulos", "Verificar temperaturas"] },
    { day: 16, title: "Dia 16", tasks: ["Alinhamento Anéis Reação/Diluição", "Alinhamento Wash Probe", "Alinhamento Probes Sample/Dilution/R1/R2", "Alinhamento Mixers", "Alinhamento Reagentes 1 e 2", "Alinhamento Reagent Loader Arm", "Alinhamento Photometro", "Alinhamento IMT", "Ajustar ganhos lâmpada", "Realizar Autocheck", "Checar dispensação das Probes", "Fazer uma diária"] },
    { day: 17, title: "Dia 17 e 18", tasks: ["Validação Pré-ATP", "Realizar teste de performance ATP"] },
    { day: 19, title: "Dia 19 e 20", tasks: ["Retirar reagentes", "Secagem das lines", "Retirar lixo", "Travamento mecanismos", "Limpeza final", "Upload no Planner", "Embalagem", "Identificação Equipamento"] },
    finalizationTask
];

const imTasks = [
    commonDay0,
    { day: 1, title: "Dia 1", tasks: ["Conferência e recebimento/ Placa de Patrimônio", "Verificar cabos", "Verificar peças danificadas / Verificar a estrutura", "Verificar integridade das Tampas / Desmontagem", "Envio de tampas para pintura"] },
    { day: 2, title: "Dia 2", tasks: ["Desmontagem dos módulos", "Limpeza do chassis", "Preparação do chassis", "Pintura do chassis"] },
    { day: 3, title: "Dia 3", tasks: ["Iniciar Revisão dos Módulos", "Troca do Kit E"] },
    { day: 4, title: "Dia 4", tasks: ["Revisar Módulos: Reagente", "Revisar Módulos: Probes de Reagente"] },
    { day: 5, title: "Dia 5", tasks: ["Revisar Módulos: Luminômetro", "Revisar Módulos: Sample Probe", "Revisar Módulos: Carregamento de Tips"] },
    { day: 6, title: "Dia 6", tasks: ["Revisar Módulos: Anel de Incubação", "Revisar Módulos: Área de cubetas", "Revisar Módulos: Área de fluídos"] },
    { day: 7, title: "Dia 7 e 8", tasks: ["Limpeza frascos água e esgoto", "Verificar Bombas Ácido/Base", "Verificar Bombas Lavagem", "Revisar Bomba Vácuo/Blower", "Verificar manifold/conexões", "Verificar válvulas/sensores", "Verificar regulador de vácuo", "Trocar tubulações", "Verificar bombas pressão", "Verificar Water Trap", "Verificar aquecedores tubulação"] },
    { day: 9, title: "Dia 9", tasks: ["Área de consumíves", "Gaveta de cubetas e ponteiras"] },
    { day: 10, title: "Dia 10", tasks: ["Elétrica: Verificar conexões cabos", "Elétrica: Verificar DCM's e Drives", "Elétrica: Limpeza fonte e UPS", "Elétrica: Verificar MM Computer/DML", "Elétrica: Condições das placas"] },
    { day: 11, title: "Dia 11", tasks: ["Montagem dos Módulos", "Montagem das Tampas"] },
    { day: 12, title: "Dia 12 e 13", tasks: ["Startup - Troubleshooting", "Alinhamento"] },
    { day: 14, title: "Dia 14", tasks: ["Verificação de funcionamento", "Preenchimento com fluidos", "Realizar Autocheck", "Realizar Darkcount", "Checar dispensação Probes", "Fazer Background Reading"] },
    { day: 15, title: "Dia 15 a 17", tasks: ["Executar Pré-Atp", "Validação do equipamento ATP"] },
    { day: 19, title: "Dia 19 e 20", tasks: ["Retirar reagentes", "Secagem das linhas", "Retirar lixo", "Travamento mecanismos", "Limpeza final", "Upload no Planner", "Embalagem", "Identificação Equipamento"] },
    finalizationTask
];

const moduleData = { "SH": shTasks, "DL": shTasks, "CH": chTasks, "IM": imTasks };
const configs = {
    "SC": ["SH", "CH"], "SCI": ["SH", "CH", "IM"], "SCII": ["SH", "CH", "IM", "IM"],
    "SCCI": ["SH", "CH", "CH", "IM"], "DLC": ["DL", "CH"], "DLI": ["DL", "IM"],
    "SI": ["SH", "IM"], "CI": ["CH", "IM"]
};

let currentModulesTemp = [];
let modalInstance = null;
let imageModalInstance = null;
let trashModalInstance = null;
let expandedAccordions = {};
let cardCollapseState = {};
let showArchived = false;
let unsubscribe = null;
let allDocsData = [];

window.addEventListener('DOMContentLoaded', () => {
    modalInstance = new bootstrap.Modal(document.getElementById('editModal'));
    imageModalInstance = new bootstrap.Modal(document.getElementById('imageModal'));
    trashModalInstance = new bootstrap.Modal(document.getElementById('trashModal'));
    populateTechSelects();
    loadDashboard();
});

function filterCards() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.machine-card-wrapper');
    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(term) ? '' : 'none';
    });
}

function toggleArchiveView() {
    showArchived = !showArchived;
    const btn = document.getElementById('btnArchived');
    if(showArchived) btn.classList.add('active'); else btn.classList.remove('active');
    loadDashboard();
}

function updateConnectionStatus(isOnline) {
    const dot = document.querySelector('.status-dot');
    const text = document.getElementById('statusText');
    if(isOnline) {
        dot.classList.remove('offline'); dot.classList.add('online');
        text.innerText = 'Online';
    } else {
        dot.classList.remove('online'); dot.classList.add('offline');
        text.innerText = 'Offline';
    }
}

function loadDashboard() {
    const container = document.getElementById('cardsContainer');
    if(unsubscribe) unsubscribe();
   
    let query = db.collection("repair_processes");
    unsubscribe = query.onSnapshot((snapshot) => {
        updateConnectionStatus(true);
        const pageScrollY = window.scrollY;
       
        if(container.children.length > 0) {
            document.querySelectorAll('.machine-card').forEach(card => {
                const docId = card.parentElement.id.replace('col_', '');
                if(docId) {
                    expandedAccordions[docId] = [];
                    card.querySelectorAll('.accordion-collapse.show').forEach(el => expandedAccordions[docId].push(el.id));
                    const body = document.getElementById(`cardBody_${docId}`);
                    if(body) cardCollapseState[docId] = body.classList.contains('card-body-collapsed');
                }
            });
        }
        let docs = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            docs.push({ id: doc.id, data: data });
        });
       
        allDocsData = docs;
        const filteredDocs = docs.filter(d => {
            if(d.data.deleted === true) return false;
            const isArchived = d.data.archived === true;
            if (showArchived && !isArchived) return false;
            if (!showArchived && isArchived) return false;
            return true;
        });
        if (filteredDocs.length === 0) {
            container.innerHTML = showArchived
                ? '<div class="col-12 text-center text-muted mt-5">Nenhum processo arquivado.</div>'
                : '<div class="col-12 text-center text-muted mt-5">Nenhum processo ativo.</div>';
            return;
        }
        const statusWeight = { "NÃO INICIADO": 1, "EM ANDAMENTO": 2, "CONCLUÍDO": 3 };
       
        filteredDocs.sort((a, b) => {
            const statusA = (a.data.status || "NÃO INICIADO").trim().toUpperCase();
            const statusB = (b.data.status || "NÃO INICIADO").trim().toUpperCase();
            const wA = statusWeight[statusA] || 2;
            const wB = statusWeight[statusB] || 2;
            if (wA !== wB) return wA - wB;
            const timeA = a.data.createdAt ? a.data.createdAt.seconds : 0;
            const timeB = b.data.createdAt ? b.data.createdAt.seconds : 0;
            return timeB - timeA;
        });
        const loader = document.getElementById('loadingMsg'); if(loader) loader.remove();
        container.innerHTML = '';
       
        filteredDocs.forEach(d => {
            try { renderCard(d.id, d.data); } catch (e) { console.error("Erro ao renderizar card", d.id, e); }
        });
        filterCards();
        window.scrollTo(0, pageScrollY);
    }, (error) => {
        console.error(error);
        updateConnectionStatus(false);
    });
}

function openTrashModal() {
    const list = document.getElementById('trashList');
    const deletedItems = allDocsData.filter(d => d.data.deleted === true);
   
    if (deletedItems.length === 0) {
        list.innerHTML = '<div class="text-center text-muted p-3">Lixeira vazia.</div>';
    } else {
        list.innerHTML = '';
        deletedItems.forEach(item => {
            const d = item.data;
            const serialsTxt = (d.serials || []).map(s => `${s.label}: ${s.val}`).join(', ');
            const configName = d.config || '-';
            list.innerHTML += `
                <div class="trash-item">
                    <div>
                        <strong>Atellica ${configName}</strong>
                        <span class="text-muted small">| Chamado: ${d.ticket || '-'}</span>
                        <div class="small text-muted" style="font-size:0.75rem;">S/N: ${serialsTxt || 'N/A'}</div>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-success py-0 px-2 me-1" onclick="restoreProcess('${item.id}')" title="Restaurar"><i class="fas fa-trash-restore"></i></button>
                        <button class="btn btn-sm btn-danger py-0 px-2" onclick="permanentDelete('${item.id}')" title="Excluir Definitivamente"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            `;
        });
    }
    trashModalInstance.show();
}

function restoreProcess(docId) {
    if(confirm("Restaurar este card?")) {
        db.collection("repair_processes").doc(docId).update({ deleted: false })
        .then(() => {
            logHistory(docId, "Restaurado da lixeira");
            openTrashModal();
        });
    }
}

function permanentDelete(docId) {
    if(confirm("ATENÇÃO: Isso apagará o card para sempre. Continuar?")) {
        db.collection("repair_processes").doc(docId).delete()
        .then(() => openTrashModal());
    }
}

function openStatsOverlay() {
    try {
        const overlay = document.getElementById('customStatsOverlay');
        const content = document.getElementById('statsBody');
        if (!overlay || !content) return;
        overlay.style.display = 'flex';
        const activeDocs = allDocsData.filter(d => !d.data.deleted);
        if(activeDocs.length === 0) {
            content.innerHTML = '<div class="col-12 text-center text-muted">Carregando dados...</div>';
            return;
        }
        let total = activeDocs.length;
        let active = 0, archived = 0;
        let notStarted = 0, inProgress = 0, done = 0;
        let delayed = 0;
        activeDocs.forEach(d => {
            const data = d.data;
            if(data.archived) archived++; else active++;
            const st = (data.status || "NÃO INICIADO").trim().toUpperCase();
            if(st === "NÃO INICIADO") notStarted++;
            else if(st === "EM ANDAMENTO") inProgress++;
            else if(st === "CONCLUÍDO") done++;
            if(st !== "CONCLUÍDO") delayed++;
        });
        content.innerHTML = `
            <div class="col-md-3"><div class="stats-card"><span class="stats-number">${total}</span><span class="stats-label">Total Cadastrados</span></div></div>
            <div class="col-md-3"><div class="stats-card"><span class="stats-number text-dark">${active}</span><span class="stats-label">Ativos</span></div></div>
            <div class="col-md-3"><div class="stats-card"><span class="stats-number text-secondary">${archived}</span><span class="stats-label">Arquivados</span></div></div>
            <div class="col-md-3"><div class="stats-card delayed"><span class="stats-number">${delayed}</span><span class="stats-label">Atrasados</span></div></div>
            <div class="col-12"><hr></div>
            <div class="col-md-4"><div class="stats-card"><span class="stats-number text-secondary">${notStarted}</span><span class="stats-label">Não Iniciados</span></div></div>
            <div class="col-md-4"><div class="stats-card"><span class="stats-number text-primary">${inProgress}</span><span class="stats-label">Em Andamento</span></div></div>
            <div class="col-md-4"><div class="stats-card done"><span class="stats-number">${done}</span><span class="stats-label">Concluídos</span></div></div>
        `;
    } catch (e) { alert("Erro ao abrir estatísticas."); }
}

function closeStatsOverlay() { document.getElementById('customStatsOverlay').style.display = 'none'; }

async function openEditModal(docId) {
    const doc = await db.collection("repair_processes").doc(docId).get();
    if(!doc.exists) return;
    const data = doc.data();
    document.getElementById('editDocId').value = docId;
    document.getElementById('editConfig').value = data.config;
    document.getElementById('editTicket').value = data.ticket;
    document.getElementById('editSiemensTicket').value = data.siemensTicket || "";
    document.getElementById('editDateReceipt').value = data.dates.receipt;
    document.getElementById('editDateStart').value = data.dates.start;
    document.getElementById('editDateGoLive').value = data.dates.goLive;
   
    const techContainer = document.getElementById('moduleTechsArea');
    techContainer.innerHTML = '';
    (data.modules || []).forEach((mod, idx) => {
        let options = `<option value="">-</option>`;
        techniciansList.forEach(t => { const selected = mod.tech === t ? 'selected' : ''; options += `<option value="${t}" ${selected}>${t}</option>`; });
        techContainer.innerHTML += `<div class="col-md-4"><label style="font-size:0.65rem;">${mod.label}</label><select class="form-select mod-tech-select" data-mod-idx="${idx}" style="font-size:0.7rem; padding:2px;">${options}</select></div>`;
    });
    const historyDiv = document.getElementById('historyLog');
    historyDiv.innerHTML = 'Nenhum histórico.';
    if(data.history && data.history.length > 0) {
        let html = '';
        data.history.slice().reverse().slice(0, 50).forEach(h => { html += `<div class="history-item"><strong>${h.time}</strong>: ${h.action}</div>`; });
        historyDiv.innerHTML = html;
    }
    const serialArea = document.getElementById('editSerialsArea');
    serialArea.innerHTML = '';
    if(data.serials && data.serials.length > 0) {
        data.serials.forEach(s => { serialArea.innerHTML += `<div class="col-6"><label class="small text-muted">${s.label}</label><input type="text" class="form-control form-control-sm edit-serial-input" data-label="${s.label}" value="${s.val}"></div>`; });
    }
    modalInstance.show();
}

function renderCard(docId, data) {
    const container = document.getElementById('cardsContainer');
    const safeSerials = data.serials || [];
    const safeModules = data.modules || [];
    const modulesHTML = generateIndependentModulesHTML(safeModules, docId, data.checkedItems || [], data.datesData || {}, safeSerials);
    const serialsBadges = safeSerials.map(s => `<span class="header-serial-badge">${s.label}: ${s.val}</span>`).join('');
   
    const safeDates = data.dates || {};
    const fmtDate = (d) => d ? d.split('-').reverse().join('/') : '-';
    let siemensBadge = "";
    if(data.siemensTicket) {
        siemensBadge = `<div style="line-height:1;"><span class="siemens-badge">${data.siemensTicket}</span></div>`;
    }
   
    let internalBadge = "";
    if(data.ticket) {
        internalBadge = `<div><span class="ticket-badge">${data.ticket}</span></div>`;
    }
    let moduleOptions = '<option value="Geral" selected>Geral</option>';
    safeModules.forEach(m => {
        const relatedSerial = safeSerials.find(s => s.label === m.label);
        const snVal = relatedSerial ? relatedSerial.val : '';
        moduleOptions += `<option value="${m.label}" data-serial="${snVal}">${m.label}</option>`;
    });
   
    let techOptions = '<option value="" selected disabled>Técnico...</option>';
    techniciansList.forEach(t => techOptions += `<option value="${t}">${t}</option>`);
    let commentsHTML = '';
    if (data.comments && data.comments.length > 0) {
        data.comments.forEach((c, idx) => {
            const editedTag = c.edited ? '<em class="text-muted" style="font-size:0.6rem; margin-left:2px;">(editado)</em>' : '';
            const modBadge = c.module && c.module !== 'Geral' ? `<span class="comment-module-badge">${c.module}</span>` : '';
            const techName = c.tech ? `<strong>${c.tech}</strong> ` : '';
            commentsHTML = `<li class="comment-item"><div style="flex:1;">${modBadge}${techName}<span class="text-muted small">[${c.time}]</span> ${c.text} ${editedTag}</div><div class="comment-actions"><i class="fas fa-pencil-alt text-primary" title="Editar" onclick="editComment('${docId}', ${idx}, '${c.text}')"></i><i class="fas fa-trash text-danger" title="Apagar" onclick="deleteComment('${docId}', ${idx})"></i></div></li>` + commentsHTML;
        });
    }
    const isCollapsed = cardCollapseState[docId] === true;
    const collapseClass = isCollapsed ? 'card-body-collapsed' : '';
    const chevronIcon = isCollapsed ? 'fa-chevron-down' : 'fa-chevron-up';
    const statusMap = {
        "NÃO INICIADO": { color: "btn-secondary", label: "NÃO INICIADO" },
        "EM ANDAMENTO": { color: "btn-primary", label: "EM ANDAMENTO" },
        "CONCLUÍDO": { color: "btn-success", label: "CONCLUÍDO" }
    };
    const currentStatus = (data.status || "NÃO INICIADO").trim().toUpperCase();
    const statusStyle = statusMap[currentStatus] || statusMap["NÃO INICIADO"];
    
    const safeATP = data.atp || {};
    const atpSol = safeATP.solicited ? 'checked' : '';
    const atpRec = safeATP.received ? 'checked' : '';
    const atpSolDate = safeATP.solicitedDate || '';
    const atpRecDate = safeATP.receivedDate || '';
   
    const serialsString = safeSerials.map(s => `${s.label}: ${s.val}`).join(' / ');
    const configName = data.config || '-'; 
    const whatsMsg = `Olá, sobre o equipamento Atellica ${configName} Séries ${serialsString}, solicitar os itens do ATP.`;
    const whatsLink = `https://wa.me/5511947684602?text=${encodeURIComponent(whatsMsg)}`;
    let archiveAction = '';
    if (data.archived) {
        archiveAction = `<li><a class="dropdown-item text-primary" onclick="unarchiveProcess('${docId}')"><i class="fas fa-box-open me-1"></i>Desarquivar</a></li>`;
    } else {
        archiveAction = `<li><a class="dropdown-item text-danger" onclick="archiveProcess('${docId}')"><i class="fas fa-archive me-1"></i>Arquivar</a></li>`;
    }
    const cardHTML = `
        <div class="machine-card-wrapper" id="col_${docId}">
            <div class="machine-card">
                <div class="machine-card-header">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <div>
                            <div class="d-flex flex-column">
                                <div class="d-flex align-items-center flex-wrap">
                                    <h6 class="mb-0 text-white fw-bold me-2" style="font-size:0.95rem">Atellica ${configName}</h6>
                                    <div class="d-inline-block">${serialsBadges}</div>
                                </div>
                                ${siemensBadge}
                            </div>
                        </div>
                        <div class="d-flex align-items-start">
                             <div class="dropdown status-dropdown me-2">
                                <button class="btn btn-sm ${statusStyle.color} dropdown-toggle text-white" type="button" data-bs-toggle="dropdown">
                                    ${statusStyle.label}
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li><a class="dropdown-item" onclick="updateStatus('${docId}', 'NÃO INICIADO')">NÃO INICIADO</a></li>
                                    <li><a class="dropdown-item" onclick="updateStatus('${docId}', 'EM ANDAMENTO')">EM ANDAMENTO</a></li>
                                    <li><a class="dropdown-item" onclick="updateStatus('${docId}', 'CONCLUÍDO')">CONCLUÍDO</a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    ${archiveAction}
                                </ul>
                            </div>
                            <div style="display:flex;">
                                <button class="btn btn-sm text-white p-0 me-2" onclick="toggleCardBody('${docId}')" title="Minimizar/Expandir"><i class="fas ${chevronIcon}" id="chevron_${docId}"></i></button>
                                <button class="btn btn-sm text-white p-0 me-2" onclick="openEditModal('${docId}')"><i class="fas fa-pencil-alt"></i></button>
                                <button class="btn btn-sm text-white p-0" onclick="deleteProcess('${docId}')"><i class="fas fa-times"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-end mt-1">
                        ${internalBadge}
                    </div>
                </div>
                <div class="dates-row">
                    <div class="date-group"><span class="date-label">Recebimento</span><span class="date-value">${fmtDate(safeDates.receipt)}</span></div>
                    <div class="date-group"><span class="date-label">Início</span><span class="date-value">${fmtDate(safeDates.start)}</span></div>
                    <div class="date-group"><span class="date-label">Go Live</span><span class="date-value">${fmtDate(safeDates.goLive)}</span></div>
                </div>
               
                <div class="atp-row">
                    <div class="atp-group">
                        <div class="atp-check">
                            <input type="checkbox" id="atp_sol_${docId}" ${atpSol} onclick="toggleATP('${docId}', 'solicited')">
                            <label for="atp_sol_${docId}">Solicitar Itens ATP</label>
                            <input type="date" class="tiny-date-input ms-1" value="${atpSolDate}" onchange="saveATPDate('${docId}', 'solicitedDate', this.value)">
                        </div>
                        <div class="atp-check">
                            <input type="checkbox" id="atp_rec_${docId}" ${atpRec} onclick="toggleATP('${docId}', 'received')">
                            <label for="atp_rec_${docId}">Recebimento Itens ATP</label>
                            <input type="date" class="tiny-date-input ms-1" value="${atpRecDate}" onchange="saveATPDate('${docId}', 'receivedDate', this.value)">
                        </div>
                    </div>
                    <a href="${whatsLink}" target="_blank" class="btn-whatsapp">
                        <i class="fab fa-whatsapp me-1"></i> Solicitar
                    </a>
                </div>
                <div style="padding: 4px 10px; background-color:#e6fcfc; border-bottom:1px solid #ccc;">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold text-dark" style="font-size:0.7rem">Progresso Geral</span>
                        <span class="fw-bold text-dark" style="font-size:0.7rem" id="progText_${docId}">0%</span>
                    </div>
                    <div class="progress" style="height: 6px; background-color: #cbd3da;">
                        <div id="progBar_${docId}" class="progress-bar bg-success" role="progressbar" style="width: 0%"></div>
                    </div>
                </div>
                <div id="cardBody_${docId}" class="${collapseClass}">
                    <div class="modules-container" id="scrollArea_${docId}">
                        ${modulesHTML}
                    </div>
                    <div class="card-footer-comments">
                        <div class="input-group input-group-sm">
                            <select class="form-select" id="commentTech_${docId}" style="max-width: 120px; font-size:0.7rem;">${techOptions}</select>
                            <select class="form-select" id="commentModule_${docId}" style="max-width: 90px; font-size:0.7rem;">${moduleOptions}</select>
                            <input type="text" class="form-control" id="commentText_${docId}" placeholder="Obs..." style="font-size:0.7rem;">
                            <button class="btn btn-outline-secondary" onclick="addComment('${docId}')"><i class="fas fa-paper-plane"></i></button>
                        </div>
                        <ul class="comment-list" id="commentList_${docId}">${commentsHTML}</ul>
                    </div>
                </div>
            </div>
        </div>
    `;
   
    container.insertAdjacentHTML('beforeend', cardHTML);
   
    if(expandedAccordions[docId]) {
        expandedAccordions[docId].forEach(id => {
            const el = document.getElementById(id);
            if(el) { el.classList.add('show'); const btn = document.querySelector(`button[data-bs-target="#${id}"]`); if(btn) btn.classList.remove('collapsed'); }
        });
    }
    recalcProgress(docId);
}

function toggleCardBody(docId) {
    const body = document.getElementById(`cardBody_${docId}`);
    const icon = document.getElementById(`chevron_${docId}`);
    if (body) {
        if (body.classList.contains('card-body-collapsed')) {
            body.classList.remove('card-body-collapsed'); icon.classList.remove('fa-chevron-down'); icon.classList.add('fa-chevron-up'); cardCollapseState[docId] = false;
        } else {
            body.classList.add('card-body-collapsed'); icon.classList.remove('fa-chevron-up'); icon.classList.add('fa-chevron-down'); cardCollapseState[docId] = true;
        }
    }
}

function updateStatus(docId, newStatus) {
    db.collection("repair_processes").doc(docId).update({ status: newStatus })
    .then(() => logHistory(docId, `Status alterado para: ${newStatus}`))
    .catch(err => alert("Erro ao atualizar status"));
}

function archiveProcess(docId) {
    if(confirm("Deseja arquivar este processo?")) {
        db.collection("repair_processes").doc(docId).update({ archived: true })
        .then(() => logHistory(docId, "Processo Arquivado"));
    }
}

function unarchiveProcess(docId) {
    if(confirm("Deseja desarquivar este processo?")) {
        db.collection("repair_processes").doc(docId).update({ archived: false })
        .then(() => logHistory(docId, "Processo Desarquivado"));
    }
}

function toggleATP(docId, field) {
    const checkbox = document.getElementById(field === 'solicited' ? `atp_sol_${docId}` : `atp_rec_${docId}`);
    const val = checkbox.checked;
    const updateKey = `atp.${field}`;
    db.collection("repair_processes").doc(docId).update({ [updateKey]: val })
    .then(() => logHistory(docId, `ATP ${field === 'solicited' ? 'Solicitado' : 'Recebido'}: ${val ? 'Sim' : 'Não'}`));
}

function saveATPDate(docId, field, val) {
    const updateKey = `atp.${field}`;
    db.collection("repair_processes").doc(docId).update({ [updateKey]: val });
}

function generateIndependentModulesHTML(modules, docId, checkedItems, datesData, serials) {
    let fullHtml = '';
   
    let techOptions = '<option value="">-</option>';
    techniciansList.forEach(t => techOptions += `<option value="${t}">${t}</option>`);
    modules.forEach((mod) => {
        let accordionHtml = '';
        const techName = mod.tech || "Não atribuído";
       
        const modSerial = serials.find(s => s.label === mod.label);
        const serialBadge = modSerial ? `<span class="module-ns-badge">${modSerial.val}</span>` : '';
        if (!moduleData[mod.type]) return;
        moduleData[mod.type].forEach((tasksObj, i) => {
            const uniqueAccordionId = `collapse_${docId}_${mod.id}_${i}`;
            const tasksHtml = tasksObj.tasks.map(t => {
                const taskId = `${mod.id}_${i}_${t.replace(/[^a-zA-Z0-9]/g, '')}`;
                const isChecked = checkedItems.includes(taskId) ? 'checked' : '';
                return `<div class="form-check"><input class="form-check-input chk-${docId} chk-mod-${docId}-${mod.id}" type="checkbox" data-day="${i}" id="${docId}_${taskId}" ${isChecked} onchange="toggleCheck('${docId}', '${taskId}', '${t}')"><label class="form-check-label" for="${docId}_${taskId}">${t}</label></div>`;
            }).join('');
           
            const dateKey = `${mod.id}_${i}`;
            const savedStart = (datesData && datesData[dateKey] && datesData[dateKey].start) ? datesData[dateKey].start : '';
            const savedEnd = (datesData && datesData[dateKey] && datesData[dateKey].end) ? datesData[dateKey].end : '';
            const savedDailyTech = (datesData && datesData[dateKey] && datesData[dateKey].tech) ? datesData[dateKey].tech : '';
            const techBadgeHtml = savedDailyTech ? `<span class="header-daily-tech-badge">${savedDailyTech}</span>` : '';
            let dailyTechSelectHTML = `
                <select class="daily-tech-select" onchange="saveDate('${docId}', '${mod.id}', ${i}, 'tech', this.value, '${mod.label}')">
                    ${techOptions.replace(`value="${savedDailyTech}"`, `value="${savedDailyTech}" selected`)}
                </select>
            `;
            const isLast = i === moduleData[mod.type].length - 1;
           
            let uploadHTML = '';
            if (i === 0 || isLast) {
                const photoUrl = (datesData && datesData[dateKey] && datesData[dateKey].photoUrl) ? datesData[dateKey].photoUrl : null;
                const btnLabel = photoUrl ? '<i class="fas fa-file-alt"></i> Ver Arq.' : '<i class="fas fa-upload"></i> Foto';
                const btnClass = photoUrl ? 'btn-success' : 'btn-secondary';
                const linkAction = photoUrl ? `showImage('${photoUrl}')` : `document.getElementById('file_${docId}_${mod.id}_${i}').click()`;
               
                let deleteBtn = '';
                if (photoUrl) {
                    deleteBtn = `<button class="btn btn-sm btn-danger py-0 px-1 ms-1" style="font-size:0.6rem;" onclick="deletePhoto('${docId}', '${mod.id}', '${i}', '${mod.label}')" title="Excluir"><i class="fas fa-trash"></i></button>`;
                }
                uploadHTML = `
                    <div class="ms-2 d-flex">
                        <input type="file" id="file_${docId}_${mod.id}_${i}" style="display:none" accept="image/*,application/pdf" onchange="uploadPhoto('${docId}', '${mod.id}', ${i}, this, '${mod.label}')">
                        <button class="btn btn-sm ${btnClass} py-0 px-1" style="font-size:0.6rem;" onclick="${linkAction}" title="Upload Foto">${btnLabel}</button>
                        ${deleteBtn}
                        <span id="spin_${docId}_${mod.id}_${i}" style="display:none" class="spinner-border spinner-border-sm text-primary ms-1"></span>
                    </div>
                `;
            }
            accordionHtml += `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="head_${uniqueAccordionId}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${uniqueAccordionId}">
                            <div class="accordion-header-content">
                                <span>${tasksObj.title}</span>
                                <div class="daily-progress-wrapper">
                                    ${techBadgeHtml}
                                    <div class="daily-progress"><div id="progDayBar_${docId}_${mod.id}_${i}" class="daily-progress-bar"></div></div>
                                    <span id="progDayText_${docId}_${mod.id}_${i}" class="daily-percent">0%</span>
                                </div>
                            </div>
                        </button>
                    </h2>
                    <div id="${uniqueAccordionId}" class="accordion-collapse collapse" data-bs-parent="#accParent_${docId}_${mod.id}">
                        <div class="accordion-body p-0">
                            <div class="day-dates-container">
                                <div class="d-flex align-items-center w-100">
                                    <span class="tiny-date-label">Téc:</span>${dailyTechSelectHTML}
                                    ${uploadHTML}
                                </div>
                                <div class="d-flex align-items-center w-100">
                                    <span class="tiny-date-label">Início:</span><input type="date" class="tiny-date-input" value="${savedStart}" onchange="saveDate('${docId}', '${mod.id}', ${i}, 'start', this.value, '${mod.label}')">
                                    <span class="tiny-date-label ms-2">Fim:</span><input type="date" class="tiny-date-input" value="${savedEnd}" onchange="saveDate('${docId}', '${mod.id}', ${i}, 'end', this.value, '${mod.label}')">
                                </div>
                            </div>
                            ${tasksHtml}
                        </div>
                    </div>
                </div>`;
        });
        fullHtml += `
            <div class="module-vertical-column">
                <div class="module-col-header">
                    <span class="module-title">${mod.label} ${serialBadge}</span>
                    <span class="module-tech-badge"><i class="fas fa-user-circle me-1"></i>${techName}</span>
                </div>
                <div class="module-progress-wrapper">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="small text-muted" style="font-size:0.65rem">Progresso Módulo</span>
                        <span class="small fw-bold text-info" style="font-size:0.65rem" id="progModText_${docId}_${mod.id}">0%</span>
                    </div>
                    <div class="progress" style="height: 4px;"><div id="progModBar_${docId}_${mod.id}" class="progress-bar bg-info" style="width: 0%"></div></div>
                </div>
                <div class="card-scroll-area"><div class="accordion accordion-flush" id="accParent_${docId}_${mod.id}">${accordionHtml}</div></div>
            </div>`;
    });
    return fullHtml;
}

async function saveDate(docId, modId, dayIdx, type, val, modLabel) {
    const key = `datesData.${modId}_${dayIdx}.${type}`;
    await db.collection("repair_processes").doc(docId).update({ [key]: val });
    logHistory(docId, `Alterou ${type} em ${modLabel} Dia ${dayIdx}: ${val}`);
}

function showImage(url) {
    const img = document.getElementById('previewImage');
    img.src = url;
    if(!imageModalInstance) imageModalInstance = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModalInstance.show();
}

function uploadPhoto(docId, modId, dayIdx, input, modLabel) {
    const file = input.files[0];
    if (!file) return;
    const spinner = document.getElementById(`spin_${docId}_${modId}_${dayIdx}`);
    if(spinner) spinner.style.display = 'inline-block';
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_WIDTH = 600; 
            const MAX_HEIGHT = 600;
            if (width > height) {
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
            } else {
                if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.5); 
            const key = `datesData.${modId}_${dayIdx}.photoUrl`;
            db.collection("repair_processes").doc(docId).update({ [key]: dataUrl })
            .then(() => {
                if(spinner) spinner.style.display = 'none';
                logHistory(docId, `Upload de Foto em ${modLabel} Dia ${dayIdx}`);
                alert('Foto salva com sucesso!');
            })
            .catch(err => {
                if(spinner) spinner.style.display = 'none';
                alert("Erro ao salvar foto: " + err.message);
            });
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
}

function deletePhoto(docId, modId, dayIdx, modLabel) {
    if(!confirm("Tem certeza que deseja excluir esta foto?")) return;
    const key = `datesData.${modId}_${dayIdx}.photoUrl`;
    db.collection("repair_processes").doc(docId).update({
        [key]: firebase.firestore.FieldValue.delete()
    }).then(() => {
        logHistory(docId, `Excluiu foto em ${modLabel} Dia ${dayIdx}`);
        alert("Foto excluída.");
    }).catch(err => alert("Erro ao excluir: " + err.message));
}

async function saveEditModal() {
    const docId = document.getElementById('editDocId').value;
    const docRef = db.collection("repair_processes").doc(docId);
    const docSnap = await docRef.get();
    const currentData = docSnap.data();
    const newTicket = document.getElementById('editTicket').value;
    const newSiemens = document.getElementById('editSiemensTicket').value;
    const newReceipt = document.getElementById('editDateReceipt').value;
    const newStart = document.getElementById('editDateStart').value;
    const newGoLive = document.getElementById('editDateGoLive').value;
    const serials = [];
    document.querySelectorAll('.edit-serial-input').forEach(input => serials.push({ label: input.dataset.label, val: input.value }));
    let modules = currentData.modules;
    const modSelects = document.querySelectorAll('.mod-tech-select');
   
    let changes = [];
    if (newTicket !== currentData.ticket) changes.push(`Chamado Int: ${currentData.ticket}->${newTicket}`);
    serials.forEach((s, i) => { if (currentData.serials[i] && currentData.serials[i].val !== s.val) changes.push(`Serial ${s.label}`); });
    modSelects.forEach(sel => {
        const idx = sel.dataset.modIdx;
        const newVal = sel.value;
        const oldVal = modules[idx].tech;
        if (newVal !== oldVal) { changes.push(`Téc. ${modules[idx].label}: ${oldVal || "-"}->${newVal}`); modules[idx].tech = newVal; }
    });
    await docRef.update({
        ticket: newTicket, siemensTicket: newSiemens,
        dates: { receipt: newReceipt, start: newStart, goLive: newGoLive },
        serials: serials, modules: modules
    }).catch(err => alert("Erro: " + err.message));
    if (changes.length > 0) logHistory(docId, "Editou: " + changes.join(", "));
    modalInstance.hide();
}

function updateSerialInputs(targetId) {
    const configType = document.getElementById('machineConfig').value;
    const serialArea = document.getElementById(targetId);
    serialArea.innerHTML = '';
    if (!configType || !configs[configType]) return;
    currentModulesTemp = [];
    const rawModules = configs[configType];
    const counts = { SH:0, CH:0, IM:0, DL:0 };
    rawModules.forEach(mod => {
        counts[mod]++;
        const label = counts[mod] > 1 || rawModules.filter(m => m === mod).length > 1 ? `${mod} #${counts[mod]}` : mod;
        currentModulesTemp.push({ type: mod, label: label, id: `${mod}_${counts[mod]}`, tech: '' });
        serialArea.innerHTML += `<div class="col-md-3"><input type="text" class="form-control serial-input" data-label="${label}" placeholder="${label}" required style="font-size:0.75rem; padding:4px;"></div>`;
    });
}

async function createNewProcess() {
    const form = document.getElementById('repairForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const mainTech = document.getElementById('technician').value;
    const modulesWithTech = JSON.parse(JSON.stringify(currentModulesTemp));
    modulesWithTech.forEach(m => m.tech = mainTech);
    await db.collection("repair_processes").add({
        config: document.getElementById('machineConfig').value,
        ticket: document.getElementById('ticketNumber').value,
        siemensTicket: document.getElementById('siemensTicket').value,
        tech: mainTech, techs: [mainTech],
        dates: { receipt: document.getElementById('dateReceipt').value, start: document.getElementById('dateStart').value, goLive: document.getElementById('dateGoLive').value },
        serials: Array.from(document.querySelectorAll('.serial-input')).map(i => ({label: i.dataset.label, val: i.value})),
        modules: modulesWithTech, checkedItems: [], comments: [], datesData: {}, history: [],
        status: "NÃO INICIADO",
        atp: { solicited: false, received: false },
        archived: false, deleted: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then((docRef) => logHistory(docRef.id, "Criado por " + mainTech)).catch(err => alert("Erro: " + err.message));
    form.reset(); document.getElementById('serialNumbersArea').innerHTML = '';
}

function logHistory(docId, action) {
    const timeStr = new Date().toLocaleString('pt-BR');
    db.collection("repair_processes").doc(docId).update({ history: firebase.firestore.FieldValue.arrayUnion({ action: action, time: timeStr }) });
}

async function deleteComment(docId, index) { if(confirm("Apagar?")) { const docRef = db.collection("repair_processes").doc(docId); const docSnap = await docRef.get(); if(docSnap.exists) { let comments = docSnap.data().comments || []; comments.splice(index, 1); await docRef.update({ comments: comments }); logHistory(docId, "Apagou um comentário"); }}}

async function editComment(docId, index, oldText) { const newText = prompt("Editar:", oldText); if(newText && newText !== oldText) { const docRef = db.collection("repair_processes").doc(docId); const docSnap = await docRef.get(); if(docSnap.exists) { let comments = docSnap.data().comments || []; comments[index].text = newText; comments[index].edited = true; await docRef.update({ comments: comments }); logHistory(docId, "Editou um comentário"); }}}

async function addComment(docId) {
    const txtInput = document.getElementById(`commentText_${docId}`);
    const modSelect = document.getElementById(`commentModule_${docId}`);
    const techSelect = document.getElementById(`commentTech_${docId}`);
   
    if(!txtInput.value) return;
    if(!techSelect.value) { alert("Selecione o técnico para comentar."); return; }
    const modLabel = modSelect.value;
    const techName = techSelect.value;
    let finalComment = txtInput.value;
   
    if (modLabel !== 'Geral') {
        const selectedOption = modSelect.options[modSelect.selectedIndex];
        const serialNum = selectedOption.getAttribute('data-serial');
        if (serialNum) finalComment = `[${modLabel} - SN: ${serialNum}] ${finalComment}`;
        else finalComment = `[${modLabel}] ${finalComment}`;
    }
    const timeStr = new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    db.collection("repair_processes").doc(docId).update({
        comments: firebase.firestore.FieldValue.arrayUnion({ module: modLabel, text: finalComment, time: timeStr, edited: false, tech: techName })
    }).then(() => {
        txtInput.value = '';
        logHistory(docId, `Comentou: "${finalComment}"`);
    });
}

function toggleCheck(docId, taskId, taskName) {
    const checkbox = document.getElementById(`${docId}_${taskId}`);
    const isChecked = checkbox.checked;
    const updateObj = { checkedItems: isChecked ? firebase.firestore.FieldValue.arrayUnion(taskId) : firebase.firestore.FieldValue.arrayRemove(taskId) };
    recalcProgress(docId);
    db.collection("repair_processes").doc(docId).update(updateObj).catch(error => { checkbox.checked = !checkbox.checked; recalcProgress(docId); });
}

function deleteProcess(docId) {
    if(confirm('Mover este card para a lixeira?')) {
        db.collection("repair_processes").doc(docId).update({ deleted: true })
        .then(() => logHistory(docId, "Movido para a lixeira"));
    }
}

function recalcProgress(docId) {
    const container = document.getElementById(`col_${docId}`);
    if(!container) return;
    const moduleCols = container.querySelectorAll('.module-vertical-column');
    let cardTotal = 0; let cardChecked = 0;
    moduleCols.forEach(col => {
        const firstChk = col.querySelector(`.chk-${docId}`);
        if(!firstChk) return;
        let modId = ''; firstChk.classList.forEach(c => { if(c.startsWith(`chk-mod-${docId}-`)) modId = c.replace(`chk-mod-${docId}-`, ''); });
        const modTotal = col.querySelectorAll('input[type="checkbox"]').length;
        const modChecked = col.querySelectorAll('input[type="checkbox"]:checked').length;
        const modPct = modTotal === 0 ? 0 : Math.round((modChecked/modTotal)*100);
        const modBar = document.getElementById(`progModBar_${docId}_${modId}`);
        const modText = document.getElementById(`progModText_${docId}_${modId}`);
        if(modBar) modBar.style.width = `${modPct}%`; if(modText) modText.innerText = `${modPct}%`;
        cardTotal += modTotal; cardChecked += modChecked;
        col.querySelectorAll('.daily-progress-bar').forEach(dayBar => {
            const dayIndex = dayBar.id.split('_').pop();
            const dayTotal = col.querySelectorAll(`input[data-day="${dayIndex}"]`).length;
            const dayChecked = col.querySelectorAll(`input[data-day="${dayIndex}"]:checked`).length;
            const dayPct = dayTotal === 0 ? 0 : Math.round((dayChecked/dayTotal)*100);
            dayBar.style.width = `${dayPct}%`;
            const dayText = document.getElementById(`progDayText_${docId}_${modId}_${dayIndex}`);
            if(dayText) dayText.innerText = `${dayPct}%`;
        });
    });
    const allPct = cardTotal === 0 ? 0 : Math.round((cardChecked/cardTotal)*100);
    const mainBar = document.getElementById(`progBar_${docId}`);
    const mainText = document.getElementById(`progText_${docId}`);
    if(mainBar) mainBar.style.width = `${allPct}%`; if(mainText) mainText.innerText = `${allPct}%`;
}