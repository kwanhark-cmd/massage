// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // If siteConfig is missing (e.g., deleted), use a fallback or wait
    if (typeof siteConfig !== 'undefined') {
        renderContent();
        applySavedLayout();
    } else {
        console.warn("site_config.js not loaded. Using defaults.");
    }
    renderPrograms();
    renderReviews();
    setupEventListeners();
});

// Render Dynamic Text Content from Config
function renderContent() {
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        const keys = key.split('.');
        let value = siteConfig;
        keys.forEach(k => {
            if (value) value = value[k];
        });
        if (value) el.innerHTML = value;
    });
}

// Apply Saved Layout
function applySavedLayout() {
    if (!siteConfig.home.layout) return;

    // Video
    const v = siteConfig.home.layout.video;
    const vidContainer = document.querySelector('.video-container');
    if (vidContainer) {
        vidContainer.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.scale})`;
        // Update sliders if they exist
        const vidX = document.getElementById('vid-x');
        const vidY = document.getElementById('vid-y');
        const vidScale = document.getElementById('vid-scale');
        if (vidX) vidX.value = v.x;
        if (vidY) vidY.value = v.y;
        if (vidScale) vidScale.value = v.scale;
    }

    // Text
    const t = siteConfig.home.layout.text;
    const txtWrapper = document.querySelector('.text-wrapper');
    if (txtWrapper) {
        txtWrapper.style.transform = `translate(${t.x}px, ${t.y}px) scale(${t.scale})`;
        // Update sliders
        const txtX = document.getElementById('text-x');
        const txtY = document.getElementById('text-y');
        const txtScale = document.getElementById('text-scale');
        if (txtX) txtX.value = t.x;
        if (txtY) txtY.value = t.y;
        if (txtScale) txtScale.value = t.scale;
    }
}

// Render Program List (Modified to use siteConfig)
function renderPrograms() {
    const list = document.getElementById('program-list');
    if (!list) return;
    list.innerHTML = '';

    // Use siteConfig.programs if available, else fallback
    const data = (typeof siteConfig !== 'undefined' && siteConfig.programs) ? siteConfig.programs : [];

    data.forEach((prog, index) => {
        const item = document.createElement('div');
        item.className = 'program-item';

        item.innerHTML = `
            <div class="program-info">
                <h4 data-prog-idx="${index}" data-prog-field="name">${prog.name}</h4>
                <span>More Details ></span>
            </div>
            <div class="program-price" data-prog-idx="${index}" data-prog-field="price">${prog.price}</div>
        `;
        item.onclick = (e) => {
            // If editing, don't open modal
            if (document.body.classList.contains('admin-mode') && e.target.isContentEditable) return;
            showInfoModal(prog.name, prog.desc + "<br><br>가격: " + prog.price, true);
        };
        list.appendChild(item);
    });
}

// Enable/Disable Admin Edit Mode
function toggleAdminMode(enable) {
    const editableElements = document.querySelectorAll('[data-key], [data-prog-field]');
    const saveBtn = document.getElementById('save-config-btn');
    const changePwBtn = document.getElementById('change-pw-btn');
    const layoutEditor = document.getElementById('layout-editor');

    if (enable) {
        document.body.classList.add('admin-mode');
        if (saveBtn) saveBtn.style.display = 'block';
        if (changePwBtn) changePwBtn.style.display = 'block';
        if (layoutEditor) layoutEditor.style.display = 'block';

        editableElements.forEach(el => {
            el.contentEditable = "true";
            el.style.border = "1px dashed var(--primary-color)";
            el.style.padding = "2px";
        });

        // Initialize Layout Editor Interactions
        const videoContainer = document.querySelector('.video-container');
        const textWrapper = document.querySelector('.text-wrapper');

        if (videoContainer) videoContainer.style.cursor = 'grab';
        if (textWrapper) textWrapper.style.cursor = 'grab';

    } else {
        document.body.classList.remove('admin-mode');
        if (saveBtn) saveBtn.style.display = 'none';
        if (changePwBtn) changePwBtn.style.display = 'none';
        if (layoutEditor) layoutEditor.style.display = 'none';

        editableElements.forEach(el => {
            el.contentEditable = "false";
            el.style.border = "none";
            el.style.padding = "0";
        });
    }
}

// Save Configuration
function saveConfiguration() {
    if (typeof siteConfig === 'undefined') return;

    // 1. Update Text Content
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        const keys = key.split('.');

        // Deep update
        if (keys.length === 2 && siteConfig[keys[0]]) {
            siteConfig[keys[0]][keys[1]] = el.innerHTML; // Capture HTML for formatting
        }
    });

    // 2. Update Programs (if edited in place)
    document.querySelectorAll('[data-prog-field]').forEach(el => {
        const idx = el.getAttribute('data-prog-idx');
        const field = el.getAttribute('data-prog-field');
        if (siteConfig.programs[idx]) {
            siteConfig.programs[idx][field] = el.innerText; // Use innerText for safe values
        }
    });

    // 3. Update Layout Config from Sliders (or current transform)
    const vidX = document.getElementById('vid-x');
    const vidY = document.getElementById('vid-y');
    const vidScale = document.getElementById('vid-scale');
    if (vidX && vidY && vidScale) {
        siteConfig.home.layout.video = {
            x: parseInt(vidX.value),
            y: parseInt(vidY.value),
            scale: parseFloat(vidScale.value)
        };
    }

    const txtX = document.getElementById('text-x');
    const txtY = document.getElementById('text-y');
    const txtScale = document.getElementById('text-scale');
    if (txtX && txtY && txtScale) {
        siteConfig.home.layout.text = {
            x: parseInt(txtX.value),
            y: parseInt(txtY.value),
            scale: parseFloat(txtScale.value)
        };
    }

    // 4. Generate Download
    const configString = "const siteConfig = " + JSON.stringify(siteConfig, null, 4) + ";";
    const blob = new Blob([configString], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);

    // Create hidden link and click
    const a = document.createElement('a');
    a.href = url;
    a.download = "site_config.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert("설정 파일(site_config.js)이 다운로드되었습니다.\n이 파일을 프로젝트 폴더의 기존 파일과 교체하면 변경사항이 영구적으로 저장됩니다.");
}


// Event Listeners
function setupEventListeners() {
    // Admin Toggle
    const adminPanel = document.getElementById('admin-panel');
    let adminVisible = false;
    const adminToggle = document.getElementById('admin-toggle');
    if (adminToggle) {
        adminToggle.onclick = () => {
            adminVisible = !adminVisible;
            adminPanel.style.display = adminVisible ? 'flex' : 'none';
        };
    }

    // Intro & Sound Control
    const introOverlay = document.getElementById('intro-overlay');
    const enterBtn = document.getElementById('enter-btn');
    const soundToggle = document.getElementById('sound-toggle');
    const volumeSlider = document.getElementById('volume-slider');

    let isMuted = true;
    updateGlobalVolume(0);

    if (enterBtn) {
        enterBtn.onclick = () => {
            if (introOverlay) introOverlay.classList.add('hidden');
            isMuted = false;
            updateGlobalVolume(0.5);
            if (volumeSlider) volumeSlider.value = 0.5;
            if (soundToggle) soundToggle.innerText = '🔊';
            document.querySelectorAll('video').forEach(vid => {
                vid.play().catch(e => console.log("Playback failed:", e));
            });
        };
    }

    if (soundToggle) {
        soundToggle.onclick = () => {
            isMuted = !isMuted;
            if (isMuted) {
                updateGlobalVolume(0);
                if (volumeSlider) volumeSlider.value = 0;
                soundToggle.innerText = '🔇';
            } else {
                updateGlobalVolume(0.5);
                if (volumeSlider) volumeSlider.value = 0.5;
                soundToggle.innerText = '🔊';
            }
        };
    }

    if (volumeSlider) {
        volumeSlider.oninput = (e) => {
            const val = parseFloat(e.target.value);
            if (val === 0) {
                isMuted = true;
                if (soundToggle) soundToggle.innerText = '🔇';
            } else {
                isMuted = false;
                if (soundToggle) soundToggle.innerText = '🔊';
            }
            updateGlobalVolume(val);
        };
    }

    function updateGlobalVolume(vol) {
        document.querySelectorAll('video').forEach(vid => {
            vid.muted = (vol === 0);
            vid.volume = vol;
        });
    }

    // Observer
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'VIDEO') {
                    node.muted = isMuted;
                    node.volume = volumeSlider ? parseFloat(volumeSlider.value) : 0;
                    node.play().catch(() => console.log('Auto-play blocked'));
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Tap Listener
    document.addEventListener('click', () => {
        document.querySelectorAll('video').forEach(vid => {
            if (vid.paused) {
                vid.muted = isMuted;
                vid.play().catch(e => console.log("Click playback failed:", e));
            }
        });
    }, { once: true });

    // Home Video Logic
    const homeVideo = document.querySelector('#home video');
    if (homeVideo) {
        homeVideo.play().catch(() => { });
        homeVideo.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                homeVideo.requestFullscreen().catch(err => {
                    console.error(`Diff Error: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    }

    // Change Background
    const changeBgBtn = document.getElementById('change-bg-btn');
    if (changeBgBtn) {
        changeBgBtn.onclick = () => {
            document.getElementById('bg-upload').click();
        };
    }

    const bgUpload = document.getElementById('bg-upload');
    if (bgUpload) {
        bgUpload.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('home').style.backgroundImage = `url('${e.target.result}')`;
                    alert('배경이 변경되었습니다.');
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // Shop Tour Button
    const shopTourBtn = document.getElementById('shop-tour-btn');
    if (shopTourBtn) shopTourBtn.onclick = () => document.getElementById('video-upload').click();

    const videoUpload = document.getElementById('video-upload');
    if (videoUpload) {
        videoUpload.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                const aboutSection = document.getElementById('about');
                aboutSection.style.backgroundImage = 'none';
                let existingVideo = document.getElementById('about-video-bg');
                if (existingVideo) existingVideo.remove();
                const video = document.createElement('video');
                video.id = 'about-video-bg';
                video.src = url;
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.style.position = 'absolute';
                video.style.top = '0';
                video.style.left = '0';
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'cover';
                video.style.zIndex = '0';
                aboutSection.insertBefore(video, aboutSection.firstChild);
                alert("영상이 업로드 재생됩니다.");
            }
        };
    }

    // Video Layout Editor Logic
    const vidControlX = document.getElementById('vid-x');
    const vidControlY = document.getElementById('vid-y');
    const vidControlScale = document.getElementById('vid-scale');
    const videoContainer = document.querySelector('.video-container');

    // Text Layout Editor Logic
    const textControlX = document.getElementById('text-x');
    const textControlY = document.getElementById('text-y');
    const textControlScale = document.getElementById('text-scale');
    const textWrapper = document.querySelector('.text-wrapper');

    function setupInteractiveElement(element, ctrlX, ctrlY, ctrlScale) {
        if (!element) return;
        let isDragging = false;
        let startX, startY;
        let currentX = 0, currentY = 0, currentScale = 1;

        // Initialize from slider if values exist (from applySavedLayout)
        if (ctrlX) currentX = parseInt(ctrlX.value);
        if (ctrlY) currentY = parseInt(ctrlY.value);
        if (ctrlScale) currentScale = parseFloat(ctrlScale.value);

        function updateLayout() {
            element.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
            if (ctrlX) ctrlX.value = currentX;
            if (ctrlY) ctrlY.value = currentY;
            if (ctrlScale) ctrlScale.value = currentScale;
        }

        if (ctrlX) ctrlX.addEventListener('input', (e) => { currentX = parseInt(e.target.value); updateLayout(); });
        if (ctrlY) ctrlY.addEventListener('input', (e) => { currentY = parseInt(e.target.value); updateLayout(); });
        if (ctrlScale) ctrlScale.addEventListener('input', (e) => { currentScale = parseFloat(e.target.value); updateLayout(); });

        element.addEventListener('mousedown', (e) => {
            if (!document.body.classList.contains('admin-mode')) return;
            isDragging = true;
            startX = e.clientX - currentX;
            startY = e.clientY - currentY;
            element.style.cursor = 'grabbing';
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX - startX;
            currentY = e.clientY - startY;
            updateLayout();
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'grab';
            }
        });

        element.addEventListener('wheel', (e) => {
            if (!document.body.classList.contains('admin-mode')) return;
            e.preventDefault();
            const delta = e.deltaY * -0.001;
            currentScale = Math.min(Math.max(0.5, currentScale + delta), 2);
            updateLayout();
        }, { passive: false });
    }

    setupInteractiveElement(videoContainer, vidControlX, vidControlY, vidControlScale);
    setupInteractiveElement(textWrapper, textControlX, textControlY, textControlScale);

    // Consolidated Admin Login Handler
    const adminLoginBtn = document.getElementById('admin-login-btn');
    if (adminLoginBtn) {
        adminLoginBtn.onclick = () => {
            const currentPw = (typeof siteConfig !== 'undefined' && siteConfig.adminPassword) ? siteConfig.adminPassword : '1234';
            const password = prompt("관리자 비밀번호를 입력하세요");
            if (password === currentPw) {
                alert("관리자 권한으로 로그인되었습니다.\n\n[가능한 작업]\n1. 텍스트를 클릭하여 직접 수정\n2. 배경/영상/텍스트 레이아웃 조절\n3. '변경사항 저장' 버튼으로 설정 파일 다운로드");
                toggleAdminMode(true);
            } else {
                alert("비밀번호가 일치하지 않습니다.");
            }
        };
    }

    // Change Password Handler
    const changePwBtn = document.getElementById('change-pw-btn');
    if (changePwBtn) {
        changePwBtn.onclick = () => {
            const newPw = prompt("새로운 비밀번호를 입력하세요:");
            if (newPw) {
                siteConfig.adminPassword = newPw;
                alert(`비밀번호가 변경되었습니다: ${newPw}\n\n'변경사항 저장' 버튼을 눌러야 영구적으로 적용됩니다.`);
            }
        };
    }

    // Save Button Handler
    const saveBtn = document.getElementById('save-config-btn');
    if (saveBtn) {
        saveBtn.onclick = saveConfiguration;
    }

    // Reservation Form
    const resForm = document.getElementById('reservation-form');
    if (resForm) {
        resForm.onsubmit = (e) => {
            e.preventDefault();
            alert("예약이 접수되었습니다. 담당자가 곧 연락드리겠습니다.");
            closeModal('reservation-modal');
        };
    }

    // Review Form
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('review-name').value;
            const rating = document.getElementById('review-rating').value;
            const text = document.getElementById('review-text').value;
            addReview(name, rating, text);
            document.getElementById('review-name').value = '';
            document.getElementById('review-text').value = '';
            alert("소중한 후기가 등록되었습니다!");
        };
    }

    // Additional Image Upload for Modal
    const modalUpload = document.getElementById('modal-img-upload');
    if (!modalUpload) {
        const modalUploadEl = document.createElement('input');
        modalUploadEl.type = 'file';
        modalUploadEl.accept = 'image/*';
        modalUploadEl.style.display = 'none';
        modalUploadEl.id = 'modal-img-upload';
        document.body.appendChild(modalUploadEl);

        modalUploadEl.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '100%';
                    img.style.marginTop = '20px';
                    img.style.borderRadius = '5px';
                    const descEl = document.getElementById('modal-desc');
                    if (descEl) descEl.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        };
    }
}

// Modals
function showDetail(type) {
    let title = "";
    let desc = "";
    if (type === 'aroma') {
        title = "아로마 오일 테라피";
        desc = "최고급 천연 아로마 오일을 블렌딩하여 심신의 안정을 돕고 근육의 긴장을 부드럽게 이완시킵니다.";
    } else if (type === 'dry') {
        title = "건식 수기 관리";
        desc = "오일을 사용하지 않고 손과 신체의 압을 이용하여 뭉친 근육을 깊숙이 자극하는 전통 마사지입니다.";
    } else if (type === 'foot') {
        title = "풋 스페셜 케어";
        desc = "발 반사구를 자극하여 전신의 순환을 촉진하고 피로를 효과적으로 해소합니다.";
    }
    showInfoModal(title, desc, false);
}

function showInfoModal(title, content, showAddBtn) {
    document.getElementById('modal-title').innerText = title;
    const descEl = document.getElementById('modal-desc');
    descEl.innerHTML = content;
    const oldBtn = document.getElementById('add-img-btn');
    if (oldBtn) oldBtn.remove();
    if (showAddBtn) {
        const btn = document.createElement('button');
        btn.id = 'add-img-btn';
        btn.innerText = '+ 이미지 추가';
        btn.style.marginTop = '15px';
        btn.className = 'hero-btn';
        btn.style.fontSize = '0.9rem';
        btn.style.padding = '5px 15px';
        btn.onclick = () => {
            const up = document.getElementById('modal-img-upload');
            if (up) up.click();
        };
        descEl.appendChild(document.createElement('br'));
        descEl.appendChild(btn);
    }
    document.getElementById('info-modal').classList.add('active');
}

function openReservation() {
    document.getElementById('reservation-modal').classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Review Data (Non-persistent demo)
const initialReviews = [
    { name: "김*희", rating: 5, text: "아로마 오일 마사지 정말 좋았습니다. 향기도 너무 좋고 피로가 싹 풀렸어요." },
    { name: "Park S.W.", rating: 5, text: "커플 테라피 받았는데 분위기가 너무 로맨틱하고 좋네요. 재방문 의사 있습니다." },
    { name: "이*진", rating: 4, text: "압이 적당해서 좋았어요. 관리사분이 친절하십니다." }
];

function renderReviews() {
    const list = document.getElementById('review-list');
    if (!list) return;
    list.innerHTML = '';
    initialReviews.forEach(r => {
        const card = createReviewCard(r.name, r.rating, r.text);
        list.appendChild(card);
    });
}

function addReview(name, rating, text) {
    const list = document.getElementById('review-list');
    const card = createReviewCard(name, rating, text);
    list.insertBefore(card, list.firstChild);
}

function createReviewCard(name, rating, text) {
    const div = document.createElement('div');
    div.className = 'review-card';
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    div.innerHTML = `
        <div class="review-header">
            <span class="review-name">${name}</span>
            <span class="review-rating">${stars}</span>
        </div>
        <div class="review-body">${text}</div>
    `;
    return div;
}

// Lightbox
let currentImageIndex = 0;
let galleryImages = [];

function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    galleryImages = Array.from(document.querySelectorAll('.gallery-grid img')).map(img => img.src);
    currentImageIndex = galleryImages.indexOf(src);
    updateLightboxImage();
    lightbox.classList.add('active');
    document.addEventListener('keydown', handleLightboxKeys);
}

function updateLightboxImage() {
    document.getElementById('lightbox-img').src = galleryImages[currentImageIndex];
}

function changeImage(step, event) {
    if (event) event.stopPropagation();
    currentImageIndex += step;
    if (currentImageIndex >= galleryImages.length) currentImageIndex = 0;
    if (currentImageIndex < 0) currentImageIndex = galleryImages.length - 1;
    updateLightboxImage();
}

function closeLightbox(event) {
    if (!event || event.target.id === 'lightbox' || event.target.className === 'close-modal') {
        document.getElementById('lightbox').classList.remove('active');
        document.removeEventListener('keydown', handleLightboxKeys);
    }
}

function handleLightboxKeys(e) {
    if (e.key === 'ArrowRight') changeImage(1);
    if (e.key === 'ArrowLeft') changeImage(-1);
    if (e.key === 'Escape') closeLightbox(null);
}

// Swipe Support
let touchStartX = 0;
let touchEndX = 0;
const lightbox = document.getElementById('lightbox');
if (lightbox) {
    lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    lightbox.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); }, { passive: true });
}

function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) changeImage(1);
    if (touchEndX > touchStartX + threshold) changeImage(-1);
}
