
// Program Data
const programs = [
    { name: "향기_아로마 오일 60분(12월할인)", price: "104,000원", desc: "천연 아로마 오일을 사용한 부드러운 전신 케어" },
    { name: "비움_건식 60분(12월할인)", price: "104,000원", desc: "뭉친 근육을 시원하게 풀어주는 건식 스포츠 마사지" },
    { name: "발길_발마사지(12월할인)", price: "104,000원", desc: "제2의 심장, 발의 피로를 풀어주는 집중 케어" },
    { name: "이슬_촉촉수분 60분(12월할인)", price: "140,000원", desc: "건조한 피부에 즉각적인 수분을 공급하는 페이셜 케어" },
    { name: "채움_시그니쳐 120분(회원가)", price: "276,000원", desc: "디오리엔탈만의 독창적인 테크닉을 집약한 프리미엄 관리" },
    { name: "맑음_전신 100분(회원가)", price: "208,000원", desc: "머리부터 발끝까지 맑은 기운을 채우는 전신 순환 케어" },
    { name: "흐름_림프 100분(회원가)", price: "216,000원", desc: "림프 순환을 돕고 노폐물 배출을 유도하는 디톡스 케어" },
    { name: "회복_통증 관리 90분(회원가)", price: "200,000원", desc: "만성 통증과 결림을 집중적으로 완화하는 치료적 마사지" },
    { name: "바당_피로회복 80분(회원가)", price: "176,000원", desc: "짧은 시간 안에 효율적으로 피로를 씻어내는 활력 코스" },
    { name: "연결_윤곽 70분(회원가)", price: "184,000원", desc: "얼굴의 선을 아름답게 정리해주는 윤곽 디자인 테라피" },
    { name: "팔로_수분관리&바디100분(회원가)", price: "224,000원", desc: "바디 릴렉싱과 페이셜 수분 관리를 동시에" },
    { name: "팔로_윤곽&바디 110분(회원가)", price: "280,000원", desc: "완벽한 바디 라인과 페이셜 라인을 위한 토탈 케어" },
    { name: "포근_커플 테라피 100분(회원가)", price: "392,000원", desc: "사랑하는 사람과 함께 나누는 편안하고 로맨틱한 휴식" },
    { name: "향기_아로마 오일 90분(회원가)", price: "176,000원", desc: "90분간의 깊은 이완, 아로마 향기의 향연" },
    { name: "비움_건식 90분(회원가)", price: "176,000원", desc: "전신 근육을 섬세하게 풀어주는 90분 건식 코스" },
    { name: "가꿈_전신 슬리밍 120분(회원가)", price: "280,000원", desc: "탄력 있는 바디 라인을 위한 집중 슬리밍 프로그램" },
    { name: "지움_상체 슬리밍100분(회원가)", price: "200,000원", desc: "등, 어깨, 팔 라인을 매끄럽게 정리하는 상체 집중 관리" },
    { name: "풀림_하체 슬리밍 100분(회원가)", price: "200,000원", desc: "부종 완화와 하체 라인 정리를 위한 하체 집중 관리" }
];

// Review Data
const initialReviews = [
    { name: "김*희", rating: 5, text: "아로마 오일 마사지 정말 좋았습니다. 향기도 너무 좋고 피로가 싹 풀렸어요." },
    { name: "Park S.W.", rating: 5, text: "커플 테라피 받았는데 분위기가 너무 로맨틱하고 좋네요. 재방문 의사 있습니다." },
    { name: "이*진", rating: 4, text: "압이 적당해서 좋았어요. 관리사분이 친절하십니다." }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderPrograms();
    renderReviews();
    setupEventListeners();
});

// Render Program List
function renderPrograms() {
    const list = document.getElementById('program-list');
    list.innerHTML = '';
    programs.forEach(prog => {
        const item = document.createElement('div');
        item.className = 'program-item';
        item.innerHTML = `
            <div class="program-info">
                <h4>${prog.name}</h4>
                <span>More Details ></span>
            </div>
            <div class="program-price">${prog.price}</div>
        `;
        item.onclick = () => showInfoModal(prog.name, prog.desc + "<br><br>가격: " + prog.price, true);
        list.appendChild(item);
    });
}

// Event Listeners
function setupEventListeners() {
    // Admin Toggle
    const adminPanel = document.getElementById('admin-panel');
    let adminVisible = false;
    document.getElementById('admin-toggle').onclick = () => {
        adminVisible = !adminVisible;
        adminPanel.style.display = adminVisible ? 'flex' : 'none';
    };

    // Sound Control
    const soundToggle = document.getElementById('sound-toggle');
    const volumeSlider = document.getElementById('volume-slider');

    // Initial State: Muted
    let isMuted = true;
    updateGlobalVolume(0);

    soundToggle.onclick = () => {
        isMuted = !isMuted;
        if (isMuted) {
            updateGlobalVolume(0);
            volumeSlider.value = 0;
            soundToggle.innerText = '🔇';
        } else {
            updateGlobalVolume(0.5); // Default to 50%
            volumeSlider.value = 0.5;
            soundToggle.innerText = '🔊';
        }
    };

    volumeSlider.oninput = (e) => {
        const val = parseFloat(e.target.value);
        if (val === 0) {
            isMuted = true;
            soundToggle.innerText = '🔇';
        } else {
            isMuted = false;
            soundToggle.innerText = '🔊';
        }
        updateGlobalVolume(val);
    };

    function updateGlobalVolume(vol) {
        document.querySelectorAll('video').forEach(vid => {
            vid.muted = (vol === 0);
            vid.volume = vol;
        });
    }

    // New Observer to handle dynamically added videos (like background change)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'VIDEO') {
                    node.muted = isMuted;
                    node.volume = parseFloat(volumeSlider.value);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });


    // Change Background
    document.getElementById('change-bg-btn').onclick = () => {
        document.getElementById('bg-upload').click();
    };

    document.getElementById('bg-upload').onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const homeSection = document.getElementById('home');
                homeSection.style.backgroundImage = `url('${e.target.result}')`;
                alert('배경이 변경되었습니다 (현재 세션 유지)');
            };
            reader.readAsDataURL(file);
        }
    };

    // Shop Tour Video Upload
    document.getElementById('shop-tour-btn').onclick = () => {
        document.getElementById('video-upload').click();
    };

    document.getElementById('video-upload').onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const aboutSection = document.getElementById('about');

            // Remove background image and existing video
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
            video.style.zIndex = '0'; // Behind content

            // Insert as first child
            aboutSection.insertBefore(video, aboutSection.firstChild);

            alert("영상이 업로드되어 배경으로 재생됩니다.");
        }
    };

    // Additional Image Upload for Modal
    const modalUpload = document.createElement('input');
    modalUpload.type = 'file';
    modalUpload.accept = 'image/*';
    modalUpload.style.display = 'none';
    modalUpload.id = 'modal-img-upload';
    document.body.appendChild(modalUpload);

    modalUpload.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.marginTop = '20px';
                img.style.borderRadius = '5px';
                document.getElementById('modal-desc').appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    };

    // Admin Login (Mock)
    document.getElementById('admin-login-btn').onclick = () => {
        const password = prompt("관리자 비밀번호를 입력하세요 (demo: 1234)");
        if (password === '1234') {
            alert("관리자 권한으로 로그인되었습니다. 편집 기능이 활성화됩니다.");
        } else {
            alert("비밀번호가 일치하지 않습니다.");
        }
    };

    // Reservation Form
    document.getElementById('reservation-form').onsubmit = (e) => {
        e.preventDefault();
        alert("예약이 접수되었습니다. 담당자가 곧 연락드리겠습니다.");
        closeModal('reservation-modal');
    };

    // Review Form Submit
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('review-name').value;
            const rating = document.getElementById('review-rating').value;
            const text = document.getElementById('review-text').value;

            addReview(name, rating, text);

            // Clear form
            document.getElementById('review-name').value = '';
            document.getElementById('review-text').value = '';
            alert("소중한 후기가 등록되었습니다!");
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

    // Remove existing add btn if any
    const oldBtn = document.getElementById('add-img-btn');
    if (oldBtn) oldBtn.remove();

    if (showAddBtn) {
        const btn = document.createElement('button');
        btn.id = 'add-img-btn';
        btn.innerText = '+ 이미지 추가';
        btn.style.marginTop = '15px';
        btn.className = 'hero-btn'; // reuse style
        btn.style.fontSize = '0.9rem';
        btn.style.padding = '5px 15px';
        btn.onclick = () => document.getElementById('modal-img-upload').click();
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



// Render Reviews
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

// Lightbox Functions
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    img.src = src;
    lightbox.classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

// Close modal on outside click
window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
};
