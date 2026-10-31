// app-desktop-render.js

// ======================================
// TREEHOUSE POS
// APP
// DESKTOP RENDER
// ======================================

const AppDesktopRender = {

    renderSidebar() {

        const logoUrl =
            StoreConfig.getLogoImageUrl(
                StoreConfig.getConfigValue(
                    "STORE_LOGO"
                )
            );


        document.getElementById(
            "sidebar-content"
        ).innerHTML = `

            <div class="sidebar-logo">

                <div
                    class="sidebar-store-logo"
                    id="sidebarStoreLogo"
                >

                    ${
                        logoUrl
                            ? `
                                <img
                                    src="${logoUrl}"
                                    alt="Logo Toko"
                                >
                              `
                            : ""
                    }

                </div>


                <div class="sidebar-store-name">

                    ${StoreConfig.getStoreName()}

                </div>

            </div>


            <div class="sidebar-menu">

                <button
                    data-page="dashboard"
                    title="Dashboard"
                >
                    <span class="sidebar-menu-icon">🏠</span>
                    <span class="sidebar-menu-text">
                        Dashboard
                    </span>
                </button>


                <div class="sidebar-group-title">
                    MANAGEMENT
                </div>


                <div class="sidebar-submenu">

                    <button
                        data-page="barang"
                        title="Barang"
                    >
                        <span class="sidebar-menu-icon">📦</span>
                        <span class="sidebar-menu-text">
                            Barang
                        </span>
                    </button>




                    <button
                        data-page="harga-pembelian"
                        title="Harga Pembelian Barang"
                    >
                        <span class="sidebar-menu-icon">🛒</span>
                        <span class="sidebar-menu-text">
                            Harga Pembelian Barang
                        </span>
                    </button>

                </div>


                <button
                    data-page="laporan"
                    title="Laporan"
                >
                    <span class="sidebar-menu-icon">📊</span>
                    <span class="sidebar-menu-text">
                        Laporan
                    </span>
                </button>


                <button
                    data-page="expense"
                    title="Expense"
                >
                    <span class="sidebar-menu-icon">💸</span>
                    <span class="sidebar-menu-text">
                        Expense
                    </span>
                </button>


                <button
                    data-page="config"
                    title="Config"
                >
                    <span class="sidebar-menu-icon">⚙️</span>
                    <span class="sidebar-menu-text">
                        Config
                    </span>
                </button>

            </div>


            <div class="sidebar-footer">

                <button
                    type="button"
                    class="sidebar-logout-button"
                    id="sidebarLogoutButton"
                    title="Logout"
                    aria-label="Logout"
                >

                    <img
                        src="icons/logout.png"
                        alt=""
                        class="sidebar-logout-icon"
                    >

                    <span class="sidebar-menu-text">
                        Logout
                    </span>

                </button>

            </div>

        `;


        document
            .querySelectorAll(
                "#sidebar-content [data-page]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        Router.go(
                            button.dataset.page
                        );

                    }
                );

            });


        const logoutButton =
            document.getElementById(
                "sidebarLogoutButton"
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

    },


    renderHeader() {

        const header =
            document.getElementById(
                "desktop-header"
            );


        if (!header) {
            return;
        }


        header.innerHTML = `

            <div class="header-left">

                <div class="header-title">

                    <h1 id="desktop-header-title">
                        Dashboard
                    </h1>

                    <span id="desktop-header-subtitle">
                        Ringkasan toko
                    </span>

                </div>

            </div>


            <div class="header-admin">
                Admin
            </div>

        `;

    }

};