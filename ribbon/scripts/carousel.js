document.addEventListener('DOMContentLoaded', function() {
    const titleCards = document.getElementById('title-cards');
    const headCard = document.getElementById('head-card');
    const prevButton = document.getElementById('prev-card');
    const nextButton = document.getElementById('next-card');
    let currentIndex = 0;
    let isManualScrolling = false;

    // Move head card into title cards container
    titleCards.insertBefore(headCard, titleCards.firstChild);

    function updateCarousel(fromScroll = false) {
        const cards = Array.from(titleCards.children);
        const totalItems = cards.length;

        if (!fromScroll) {
            const cardWidth = cards[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(titleCards).gap);
            const scrollAmount = cardWidth + gap;
            
            titleCards.scrollTo({
                left: currentIndex * scrollAmount
            });
        }

        // Show/hide navigation buttons
        prevButton.style.display = currentIndex === 0 ? 'none' : 'block';
        nextButton.style.display = currentIndex >= totalItems - 1 ? 'none' : 'block';
    }

    // Handle manual scrolling
    let scrollTimeout;
    titleCards.addEventListener('scroll', function() {
        if (!isManualScrolling) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const cardWidth = titleCards.children[0].offsetWidth;
                const gap = parseInt(window.getComputedStyle(titleCards).gap);
                const scrollAmount = cardWidth + gap;
                
                // Calculate current index based on scroll position
                const scrollPosition = titleCards.scrollLeft;
                const newIndex = Math.round(scrollPosition / scrollAmount);
                
                if (currentIndex !== newIndex) {
                    currentIndex = newIndex;
                    updateCarousel(true);
                }
            }, 50); // Small delay to let native scroll snap finish
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            isManualScrolling = true;
            currentIndex--;
            updateCarousel();
            setTimeout(() => { isManualScrolling = false; }, 100);
        }
    });

    nextButton.addEventListener('click', () => {
        const totalItems = titleCards.children.length;
        if (currentIndex < totalItems - 1) {
            isManualScrolling = true;
            currentIndex++;
            updateCarousel();
            setTimeout(() => { isManualScrolling = false; }, 100);
        }
    });

    // Handle touch events for mobile scrolling
    let touchStartX = 0;
    headCard.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    headCard.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (diff > 50) { // Swipe left
            if (currentIndex === 0) {
                currentIndex = 1;
                updateCarousel();
            }
        }
    });

    // Reset carousel when new cards are loaded
    const observer = new MutationObserver(() => {
        currentIndex = 0;
        updateCarousel();
    });

    observer.observe(titleCards, { childList: true });

    // Initial update
    updateCarousel();
}); 