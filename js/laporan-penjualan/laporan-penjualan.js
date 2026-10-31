const LaporanPenjualan = {

    data: null,

    report: null,

    filtered: [],

    render() {

        return LaporanPenjualanRender.render();

    },

    async init() {

        this.data = null;

        this.report = null;

        this.filtered = [];

        this.setDefaultDate();

        this.bindEvents();

        this.resetSummary();

        this.renderTable();

        await this.loadKasir();

        await this.filter();

    },


    /* ======================================
       DEFAULT BULAN
    ====================================== */

    setDefaultDate() {

        const input =
            document.getElementById(
                "laporanPenjualanTanggal"
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
            "laporanPenjualanLaporan"
        );

    if (laporan) {

        laporan.onclick =
            () => {

                this.laporan();

            };

    }


    const bulan =
        document.getElementById(
            "laporanPenjualanTanggal"
        );

    if (bulan) {

        bulan.onchange =
            () => {

                this.filter();

            };

    }


    const kasir =
        document.getElementById(
            "laporanPenjualanKasir"
        );

    if (kasir) {

        kasir.onchange =
            () => {

                this.filter();

            };

    }


    const filter =
        document.getElementById(
            "laporanPenjualanFilter"
        );

    const reset =
        document.getElementById(
            "laporanPenjualanReset"
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
       KASIR
    ====================================== */

    async loadKasir() {

        const select =
            document.getElementById(
                "laporanPenjualanKasir"
            );

        if (!select) return;

        select.innerHTML = `
            <option value="">
                Semua Kasir
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
                "laporanPenjualanFilter"
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
       KASIR OPTIONS
    ====================================== */

   
updateKasirOptions(
    transactions,
    selectedKasir = ""
) {

    const select =
        document.getElementById(
            "laporanPenjualanKasir"
        );

    if (!select) return;

    const currentValue =
        String(
            selectedKasir || ""
        ).trim();

    const kasirList = [
        ...new Map(
            transactions
                .map(row => {
                    const kasir =
                        String(
                            row.kasir || ""
                        ).trim();

                    return [
                        kasir.toLocaleLowerCase("id"),
                        kasir
                    ];
                })
                .filter(
                    ([key, value]) =>
                        Boolean(key && value)
                )
        ).values()
    ].sort(
        (a, b) =>
            a.localeCompare(b, "id")
    );

    select.innerHTML = `
        <option value="">
            Semua Kasir
        </option>

        ${
            kasirList
                .map(
                    kasir => `
                        <option
                            value="${this.escape(kasir)}"
                        >
                            ${this.escape(kasir)}
                        </option>
                    `
                )
                .join("")
        }
    `;

    const matchedKasir =
        kasirList.find(
            kasir =>
                kasir.toLocaleLowerCase("id") ===
                currentValue.toLocaleLowerCase("id")
        );

    select.value =
        matchedKasir || "";

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
       NORMALIZE DATE
       ISO UTC -> LOCAL DATE
    ====================================== */

    normalizeDate(value) {

        if (!value) return "";

        if (typeof value === "string") {

            if (
                /^\d{4}-\d{2}-\d{2}$/.test(
                    value
                )
            ) {

                return value;

            }


            if (
                /^\d{4}-\d{2}-\d{2}T/.test(
                    value
                )
            ) {

                const date =
                    new Date(value);

                if (
                    !Number.isNaN(
                        date.getTime()
                    )
                ) {

                    const year =
                        date.getFullYear();

                    const month =
                        String(
                            date.getMonth() + 1
                        ).padStart(
                            2,
                            "0"
                        );

                    const day =
                        String(
                            date.getDate()
                        ).padStart(
                            2,
                            "0"
                        );

                    return (
                        `${year}-${month}-${day}`
                    );

                }

            }


            const localMatch =
                value.match(
                    /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})(?:\s|$)/
                );

            if (localMatch) {

                const day =
                    String(
                        Number(
                            localMatch[1]
                        )
                    ).padStart(
                        2,
                        "0"
                    );

                const month =
                    String(
                        Number(
                            localMatch[2]
                        )
                    ).padStart(
                        2,
                        "0"
                    );

                let year =
                    Number(
                        localMatch[3]
                    );

                if (year < 100) {

                    year += 2000;

                }

                return (
                    `${year}-${month}-${day}`
                );

            }

        }


        if (
            value instanceof Date
        ) {

            if (
                Number.isNaN(
                    value.getTime()
                )
            ) {

                return "";

            }

            const year =
                value.getFullYear();

            const month =
                String(
                    value.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );

            const day =
                String(
                    value.getDate()
                ).padStart(
                    2,
                    "0"
                );

            return (
                `${year}-${month}-${day}`
            );

        }


        return "";

    },


    /* ======================================
       DATE
       ISO UTC -> LOCAL WIB
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


        return new Intl.DateTimeFormat(
            "id-ID",
            {

                day:
                    "2-digit",

                month:
                    "2-digit",

                year:
                    "2-digit",

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                hour12:
                    false

            }
        ).format(
            date
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