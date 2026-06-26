const PAGE_SIZE = 15;
let videos = [];

function getCurrentPageFromURL() {
    const params = new URLSearchParams(window.location.search);
    const p = parseInt(params.get('page')) || 1;
    return Math.max(1, p);
}

function setPageInURL(page) {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page);
    const newUrl = window.location.pathname + '?' + params.toString();
    history.pushState({}, '', newUrl);
}

function renderPage(page) {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    const totalPages = Math.max(1, Math.ceil(videos.length / PAGE_SIZE));
    if (page > totalPages) page = totalPages;

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const slice = videos.slice(start, end);

    slice.forEach(video => {
        const div = document.createElement('div');
        div.className = 'video-item';
        div.innerHTML = `
            <div>🎬</div>
            <div class="video-title">${video.title}</div>
        `;
        div.onclick = () => {
            window.location.href = `play.html?v=${video.id}`;
        };
        gallery.appendChild(div);
    });

    // update controls
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');

    if (prevBtn) prevBtn.disabled = (page <= 1);
    if (nextBtn) nextBtn.disabled = (page >= totalPages);
    if (pageInfo) pageInfo.textContent = `Página ${page} de ${totalPages}`;

    setPageInURL(page);
}

async function init() {
    try {
        const response = await fetch('data/videos.json');
        videos = await response.json();
        
        let currentPage = getCurrentPageFromURL();
        renderPage(currentPage);

        document.getElementById('prevBtn')?.addEventListener('click', () => {
            const page = Math.max(1, getCurrentPageFromURL() - 1);
            renderPage(page);
        });

        document.getElementById('nextBtn')?.addEventListener('click', () => {
            const totalPages = Math.max(1, Math.ceil(videos.length / PAGE_SIZE));
            const page = Math.min(totalPages, getCurrentPageFromURL() + 1);
            renderPage(page);
        });

        window.addEventListener('popstate', () => {
            const p = getCurrentPageFromURL();
            renderPage(p);
        });
    } catch (error) {
        console.error('Error cargando videos:', error);
    }
}

document.addEventListener('DOMContentLoaded', init);
