const Laporan = {

    currentMenu: "pembelian",


    /* ======================================
       RENDER HALAMAN LAPORAN
    ====================================== */

    render() {

        return LaporanRender.render();

    },


    /* ======================================
       INIT
    ====================================== */

    init() {

        const menu =
            document.querySelectorAll(
                ".laporan-menu-item"
            );


        menu.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const laporan =
                        button.dataset.laporan;


                    this.open(
                        laporan
                    );

                }
            );

        });


        this.open(
            this.currentMenu
        );

    },


    /* ======================================
       BUKA MENU LAPORAN
    ====================================== */

    open(menu) {

        this.currentMenu =
            menu;


        /* ==================================
           ACTIVE MENU
        ================================== */

        document
            .querySelectorAll(
                ".laporan-menu-item"
            )
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.laporan === menu
                );

            });


        /* ==================================
           CONTENT
        ================================== */

        const content =
            document.getElementById(
                "laporan-content"
            );


        if (!content) {

            return;

        }


        /* ==================================
           LAPORAN PEMBELIAN
        ================================== */

        if (
            menu === "pembelian"
        ) {

            content.innerHTML =
                LaporanPembelian.render();


            LaporanPembelian.init();


            return;

        }


        /* ==================================
           LAPORAN PENJUALAN
        ================================== */

        if (
            menu === "penjualan"
        ) {

            content.innerHTML =
                LaporanPenjualan.render();


            LaporanPenjualan.init();


            return;

        }


        /* ==================================
           LAPORAN EXPENSE
        ================================== */

        if (
            menu === "expense"
        ) {

            content.innerHTML =
                LaporanExpense.render();


            LaporanExpense.init();


            return;

        }


        /* ==================================
           LAPORAN PROFIT
        ================================== */

        if (
            menu === "profit"
        ) {

            content.innerHTML =
                LaporanProfit.render();


            LaporanProfit.init();


            return;

        }


        /* ==================================
           LAPORAN LAIN
        ================================== */

        const title =
            this.getTitle(
                menu
            );


        content.innerHTML = `

            <div class="laporan-content-header">

                <div>

                    <h2>
                        ${title}
                    </h2>

                    <p>
                        Laporan ${title.toLowerCase()}
                    </p>

                </div>

            </div>

        `;

    },


    /* ======================================
       TITLE
    ====================================== */

    getTitle(menu) {

        const titles = {

            pembelian:
                "Laporan Pembelian",

            penjualan:
                "Laporan Penjualan",

            expense:
                "Laporan Expense",

            profit:
                "Laporan Profit"

        };


        return (
            titles[menu] ||
            "Laporan"
        );

    }

};