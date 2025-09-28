// PWA Service Worker Registration and Install Prompt
(function() {
    'use strict';

    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('Service Worker registered with scope:', registration.scope);

                    // Check for updates
                    registration.addEventListener('updatefound', function() {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', function() {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(function(error) {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }

    // Handle PWA install prompt
    let deferredPrompt;
    const installButton = document.createElement('button');
    installButton.id = 'install-button';
    installButton.innerHTML = '📱 Install App';
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(45deg, #ff0000, #8a2be2);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
        z-index: 1000;
        display: none;
        transition: all 0.3s ease;
    `;
    installButton.addEventListener('click', installApp);
    document.body.appendChild(installButton);

    window.addEventListener('beforeinstallprompt', function(e) {
        console.log('Install prompt triggered');
        e.preventDefault();
        deferredPrompt = e;
        installButton.style.display = 'block';
    });

    window.addEventListener('appinstalled', function() {
        console.log('App installed successfully');
        installButton.style.display = 'none';
        deferredPrompt = null;
    });

    async function installApp() {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        console.log('Install outcome:', outcome);
        installButton.style.display = 'none';
        deferredPrompt = null;
    }

    function showUpdateNotification() {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(45deg, #10b981, #059669);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                z-index: 1001;
                font-weight: 500;
                text-align: center;
                cursor: pointer;
            ">
                🎉 App updated! Click to refresh
            </div>
        `;
        notification.addEventListener('click', () => location.reload());
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 10000);
    }

    // Handle online/offline status
    window.addEventListener('online', function() {
        console.log('App is online');
        showNetworkStatus('🟢 Online', '#10b981');
    });

    window.addEventListener('offline', function() {
        console.log('App is offline');
        showNetworkStatus('🔴 Offline - Limited functionality', '#ef4444');
    });

    function showNetworkStatus(message, color) {
        const status = document.createElement('div');
        status.innerHTML = message;
        status.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: ${color};
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(status);

        setTimeout(() => {
            if (status.parentNode) {
                status.parentNode.removeChild(status);
            }
        }, 3000);
    }

})();
