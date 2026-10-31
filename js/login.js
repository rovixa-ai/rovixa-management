const Login = {

    async init() {
        this.render();
        this.bindEvents();

        try {
            let users = await DB.getAll("users");

            if (!Array.isArray(users) || !users.length) {
                const result = await DownloadUsers.download();

                if (!result || result.success !== true) {
                    throw new Error(result?.message || "Data pengguna belum tersedia.");
                }

                users = await DB.getAll("users");
            }

            if (!Array.isArray(users) || !users.length) {
                throw new Error("Data pengguna belum tersedia.");
            }

        } catch (error) {
            this.showMessage(error.message || "Gagal menyiapkan login.");
        }
    },

    getStoreInfo() {
        let storeName = "Management Toko";
        let logo = "";

        if (typeof StoreConfig !== "undefined") {

            if (typeof StoreConfig.getStoreName === "function") {
                storeName =
                    StoreConfig.getStoreName() || storeName;
            }

            if (typeof StoreConfig.getConfigValue === "function") {

                const logoSource = String(
                    StoreConfig.getConfigValue("LOGO_SOURCE") ||
                    StoreConfig.getConfigValue("logoSource") ||
                    ""
                ).trim().toLowerCase();

                const logoValue = String(
                    StoreConfig.logoValue ||
                    StoreConfig.getConfigValue("LOGO") ||
                    StoreConfig.getConfigValue("logo") ||
                    ""
                ).trim();

                const logoDrive = String(
                    StoreConfig.getConfigValue("LOGO_DRIVE") ||
                    StoreConfig.getConfigValue("logoDrive") ||
                    ""
                ).trim();

                const logoUrl = String(
                    StoreConfig.getConfigValue("LOGO_URL") ||
                    StoreConfig.getConfigValue("logoUrl") ||
                    ""
                ).trim();

                const storeLogo = String(
                    StoreConfig.getConfigValue("STORE_LOGO") ||
                    ""
                ).trim();

                let logoInput = "";

                if (logoSource === "drive") {
                    logoInput = logoDrive;
                } else if (logoSource === "url") {
                    logoInput = logoUrl;
                } else if (
                    logoSource === "upload" ||
                    logoSource === "uploaded" ||
                    logoSource === "file"
                ) {
                    logoInput = logoValue;
                } else {
                    logoInput =
                        storeLogo ||
                        logoValue ||
                        logoUrl ||
                        logoDrive;
                }

                if (
                    logoInput &&
                    typeof StoreConfig.getLogoImageUrl === "function"
                ) {
                    logo = StoreConfig.getLogoImageUrl(logoInput) || "";
                }

                if (!logo && storeLogo &&
                    typeof StoreConfig.getLogoImageUrl === "function") {
                    logo = StoreConfig.getLogoImageUrl(storeLogo) || "";
                }
            }
        }

        return {
            storeName,
            logo
        };
    },

    escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    },

    render() {
        const app = document.getElementById("app");
        if (!app) return;

        const store = this.getStoreInfo();
        const storeName = this.escapeHTML(store.storeName);
        const initial = this.escapeHTML(
            String(store.storeName).charAt(0).toUpperCase() || "M"
        );

        const logoContent = store.logo
            ? `
                <img
                    src="${this.escapeHTML(store.logo)}"
                    alt="Logo toko"
                    onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
                >
                <span
                    class="login-logo-fallback"
                    style="display:none;"
                >${initial}</span>
              `
            : `
                <span class="login-logo-fallback">
                    ${initial}
                </span>
              `;

        app.classList.add("login-mode");

        app.innerHTML = `
            <main class="login-page" id="loginPage">
                <section class="login-card">
                    <div class="login-logo">
                        ${logoContent}
                    </div>

                    <header class="login-header">
                        <h1>${storeName}</h1>
                        <p>Login Management</p>
                    </header>

                    <form class="login-form" id="loginForm" autocomplete="off">
                        <div class="login-field">
                            <label for="loginUsername">Username</label>
                            <input
                                type="text"
                                id="loginUsername"
                                name="username"
                                placeholder="Masukkan username"
                                autocomplete="username"
                                spellcheck="false"
                                autocapitalize="off"
                                required
                            >
                        </div>

                        <div class="login-field">
                            <label for="loginPIN">PIN</label>
                            <input
                                type="password"
                                id="loginPIN"
                                name="pin"
                                placeholder="Masukkan PIN"
                                inputmode="numeric"
                                autocomplete="current-password"
                                maxlength="20"
                                required
                            >
                        </div>

                        <div class="login-message" id="loginMessage" hidden></div>

                        <button type="submit" class="login-button" id="loginButton">
                            LOGIN
                        </button>
                    </form>
                </section>
            </main>
        `;

        const username = document.getElementById("loginUsername");

        if (username) {
            setTimeout(() => username.focus(), 50);
        }
    },

    bindEvents() {
        const form = document.getElementById("loginForm");
        const pin = document.getElementById("loginPIN");

        if (!form) return;

        form.addEventListener("submit", async event => {
            event.preventDefault();
            await this.submit();
        });

        if (pin) {
            pin.addEventListener("input", () => {
                pin.value = pin.value.replace(/\D/g, "");
            });
        }
    },

    async submit() {
        const username = document.getElementById("loginUsername");
        const pin = document.getElementById("loginPIN");
        const button = document.getElementById("loginButton");

        if (!username || !pin) return;

        const usernameValue = username.value.trim();
        const pinValue = pin.value.trim();

        this.clearMessage();

        if (!usernameValue) {
            this.showMessage("Username belum diisi.");
            username.focus();
            return;
        }

        if (!pinValue) {
            this.showMessage("PIN belum diisi.");
            pin.focus();
            return;
        }

        if (button) {
            button.disabled = true;
            button.textContent = "Memeriksa...";
        }

        try {
            const result = await Auth.login(usernameValue, pinValue);

            if (!result || result.success !== true) {
                throw new Error(result?.message || "Username atau PIN tidak valid.");
            }

            const sessionCheck = await Auth.validateSession();

            if (!sessionCheck.success) {
                throw new Error(sessionCheck.message || "Sesi login tidak valid.");
            }

            const app = document.getElementById("app");

            if (app) {
                app.classList.remove("login-mode");
                app.innerHTML = `
                    <aside id="sidebar">
                        <div id="sidebar-content"></div>
                    </aside>
                    <main id="main">
                        <header id="desktop-header"></header>
                        <header id="mobile-header"></header>
                        <section id="page"></section>
                    </main>
                `;
            }

            AppDesktopRender.renderSidebar();
            AppDesktopRender.renderHeader();
            AppMobileRender.renderHeader();
            AppMobileRender.renderMobileMenu();

            Router.go("dashboard");

        } catch (error) {
            this.showMessage(error.message || "Login gagal.");
            pin.value = "";
            pin.focus();

        } finally {
            if (button && document.body.contains(button)) {
                button.disabled = false;
                button.textContent = "LOGIN";
            }
        }
    },

    showMessage(message) {
        const element = document.getElementById("loginMessage");
        if (!element) return;

        element.textContent = message || "";
        element.hidden = false;
    },

    clearMessage() {
        const element = document.getElementById("loginMessage");
        if (!element) return;

        element.textContent = "";
        element.hidden = true;
    }

};