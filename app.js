// Dummy Knowledge Database for Blood Inventory
const mockInventory = [
    { hospital: "City General Hospital", location: "New York, NY", distance: "2.4 km", stocks: [ { type: "A+", units: 12 }, { type: "O-", units: 3 }, { type: "B+", units: 8 } ] },
    { hospital: "Metro Medical Center", location: "Manhattan, NY", distance: "4.1 km", stocks: [ { type: "O+", units: 25 }, { type: "AB+", units: 5 }, { type: "A-", units: 2 } ] },
    { hospital: "St. Jude's Care", location: "Brooklyn, NY", distance: "6.8 km", stocks: [ { type: "B-", units: 1 }, { type: "AB-", units: 2 }, { type: "O-", units: 10 } ] },
    { hospital: "Central Blood Bank", location: "Queens, NY", distance: "8.2 km", stocks: [ { type: "A+", units: 40 }, { type: "B+", units: 30 }, { type: "O+", units: 50 }, { type: "AB+", units: 15 } ] },
    { hospital: "Community Health Hub", location: "Staten Island, NY", distance: "12.5 km", stocks: [ { type: "A-", units: 4 }, { type: "O-", units: 1 }, { type: "B-", units: 3 } ] },
    { hospital: "Riverfront Clinic", location: "Jersey City, NJ", distance: "15.0 km", stocks: [ { type: "A+", units: 8 }, { type: "B+", units: 12 } ] }
];

document.addEventListener("DOMContentLoaded", () => {
    // Current Year for Footer (if present)
    const currentYearEl = document.getElementById("currentYear");
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

    // DOM Elements (may be absent on some pages)
    const navbar = document.querySelector(".navbar");
    const mobileToggle = document.getElementById("mobileToggle");
    const searchForm = document.getElementById("searchForm");
    const inventoryResults = document.getElementById("inventoryResults");
    const requestBtn = document.getElementById("requestBtn");
    const requestModal = document.getElementById("requestModal");
    const loginBtn = document.getElementById("loginBtn");
    const loginModal = document.getElementById("loginModal");
    const closeModalBtns = document.querySelectorAll(".close-modal");

    // Scroll Effect on Navbar (only if navbar exists)
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.style.background = "rgba(10, 10, 12, 0.95)";
                navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.5)";
            } else {
                navbar.style.background = "rgba(10, 10, 12, 0.7)";
                navbar.style.boxShadow = "none";
            }

            // Active Link Highlighting for single-page layout (skip on separate pages)
            const sections = document.querySelectorAll("section");
            let current = "";

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 150) {
                    current = section.getAttribute("id");
                }
            });

            document.querySelectorAll(".nav-link").forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href").includes(current)) {
                    link.classList.add("active");
                }
            });
        });
    }

    // Mobile Toggle
    if (mobileToggle) {
        mobileToggle.addEventListener("click", () => {
            const icon = mobileToggle.querySelector("i");
            if (icon) {
                if (icon.classList.contains("ph-list")) {
                    icon.classList.replace("ph-list", "ph-x");
                } else {
                    icon.classList.replace("ph-x", "ph-list");
                }
            }
        });
    }

    // Modal Handling
    const openModal = (modal) => {
        modal.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    };

    const closeModal = (modal) => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    };

    if (requestBtn) {
        requestBtn.addEventListener("click", () => {
             window.location.href = "request-blood.html";
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", () => openModal(loginModal));
    }

    if (closeModalBtns && closeModalBtns.length) {
        closeModalBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const overlay = e.target.closest(".modal-overlay");
                if (overlay) closeModal(overlay);
            });
        });
    }

    // Close on clicking outside
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeModal(overlay);
        });
    });

    // Handle Request Form Submission (if present)
    const requestForm = document.getElementById("requestBloodForm");
    if (requestForm) {
        requestForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn ? btn.innerHTML : "Submit";
            if (btn) {
                btn.innerHTML = `<i class="ph ph-spinner-gap ph-spin"></i> Submitting...`;
                btn.disabled = true;
            }

            setTimeout(() => {
                if (btn) {
                    btn.innerHTML = `<i class="ph ph-check-circle"></i> Request Sent Successfully!`;
                    btn.style.backgroundColor = "#4caf50";
                    btn.style.boxShadow = "0 4px 15px rgba(76, 175, 80, 0.4)";
                }

                setTimeout(() => {
                    if (requestModal) closeModal(requestModal);
                    e.target.reset();
                    if (btn) {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        btn.style = ""; // Reset inline styles
                    }
                }, 1200);
            }, 900);
        });
    }

    // Handle Login Form Submission (if present)
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        async function hashPassword(pwd) {
            const msgBuffer = new TextEncoder().encode(pwd);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const identifierInput = loginForm.querySelector('input[type="email"]') || loginForm.querySelector('input[type="text"]');
            const identifier = identifierInput ? identifierInput.value : '';
            const password = loginForm.querySelector('input[type="password"]').value;
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn ? btn.innerHTML : "Login";
            
            if (btn) {
                btn.innerHTML = `<i class="ph ph-spinner-gap ph-spin"></i> Verifying...`;
                btn.disabled = true;
            }

            const hashedAttempt = await hashPassword(password);
            const usersDB = JSON.parse(localStorage.getItem('sanguis_users')) || [];
            
            const user = usersDB.find(u => u.phone === identifier || u.name === identifier || (u.email && u.email === identifier));

            if (!user || user.password !== hashedAttempt) {
                setTimeout(() => {
                    alert("Invalid password. Please enter the correct registered password.");
                    if (btn) {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }
                }, 400);
                return;
            }

            setTimeout(() => {
                if (btn) {
                    btn.innerHTML = `<i class="ph ph-check-circle"></i> Login Successful!`;
                    btn.style.backgroundColor = "#4caf50";
                    btn.style.boxShadow = "0 4px 15px rgba(76, 175, 80, 0.4)";
                }

                // Store login info in localStorage
                localStorage.setItem('sanguis_user', JSON.stringify({ 
                    phone: user.phone,
                    name: user.name,
                    role: user.role,
                    loginTime: new Date().toISOString()
                }));

                setTimeout(() => {
                    if (loginModal) closeModal(loginModal);
                    loginForm.reset();
                    if (btn) {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        btn.style = ""; // Reset inline styles
                    }
                    if (loginBtn) {
                        loginBtn.textContent = "Logout";
                        loginBtn.classList.add("logged-in");
                    }
                    if (user.role === 'donor') window.location.href = "donors.html";
                    else if (user.role === 'patient') window.location.href = "emergency.html";
                    else window.location.href = "index.html";
                }, 1200);
            }, 800);
        });
    }

    // Handle Login Button Toggle
    if (loginBtn) {
        const savedUser = localStorage.getItem('sanguis_user');
        if (savedUser) {
            loginBtn.textContent = "Logout";
            loginBtn.classList.add("logged-in");
            loginBtn.removeEventListener("click", () => openModal(loginModal));
            loginBtn.addEventListener("click", () => {
                localStorage.removeItem('sanguis_user');
                loginBtn.textContent = "Login";
                loginBtn.classList.remove("logged-in");
                location.reload();
            });
        }
    }

    // Handle Search form and inventory rendering (if present)
    if (inventoryResults) {
        const renderInventory = (queryLoc = "", queryType = "all") => {
            inventoryResults.innerHTML = "";

            const filtered = mockInventory.filter(item => {
                const locMatch = item.location.toLowerCase().includes(queryLoc.toLowerCase()) || item.hospital.toLowerCase().includes(queryLoc.toLowerCase());

                let typeMatch = false;
                if (queryType === "all") {
                    typeMatch = true;
                } else {
                    item.stocks.forEach(stock => {
                        if (stock.type === queryType && stock.units > 0) typeMatch = true;
                    });
                }

                return locMatch && typeMatch;
            });

            if (filtered.length === 0) {
                inventoryResults.innerHTML = `
                    <div class="glass-panel" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <i class="ph ph-warning-circle" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                        <h3>No exact matches found</h3>
                        <p class="text-muted">Try adjusting your search criteria or broadening your location.</p>
                    </div>
                `;
                return;
            }

            filtered.forEach(item => {
                const card = document.createElement("div");
                card.className = "inventory-card";

                let stocksHTML = "";
                item.stocks.forEach(stock => {
                    const isMatch = queryType === "all" || stock.type === queryType;
                    const opacity = isMatch ? "1" : "0.4";

                    stocksHTML += `
                        <div class="stock-item" style="opacity: ${opacity}">
                            <div class="blood-type-badge ${stock.type.includes('O') ? 'type-o' : 'type-ab'}" style="width:30px; height:30px; font-size:0.8rem; border-radius:6px;">
                                ${stock.type}
                            </div>
                            <span class="stock-amount">${stock.units} Units</span>
                        </div>
                    `;
                });

                card.innerHTML = `
                    <div class="hospital-header">
                        <div>
                            <h3>${item.hospital}</h3>
                            <p><i class="ph ph-map-pin"></i> ${item.location}</p>
                        </div>
                        <span class="distance-badge">${item.distance}</span>
                    </div>
                    <div class="blood-stock">
                        ${stocksHTML}
                    </div>
                    <button class="btn btn-outline btn-block mt-4" onclick="document.getElementById('requestBtn') && document.getElementById('requestBtn').click()">Request from here</button>
                `;

                inventoryResults.appendChild(card);
            });
        };

        if (searchForm) {
            searchForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const loc = document.getElementById("locationInput").value;
                const type = document.getElementById("bloodTypeSelect").value;

                inventoryResults.style.opacity = "0.5";

                setTimeout(() => {
                    renderInventory(loc, type);
                    inventoryResults.style.opacity = "1";
                }, 400);
            });
        }

        // Initial render
        renderInventory();
    }

    // Contact form handler (if present)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const original = btn ? btn.innerHTML : null;
            if (btn) { btn.innerHTML = 'Sending...'; btn.disabled = true; }

            setTimeout(() => {
                if (btn) { btn.innerHTML = 'Sent ✓'; }
                setTimeout(() => {
                    contactForm.reset();
                    if (btn) { btn.innerHTML = original; btn.disabled = false; }
                }, 900);
            }, 900);
        });
    }

    // Pager (Next / Previous) for single-page navigation
    const pagerPrev = document.getElementById('prevSection');
    const pagerNext = document.getElementById('nextSection');
    const pageSections = Array.from(document.querySelectorAll('main section'));

    if (pagerPrev && pagerNext && pageSections.length) {
        const getCurrentIndex = () => {
            const pos = window.scrollY + 200; // small offset to detect current
            let idx = 0;
            pageSections.forEach((sec, i) => {
                if (sec.offsetTop <= pos) idx = i;
            });
            return idx;
        };

        const updatePager = () => {
            const idx = getCurrentIndex();
            pagerPrev.disabled = idx === 0;
            pagerNext.disabled = idx === pageSections.length - 1;
        };

        pagerPrev.addEventListener('click', () => {
            const idx = getCurrentIndex();
            if (idx > 0) pageSections[idx - 1].scrollIntoView({ behavior: 'smooth' });
        });

        pagerNext.addEventListener('click', () => {
            const idx = getCurrentIndex();
            if (idx < pageSections.length - 1) pageSections[idx + 1].scrollIntoView({ behavior: 'smooth' });
        });

        window.addEventListener('scroll', updatePager);
        // also update on resize/load
        window.addEventListener('resize', updatePager);
        updatePager();
    }

    // --- Emergency Alert System ---
    const checkEmergencies = () => {
        const requests = JSON.parse(localStorage.getItem('sanguis_requests')) || [];
        const criticals = requests.filter(r => r.level === 'Critical' || r.level === 'Emergency');
        if (criticals.length === 0) return;

        const latest = criticals[criticals.length - 1]; // Assume last is newest
        const lastSeen = sessionStorage.getItem('last_seen_emergency_id');

        if (latest.id.toString() !== lastSeen) {
            triggerEmergencyAlert(latest);
            sessionStorage.setItem('last_seen_emergency_id', latest.id.toString());
        }
    };

    const triggerEmergencyAlert = (req) => {
        // Play beep sound using AudioContext
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.type = "square";
            osc.frequency.setValueAtTime(800, ctx.currentTime); // 800Hz beep sound
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime); // low volume
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
            
            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.type = "square";
                osc2.frequency.setValueAtTime(800, ctx.currentTime);
                gain2.gain.setValueAtTime(0.1, ctx.currentTime);
                osc2.start();
                osc2.stop(ctx.currentTime + 0.5);
            }, 600);
        } catch(e) { console.warn("AudioContext playback blocked", e); }

        // Create Full Page Alert Overlay
        const overlay = document.createElement('div');
        overlay.className = "emergency-alert-overlay";
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(255, 0, 0, 0.9); z-index: 999999;
            display: flex; align-items: center; justify-content: center;
            color: white; text-align: center; font-family: 'Outfit', sans-serif;
            animation: flashOverlay 1s infinite alternate;
        `;
        overlay.innerHTML = `
            <style>
                @keyframes flashOverlay { 
                    from { background: rgba(255, 0, 0, 0.85); } 
                    to { background: rgba(200, 0, 0, 0.95); } 
                }
            </style>
            <div style="background: #111; padding: 3rem; border-radius: 20px; border: 4px solid #ff3b30; box-shadow: 0 0 50px rgba(255,59,48,0.5); max-width: 600px; width: 90%;">
                <i class="ph-fill ph-warning" style="font-size: 5rem; color: #ff3b30; margin-bottom: 1rem; display: block; animation: pulse 1s infinite;"></i>
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #ff3b30; line-height:1.2;">EMERGENCY BLOOD REQUIRED!</h1>
                <h2 style="font-size: 1.8rem; margin-bottom: 1.5rem; color: #fff;">Wait, someone needs ${req.group} Blood immediately</h2>
                <div style="text-align: left; background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; font-size: 1.2rem; line-height:1.6;">
                    <p><strong>Patient/Hospital:</strong> ${req.name}</p>
                    <p><strong>Units Required:</strong> ${req.units || 1}</p>
                    <p><strong>Location:</strong> ${req.hospital || req.location}</p>
                </div>
                <div style="display:flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button id="dismissAlertBtn" class="btn btn-outline" style="border-color: #fff; color: #fff; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 12px; cursor: pointer;">Dismiss</button>
                    <!-- Navigates directly to donors matching -->
                    <button id="actNowBtn" class="btn" style="background: #ff3b30; color: #fff; padding: 1rem 2rem; font-size: 1.1rem; border: none; border-radius: 12px; cursor: pointer;">Act Now (Donor Match)</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('dismissAlertBtn').onclick = () => overlay.remove();
        document.getElementById('actNowBtn').onclick = () => {
            overlay.remove();
            window.location.href = "donors.html";
        };
    };

    // Check every 2 seconds for new critical emergencies
    setInterval(checkEmergencies, 2000);
});
