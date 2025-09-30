document.addEventListener('DOMContentLoaded', () => {
    const userIpSpan = document.getElementById('user-ip');
    const ipDetailsDiv = document.getElementById('ip-details');
    const ipInput = document.getElementById('ip-input');
    const trackIpBtn = document.getElementById('track-ip-btn');
    const trackIpDetailsDiv = document.getElementById('track-ip-details');

    // Function to fetch and display IP information
    const getIpInfo = async (ipAddress = '') => {
        const targetDiv = ipAddress ? trackIpDetailsDiv : ipDetailsDiv;
        targetDiv.innerHTML = '<p>جاري البحث عن المعلومات...</p>';
        try {
            const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.error) {
                throw new Error(data.reason);
            }

            if (!ipAddress) {
                userIpSpan.textContent = data.ip;
            }

            targetDiv.innerHTML = `
                <p><strong>IP:</strong> ${data.ip}</p>
                <p><strong>المدينة:</strong> ${data.city}</p>
                <p><strong>المنطقة:</strong> ${data.region}</p>
                <p><strong>الدولة:</strong> ${data.country_name}</p>
                <p><strong>القارة:</strong> ${data.continent_code}</p>
                <p><strong>خط العرض:</strong> ${data.latitude}</p>
                <p><strong>خط الطول:</strong> ${data.longitude}</p>
                <p><strong>المنطقة الزمنية:</strong> ${data.timezone}</p>
                <p><strong>مزود الخدمة:</strong> ${data.org}</p>
            `;
        } catch (error) {
            console.error('Error fetching IP info:', error);
            targetDiv.innerHTML = `<p style="color: #ff4d4d;">حدث خطأ: ${error.message}</p>`;
            if (!ipAddress) {
                userIpSpan.textContent = 'فشل البحث';
            }
        }
    };

    // Get user's IP on page load
    getIpInfo();

    // Event listener for the track IP button
    trackIpBtn.addEventListener('click', () => {
        const ip = ipInput.value.trim();
        if (ip) {
            getIpInfo(ip);
        } else {
            trackIpDetailsDiv.innerHTML = '<p style="color: #ffcc00;">الرجاء إدخال عنوان IP صالح.</p>';
        }
    });

    // Ping Tool
    const pingBtn = document.getElementById('ping-btn');
    const pingStatus = document.getElementById('ping-status');
    const pingResult = document.getElementById('ping-result');

    pingBtn.addEventListener('click', async () => {
        pingStatus.textContent = 'جاري الاختبار...';
        pingResult.textContent = '';
        const startTime = performance.now();

        try {
            // We fetch a small resource to measure latency.
            // Using { cache: 'no-store' } to ensure we are not getting a cached response.
            const response = await fetch('https://ipapi.co/json/', { cache: 'no-store', mode: 'cors' });
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            const endTime = performance.now();
            const latency = Math.round(endTime - startTime);
            pingStatus.textContent = 'اكتمل';
            pingResult.textContent = `${latency} ms`;
        } catch (error) {
            console.error('Ping test failed:', error);
            pingStatus.textContent = 'فشل';
            pingResult.textContent = 'لا يمكن الوصول للخادم';
        }
    });

    // System Info
    const getGpuInfo = () => {
        const gpuInfoSpan = document.getElementById('gpu-info');
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    gpuInfoSpan.textContent = renderer;
                } else {
                    gpuInfoSpan.textContent = 'لا يمكن الوصول لمعلومات مفصلة';
                }
            } else {
                gpuInfoSpan.textContent = 'WebGL غير مدعوم في هذا المتصفح';
            }
        } catch (error) {
            console.error('Error getting GPU info:', error);
            gpuInfoSpan.textContent = 'حدث خطأ أثناء جلب المعلومات';
        }
    };

    getGpuInfo();

    // Storage Info
    const getStorageInfo = async () => {
        const storageInfoSpan = document.getElementById('storage-info');
        if (navigator.storage && navigator.storage.estimate) {
            try {
                const formatBytes = (bytes, decimals = 2) => {
                    if (bytes === 0) return '0 Bytes';
                    const k = 1024;
                    const dm = decimals < 0 ? 0 : decimals;
                    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
                }

                const estimate = await navigator.storage.estimate();
                const used = formatBytes(estimate.usage);
                const quota = formatBytes(estimate.quota);
                storageInfoSpan.textContent = `المستخدم: ${used} / الإجمالي: ${quota}`;
            } catch (error) {
                console.error('Error getting storage estimate:', error);
                storageInfoSpan.textContent = 'تعذر الحساب';
            }
        } else {
            storageInfoSpan.textContent = 'الميزة غير مدعومة في المتصفح';
        }
    };

    getStorageInfo();

    console.log('تم تحميل الموقع بنجاح');
});