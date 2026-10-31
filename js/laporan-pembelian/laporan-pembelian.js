const LaporanPembelian = {

    data: null,
    report: null,
    filtered: [],

    render() {

        return LaporanPembelianRender.render();

    },

    async init() {

        this.data = null;
        this.report = null;
        this.filtered = [];

        this.setDefaultDate();
        this.bindEvents();
        this.resetSummary();
        this.renderTable();

        await this.loadSupplier();

        await this.filter();
    },


    /* ======================================
       DEFAULT BULAN
    ====================================== */

    setDefaultDate() {

        const input =
            document.getElementById(
                "laporanPembelianTanggal"
            );

        if (!input) return;


        const now =
            new Date();


        const year =
            now.getFullYear();


        const month =
            String(
                now.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        input.value =
            `${year}-${month}`;

    },


    /* ======================================
       EVENT
    ====================================== */

    bindEvents() {

    const laporan =
        document.getElementById(
            "laporanPembelianLaporan"
        );

    if (laporan) {

        laporan.onclick =
            () => {

                this.laporan();

            };

    }


    const bulan =
        document.getElementById(
            "laporanPembelianTanggal"
        );

    if (bulan) {

        bulan.onchange =
            () => {

                this.filter();

            };

    }


    const supplier =
        document.getElementById(
            "laporanPembelianSupplier"
        );

    if (supplier) {

        supplier.onchange =
            () => {

                this.filter();

            };

    }


    const filter =
        document.getElementById(
            "laporanPembelianFilter"
        );


    const reset =
        document.getElementById(
            "laporanPembelianReset"
        );


    if (filter) {

        filter.onclick =
            () => {

                this.filter();

            };

    }


    if (reset) {

        reset.onclick =
            () => {

                this.reset();

            };

    }

},


    /* ======================================
       SUPPLIER
    ====================================== */

    async loadSupplier() {

        const select =
            document.getElementById(
                "laporanPembelianSupplier"
            );


        if (!select) return;


        select.innerHTML = `

            <option value="">
                Semua Supplier
            </option>

        `;

    },


    /* ======================================
       RESET
    ====================================== */

    async reset() {

        await this.init();

    },


    /* ======================================
       LOADING
    ====================================== */

    setLoading(loading) {

        const button =
            document.getElementById(
                "laporanPembelianFilter"
            );


        if (!button) return;


        button.disabled =
            loading;


        button.textContent =
            loading
                ? "Memuat..."
                : "Tampilkan";

    },


    /* ======================================
       SUPPLIER OPTIONS
    ====================================== */

    updateSupplierOptions(
        transactions,
        selectedSupplier = ""
    ) {

        const select =
            document.getElementById(
                "laporanPembelianSupplier"
            );


        if (!select) return;


        const suppliers =
            [
                ...new Set(

                    transactions
                        .map(
                            row =>
                                String(
                                    row.supplier ||
                                    ""
                                ).trim()
                        )

                        .filter(
                            Boolean
                        )

                )
            ]

            .sort(
                (a, b) =>
                    a.localeCompare(
                        b,
                        "id"
                    )
            );


        select.innerHTML = `

            <option value="">
                Semua Supplier
            </option>

            ${
                suppliers
                    .map(
                        supplier => `

                            <option
                                value="${this.escape(
                                    supplier
                                )}"
                            >

                                ${this.escape(
                                    supplier
                                )}

                            </option>

                        `
                    )
                    .join("")
            }

        `;


        select.value =
            selectedSupplier || "";

    },


    /* ======================================
       NUMBER
    ====================================== */

    number(value) {

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

    money(value) {

        return "Rp " +

            (

                Number(
                    value
                ) || 0

            ).toLocaleString(
                "id-ID"
            );

    },


    /* ======================================
       DATE
    ====================================== */

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


    /* ======================================
       SET TEXT
    ====================================== */

    setText(id, value) {

        const element =
            document.getElementById(
                id
            );


        if (!element) return;


        element.textContent =
            value;

    },


    /* ======================================
       ESCAPE HTML
    ====================================== */

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