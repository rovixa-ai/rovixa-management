const PembelianLaporanModal = {

    data: [],
    filtered: [],
    report: null,


    async open() {

        this.close();

        const modal =
            document.createElement("div");

        modal.id =
            "pembelian-laporan-modal";

        modal.className =
            "pembelian-laporan-modal";

        modal.innerHTML =
            PembelianLaporanModalRender.render();

        document.body.appendChild(modal);

        document.body.classList.add(
            "pembelian-laporan-modal-open"
        );

        this.event();

        await this.load();

    },


    close() {

        const modal =
            document.getElementById(
                "pembelian-laporan-modal"
            );

        if (modal) {

            modal.remove();

        }

        document.body.classList.remove(
            "pembelian-laporan-modal-open"
        );

        if (this.escapeHandler) {

            document.removeEventListener(
                "keydown",
                this.escapeHandler
            );

            this.escapeHandler = null;

        }

    },


    event() {

        const modal =
            document.getElementById(
                "pembelian-laporan-modal"
            );

        if (!modal) {
            return;
        }


        const closeButton =
            modal.querySelector(
                '[data-action="close"]'
            );

        if (closeButton) {

            closeButton.onclick =
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    this.close();

                };

        }


        const overlay =
            modal.querySelector(
                ".pembelian-laporan-modal-overlay"
            );

        if (overlay) {

            overlay.onclick =
                event => {

                    if (
                        event.target ===
                        overlay
                    ) {

                        this.close();

                    }

                };

        }


        const tanggal =
            document.getElementById(
                "pembelianLaporanModalTanggal"
            );

        if (tanggal) {

            tanggal.onchange =
                () => {

                    this.filter();

                };

        }


        const supplier =
            document.getElementById(
                "pembelianLaporanModalSupplier"
            );

        if (supplier) {

            supplier.onchange =
                () => {

                    this.filter();

                };

        }


        const reset =
            document.getElementById(
                "pembelianLaporanModalReset"
            );

        if (reset) {

            reset.onclick =
                () => {

                    this.reset();

                };

        }


        const tbody =
            document.getElementById(
                "pembelianLaporanModalTableBody"
            );

        if (tbody) {

            tbody.onclick =
                event => {

                    const pdfButton =
                        event.target.closest(
                            '[data-action="lihat-pdf"]'
                        );


                    if (pdfButton) {

                        event.preventDefault();
                        event.stopPropagation();


                        const tanggal =
                            pdfButton.dataset.tanggal;


                        this.lihatPdf(
                            tanggal
                        );

                        return;

                    }


                    const row =
                        event.target.closest(
                            ".pembelian-laporan-modal-row"
                        );


                    if (!row) {
                        return;
                    }


                    event.preventDefault();
                    event.stopPropagation();


                    const tanggal =
                        row.dataset.tanggal;


                    const day =
                        this.report &&
                        Array.isArray(
                            this.report.daily
                        )
                            ? this.report.daily.find(
                                item =>
                                    String(
                                        item.tanggal
                                    ) ===
                                    String(
                                        tanggal
                                    )
                            )
                            : null;


                    if (
                        typeof PembelianTransaksiModal ===
                        "undefined"
                    ) {

                        console.error(
                            "PembelianTransaksiModal tidak ditemukan."
                        );

                        return;

                    }


                    PembelianTransaksiModal.open(
                        tanggal,
                        day &&
                        Array.isArray(
                            day.transactions
                        )
                            ? day.transactions
                            : []
                    );

                };

        }


        this.escapeHandler =
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    this.close();

                }

            };


        document.addEventListener(
            "keydown",
            this.escapeHandler
        );

    },


    async lihatPdf(tanggal) {

        if (!tanggal) {

            Dialog.alert(
                "Tanggal laporan tidak ditemukan."
            );

            return;

        }


        try {

            const parts =
                String(
                    tanggal
                ).split("-");


            if (
                parts.length !== 3
            ) {

                throw new Error(
                    "Format tanggal tidak valid."
                );

            }


            const tahun =
                parts[0];

            const bulan =
                parts[1];

            const hari =
                parts[2];


            const fileName =
                `${hari}-${bulan}-${String(
                    tahun
                ).slice(-2)}.pdf`;


            const result =
                await API.getLaporanPembelianPdf();


            if (
                !result ||
                result.success !== true
            ) {

                throw new Error(
                    result &&
                    result.message
                        ? result.message
                        : "Gagal membaca daftar PDF."
                );

            }


            const files =
                Array.isArray(
                    result.data
                )
                    ? result.data
                    : [];


            const file =
                files.find(
                    item =>
                        String(
                            item.fileName ||
                            ""
                        ).toLowerCase() ===
                        fileName.toLowerCase()
                );


            if (!file) {

                Dialog.alert(
                    `File PDF laporan tanggal ${this.date(
                        tanggal
                    )} belum tersedia.`
                );

                return;

            }


            const url =
                file.url ||
                (
                    file.fileId
                        ? `https://drive.google.com/file/${file.fileId}/view`
                        : ""
                );


            if (!url) {

                throw new Error(
                    "URL file PDF tidak ditemukan."
                );

            }


            window.open(
                url,
                "_blank"
            );

        }
        catch (error) {

            console.error(
                "LIHAT PDF LAPORAN PEMBELIAN ERROR:",
                error
            );

            Dialog.alert(
                error.message ||
                "Gagal membuka file PDF."
            );

        }

    },


    async load() {

        try {

            const pembelian =
                await DB.getAll(
                    "pembelian"
                );


            const detailPembelian =
                await DB.getAll(
                    "detailPembelian"
                );


            const pembayaranPembelian =
                await DB.getAll(
                    "pembayaranPembelian"
                );


            const dataPembelian =
                Array.isArray(
                    pembelian
                )
                    ? pembelian
                    : [];


            const dataDetail =
                Array.isArray(
                    detailPembelian
                )
                    ? detailPembelian
                    : [];


            const dataPembayaran =
                Array.isArray(
                    pembayaranPembelian
                )
                    ? pembayaranPembelian
                    : [];


            const detailMap =
                new Map();


            dataDetail.forEach(
                item => {

                    const id =
                        String(
                            item.id ||
                            ""
                        ).trim();


                    if (!id) {
                        return;
                    }


                    if (
                        !detailMap.has(id)
                    ) {

                        detailMap.set(
                            id,
                            []
                        );

                    }


                    detailMap
                        .get(id)
                        .push({

                            barcode:
                                String(
                                    item.barcode ||
                                    ""
                                ),

                            kode:
                                String(
                                    item.kode ||
                                    ""
                                ),

                            nama:
                                String(
                                    item.nama ||
                                    ""
                                ),

                            satuan:
                                String(
                                    item.satuan ||
                                    ""
                                ),

                            qty:
                                Number(
                                    item.qty
                                ) || 0,

                            isi:
                                Number(
                                    item.isi
                                ) || 0,

                            harga:
                                Number(
                                    item.harga
                                ) || 0,

                            disc:
                                Number(
                                    item.disc
                                ) || 0,

                            total:
                                Number(
                                    item.total
                                ) || 0

                        });

                }
            );


            const pembayaranMap =
                new Map();


            dataPembayaran.forEach(
                payment => {

                    const id =
                        String(
                            payment.id ||
                            ""
                        ).trim();


                    if (!id) {
                        return;
                    }


                    if (
                        !pembayaranMap.has(id)
                    ) {

                        pembayaranMap.set(
                            id,
                            []
                        );

                    }


                    pembayaranMap
                        .get(id)
                        .push({

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

                        });

                }
            );


            this.data =
                dataPembelian
                    .map(
                        row => {

                            const id =
                                String(
                                    row.id ||
                                    ""
                                ).trim();


                            const items =
                                detailMap.get(id) ||
                                [];


                            const payments =
                                pembayaranMap.get(id) ||
                                [];


                            const subtotal =
                                Number(
                                    row.subtotal
                                ) || 0;


                            const disc =
                                Number(
                                    row.disc
                                ) || 0;


                            const total =
                                Number(
                                    row.total
                                ) ||
                                Math.max(
                                    0,
                                    subtotal - disc
                                );


                            return {

                                id:
                                    id,

                                tanggal:
                                    row.tanggal ||
                                    "",

                                supplier:
                                    String(
                                        row.supplier ||
                                        ""
                                    ),

                                invoice:
                                    String(
                                        row.invoice ||
                                        ""
                                    ),

                                subtotal:
                                    subtotal,

                                disc:
                                    disc,

                                total:
                                    total,

                                status:
                                    String(
                                        row.status ||
                                        "Aktif"
                                    ),

                                items:
                                    items,

                                payments:
                                    payments,

                                jam:
                                    row.jam ||
                                    row.waktu ||
                                    ""

                            };

                        }
                    );


            this.filtered =
                this.data.slice();


            this.setTanggal();

            this.loadSupplier();

            this.filter();

        }
        catch (error) {

            console.error(
                "PEMBELIAN LAPORAN MODAL LOAD ERROR:",
                error
            );

            this.data = [];

            this.filtered = [];

            this.report = null;

            this.renderSummary();

            this.renderTable();

        }

    },


    setTanggal() {

    const input =
        document.getElementById(
            "pembelianLaporanModalTanggal"
        );

    if (!input) {
        return;
    }

    const now = new Date();

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


    loadSupplier() {

        const select =
            document.getElementById(
                "pembelianLaporanModalSupplier"
            );

        if (!select) {
            return;
        }


        const current =
            String(
                select.value ||
                ""
            );


        const suppliers =
            [
                ...new Set(
                    this.data
                        .map(
                            row =>
                                String(
                                    row.supplier ||
                                    ""
                                ).trim()
                        )
                        .filter(
                            value =>
                                value
                        )
                )
            ]
                .sort(
                    (a, b) =>
                        a.localeCompare(
                            b,
                            "id-ID"
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


        if (
            suppliers.includes(
                current
            )
        ) {

            select.value =
                current;

        }

    },


    filter() {

        const tanggal =
            document.getElementById(
                "pembelianLaporanModalTanggal"
            );


        const supplier =
            document.getElementById(
                "pembelianLaporanModalSupplier"
            );


        const month =
            tanggal
                ? String(
                    tanggal.value ||
                    ""
                ).trim()
                : "";


        const supplierValue =
            supplier
                ? String(
                    supplier.value ||
                    ""
                ).trim()
                : "";


        let filtered =
            this.data.slice();


        if (month) {

            filtered =
                filtered.filter(
                    row => {

                        const date =
                            this.parseDate(
                                row.tanggal
                            );


                        if (!date) {
                            return false;
                        }


                        const year =
                            date.getFullYear();


                        const monthNumber =
                            String(
                                date.getMonth() + 1
                            ).padStart(
                                2,
                                "0"
                            );


                        return (
                            year +
                            "-" +
                            monthNumber
                        ) === month;

                    }
                );

        }


        if (supplierValue) {

            filtered =
                filtered.filter(
                    row =>
                        String(
                            row.supplier ||
                            ""
                        ).trim() ===
                        supplierValue
                );

        }


        this.filtered =
            filtered;


        this.buildReport();

    },


    buildReport() {

        const transactions =
            this.filtered.slice();


        let totalTransaksi =
            transactions.length;


        let totalItem =
            0;


        let subtotal =
            0;


        let discount =
            0;


        let total =
            0;


        let cash =
            0;


        let qris =
            0;


        let kartu =
            0;


        let transfer =
            0;


        let totalPayment =
            0;


        transactions.forEach(
            row => {

                const items =
                    Array.isArray(
                        row.items
                    )
                        ? row.items
                        : [];


                items.forEach(
                    item => {

                        totalItem +=
                            Number(
                                item.qty
                            ) || 0;

                    }
                );


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


                const payments =
                    Array.isArray(
                        row.payments
                    )
                        ? row.payments
                        : [];


                payments.forEach(
                    payment => {

                        const nominal =
                            Number(
                                payment.nominal
                            ) || 0;


                        totalPayment +=
                            nominal;


                        const metode =
                            String(
                                payment.metode ||
                                ""
                            )
                                .trim()
                                .toLowerCase();


                        if (
                            metode ===
                            "cash"
                        ) {

                            cash +=
                                nominal;

                        }
                        else if (
                            metode ===
                            "qris"
                        ) {

                            qris +=
                                nominal;

                        }
                        else if (
                            metode ===
                            "kartu" ||
                            metode ===
                            "debit"
                        ) {

                            kartu +=
                                nominal;

                        }
                        else if (
                            metode ===
                            "transfer"
                        ) {

                            transfer +=
                                nominal;

                        }

                    }
                );

            }
        );


        const dailyMap =
            new Map();


        transactions.forEach(
            row => {

                const date =
                    this.parseDate(
                        row.tanggal
                    );


                if (!date) {
                    return;
                }


                const tanggal =
                    [
                        date.getFullYear(),
                        String(
                            date.getMonth() + 1
                        ).padStart(
                            2,
                            "0"
                        ),
                        String(
                            date.getDate()
                        ).padStart(
                            2,
                            "0"
                        )
                    ].join("-");


                if (
                    !dailyMap.has(
                        tanggal
                    )
                ) {

                    dailyMap.set(
                        tanggal,
                        {

                            tanggal:
                                tanggal,

                            totalTransaksi:
                                0,

                            subtotal:
                                0,

                            discount:
                                0,

                            total:
                                0,

                            transactions:
                                []

                        }
                    );

                }


                const day =
                    dailyMap.get(
                        tanggal
                    );


                day.totalTransaksi +=
                    1;


                day.subtotal +=
                    Number(
                        row.subtotal
                    ) || 0;


                day.discount +=
                    Number(
                        row.disc
                    ) || 0;


                day.total +=
                    Number(
                        row.total
                    ) || 0;


                day.transactions.push(
                    row
                );

            }
        );


        const daily =
            Array.from(
                dailyMap.values()
            )
                .sort(
                    (a, b) =>
                        a.tanggal.localeCompare(
                            b.tanggal
                        )
                );


        this.report = {

            success:
                true,

            filter: {

                bulan:
                    document.getElementById(
                        "pembelianLaporanModalTanggal"
                    )?.value ||
                    "",

                supplier:
                    document.getElementById(
                        "pembelianLaporanModalSupplier"
                    )?.value ||
                    ""

            },

            summary: {

                totalTransaksi:
                    totalTransaksi,

                totalItem:
                    totalItem,

                subtotal:
                    subtotal,

                discount:
                    discount,

                total:
                    total,

                cash:
                    cash,

                qris:
                    qris,

                kartu:
                    kartu,

                transfer:
                    transfer,

                totalPayment:
                    totalPayment

            },

            transactions:
                transactions,

            daily:
                daily

        };


        this.renderSummary();

        this.renderTable();

    },


    renderSummary() {

        const summary =
            this.report &&
            this.report.summary
                ? this.report.summary
                : {};


        this.setText(
            "pembelianLaporanModalTotalTransaksi",
            this.number(
                summary.totalTransaksi
            )
        );


        this.setText(
            "pembelianLaporanModalTotalItem",
            this.number(
                summary.totalItem
            )
        );


        this.setText(
            "pembelianLaporanModalSubtotal",
            this.money(
                summary.subtotal
            )
        );


        this.setText(
            "pembelianLaporanModalDiscount",
            this.money(
                summary.discount
            )
        );


        this.setText(
            "pembelianLaporanModalTotal",
            this.money(
                summary.total
            )
        );


        this.setText(
            "pembelianLaporanModalCash",
            this.money(
                summary.cash
            )
        );


        this.setText(
            "pembelianLaporanModalQRIS",
            this.money(
                summary.qris
            )
        );


        this.setText(
            "pembelianLaporanModalKartu",
            this.money(
                summary.kartu
            )
        );


        this.setText(
            "pembelianLaporanModalTransfer",
            this.money(
                summary.transfer
            )
        );


        this.setText(
            "pembelianLaporanModalTotalPayment",
            this.money(
                summary.totalPayment
            )
        );

    },


    renderTable() {

        const tbody =
            document.getElementById(
                "pembelianLaporanModalTableBody"
            );


        const count =
            document.getElementById(
                "pembelianLaporanModalCount"
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



        if (count) {

            count.textContent =
                this.number(
                    daily.length
                ) +
                " hari";

        }


        if (!daily.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="pembelian-laporan-modal-empty"
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
                            class="pembelian-laporan-modal-row"
                            data-tanggal="${this.escape(
                                row.tanggal ||
                                ""
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

                            <td>

                                <strong>
                                    ${this.money(
                                        row.subtotal
                                    )}
                                </strong>

                            </td>

                            <td>

                                <button
                                    type="button"
                                    class="pembelian-laporan-modal-detail-button"
                                    data-action="lihat-pdf"
                                    data-tanggal="${this.escape(
                                        row.tanggal ||
                                        ""
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


    reset() {

        this.setTanggal();


        const supplier =
            document.getElementById(
                "pembelianLaporanModalSupplier"
            );


        if (supplier) {

            supplier.value =
                "";

        }


        this.filter();

    },


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


    date(
        value
    ) {

        if (!value) {
            return "-";
        }


        const date =
            this.parseDate(
                value
            );


        if (!date) {

            return this.escape(
                String(
                    value
                )
            );

        }


        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );


        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const year =
            date.getFullYear();


        return (
            day +
            "-" +
            month +
            "-" +
            year
        );

    },


    parseDate(
        value
    ) {

        if (!value) {
            return null;
        }


        const text =
            String(
                value
            ).trim();


        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                text
            )
        ) {

            const parts =
                text.split(
                    "-"
                );


            const date =
                new Date(
                    Number(
                        parts[0]
                    ),
                    Number(
                        parts[1]
                    ) - 1,
                    Number(
                        parts[2]
                    )
                );


            return isNaN(
                date.getTime()
            )
                ? null
                : date;

        }


        const date =
            new Date(
                text
            );


        return isNaN(
            date.getTime()
        )
            ? null
            : date;

    },


    escape(
        value
    ) {

        return String(
            value ??
            ""
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