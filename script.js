let dataArray = [];
let currentId = null;

// JSONL 파일 로드
async function loadData() {
    try {
        const response = await fetch('./test_data_assis_only_web_final_20.jsonl');
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        dataArray = lines.map(line => JSON.parse(line));
        
        // ID로 정렬
        dataArray.sort((a, b) => a.id - b.id);
        
        renderIdList();
        
        // 첫 번째 항목 선택
        if (dataArray.length > 0) {
            selectId(dataArray[0].id);
        }
        
        // 로딩 화면 숨기고 앱 표시
        document.getElementById('loading').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('loading').textContent = 'Error loading data';
    }
}

// ID 리스트 렌더링
function renderIdList() {
    const idList = document.getElementById('id-list');
    idList.innerHTML = '';
    
    dataArray.forEach(item => {
        const li = document.createElement('li');
        li.className = 'id-item';
        li.textContent = `ID ${item.id}`;
        li.dataset.id = item.id;
        li.onclick = () => selectId(item.id);
        idList.appendChild(li);
    });
}

// ID 선택
function selectId(id) {
    currentId = id;
    
    // 활성화 상태 업데이트
    document.querySelectorAll('.id-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.id) === id) {
            item.classList.add('active');
        }
    });
    
    // 데이터 찾기
    const data = dataArray.find(item => item.id === id);
    if (data) {
        renderData(data);
    }
}

// 데이터 렌더링
function renderData(data) {
    // 헤더 업데이트
    document.getElementById('input-header').innerHTML = "Client's note:<br>" + data.input;
    
    // 각 컬럼 렌더링
    renderChat('chat-a', data.A);
    renderChat('chat-b', data.B);
    renderChat('chat-c', data.C);
    renderChat('chat-d', data.D);
}

// 채팅 렌더링
function renderChat(containerId, messages) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    if (!messages || messages.length === 0) {
        container.innerHTML = '<div class="empty-state">No messages</div>';
        return;
    }
    
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}`;
        
        const roleLabel = message.role === 'therapist' ? 'Therapist' : 'Client';
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="message-role">${roleLabel}</div>
            <div class="message-bubble">${escapeHtml(message.content)}</div>
        `;
        
        messageDiv.appendChild(wrapper);
        container.appendChild(messageDiv);
    });
    
    // 스크롤을 아래로
    container.scrollTop = container.scrollHeight;
}

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 페이지 로드 시 데이터 로드
window.addEventListener('DOMContentLoaded', loadData);