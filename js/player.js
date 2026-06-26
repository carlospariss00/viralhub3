document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');
    const videoPlayer = document.getElementById('videoPlayer');
    const container = document.querySelector('.container');
    
    if (videoId && videoPlayer) {
        try {
            const response = await fetch('data/videos.json');
            const videos = await response.json();
            const videoData = videos.find(v => v.id.toString() === videoId);

            if (videoData) {
                videoPlayer.src = videoData.src;
                document.title = `${videoData.title} - PlacerVerdadero`;
                
                // Opcional: Limpiar la URL para que sea aún más bonita (ej: placerverdadero.com/v1)
                // history.replaceState(null, '', `video${videoId}`); 
            } else {
                showNotFound();
            }
        } catch (error) {
            console.error('Error cargando video:', error);
            showNotFound();
        }
    } else if (container) {
        showNotFound();
    }

    function showNotFound() {
        if (container) {
            container.innerHTML = `
                <div class="not-found">
                    <h2>Video no encontrado</h2>
                    <a href="index.html">Volver a la galería</a>
                </div>`;
        }
    }

    // --- PROTECCIÓN EXTRA CONTRA DESCARGAS ---
    document.addEventListener('contextmenu', e => e.preventDefault());

    document.addEventListener('keydown', e => {
        if ((e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'i' || e.key === 'j')) || 
            (e.keyCode === 123)) { 
            e.preventDefault();
            return false;
        }
    });

    if (videoPlayer) {
        videoPlayer.setAttribute('controlsList', 'nodownload');
        videoPlayer.addEventListener('dragstart', e => e.preventDefault());
    }
});


