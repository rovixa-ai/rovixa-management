// app.js

const App = {

    currentPage: null,


    async init() {

        Loading.show(
            "Menyiapkan database dan memuat data toko...",
            "Memuat Aplikasi"
        );

        try {

            await DB.init();

            try {

                Loading.update(
                    "Mengunduh data pengguna...",
                    "Memuat Aplikasi"
                );

                await DownloadUsers.download();

            }
            catch (error) {

                console.warn(
                    "Download User gagal:",
                    error.message ||
                    error
                );

            }

            Loading.update(
                "Memuat konfigurasi toko...",
                "Memuat Aplikasi"
            );

            await StoreConfig.load();

            Sync.init();

            Loading.update(
                "Mengunduh dan menyiapkan data aplikasi...",
                "Memuat Aplikasi"
            );

            const result =
                await Download.bootstrap();

            if (!result.success) {

                console.warn(
                    "Download gagal:",
                    result.message
                );

            }

            Loading.update(
                "Memeriksa sesi pengguna...",
                "Memuat Aplikasi"
            );

            const session =
                await Auth.validateSession();

            if (
                session.success &&
                session.loggedIn
            ) {

                this.renderAppShell();

                Loading.update(
                    "Membuka dashboard...",
                    "Memuat Aplikasi"
                );

                Router.go("dashboard");

            } else {

                await Login.init();

            }

        }
        catch (error) {

            console.error(
                "APP INIT ERROR:",
                error
            );

            if (typeof Dialog !== "undefined") {

                Dialog.error(
                    error.message ||
                    "Gagal memuat aplikasi."
                );

            }

        }
        finally {

            Loading.hide();

        }

    },


    renderAppShell() {

        const app =
            document.getElementById("app");

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

    },


    async logout() {

        const confirmed = await Dialog.confirm(
            "Apakah Anda yakin ingin keluar dari aplikasi?",
            {
                title: "Konfirmasi Logout",
                confirmText: "Ya, Logout",
                cancelText: "Batal",
                variant: "danger"
            }
        );

        if (!confirmed) {
            return;
        }

        Auth.logout();

        const app =
            document.getElementById("app");

        if (app) {
            app.classList.add("login-mode");
        }

        await Login.init();

    },


    toggleMobileMenu() {

        const menu =
            document.getElementById(
                "mobile-menu"
            );

        if (!menu) return;

        menu.classList.toggle("open");

    },


    closeMobileMenu() {

        const menu =
            document.getElementById(
                "mobile-menu"
            );

        if (!menu) return;

        menu.classList.remove("open");

    },


    loadPage(page) {

        if (
            typeof Auth !== "undefined" &&
            !Auth.isLoggedIn()
        ) {

            Login.init();

            return;

        }

        const pages = {

            dashboard: {
                title: "Dashboard",
                subtitle: "Ringkasan toko"
            },

            barang: {
                title: "Barang",
                subtitle: "Management data barang"
            },

            satuan: {
                title: "Satuan & Harga",
                subtitle: "Management satuan dan harga"
            },

            "harga-pembelian": {
                title: "Harga Pembelian Barang",
                subtitle: "Management harga pembelian barang"
            },

            stok: {
                title: "Stok",
                subtitle: "Management stok"
            },

            penjualan: {
                title: "Penjualan",
                subtitle: "Riwayat penjualan"
            },

            penyesuaian: {
                title: "Penyesuaian Stok",
                subtitle: "Koreksi stok"
            },

            laporan: {
                title: "Laporan",
                subtitle: "Laporan toko"
            },

            expense: {
                title: "Expense",
                subtitle: "Catat pengeluaran"
            },

            config: {
                title: "Config Toko",
                subtitle: "Pengaturan informasi toko"
            }

        };


        const info =
            pages[page];

        if (!info) return;

        this.currentPage = page;


        /* ==================================
           UPDATE DESKTOP HEADER
        ================================== */

        const desktopTitle =
            document.getElementById(
                "desktop-header-title"
            );

        const desktopSubtitle =
            document.getElementById(
                "desktop-header-subtitle"
            );

        if (desktopTitle) {

            desktopTitle.textContent =
                info.title;

        }

        if (desktopSubtitle) {

            desktopSubtitle.textContent =
                info.subtitle;

        }


        /* ==================================
           UPDATE MOBILE HEADER
        ================================== */

        const mobileTitle =
            document.getElementById(
                "mobile-header-title"
            );

        const mobileSubtitle =
            document.getElementById(
                "mobile-header-subtitle"
            );

        if (mobileTitle) {

            mobileTitle.textContent =
                info.title;

        }

        if (mobileSubtitle) {

            mobileSubtitle.textContent =
                info.subtitle;

        }


        /* ==================================
           PAGE
        ================================== */

        if (page === "dashboard") {

            document.getElementById(
                "page"
            ).innerHTML =
                Dashboard.render();

            Dashboard.init();

        }

        else if (page === "barang") {

            document.getElementById(
                "page"
            ).innerHTML =
                Barang.render();

            Barang.init();

        }

        else if (page === "satuan") {

            document.getElementById(
                "page"
            ).innerHTML =
                Satuan.render();

            Satuan.init();

        }

        else if (page === "harga-pembelian") {

            document.getElementById(
                "page"
            ).innerHTML =
                HargaPembelian.render();

            HargaPembelian.init();

        }

        else if (page === "laporan") {

            document.getElementById(
                "page"
            ).innerHTML =
                Laporan.render();

            Laporan.init();

        }

        else if (page === "expense") {

            document.getElementById(
                "page"
            ).innerHTML =
                Expense.render();

            Expense.init();

        }

        else if (page === "config") {

            document.getElementById(
                "page"
            ).innerHTML =
                StoreConfig.page();

            StoreConfig.init();

        }

        else {

            document.getElementById(
                "page"
            ).innerHTML = `

                <h2>
                    ${info.title}
                </h2>

                <p>
                    Halaman ${info.title}
                    sedang dibuat.
                </p>

            `;

        }


        /* ==================================
           DESKTOP MENU ACTIVE
        ================================== */

        document
            .querySelectorAll(
                "[data-page]"
            )
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.page === page
                );

            });


        /* ==================================
           MOBILE MENU ACTIVE
        ================================== */

        document
            .querySelectorAll(
                "[data-mobile-page]"
            )
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.mobilePage === page
                );

            });

    }

};


document.addEventListener(
    "DOMContentLoaded",
    () => App.init()
);