Object.assign(LaporanPembelian, {

    renderTable() {

        const tbody =
            document.getElementById(
                "laporanPembelianTableBody"
            );

        const count =
            document.getElementById(
                "laporanPembelianCount"
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
                `${daily.length} hari`;

        }

        if (!daily.length) {

            tbody.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        class="laporan-empty"
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
                            class="laporan-table-row"
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
                                    class="laporan-detail-button"
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

        this.bindTableEvents();

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
                String(tanggal)
                    .split("-");

            if (parts.length !== 3) {

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
                `${hari}-${bulan}-${String(tahun).slice(-2)}.pdf`;

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
                Array.isArray(result.data)
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

        } catch (error) {

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


    bindTableEvents() {

        const tbody =
            document.getElementById(
                "laporanPembelianTableBody"
            );

        if (!tbody) {
            return;
        }

        tbody.onclick =
            event => {

                const pdfButton =
                    event.target.closest(
                        '[data-action="lihat-pdf"]'
                    );

                if (pdfButton) {

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
                        "tr.laporan-table-row"
                    );

                if (!row) {
                    return;
                }

                const tanggal =
                    row.dataset.tanggal;

                const daily =
                    this.report &&
                    Array.isArray(
                        this.report.daily
                    )
                        ? this.report.daily
                        : [];

                const day =
                    daily.find(
                        item =>
                            String(
                                item.tanggal ||
                                ""
                            ) ===
                            String(
                                tanggal ||
                                ""
                            )
                    );

                const transactions =
                    day &&
                    Array.isArray(
                        day.transactions
                    )
                        ? day.transactions
                        : [];

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
                    transactions
                );

            };

    }

});