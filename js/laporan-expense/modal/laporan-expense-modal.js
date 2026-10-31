const LaporanExpenseModal = {

    open() {

        this.close();


        const modal =
            document.createElement(
                "div"
            );


        modal.id =
            "laporan-expense-modal";


        modal.innerHTML =
            LaporanExpenseModalRender.render();


        document.body.appendChild(
            modal
        );


        this.setTanggal();

        this.event();

        this.load();

    },


    close() {

        const modal =
            document.getElementById(
                "laporan-expense-modal"
            );


        if (modal) {

            modal.remove();

        }

    },


    setTanggal() {

        const tanggal =
            document.getElementById(
                "laporanExpenseModalTanggal"
            );


        if (!tanggal) {
            return;
        }


        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        tanggal.value =
            year +
            "-" +
            month;

    },


    event() {

        const close =
            document.getElementById(
                "laporan-expense-modal-close"
            );


        const reset =
            document.getElementById(
                "laporanExpenseModalResetButton"
            );


        const overlay =
            document.querySelector(
                "#laporan-expense-modal .laporan-expense-modal-overlay"
            );


        const tanggal =
            document.getElementById(
                "laporanExpenseModalTanggal"
            );


        const kategori =
            document.getElementById(
                "laporanExpenseModalKategori"
            );


        const metode =
            document.getElementById(
                "laporanExpenseModalMetode"
            );


        if (close) {

            close.addEventListener(
                "click",
                () => {

                    this.close();

                }
            );

        }


        if (reset) {

            reset.addEventListener(
                "click",
                () => {

                    this.reset();

                }
            );

        }


        if (overlay) {

            overlay.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        overlay
                    ) {

                        this.close();

                    }

                }
            );

        }


        if (tanggal) {

            tanggal.addEventListener(
                "change",
                () => {

                    this.filter();

                }
            );

        }


        if (kategori) {

            kategori.addEventListener(
                "change",
                () => {

                    this.filter();

                }
            );

        }


        if (metode) {

            metode.addEventListener(
                "change",
                () => {

                    this.filter();

                }
            );

        }

    },


    async load() {

        try {

            const data =
                await DB.getAll(
                    "expense"
                );


            this.data =
                Array.isArray(data)
                    ? data
                    : [];


            this.loadKategori();

            this.filter();

        }
        catch (error) {

            console.error(
                "LAPORAN EXPENSE MODAL LOAD ERROR:",
                error
            );


            this.data = [];

            this.renderSummary([]);

            this.renderTable([]);

        }

    },


    loadKategori() {

        const select =
            document.getElementById(
                "laporanExpenseModalKategori"
            );


        if (!select) {
            return;
        }


        const kategori =
            new Set();


        this.data.forEach(
            item => {

                const value =
                    String(
                        item.kategori ||
                        ""
                    ).trim();


                if (value) {

                    kategori.add(
                        value
                    );

                }

            }
        );


        select.innerHTML = `

            <option value="">
                Semua Kategori
            </option>

        `;


        Array.from(
            kategori
        )
            .sort(
                (a, b) =>
                    a.localeCompare(
                        b,
                        "id-ID"
                    )
            )
            .forEach(
                value => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        value;


                    option.textContent =
                        value;


                    select.appendChild(
                        option
                    );

                }
            );

    },


    filter() {

        const tanggal =
            document.getElementById(
                "laporanExpenseModalTanggal"
            );


        const kategori =
            document.getElementById(
                "laporanExpenseModalKategori"
            );


        const metode =
            document.getElementById(
                "laporanExpenseModalMetode"
            );


        const periode =
            tanggal
                ? String(
                    tanggal.value || ""
                )
                : "";


        const kategoriValue =
            kategori
                ? String(
                    kategori.value || ""
                ).trim()
                : "";


        const metodeValue =
            metode
                ? String(
                    metode.value || ""
                ).trim()
                : "";


        let filtered =
            Array.isArray(
                this.data
            )
                ? [...this.data]
                : [];


        if (periode) {

            const parts =
                periode.split("-");


            const year =
                Number(
                    parts[0]
                );


            const month =
                Number(
                    parts[1]
                );


            filtered =
                filtered.filter(
                    item => {

                        const date =
                            this.parseDate(
                                item.tanggal
                            );


                        if (!date) {
                            return false;
                        }


                        return (
                            date.getFullYear() ===
                                year &&
                            date.getMonth() + 1 ===
                                month
                        );

                    }
                );

        }


        if (kategoriValue) {

            filtered =
                filtered.filter(
                    item =>
                        String(
                            item.kategori ||
                            ""
                        ).trim() ===
                        kategoriValue
                );

        }


        if (metodeValue) {

            filtered =
                filtered.filter(
                    item =>
                        String(
                            item.metode ||
                            ""
                        ).trim() ===
                        metodeValue
                );

        }


        this.filtered =
            filtered;


        this.renderSummary(
            filtered
        );


        this.renderTable(
            filtered
        );

    },


    reset() {

        this.setTanggal();


        const kategori =
            document.getElementById(
                "laporanExpenseModalKategori"
            );


        const metode =
            document.getElementById(
                "laporanExpenseModalMetode"
            );


        if (kategori) {

            kategori.value =
                "";

        }


        if (metode) {

            metode.value =
                "";

        }


        this.filter();

    },


    renderSummary(data) {

        const transactions =
            Array.isArray(data)
                ? data
                : [];


        let total =
            0;


        let cash =
            0;


        let transfer =
            0;


        let qris =
            0;


        let kartu =
            0;


        transactions.forEach(
            item => {

                const jumlah =
                    Number(
                        item.jumlah
                    ) || 0;


                const metode =
                    String(
                        item.metode ||
                        ""
                    ).trim()
                    .toLowerCase();


                total +=
                    jumlah;


                if (
                    metode ===
                    "cash"
                ) {

                    cash +=
                        jumlah;

                }


                else if (
                    metode ===
                    "transfer"
                ) {

                    transfer +=
                        jumlah;

                }


                else if (
                    metode ===
                    "qris"
                ) {

                    qris +=
                        jumlah;

                }


                else if (
                    metode ===
                    "kartu"
                ) {

                    kartu +=
                        jumlah;

                }

            }
        );


        this.setText(
            "laporanExpenseModalTotalTransaksi",
            transactions.length
        );


        this.setText(
            "laporanExpenseModalTotal",
            this.formatRupiah(
                total
            )
        );


        this.setText(
            "laporanExpenseModalCash",
            this.formatRupiah(
                cash
            )
        );


        this.setText(
            "laporanExpenseModalTransfer",
            this.formatRupiah(
                transfer
            )
        );


        this.setText(
            "laporanExpenseModalQRIS",
            this.formatRupiah(
                qris
            )
        );


        this.setText(
            "laporanExpenseModalKartu",
            this.formatRupiah(
                kartu
            )
        );

    },


    renderTable(data) {

        const tbody =
            document.getElementById(
                "laporanExpenseModalTableBody"
            );


        if (!tbody) {
            return;
        }


        const transactions =
    Array.isArray(data)
        ? [...data].sort(
            (a, b) =>
                String(
                    b.spreadsheetId || ""
                ).localeCompare(
                    String(
                        a.spreadsheetId || ""
                    )
                )
        )
        : [];


        if (!transactions.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        class="laporan-expense-empty"
                    >
                        Tidak ada data Expense.
                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML =
            transactions
                .map(
                    (expense, index) => {

                        const status =
                            String(
                                expense.status ||
                                "Aktif"
                            ).trim();


                        const statusLower =
                            status.toLowerCase();


                        const statusClass =
                            statusLower ===
                            "aktif"
                                ? "laporan-expense-status-aktif"
                                : "laporan-expense-status-nonaktif";


                        const displayId =
                            String(
                                expense.spreadsheetId ||
                                ""
                            ).trim();


                        return `

                            <tr>

                                <td>
                                    ${index + 1}
                                </td>

                                <td>
                                    ${
                                        displayId
                                            ? this.escapeHtml(
                                                displayId
                                            )
                                            : "-"
                                    }
                                </td>

                                <td>
                                    ${this.formatTanggal(
                                        expense.tanggal
                                    )}
                                </td>

                                <td>
                                    ${this.escapeHtml(
                                        expense.kategori
                                    )}
                                </td>

                                <td>
                                    ${this.escapeHtml(
                                        expense.keterangan
                                    )}
                                </td>

                                <td>
                                    ${this.escapeHtml(
                                        expense.metode
                                    )}
                                </td>

                                <td
                                    class="laporan-expense-amount"
                                >
                                    ${this.formatRupiah(
                                        expense.jumlah
                                    )}
                                </td>

                                <td>

                                    <span
                                        class="
                                            laporan-expense-status
                                            ${statusClass}
                                        "
                                    >
                                        ${this.escapeHtml(
                                            status
                                        )}
                                    </span>

                                </td>

                            </tr>

                        `;

                    }
                )
                .join("");

    },


    setText(id, value) {

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


    parseDate(value) {

        if (
            value instanceof Date
        ) {

            return isNaN(
                value.getTime()
            )
                ? null
                : value;

        }


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
                text.split("-");


            const date =
                new Date(
                    Number(parts[0]),
                    Number(parts[1]) - 1,
                    Number(parts[2])
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


    formatTanggal(value) {

        if (!value) {
            return "-";
        }


        const date =
            this.parseDate(
                value
            );


        if (!date) {

            return this.escapeHtml(
                value
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


    formatRupiah(value) {

        const number =
            Number(
                value
            ) || 0;


        return (
            "Rp " +
            number.toLocaleString(
                "id-ID"
            )
        );

    },


    escapeHtml(value) {

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