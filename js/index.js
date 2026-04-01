document.addEventListener('DOMContentLoaded', () => {
    const perfilLinks = document.querySelectorAll('.perfil');
    const btnGerenciar = document.getElementById('btn-gerenciar');
    const container = document.getElementById('lista-perfis');
    
    const editModal = document.getElementById('edit-modal');
    const editName = document.getElementById('edit-name');
    const editPreview = document.getElementById('edit-preview');
    const fileInput = document.getElementById('file-input');
    const btnSave = document.getElementById('btn-save');
    const btnCancel = document.getElementById('btn-cancel');

    let isManageMode = false;
    let currentEditingProfile = null;
    let tempImageBase64 = null;

    // Load custom profiles from localStorage
    function loadSavedProfiles() {
        const saved = JSON.parse(localStorage.getItem('customProfiles') || '{}');
        perfilLinks.forEach(link => {
            const id = link.getAttribute('data-id');
            if (saved[id]) {
                const nomeEl = link.querySelector('.nome-perfil');
                const imgEl = link.querySelector('img');
                if (saved[id].name) nomeEl.textContent = saved[id].name;
                if (saved[id].img) imgEl.src = saved[id].img;
            }
        });
    }

    loadSavedProfiles();

    if (btnGerenciar) {
        btnGerenciar.addEventListener('click', () => {
            isManageMode = !isManageMode;
            if (container) container.classList.toggle('manage-mode', isManageMode);
            btnGerenciar.textContent = isManageMode ? 'Pronto' : 'Gerenciar perfis';
            btnGerenciar.classList.toggle('active', isManageMode);
        });
    }

    perfilLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            if (isManageMode) {
                event.preventDefault();
                openEditModal(link);
                return;
            }

            const item = link.closest('.item-perfil');
            if (!item) return;

            const nomeEl = item.querySelector('.nome-perfil');
            const imgEl = item.querySelector('img');

            const nome = nomeEl ? nomeEl.textContent.trim() : '';
            let imgSrc = imgEl ? imgEl.getAttribute('src') : '';

            // Ensure path for catalog works - if it's base64, don't prefix with ../
            if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/') && !imgSrc.startsWith('..') && !imgSrc.startsWith('data:')) {
                imgSrc = '../' + imgSrc;
            }

            try {
                localStorage.setItem('perfilAtivoNome', nome);
                localStorage.setItem('perfilAtivoImagem', imgSrc);
            } catch (e) {
                console.warn('Erro ao salvar perfil ativo', e);
            }
        });
    });

    function openEditModal(link) {
        currentEditingProfile = link;
        const nome = link.querySelector('.nome-perfil').textContent.trim();
        const img = link.querySelector('img').getAttribute('src');

        editName.value = nome;
        editPreview.src = img;
        tempImageBase64 = img.startsWith('data:') ? img : null;
        editModal.classList.add('active');
    }

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                tempImageBase64 = event.target.result;
                editPreview.src = tempImageBase64;
            };
            reader.readAsDataURL(file);
        }
    });

    btnSave.addEventListener('click', () => {
        if (currentEditingProfile) {
            const id = currentEditingProfile.getAttribute('data-id');
            const nomeEl = currentEditingProfile.querySelector('.nome-perfil');
            const imgEl = currentEditingProfile.querySelector('img');
            
            const newName = editName.value || nomeEl.textContent;
            const newImg = tempImageBase64 || imgEl.src;

            nomeEl.textContent = newName;
            imgEl.src = newImg;

            // Persist
            const saved = JSON.parse(localStorage.getItem('customProfiles') || '{}');
            saved[id] = { name: newName, img: newImg };
            localStorage.setItem('customProfiles', JSON.stringify(saved));
        }
        closeModal();
    });

    btnCancel.addEventListener('click', closeModal);

    function closeModal() {
        editModal.classList.remove('active');
        currentEditingProfile = null;
        tempImageBase64 = null;
    }
});