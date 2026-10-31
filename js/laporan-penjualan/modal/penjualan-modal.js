const PenjualanLaporanModal = {

    data: null,
    report: null,
    filtered: [],


    /* ======================================
       OPEN
    ====================================== */

    async open() {

        this.close();

        this.data = null;
        this.report = null;
        this.filtered = [];

        this.render();

        document.body.classList.add(
            "penjualan-laporan-modal-open"
        );

        this.setDefaultDate();

        await this.loadKasir();

        await this.filter();

    },


    /* ======================================
       CLOSE
    ====================================== */

    close() {

        const modal =
            document.getElementById(
                "penjualan-laporan-modal"
            );

        if (modal) {
            modal.remove();
        }

        document.body.classList.remove(
            "penjualan-laporan-modal-open"
        );

        this.unbindEscape();

        this.data = null;
        this.report = null;
        this.filtered = [];

    },


    /* ======================================
       RENDER
    ====================================== */

    render() {

    const modal =
        document.createElement("div");

    modal.id =
        "penjualan-laporan-modal";

    modal.className =
        "penjualan-laporan-modal";

    modal.innerHTML =
        PenjualanLaporanModalRender.render();

    document.body.appendChild(modal);

    this.bindEvents(modal);

    this.bindEscape();

},


    /* ======================================
       DEFAULT BULAN
    ====================================== */

    setDefaultDate() {

        const input =
            document.getElementById(
                "penjualanLaporanModalBulan"
            );

        if (!input) {
            return;
        }


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

                /* ======================================
                   LIHAT PDF
                   HARUS DIPROSES TERLEBIH DAHULU
                   ====================================== */

                const pdfButton =
                    event.target.closest(
                        '[data-action="lihat-pdf"]'
                    );


                if (pdfButton) {

                    event.preventDefault();

                    event.stopPropagation();


                    const tanggal =
                        pdfButton.dataset.tanggal;


                    if (
                        typeof this.lihatPdf ===
                        "function"
                    ) {

                        this.lihatPdf(
                            tanggal
                        );

                    } else {

                        console.error(
                            "PenjualanLaporanModal.lihatPdf tidak ditemukan."
                        );

                    }


                    return;

                }


                /* ======================================
                   BARIS TRANSAKSI
                   ====================================== */

                const tableRow =
                    event.target.closest(
                        ".penjualan-laporan-modal-row"
                    );


                if (tableRow) {

                    event.preventDefault();

                    event.stopPropagation();


                    const tanggal =
                        tableRow.dataset.tanggal;


                    const daily =
                        this.report &&
                        Array.isArray(
                            this.report.daily
                        )
                            ? this.report.daily.find(
                                row =>
                                    String(
                                        row.tanggal
                                    ) ===
                                    String(
                                        tanggal
                                    )
                            )
                            : null;


                    if (
                        !daily ||
                        !Array.isArray(
                            daily.transactions
                        )
                    ) {

                        console.error(
                            "Data transaksi penjualan tidak ditemukan:",
                            tanggal
                        );

                        return;

                    }


                    if (
                        typeof PenjualanTransaksiModal ===
                        "undefined"
                    ) {

                        console.error(
                            "PenjualanTransaksiModal tidak ditemukan."
                        );

                        return;

                    }


                    PenjualanTransaksiModal.open(
                        tanggal,
                        daily.transactions
                    );


                    return;

                }


                /* ======================================
                   RESET
                   ====================================== */

                const resetButton =
                    event.target.closest(
                        "#penjualanLaporanModalReset"
                    );


                if (resetButton) {

                    event.preventDefault();

                    event.stopPropagation();

                    this.reset();

                    return;

                }


                /* ======================================
                   CLOSE
                   HANYA TOMBOL CLOSE ATAU OVERLAY
                   ====================================== */

                const closeButton =
                    event.target.closest(
                        ".penjualan-laporan-modal-close, .penjualan-laporan-modal-footer-button"
                    );


                if (closeButton) {

                    event.preventDefault();

                    event.stopPropagation();

                    this.close();

                    return;

                }


                const overlay =
                    event.target.closest(
                        ".penjualan-laporan-modal-overlay"
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


        const bulan =
            document.getElementById(
                "penjualanLaporanModalBulan"
            );


        if (bulan) {

            bulan.addEventListener(
                "change",
                () => {

                    this.filter();

                }
            );

        }


        const kasir =
            document.getElementById(
                "penjualanLaporanModalKasir"
            );


        if (kasir) {

            kasir.addEventListener(
                "change",
                () => {

                    this.filter();

                }
            );

        }

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


                const transaksiModal =
                    document.getElementById(
                        "penjualan-transaksi-modal"
                    );


                if (transaksiModal) {
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
       KASIR
    ====================================== */

    async loadKasir() {

        const select =
            document.getElementById(
                "penjualanLaporanModalKasir"
            );


        if (!select) {
            return;
        }


        select.innerHTML = `

            <option value="">
                Semua Kasir
            </option>

        `;

    },


    /* ======================================
       FILTER
       LOGIKA SAMA DENGAN
       LAPORAN PENJUALAN
    ====================================== */

    async filter() {

        const bulanInput =
            document.getElementById(
                "penjualanLaporanModalBulan"
            );


        const kasirInput =
            document.getElementById(
                "penjualanLaporanModalKasir"
            );


        if (
            !bulanInput ||
            !bulanInput.value
        ) {

            Dialog.alert(
                "Silakan pilih bulan."
            );

            return;

        }


        const parts =
            bulanInput.value.split("-");


        if (
            parts.length !== 2
        ) {

            Dialog.alert(
                "Bulan laporan tidak valid."
            );

            return;

        }


        const tahun =
            Number(
                parts[0]
            );


        const bulan =
            Number(
                parts[1]
            );


        if (
            !tahun ||
            !bulan ||
            bulan < 1 ||
            bulan > 12
        ) {

            Dialog.alert(
                "Bulan dan tahun laporan tidak valid."
            );

            return;

        }


        const selectedKasir =
            kasirInput
                ? kasirInput.value
                : "";


        this.setLoading(
            true
        );


        try {

            const penjualan =
                await DB.getAll(
                    "penjualan"
                );


            const detailPenjualan =
                await DB.getAll(
                    "detailPenjualan"
                );


            const pembayaranPenjualan =
                await DB.getAll(
                    "pembayaranPenjualan"
                );


            


            const filteredPenjualan =
                penjualan.filter(
                    row => {

                        if (!row) {
                            return false;
                        }


                        const date =
                            new Date(
                                row.tanggal
                            );


                        if (
                            Number.isNaN(
                                date.getTime()
                            )
                        ) {

                            return false;

                        }


                        return (

                            date.getFullYear() ===
                                tahun &&

                            date.getMonth() + 1 ===
                                bulan &&

                            (
                                !selectedKasir ||

                                String(
                                    row.kasir ||
                                    ""
                                ).trim() ===
                                    selectedKasir
                            )

                        );

                    }
                );


            const transactions =
                filteredPenjualan.map(
                    penjualanRow => {

                        const id =
                            String(
                                penjualanRow.id
                            );


                        const items =
                            detailPenjualan
                                .filter(
                                    detail =>
                                        String(
                                            detail.id
                                        ) === id
                                )
                                .map(
                                    detail => ({

                                        kode:
                                            String(
                                                detail.kode ||
                                                ""
                                            ),

                                        nama:
                                            String(
                                                detail.nama ||
                                                ""
                                            ),

                                        satuan:
                                            String(
                                                detail.satuan ||
                                                ""
                                            ),

                                        qty:
                                            Number(
                                                detail.qty
                                            ) || 0,

                                        konversi:
                                            Number(
                                                detail.konversi
                                            ) || 0,

                                        harga:
                                            Number(
                                                detail.harga
                                            ) || 0,

                                        discount:
                                            Number(
                                                detail.discount
                                            ) || 0,

                                        subtotal:
                                            Number(
                                                detail.subtotal
                                            ) || 0

                                    })
                                );


                        const payments =
                            pembayaranPenjualan
                                .filter(
                                    payment =>
                                        String(
                                            payment.id
                                        ) === id
                                )
                                .map(
                                    payment => ({

                                        metode:
                                            String(
                                                payment.metode ||
                                                ""
                                            ),

                                        nominal:
                                            Number(
                                                payment.nominal
                                            ) || 0,

                                        kembalian:
                                            Number(
                                                payment.kembalian
                                            ) || 0

                                    })
                                );


                        let CASH = 0;
                        let QRIS = 0;
                        let DEBIT = 0;
                        let TRANSFER = 0;
                        let change = 0;


                        payments.forEach(
                            payment => {

                                const metode =
                                    String(
                                        payment.metode ||
                                        ""
                                    )
                                        .trim()
                                        .toUpperCase();


                                const nominal =
                                    Number(
                                        payment.nominal
                                    ) || 0;


                                const kembalian =
                                    Number(
                                        payment.kembalian
                                    ) || 0;


                                if (
                                    metode ===
                                    "CASH"
                                ) {

                                    CASH +=
                                        nominal;

                                }

                                else if (
                                    metode ===
                                    "QRIS"
                                ) {

                                    QRIS +=
                                        nominal;

                                }

                                else if (
                                    metode ===
                                    "DEBIT"
                                ) {

                                    DEBIT +=
                                        nominal;

                                }

                                else if (
                                    metode ===
                                    "TRANSFER"
                                ) {

                                    TRANSFER +=
                                        nominal;

                                }


                                change +=
                                    kembalian;

                            }
                        );


                        /*
                         * ==================================
                         * CASH = PEMBAYARAN CASH - KEMBALIAN
                         *
                         * TERMASUK TRANSAKSI RETUR
                         * ==================================
                         */

                        CASH =
                            CASH -
                            change;


                        const qty =
                            items.reduce(
                                (
                                    total,
                                    item
                                ) =>
                                    total +
                                    (
                                        Number(
                                            item.qty
                                        ) || 0
                                    ),
                                0
                            );


                        const totalItem =
                            items.length;


                        const totalPayment =
                            CASH +
                            QRIS +
                            DEBIT +
                            TRANSFER;


                        return {

                            id,

                            tanggal:
                                penjualanRow.tanggal,

                            kasir:
                                String(
                                    penjualanRow.kasir ||
                                    ""
                                ),

                            subtotal:
                                Number(
                                    penjualanRow.subtotal
                                ) || 0,

                            disc:
                                Number(
                                    penjualanRow.disc
                                ) || 0,

                            total:
                                Number(
                                    penjualanRow.total
                                ) || 0,

                            status:
                                String(
                                    penjualanRow.status ||
                                    ""
                                ),

                            totalItem,

                            qty,

                            CASH,

                            QRIS,

                            DEBIT,

                            TRANSFER,

                            totalPayment,

                            change,

                            items,

                            payments

                        };

                    }
                );


            transactions.sort(
                (
                    a,
                    b
                ) =>
                    new Date(
                        a.tanggal
                    ) -
                    new Date(
                        b.tanggal
                    )
            );


            /* ======================================
               SUMMARY
            ====================================== */

            let totalTransaksi = 0;

            let totalItem = 0;

            let qty = 0;

            let subtotal = 0;

            let discount = 0;

            let total = 0;

            let cash = 0;

            let qris = 0;

            let debit = 0;

            let transfer = 0;

            let totalPayment = 0;

            let change = 0;


            transactions.forEach(
                row => {

                    /*
                     * ==================================
                     * TOTAL TRANSAKSI
                     *
                     * RETUR TETAP DIHITUNG
                     * ==================================
                     */

                    totalTransaksi +=
                        1;


                    /*
                     * ==================================
                     * PAYMENT
                     *
                     * RETUR TETAP DIHITUNG
                     * ==================================
                     */

                    cash +=
                        Number(
                            row.CASH
                        ) || 0;


                    qris +=
                        Number(
                            row.QRIS
                        ) || 0;


                    debit +=
                        Number(
                            row.DEBIT
                        ) || 0;


                    transfer +=
                        Number(
                            row.TRANSFER
                        ) || 0;


                    totalPayment +=
                        Number(
                            row.totalPayment
                        ) || 0;


                    change +=
                        Number(
                            row.change
                        ) || 0;


                    /*
                     * ==================================
                     * STATUS
                     * ==================================
                     */

                    const status =
                        String(
                            row.status ||
                            ""
                        )
                            .trim()
                            .toUpperCase();


                    /*
                     * ==================================
                     * RETUR
                     *
                     * Tidak dihitung untuk:
                     * - Total Item
                     * - Qty
                     * - Subtotal
                     * - Discount
                     * - Total Penjualan
                     * ==================================
                     */

                    if (
                        status ===
                        "RETUR"
                    ) {

                        return;

                    }


                    totalItem +=
                        Number(
                            row.totalItem
                        ) || 0;


                    qty +=
                        Number(
                            row.qty
                        ) || 0;


                    subtotal +=
                        Number(
                            row.subtotal
                        ) || 0;


                    discount +=
                        Number(
                            row.disc
                        ) || 0;


                    total +=
                        Number(
                            row.total
                        ) || 0;

                }
            );


            const summary = {

                totalTransaksi,

                totalItem,

                qty,

                subtotal,

                discount,

                total,

                cash,

                qris,

                debit,

                transfer,

                totalPayment,

                change

            };


            /* ======================================
               DAILY
            ====================================== */

            const dailyMap =
                new Map();


            transactions.forEach(
                transaction => {

                    const date =
                        new Date(
                            transaction.tanggal
                        );


                    const key =
                        [

                            date.getFullYear(),

                            String(
                                date.getMonth() + 1
                            )
                                .padStart(
                                    2,
                                    "0"
                                ),

                            String(
                                date.getDate()
                            )
                                .padStart(
                                    2,
                                    "0"
                                )

                        ].join("-");


                    if (
                        !dailyMap.has(
                            key
                        )
                    ) {

                        dailyMap.set(
                            key,
                            {

                                tanggal:
                                    key,

                                totalTransaksi:
                                    0,

                                subtotal:
                                    0,

                                total:
                                    0,

                                transactions:
                                    []

                            }
                        );

                    }


                    const daily =
                        dailyMap.get(
                            key
                        );


                    /*
                     * ==================================
                     * JUMLAH TRANSAKSI HARIAN
                     *
                     * RETUR TETAP DIHITUNG
                     * ==================================
                     */

                    daily.totalTransaksi +=
                        1;


                    /*
                     * ==================================
                     * SUBTOTAL HARIAN
                     *
                     * RETUR TIDAK DIHITUNG
                     * ==================================
                     */

                    const status =
                        String(
                            transaction.status ||
                            ""
                        )
                            .trim()
                            .toUpperCase();


                    if (
                        status !==
                        "RETUR"
                    ) {

                        daily.subtotal +=
                            Number(
                                transaction.subtotal
                            ) || 0;


                        daily.total +=
                            (
                                Number(
                                    transaction.subtotal
                                ) || 0
                            ) -
                            (
                                Number(
                                    transaction.disc
                                ) || 0
                            );

                    }


                    /*
                     * ==================================
                     * TRANSAKSI TETAP DISIMPAN
                     *
                     * TERMASUK RETUR
                     * ==================================
                     */

                    daily.transactions.push(
                        transaction
                    );

                }
            );


            const daily =
                Array.from(
                    dailyMap.values()
                )
                .sort(
                    (
                        a,
                        b
                    ) =>
                        a.tanggal.localeCompare(
                            b.tanggal
                        )
                );


            const report = {

                success:
                    true,

                summary,

                daily,

                transactions

            };


            this.report =
                report;


            this.data =
                report;


            this.filtered =
                transactions;


            this.updateKasirOptions(
                transactions,
                selectedKasir
            );


            this.renderSummary(
                summary
            );


            this.renderTable();

        }


        catch (error) {

            console.error(
                "PenjualanLaporanModal.filter:",
                error
            );


            this.data = null;

            this.report = null;

            this.filtered = [];


            this.resetSummary();

            this.renderTable();


            Dialog.alert(
                error.message ||
                "Gagal memuat laporan penjualan."
            );

        }


        finally {

            this.setLoading(
                false
            );

        }

    },


    async lihatPdf(tanggal) {

        try {

            if (!tanggal) {

                Dialog.alert(
                    "Tanggal laporan tidak ditemukan."
                );

                return;

            }


            /* ======================================
               FORMAT TANGGAL
               YYYY-MM-DD
               MENJADI
               DD-MM-YY.pdf
            ====================================== */

            const parts =
                String(
                    tanggal
                ).split("-");


            if (
                parts.length !== 3
            ) {

                Dialog.alert(
                    "Format tanggal laporan tidak valid."
                );

                return;

            }


            const tahun =
                parts[0];

            const bulan =
                parts[1];

            const hari =
                parts[2];


            const fileName =
                `${hari}-${bulan}-${tahun.slice(-2)}.pdf`;


            /* ======================================
               AMBIL DAFTAR PDF
            ====================================== */

            const response =
                await API.getLaporanPenjualanPdf();


            if (
                !response ||
                !response.success
            ) {

                throw new Error(
                    response &&
                    response.message
                        ? response.message
                        : "Gagal membaca file PDF laporan penjualan."
                );

            }


            const files =
                Array.isArray(
                    response.data
                )
                    ? response.data
                    : [];


            /* ======================================
               CARI PDF SESUAI TANGGAL
            ====================================== */

            const file =
                files.find(
                    item =>
                        String(
                            item.fileName
                        ) ===
                        fileName
                );


            if (!file) {

                Dialog.alert(
                    `PDF laporan penjualan untuk tanggal ${hari}-${bulan}-${tahun.slice(-2)} tidak ditemukan.`
                );

                return;

            }


            /* ======================================
               BUKA PDF
            ====================================== */

            if (file.url) {

                window.open(
                    file.url,
                    "_blank"
                );

                return;

            }


            if (file.fileId) {

                window.open(
                    `https://drive.google.com/file/d/${file.fileId}/view`,
                    "_blank"
                );

                return;

            }


            Dialog.alert(
                "Link PDF tidak tersedia."
            );


        }
        catch (error) {

            console.error(
                "LIHAT PDF LAPORAN PENJUALAN ERROR:",
                error
            );


            Dialog.alert(
                error.message ||
                "Gagal membuka PDF laporan penjualan."
            );

        }

    },


    /* ======================================
       UPDATE KASIR
    ====================================== */

    updateKasirOptions(
        transactions,
        selectedKasir = ""
    ) {

        const select =
            document.getElementById(
                "penjualanLaporanModalKasir"
            );


        if (!select) {
            return;
        }


        const kasirList =
            [
                ...new Set(

                    transactions
                        .map(
                            row =>
                                String(
                                    row.kasir ||
                                    ""
                                ).trim()
                        )

                        .filter(
                            Boolean
                        )

                )
            ];


        kasirList.sort(
            (
                a,
                b
            ) =>
                a.localeCompare(
                    b,
                    "id"
                )
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
                                value="${this.escape(
                                    kasir
                                )}"
                            >
                                ${this.escape(
                                    kasir
                                )}
                            </option>

                        `
                    )
                    .join("")
            }

        `;


        select.value =
            selectedKasir || "";

    },


    /* ======================================
       SUMMARY
    ====================================== */

    renderSummary(
        summary
    ) {

        this.setText(
            "penjualanLaporanModalTotalTransaksi",
            this.number(
                summary.totalTransaksi
            )
        );


        this.setText(
            "penjualanLaporanModalTotalItem",
            this.number(
                summary.totalItem
            )
        );


        this.setText(
            "penjualanLaporanModalSubtotal",
            this.money(
                summary.subtotal
            )
        );


        this.setText(
            "penjualanLaporanModalDiscount",
            this.money(
                summary.discount
            )
        );


        this.setText(
            "penjualanLaporanModalTotal",
            this.money(
                summary.total
            )
        );


        this.setText(
            "penjualanLaporanModalCash",
            this.money(
                summary.cash
            )
        );


        this.setText(
            "penjualanLaporanModalQRIS",
            this.money(
                summary.qris
            )
        );


        this.setText(
            "penjualanLaporanModalDebit",
            this.money(
                summary.debit
            )
        );


        this.setText(
            "penjualanLaporanModalTransfer",
            this.money(
                summary.transfer
            )
        );


        this.setText(
            "penjualanLaporanModalTotalPayment",
            this.money(
                summary.totalPayment
            )
        );


        this.setText(
            "penjualanLaporanModalFooterTotal",
            this.money(
                summary.total
            )
        );

    },


    /* ======================================
       RESET SUMMARY
    ====================================== */

    resetSummary() {

        this.setText(
            "penjualanLaporanModalTotalTransaksi",
            "0"
        );


        this.setText(
            "penjualanLaporanModalTotalItem",
            "0"
        );


        this.setText(
            "penjualanLaporanModalSubtotal",
            "Rp 0"
        );


        this.setText(
            "penjualanLaporanModalDiscount",
            "Rp 0"
        );


        this.setText(
            "penjualanLaporanModalTotal",
            "Rp 0"
        );


        this.setText(
            "penjualanLaporanModalCash",
            "Rp 0"
        );


        this.setText(
            "penjualanLaporanModalQRIS",
            "Rp 0"
        );


        this.setText(
            "penjualanLaporanModalDebit",
            "Rp 0"
        );


        this.setText(
            "penjualanLaporanModalTransfer",
            "Rp 0"
        );


        this.setText(
            "penjualanLaporanModalTotalPayment",
            "Rp 0"
        );


        this.setText(
            "penjualanLaporanModalFooterTotal",
            "Rp 0"
        );

    },


    /* ======================================
       TABLE
    ====================================== */

    renderTable() {

        const tbody =
            document.getElementById(
                "penjualanLaporanModalTableBody"
            );


        if (!tbody) {
            return;
        }


        const daily =
    this.report &&
    Array.isArray(
        this.report.daily
    )
        ? [...this.report.daily].sort(
            (a, b) =>
                String(b.tanggal || "").localeCompare(
                    String(a.tanggal || "")
                )
        )
        : [];


        this.setText(
            "penjualanLaporanModalCount",
            `${this.number(
                daily.length
            )} hari`
        );


        if (!daily.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="penjualan-laporan-modal-empty"
                    >
                        Tidak ada transaksi.
                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML =
            daily
                .map(
                    row => `

                        <tr
                            class="penjualan-laporan-modal-row"
                            data-tanggal="${this.escape(
                                row.tanggal || ""
                            )}"
                        >

                            <td>
                                ${this.date(
                                    row.tanggal
                                )}
                            </td>


                            <td>
                                ${this.number(
                                    row.totalTransaksi
                                )}
                            </td>


                            <td
                                class="
                                    penjualan-laporan-modal-money
                                "
                            >
                                ${this.money(
                                    row.total
                                )}
                            </td>


                            <td>

                                <button
                                    type="button"
                                    class="
                                        penjualan-laporan-modal-detail-button
                                    "
                                    data-action="lihat-pdf"
                                    data-tanggal="${this.escape(
                                        row.tanggal || ""
                                    )}"
                                >
                                    Lihat PDF
                                </button>

                            </td>

                        </tr>

                    `
                )
                .join("");

    },


    /* ======================================
       LOADING
    ====================================== */

    setLoading(
        loading
    ) {

        const button =
            document.getElementById(
                "penjualanLaporanModalReset"
            );


        if (!button) {
            return;
        }


        button.disabled =
            loading;

    },


    /* ======================================
       SET TEXT
    ====================================== */

    setText(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );


        if (!element) {
            return;
        }


        element.textContent =
            value;

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
        )
            .toLocaleString(
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
            )
                .toLocaleString(
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
                text.split("-");


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

    },


    /* ======================================
       RESET
    ====================================== */

    async reset() {

        const input =
            document.getElementById(
                "penjualanLaporanModalBulan"
            );


        if (input) {

            const now =
                new Date();


            input.value =
                `${now.getFullYear()}-${String(
                    now.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                )}`;

        }


        const kasir =
            document.getElementById(
                "penjualanLaporanModalKasir"
            );


        if (kasir) {
            kasir.value = "";
        }


        await this.loadKasir();

        await this.filter();

    }

};