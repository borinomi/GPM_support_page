/**
 * Dynamic Banner Ad System for Group Post Manager Extension
 * Hosted on gpm.anhmake.com/ads/
 */

class BannerAdSystem {
    constructor() {
        this.banners = [
            {
                id: 'premium-upgrade',
                image: 'https://gpm.anhmake.com/ads/premium-upgrade.png',
                url: 'https://gpm.anhmake.com/#pricing',
                title: 'Premium Upgrade - Remove Ads',
                type: 'internal'
            },
            {
                id: 'website-visit', 
                image: 'https://gpm.anhmake.com/ads/website-visit.png',
                url: 'https://gpm.anhmake.com/',
                title: 'Visit Our Website',
                type: 'internal'
            },
            {
                id: 'features-highlight',
                image: 'https://gpm.anhmake.com/ads/features-highlight.png', 
                url: 'https://gpm.anhmake.com/#features',
                title: 'New Features Available',
                type: 'internal'
            }
        ];
        
        this.currentBannerIndex = 0;
        this.rotationInterval = null;
        this.isInitialized = false;
    }
    
    /**
     * Initialize the banner system
     */
    init() {
        if (this.isInitialized) return;
        
        const bannerContainer = document.getElementById('banner-ad');
        if (!bannerContainer) {
            console.warn('Banner container not found');
            return;
        }
        
        this.loadRandomBanner();
        this.startRotation();
        this.isInitialized = true;
        
        console.log('Banner ad system initialized');
    }
    
    /**
     * Load a random banner
     */
    loadRandomBanner() {
        if (this.banners.length === 0) return;
        
        // Get random banner
        const randomIndex = Math.floor(Math.random() * this.banners.length);
        const banner = this.banners[randomIndex];
        this.currentBannerIndex = randomIndex;
        
        this.displayBanner(banner);
    }
    
    /**
     * Display a specific banner
     */
    displayBanner(banner) {
        const bannerContainer = document.getElementById('banner-ad');
        if (!bannerContainer) return;
        
        // Create banner HTML
        bannerContainer.innerHTML = `
            <div class="banner-ad-content">
                <a href="${banner.url}" class="banner-ad-link" target="_blank" rel="noopener" title="${banner.title}">
                    <img src="${banner.image}" alt="${banner.title}" 
                         onload="this.style.opacity=1" 
                         onerror="this.parentElement.parentElement.innerHTML='<div class=\\"banner-ad-placeholder\\"><span class=\\"icon\\">📢</span><div>Ad Loading Failed</div></div>'"
                         style="opacity: 0; transition: opacity 0.3s;">
                </a>
            </div>
        `;
        
        // Track banner impression
        this.trackImpression(banner);
    }
    
    /**
     * Start banner rotation (every 10 seconds)
     */
    startRotation() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
        }
        
        this.rotationInterval = setInterval(() => {
            this.loadRandomBanner();
        }, 10000); // 10 seconds
    }
    
    /**
     * Stop banner rotation
     */
    stopRotation() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
        }
    }
    
    /**
     * Track banner impression (for analytics)
     */
    trackImpression(banner) {
        // Send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'banner_impression', {
                event_category: 'advertisement',
                event_label: banner.id,
                banner_type: banner.type
            });
        }
        
        console.log('Banner impression tracked:', banner.id);
    }
    
    /**
     * Track banner click (called when banner is clicked)
     */
    trackClick(banner) {
        // Send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'banner_click', {
                event_category: 'advertisement', 
                event_label: banner.id,
                banner_type: banner.type,
                target_url: banner.url
            });
        }
        
        console.log('Banner click tracked:', banner.id);
    }
    
    /**
     * Add a new banner to rotation
     */
    addBanner(banner) {
        this.banners.push(banner);
        console.log('New banner added:', banner.id);
    }
    
    /**
     * Remove a banner from rotation
     */
    removeBanner(bannerId) {
        this.banners = this.banners.filter(banner => banner.id !== bannerId);
        console.log('Banner removed:', bannerId);
    }
    
    /**
     * Update banner configuration from remote source
     */
    async updateBannersFromRemote() {
        try {
            const response = await fetch('https://gpm.anhmake.com/ads/banner-config.json');
            if (response.ok) {
                const remoteBanners = await response.json();
                this.banners = remoteBanners;
                console.log('Banner configuration updated from remote');
            }
        } catch (error) {
            console.warn('Failed to update banners from remote:', error);
        }
    }
}

// Global banner system instance
window.bannerSystem = new BannerAdSystem();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the popup to fully load
    setTimeout(() => {
        window.bannerSystem.init();
    }, 1000);
});

// Clean up on unload
window.addEventListener('beforeunload', () => {
    if (window.bannerSystem) {
        window.bannerSystem.stopRotation();
    }
});