// ======================================
// TREEHOUSE POS
// APP
// MOBILE RENDER
// ======================================

const AppMobileRender = {

    scrollHandler: null,

    renderHeader() {

        const storeName =
            StoreConfig.getStoreName() ||
            "Treehouse POS";

        const logoUrl =
            StoreConfig.getLogoImageUrl(
                StoreConfig.getConfigValue(
                    "STORE_LOGO"
                )
            );

        const user =
            typeof Auth !== "undefined" &&
            typeof Auth.getCurrentUser === "function"
                ? Auth.getCurrentUser()
                : null;

        const adminName =
            user?.nama ||
            user?.username ||
            "Admin";

        const header =
            document.getElementById(
                "mobile-header"
            );

        if (!header) {
            return;
        }

        header.innerHTML = `

            <div class="mobile-header">

                <div class="mobile-header-store">

                    <div class="mobile-header-logo">

                        ${
                            logoUrl
                                ? `
                                    <img
                                        src="${logoUrl}"
                                        alt="Logo Toko"
                                    >
                                  `
                                : `
                                    <span>🏪</span>
                                  `
                        }

                    </div>

                    <div class="mobile-header-store-name">
                        ${storeName}
                    </div>

                </div>

                

                <div class="mobile-header-user">

                    <span class="mobile-header-user-icon">
                        👤
                    </span>

                    <span class="mobile-header-user-name">
                        ${adminName}
                    </span>

                    <button
                        type="button"
                        class="mobile-header-logout"
                        id="mobileHeaderLogout"
                        title="Logout"
                        aria-label="Logout"
                    >
                        <img
                            src="icons/logout.png"
                            alt=""
                        >
                    </button>

                </div>

            </div>

        `;

        const logoutButton =
            document.getElementById(
                "mobileHeaderLogout"
            );

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                () => {

                    if (
                        typeof App !== "undefined" &&
                        typeof App.logout === "function"
                    ) {
                        App.logout();
                    }

                }
            );

        }

        this.initStickyHeader();
    },


    initStickyHeader() {

        const header =
            document.getElementById(
                "mobile-header"
            );

        const page =
            document.getElementById("page");

        if (!header) {
            return;
        }

        if (this.scrollHandler) {

            window.removeEventListener(
                "scroll",
                this.scrollHandler
            );

            if (page) {
                page.removeEventListener(
                    "scroll",
                    this.scrollHandler
                );
            }

            document.removeEventListener(
                "scroll",
                this.scrollHandler
            );

        }

        this.scrollHandler = () => {

            const scrollPosition = Math.max(
                window.scrollY || 0,
                document.documentElement.scrollTop || 0,
                document.body.scrollTop || 0,
                page ? page.scrollTop : 0
            );

            header.classList.toggle(
                "is-scrolled",
                scrollPosition > 5
            );

        };

        window.addEventListener(
            "scroll",
            this.scrollHandler,
            { passive: true }
        );

        document.addEventListener(
            "scroll",
            this.scrollHandler,
            { passive: true }
        );

        if (page) {

            page.addEventListener(
                "scroll",
                this.scrollHandler,
                { passive: true }
            );

        }

        this.scrollHandler();
    },


    renderMobileMenu() {

        const existing =
            document.getElementById(
                "mobile-menu"
            );

        if (existing) {
            existing.remove();
        }

        const menu =
            document.createElement(
                "div"
            );

        menu.id = "mobile-menu";
        menu.className = "mobile-menu";

        menu.innerHTML = `

            <div class="mobile-menu-scroll">

                <div class="mobile-menu-list">

                     

                    <button
                        type="button"
                        class="mobile-menu-item"
                        data-mobile-page="barang"
                        title="Barang"
                        aria-label="Barang"
                    >
                        <span class="mobile-menu-icon">
                            📦
                        </span>

                        <span class="mobile-menu-text">
                            Barang
                        </span>
                    </button>


                    

                    <button
                        type="button"
                        class="mobile-menu-item"
                        data-mobile-page="laporan"
                        title="Laporan"
                        aria-label="Laporan"
                    >
                        <span class="mobile-menu-icon">
                            📊
                        </span>

                        <span class="mobile-menu-text">
                            Laporan
                        </span>
                    </button>

                    <button
                        type="button"
                        class="mobile-menu-item mobile-menu-home"
                        data-mobile-page="dashboard"
                        title="Home"
                        aria-label="Home"
                        aria-current="page"
                    >
                        <span class="mobile-menu-icon">
                            🏠
                        </span>

                        <span class="mobile-menu-text">
                            Home
                        </span>
                    </button>


                    <button
                        type="button"
                        class="mobile-menu-item"
                        data-mobile-page="expense"
                        title="Expense"
                        aria-label="Expense"
                    >
                        <span class="mobile-menu-icon">
                            💸
                        </span>

                        <span class="mobile-menu-text">
                            Expense
                        </span>
                    </button>


                    <button
                        type="button"
                        class="mobile-menu-item"
                        data-mobile-page="config"
                        title="Akun"
                        aria-label="Akun"
                    >
                        <span class="mobile-menu-icon">
                            👤
                        </span>

                        <span class="mobile-menu-text">
                            Akun
                        </span>
                    </button>

                </div>

            </div>

        `;

        const main =
            document.getElementById("main");

        if (main) {
            main.appendChild(menu);
        } else {
            document.body.appendChild(menu);
        }

        menu
            .querySelectorAll(
                "[data-mobile-page]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const page =
                            button.dataset.mobilePage;

                        App.closeMobileMenu();

                        Router.go(page);

                    }
                );

            });

    }

};