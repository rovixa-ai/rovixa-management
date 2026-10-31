const PenjualanTransaksiModal = {

    data: [],
    tanggal: "",


    // ======================================
// OPEN MODAL
// ======================================

open(tanggal, transactions = []) {

    this.close();

    this.tanggal =
        tanggal || "";

    this.data =
        Array.isArray(transactions)
            ? [...transactions].sort(
                (a, b) =>
                    String(b.id || "").localeCompare(
                        String(a.id || "")
                    )
            )
            : [];

    this.render();

},


    // ======================================
    // CLOSE MODAL
    // ======================================

    close() {

        const modal =
            document.getElementById(
                "penjualan-transaksi-modal"
            );

        if (modal) {

            modal.remove();

        }

        this.unbindEscape();

        this.data = [];
        this.tanggal = "";

    },


    // ======================================
    // RENDER
    // ======================================

    render() {

    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "penjualan-transaksi-modal";


    modal.className =
        "penjualan-transaksi-modal";


    modal.innerHTML =
        PenjualanTransaksiModalRender.render(
            this.tanggal,
            this.data
        );


    document.body.appendChild(
        modal
    );


    this.bindEvents(
        modal
    );


    this.bindEscape();

},


    // ======================================
    // EVENTS
    // ======================================

    bindEvents(modal) {

        if (!modal) {
            return;
        }


        modal.addEventListener(
            "click",
            event => {

                // ==================================
                // ROW DETAIL
                // ==================================

                const row =
                    event.target.closest(
                        ".penjualan-transaksi-row"
                    );


                if (row) {

                    event.preventDefault();

                    event.stopPropagation();


                    const id =
                        row.dataset.id;


                    this.detail(
                        id
                    );


                    return;

                }


                // ==================================
                // CLOSE BUTTON
                // ==================================

                const closeButton =
                    event.target.closest(
                        ".penjualan-transaksi-close, .penjualan-transaksi-footer-button"
                    );


                if (closeButton) {

                    event.preventDefault();

                    event.stopPropagation();


                    this.close();


                    return;

                }


                // ==================================
                // CLOSE VIA OVERLAY
                // ==================================

                const overlay =
                    event.target.closest(
                        ".penjualan-transaksi-overlay"
                    );


                if (
                    overlay &&
                    event.target === overlay
                ) {

                    event.preventDefault();

                    event.stopPropagation();


                    this.close();

                    return;

                }

            }
        );

    },


    // ======================================
    // DETAIL TRANSAKSI
    // ======================================

    detail(id) {

        const row =
            this.data.find(
                transaction =>
                    String(
                        transaction.id
                    ) ===
                    String(id)
            );


        if (!row) {

            console.error(
                "Transaksi tidak ditemukan:",
                id
            );

            return;

        }


        if (
            typeof LaporanPenjualan !==
                "undefined" &&
            typeof LaporanPenjualan.showDetailModal ===
                "function"
        ) {

            LaporanPenjualan.showDetailModal(
                row
            );

            return;

        }


        console.error(
            "LaporanPenjualan.showDetailModal tidak tersedia."
        );

    },


    // ======================================
    // ESC
    // ======================================

    bindEscape() {

        this.unbindEscape();


        this.escapeHandler =
            event => {

                if (
                    event.key !==
                    "Escape"
                ) {

                    return;

                }


                const detailModal =
                    document.getElementById(
                        "laporanPenjualanDetailModal"
                    );


                if (detailModal) {

                    return;

                }


                this.close();

            };


        document.addEventListener(
            "keydown",
            this.escapeHandler
        );

    },


    unbindEscape() {

        if (
            this.escapeHandler
        ) {

            document.removeEventListener(
                "keydown",
                this.escapeHandler
            );

        }


        this.escapeHandler =
            null;

    },


    // ======================================
    // FORMAT NUMBER
    // ======================================

    number(value) {

        return (
            Number(value) || 0
        )
            .toLocaleString(
                "id-ID"
            );

    },


    // ======================================
    // FORMAT MONEY
    // ======================================

    money(value) {

        return (
            "Rp " +
            (
                Number(value) || 0
            )
                .toLocaleString(
                    "id-ID"
                )
        );

    },


    // ======================================
    // FORMAT DATE
    // ======================================

    date(value) {

        if (!value) {
            return "-";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(
                value
            );

        }


        return date.toLocaleDateString(
            "id-ID",
            {
                day:
                    "2-digit",

                month:
                    "2-digit",

                year:
                    "numeric"
            }
        );

    },


    // ======================================
    // ESCAPE HTML
    // ======================================

    escape(value) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }

};