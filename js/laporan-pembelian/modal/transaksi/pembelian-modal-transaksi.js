const PembelianTransaksiModal = {

    data: [],


    /* ======================================
       OPEN
    ====================================== */

    open(
        tanggal,
        transactions = []
    ) {

        this.close();


        this.data =
    Array.isArray(transactions)
        ? [...transactions].sort(
            (a, b) =>
                String(b.id || "").localeCompare(
                    String(a.id || ""),
                    undefined,
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                )
        )
        : [];


        const modal =
            document.createElement(
                "div"
            );


        modal.id =
            "pembelian-transaksi-modal";


        modal.className =
            "pembelian-transaksi-modal";


        modal.innerHTML =
            PembelianTransaksiModalRender.render(
                tanggal,
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


    /* ======================================
       CLOSE
    ====================================== */

    close() {

        const modal =
            document.getElementById(
                "pembelian-transaksi-modal"
            );


        if (modal) {

            modal.remove();

        }


        this.unbindEscape();


        this.data = [];

    },


    /* ======================================
       EVENTS
    ====================================== */

    bindEvents(
        modal
    ) {

        if (!modal) {
            return;
        }


        modal.addEventListener(
            "click",
            event => {

                const row =
                    event.target.closest(
                        ".pembelian-transaksi-row"
                    );


                if (row) {

                    event.preventDefault();

                    event.stopPropagation();


                    const id =
                        row.dataset.id;


                    if (
                        typeof PembelianDetailModal ===
                        "undefined"
                    ) {

                        console.error(
                            "PembelianDetailModal tidak ditemukan."
                        );

                        return;

                    }


                    PembelianDetailModal.open(
                        id,
                        this.data
                    );


                    return;

                }


                const closeButton =
                    event.target.closest(
                        '[data-action="close"]'
                    );


                if (closeButton) {

                    event.preventDefault();

                    event.stopPropagation();


                    this.close();


                    return;

                }

            }
        );

    },


    /* ======================================
       ESCAPE
    ====================================== */

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
                        "pembelian-detail-modal"
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


            this.escapeHandler =
                null;

        }

    },


    /* ======================================
       SUBTOTAL
    ====================================== */

    getSubtotal() {

        return this.data.reduce(
            (
                total,
                transaction
            ) => {

                return total +
                    (
                        Number(
                            transaction.subtotal
                        ) || 0
                    );

            },
            0
        );

    },


    /* ======================================
       TOTAL
    ====================================== */

    getTotal() {

        return this.data.reduce(
            (
                total,
                transaction
            ) => {

                return total +
                    (
                        Number(
                            transaction.total
                        ) || 0
                    );

            },
            0
        );

    },


    /* ======================================
       NUMBER
    ====================================== */

    number(
        value
    ) {

        return (
            Number(
                value
            ) || 0
        ).toLocaleString(
            "id-ID"
        );

    },


    /* ======================================
       MONEY
    ====================================== */

    money(
        value
    ) {

        return (
            "Rp " +
            (
                Number(
                    value
                ) || 0
            ).toLocaleString(
                "id-ID"
            )
        );

    },


    /* ======================================
       DATE
    ====================================== */

    date(
        value
    ) {

        if (!value) {

            return "-";

        }


        const text =
            String(
                value
            );


        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                text
            )
        ) {

            const parts =
                text.split(
                    "-"
                );


            return (
                parts[2] +
                "-" +
                parts[1] +
                "-" +
                parts[0]
            );

        }


        const date =
            new Date(
                value
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return this.escape(
                text
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


    /* ======================================
       ESCAPE
    ====================================== */

    escape(
        value
    ) {

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