// 当前幻灯片索引
let currentSlide = 1;
const totalSlides = 8;

// 获取DOM元素
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const currentSlideSpan = document.getElementById('current-slide');
const totalSlidesSpan = document.getElementById('total-slides');

// 初始化
function init() {
    totalSlidesSpan.textContent = totalSlides;
    updateSlideDisplay();
    
    // 键盘事件监听
    document.addEventListener('keydown', handleKeyPress);
    
    // 触摸事件支持
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) prevSlide();
    }
}

// 更新幻灯片显示
function updateSlideDisplay() {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index + 1 === currentSlide);
    });
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index + 1 === currentSlide);
    });
    
    currentSlideSpan.textContent = currentSlide;
    
    // 更新导航按钮状态
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
}

// 下一张幻灯片
function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        updateSlideDisplay();
    }
}

// 上一张幻灯片
function prevSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        updateSlideDisplay();
    }
}

// 跳转到指定幻灯片
function goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
        currentSlide = slideNumber;
        updateSlideDisplay();
    }
}

// 键盘事件处理
function handleKeyPress(e) {
    switch(e.key) {
        case 'ArrowRight':
        case ' ':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            prevSlide();
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(1);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides);
            break;
        case 'Escape':
            // 全屏切换
            toggleFullscreen();
            break;
    }
}

// 全屏切换
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// 演示区域交互
function initDemoInteraction() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// 鼠标手势支持
let mouseStartX = 0;
let isMouseDown = false;

document.addEventListener('mousedown', e => {
    if (e.target.closest('.slide')) {
        mouseStartX = e.clientX;
        isMouseDown = true;
    }
});

document.addEventListener('mouseup', e => {
    if (isMouseDown) {
        const mouseEndX = e.clientX;
        const diff = mouseEndX - mouseStartX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }
    isMouseDown = false;
});

// 防止右键菜单
document.addEventListener('contextmenu', e => {
    e.preventDefault();
});

// 自动播放功能已移除 - 根据用户需求关闭

// 页面可见性API
function handleVisibilityChange() {
    if (document.hidden) {
        stopAutoPlay();
    } else {
        // 可选：页面可见时重新开始
        // startAutoPlay();
    }
}

document.addEventListener('visibilitychange', handleVisibilityChange);

// 打印功能
function printSlides() {
    window.print();
}

// 添加控制台帮助信息
console.log(`
🎯 来鼓2.0发布会演示控制
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖱️ 鼠标: 左右滑动切换幻灯片
⌨️ 键盘: 
   → 或 空格: 下一张
   ←: 上一张
   Home: 第一张
   End: 最后一张
   Esc: 全屏切换
📱 触屏: 左右滑动切换
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    init();
    initDemoInteraction();
    
    // 添加加载完成动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 窗口大小改变时重新计算
window.addEventListener('resize', () => {
    // 可以在这里添加响应式调整逻辑
});

// 导出函数到全局作用域
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;