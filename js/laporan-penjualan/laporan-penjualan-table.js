Object.assign(LaporanPenjualan, {

    renderTable() {

        const tbody =
            document.getElementById(
                "laporanPenjualanTableBody"
            );

        const count =
            document.getElementById(
                "laporanPenjualanCount"
            );

        if (!tbody) return;

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
                            class="laporan-penjualan-row"
                            data-tanggal="${this.escape(
                                row.tanggal || ""
                            )}"
                        >

                            <td>
    ${this.escape(String(row.tanggal || ""))}
</td>

                            <td>
                                ${this.number(
                                    row.totalTransaksi
                                )}
                            </td>

                            <td>
                                    <strong>
                                        ${this.money(
                                            (
                                                Number(
                                                    row.subtotal
                                                ) || 0
                                            ) -
                                            (
                                                Number(
                                                    row.discount
                                                ) || 0
                                            )
                                        )}
                                    </strong>
                                </td>

                            <td>

                                <button
                                    type="button"
                                    class="laporan-detail-button"
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

        this.bindTableEvents();

    },


    bindTableEvents() {

        const tbody =
            document.getElementById(
                "laporanPenjualanTableBody"
            );

        if (!tbody) return;


        tbody.onclick =
            async event => {

                /*======================================
                   TOMBOL LIHAT PDF
                ======================================*/

                const pdfButton =
                    event.target.closest(
                        '[data-action="lihat-pdf"]'
                    );


                if (pdfButton) {

                    event.preventDefault();
                    event.stopPropagation();


                    const tanggal =
                        pdfButton.dataset.tanggal;


                    await this.lihatPdf(
                        tanggal
                    );


                    return;

                }


                /*======================================
                   KLIK BARIS
                ======================================*/

                const row =
                    event.target.closest(
                        ".laporan-penjualan-row"
                    );


                if (!row) return;


                event.preventDefault();
                event.stopPropagation();


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
                                item.tanggal
                            ) ===
                            String(
                                tanggal
                            )
                    );


                if (!day) return;


                if (
                    typeof PenjualanTransaksiModal !==
                    "undefined"
                ) {

                    PenjualanTransaksiModal.open(
                        day.tanggal,
                        day.transactions
                    );

                }
                else {

                    console.error(
                        "PenjualanTransaksiModal tidak ditemukan."
                    );

                }

            };

    },


    async lihatPdf(tanggal) {

        try {

            if (!tanggal) {

                Dialog.alert(
                    "Tanggal laporan tidak ditemukan."
                );

                return;

            }


            /*======================================
               FORMAT TANGGAL
               YYYY-MM-DD
               MENJADI
               DD-MM-YY.pdf
            ======================================*/

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


            /*======================================
               AMBIL DAFTAR PDF
            ======================================*/

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


            /*======================================
               CARI FILE SESUAI TANGGAL
            ======================================*/

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


            /*======================================
               BUKA PDF
            ======================================*/

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

    }

});