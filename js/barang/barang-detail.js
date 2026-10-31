
/*======================================
TREEHOUSE POS
BARANG DETAIL MODAL
======================================*/

const BarangDetail = {

    modal: null,
    barangAktif: null,

    async open(barang) {

        if (!barang) {
            return;
        }

        this.close();
        this.barangAktif = barang;

        let statistik = {
            totalTerjual: 0,
            rataHari: 0,
            rataMinggu: 0,
            rataBulan: 0,
            terjualHariIni: 0,
            terjualMingguIni: 0,
            terjualBulanIni: 0
        };

        try {
            statistik = await this.getSalesStats(barang);
        } catch (error) {
            console.error(
                "Gagal memuat statistik penjualan barang:",
                error
            );
        }

        let satuan = [];

        try {
            satuan = await this.getUnitData(barang);
        } catch (error) {
            console.error(
                "Gagal memuat data satuan dan harga barang:",
                error
            );

            satuan = Array.isArray(barang.satuan)
                ? barang.satuan
                : [];
        }

        const modal = document.createElement("div");

        modal.id = "barang-detail-modal";
        modal.className = "barang-detail-modal";

        modal.innerHTML = `

            <div
                class="barang-detail-overlay"
                data-detail-close="true"
            >

                <div
                    class="barang-detail-dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="barang-detail-title"
                >

                    <div class="barang-detail-header">

                        <div>
                            <h2 id="barang-detail-title">
                                Detail Barang
                            </h2>

                            <p>
                                Informasi barang yang dipilih
                            </p>
                        </div>

                        <button
                            type="button"
                            class="barang-detail-close"
                            id="barang-detail-close"
                            aria-label="Tutup modal"
                        >
                            ×
                        </button>

                    </div>

                    <div class="barang-detail-body">

                        <div class="barang-detail-section">

                            <h3>Informasi Utama</h3>

                            <div class="barang-detail-grid">

                                ${this.renderField(
                                    "Kode Barang",
                                    barang.kode
                                )}

                                ${this.renderField(
                                    "Nama Barang",
                                    barang.nama ||
                                    barang.namaBarang
                                )}

                                ${this.renderField(
                                    "Kategori",
                                    barang.kategori
                                )}

                                ${this.renderField(
                                    "Satuan Dasar",
                                    barang.satuanDasar ||
                                    barang.satuan_dasar ||
                                    "-"
                                )}

                                ${this.renderField(
                                    "Barcode",
                                    barang.barcode
                                )}

                                ${this.renderField(
                                    "Stok",
                                    barang.stok
                                )}

                                ${this.renderField(
                                    "Status",
                                    barang.status
                                )}

                            </div>

                        </div>

                        <div class="barang-detail-section">

                            <h3>Statistik Penjualan</h3>

                            <div class="barang-detail-statistics">

                                ${this.renderStat(
                                    "Terjual Hari Ini",
                                    statistik.terjualHariIni,
                                    "unit"
                                )}

                                ${this.renderStat(
                                    "Terjual Minggu Ini",
                                    statistik.terjualMingguIni,
                                    "unit"
                                )}

                                ${this.renderStat(
                                    "Terjual Bulan Ini",
                                    statistik.terjualBulanIni,
                                    "unit"
                                )}

                                ${this.renderStat(
                                    "Rata-rata per Bulan",
                                    statistik.rataBulan,
                                    "unit/bulan"
                                )}

                            </div>

                            <p class="barang-detail-statistics-note">
                                Statistik dihitung dari detail transaksi penjualan,
                                tidak termasuk transaksi berstatus RETUR.
                            </p>

                        </div>

                        <div class="barang-detail-section">

                            <h3>Satuan dan Harga</h3>

                            ${
                                satuan.length
                                    ? `
                                        <div class="barang-detail-table-wrapper">

                                            <table class="barang-detail-table">

                                                <thead>
                                                    <tr>
                                                        <th>Satuan</th>
                                                        <th>Isi / Konversi</th>
                                                        <th>Harga Beli</th>
                                                        <th>Harga Jual</th>
                                                        <th>Barcode Satuan</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    ${satuan.map((item, index) => `
                                                        <tr
                                                            class="barang-detail-unit-row"
                                                            data-unit-index="${index}"
                                                            tabindex="0"
                                                            role="button"
                                                            aria-label="Edit satuan ${this.escapeHTML(
                                                                item.satuan ||
                                                                item.nama ||
                                                                ""
                                                            )}"
                                                            title="Klik untuk mengedit satuan"
                                                        >
                                                            <td>
                                                                ${this.escapeHTML(
                                                                    item.satuan ||
                                                                    item.nama ||
                                                                    "-"
                                                                )}
                                                            </td>

                                                            <td class="text-right">
                                                                ${this.escapeHTML(
                                                                    item.isi ??
                                                                    item.konversi ??
                                                                    "-"
                                                                )}
                                                            </td>

                                                            <td class="text-right">
                                                                ${this.formatCurrency(
                                                                    item.hargaBeli ??
                                                                    item.harga_beli ??
                                                                    0
                                                                )}
                                                            </td>

                                                            <td class="text-right">
                                                                ${this.formatCurrency(
                                                                    item.hargaJual ??
                                                                    item.harga_jual ??
                                                                    0
                                                                )}
                                                            </td>

                                                            <td>
                                                                ${this.escapeHTML(
                                                                    item.barcodeSatuan ||
                                                                    item.barcode ||
                                                                    "-"
                                                                )}
                                                            </td>

                                                            <td>
                                                                ${this.escapeHTML(
                                                                    item.status || "-"
                                                                )}
                                                            </td>
                                                        </tr>
                                                    `).join("")}
                                                </tbody>

                                            </table>

                                        </div>

                                        <p class="barang-detail-statistics-note">
                                            Klik baris satuan untuk mengedit datanya.
                                        </p>
                                    `
                                    : `
                                        <div class="barang-detail-empty">
                                            Belum ada data satuan barang.
                                        </div>
                                    `
                            }

                        </div>

                    </div>

                    <div class="barang-detail-footer">

                        <button
                            type="button"
                            class="btn-secondary"
                            id="barang-detail-tutup"
                        >
                            Tutup
                        </button>

                    </div>

                </div>

            </div>

        `;

        document.body.appendChild(modal);

        this.modal = modal;

        this.bindEvents();
    },


    async editUnit(index) {

        const modal = this.modal;

        if (!modal || !this.barangAktif) {
            return;
        }

        const rows = modal.querySelectorAll(
            ".barang-detail-unit-row"
        );

        const row = rows[index];

        if (!row) {
            return;
        }

        const namaSatuan = row.cells[0]?.textContent
            ?.trim()
            .toLowerCase();

        const kodeBarang = String(
            this.barangAktif.kode ?? ""
        ).trim();

        /*
         * Ambil kembali data satuan asli dari IndexedDB.
         * Jangan gunakan objek hasil getUnitData untuk
         * penyimpanan karena objek tersebut sudah diperkaya
         * dengan harga beli hasil perhitungan.
         */
        const semuaSatuan = await DB.getAll("satuan");

        const satuanAsli = (
            Array.isArray(semuaSatuan)
                ? semuaSatuan
                : []
        ).find(item => {

            return (
                String(item?.kode ?? "").trim() ===
                    kodeBarang &&
                String(
                    item?.satuan ??
                    item?.nama ??
                    ""
                ).trim().toLowerCase() === namaSatuan
            );
        });

        if (!satuanAsli) {
            Dialog.alert(
                "Data satuan asli tidak ditemukan. " +
                "Form edit tidak dapat dibuka."
            );

            return;
        }

        /*
         * Tutup modal detail sebelum berpindah ke form.
         */
        this.close();

        /*
         * Kirim objek satuan asli yang memiliki ID,
         * kode barang induk, dan data edit yang sebenarnya.
         */
        SatuanForm.form(
            satuanAsli,
            {
                returnTo: "barang-detail",
                barangInduk: this.barangAktif
            }
        );
    },


    async getUnitData(barang) {

        const kodeBarang = String(
            barang?.kode ?? ""
        ).trim();

        if (!kodeBarang) {
            return Array.isArray(barang?.satuan)
                ? barang.satuan
                : [];
        }

        const [
            semuaSatuan,
            detailPembelian,
            pembelian
        ] = await Promise.all([
            DB.getAll("satuan"),
            DB.getAll("detailPembelian"),
            DB.getAll("pembelian")
        ]);

        const satuanBarang = (
            Array.isArray(semuaSatuan)
                ? semuaSatuan
                : []
        ).filter(item =>
            String(item?.kode ?? "").trim() === kodeBarang
        );

        if (!satuanBarang.length) {
            return Array.isArray(barang.satuan)
                ? barang.satuan
                : [];
        }

        const daftarDetail = Array.isArray(detailPembelian)
            ? detailPembelian
            : [];

        const daftarPembelian = Array.isArray(pembelian)
            ? pembelian
            : [];

        const transaksiMap = new Map();

        daftarPembelian.forEach(transaksi => {

            if (
                !transaksi ||
                transaksi.id == null
            ) {
                return;
            }

            const status = String(
                transaksi.status ?? ""
            ).trim().toUpperCase();

            if (
                status === "RETUR" ||
                status === "BATAL" ||
                status === "DIBATALKAN"
            ) {
                return;
            }

            const tanggal = this.parseDate(
                transaksi.tanggal
            );

            if (!tanggal) {
                return;
            }

            transaksiMap.set(
                String(transaksi.id).trim(),
                {
                    tanggal,
                    transaksi
                }
            );
        });

        return satuanBarang.map(item => {

            const namaSatuan = String(
                item.satuan ??
                item.nama ??
                ""
            ).trim().toLowerCase();

            const isiSatuan = Number(item.isi);

            let pembelianTerbaru = null;

            daftarDetail.forEach(detail => {

                if (!detail) {
                    return;
                }

                if (
                    String(detail.kode ?? "").trim() !==
                    kodeBarang
                ) {
                    return;
                }

                const satuanDetail = String(
                    detail.satuan ?? ""
                ).trim().toLowerCase();

                if (
                    !namaSatuan ||
                    satuanDetail !== namaSatuan
                ) {
                    return;
                }

                if (detail.id == null) {
                    return;
                }

                const transaksiData = transaksiMap.get(
                    String(detail.id).trim()
                );

                if (!transaksiData) {
                    return;
                }

                const harga = Number(detail.harga);
                const isiPembelian = Number(detail.isi);

                if (
                    !Number.isFinite(harga) ||
                    harga < 0 ||
                    !Number.isFinite(isiPembelian) ||
                    isiPembelian <= 0
                ) {
                    return;
                }

                if (
                    !pembelianTerbaru ||
                    transaksiData.tanggal >
                        pembelianTerbaru.tanggal
                ) {
                    pembelianTerbaru = {
                        tanggal: transaksiData.tanggal,
                        harga,
                        isi: isiPembelian
                    };
                }
            });

            let hargaBeli = Number(
                item.hargaBeli ??
                item.harga_beli ??
                0
            );

            if (
                pembelianTerbaru &&
                Number.isFinite(isiSatuan) &&
                isiSatuan > 0
            ) {
                hargaBeli = Math.round(
                    (
                        pembelianTerbaru.harga /
                        pembelianTerbaru.isi
                    ) * isiSatuan
                );
            }

            return {
                ...item,
                hargaBeli
            };
        });
    },


    async getSalesStats(barang) {

        const hasil = {
            terjualHariIni: 0,
            terjualMingguIni: 0,
            terjualBulanIni: 0,
            rataBulan: 0
        };

        const [
            penjualan,
            detailPenjualan
        ] = await Promise.all([
            DB.getAll("penjualan"),
            DB.getAll("detailPenjualan")
        ]);

        if (
            !Array.isArray(penjualan) ||
            !Array.isArray(detailPenjualan)
        ) {
            return hasil;
        }

        const kodeBarang = String(
            barang?.kode ?? ""
        ).trim();

        if (!kodeBarang) {
            return hasil;
        }

        const sekarang = new Date();

        const awalHariIni = new Date(
            sekarang.getFullYear(),
            sekarang.getMonth(),
            sekarang.getDate()
        );

        const awalBesok = new Date(
            awalHariIni.getTime() + 86400000
        );

        const awalMingguIni = new Date(
            awalHariIni
        );

        const hari = awalMingguIni.getDay();

        awalMingguIni.setDate(
            awalMingguIni.getDate() -
            (hari === 0 ? 6 : hari - 1)
        );

        const awalBulanIni = new Date(
            sekarang.getFullYear(),
            sekarang.getMonth(),
            1
        );

        const awalBulanDepan = new Date(
            sekarang.getFullYear(),
            sekarang.getMonth() + 1,
            1
        );

        const transaksiMap = new Map();

        penjualan.forEach(transaksi => {

            if (
                !transaksi ||
                transaksi.id == null
            ) {
                return;
            }

            const status = String(
                transaksi.status ?? ""
            ).trim().toUpperCase();

            if (status === "RETUR") {
                return;
            }

            const tanggal = this.parseDate(
                transaksi.tanggal
            );

            if (!tanggal) {
                return;
            }

            transaksiMap.set(
                String(transaksi.id),
                tanggal
            );
        });

        let totalTerjual = 0;
        let tanggalPertama = null;
        let tanggalTerakhir = null;

        detailPenjualan.forEach(detail => {

            if (
                !detail ||
                String(detail.kode ?? "").trim() !==
                    kodeBarang ||
                detail.id == null
            ) {
                return;
            }

            const tanggal = transaksiMap.get(
                String(detail.id)
            );

            if (!tanggal) {
                return;
            }

            const qty = Number(detail.qty);
            const konversi = Number(detail.konversi);

            if (
                !Number.isFinite(qty) ||
                qty <= 0
            ) {
                return;
            }

            const faktorKonversi =
                Number.isFinite(konversi) &&
                konversi > 0
                    ? konversi
                    : 1;

            const jumlah = qty * faktorKonversi;

            totalTerjual += jumlah;

            if (
                tanggalPertama === null ||
                tanggal < tanggalPertama
            ) {
                tanggalPertama = tanggal;
            }

            if (
                tanggalTerakhir === null ||
                tanggal > tanggalTerakhir
            ) {
                tanggalTerakhir = tanggal;
            }

            if (
                tanggal >= awalHariIni &&
                tanggal < awalBesok
            ) {
                hasil.terjualHariIni += jumlah;
            }

            if (
                tanggal >= awalMingguIni &&
                tanggal < awalBesok
            ) {
                hasil.terjualMingguIni += jumlah;
            }

            if (
                tanggal >= awalBulanIni &&
                tanggal < awalBulanDepan
            ) {
                hasil.terjualBulanIni += jumlah;
            }
        });

        if (
            tanggalPertama === null ||
            tanggalTerakhir === null
        ) {
            return hasil;
        }

        const bulanPertama =
            tanggalPertama.getFullYear() * 12 +
            tanggalPertama.getMonth();

        const bulanTerakhir =
            tanggalTerakhir.getFullYear() * 12 +
            tanggalTerakhir.getMonth();

        const jumlahBulan = Math.max(
            1,
            bulanTerakhir - bulanPertama + 1
        );

        hasil.rataBulan =
            totalTerjual / jumlahBulan;

        return hasil;
    },


    parseDate(value) {

        if (!value) {
            return null;
        }

        if (value instanceof Date) {
            return Number.isNaN(value.getTime())
                ? null
                : value;
        }

        const text = String(value).trim();

        const formatIndonesia = text.match(
            /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/
        );

        if (formatIndonesia) {

            const tanggal = new Date(
                Number(formatIndonesia[3]),
                Number(formatIndonesia[2]) - 1,
                Number(formatIndonesia[1]),
                Number(formatIndonesia[4] || 0),
                Number(formatIndonesia[5] || 0),
                Number(formatIndonesia[6] || 0)
            );

            return Number.isNaN(tanggal.getTime())
                ? null
                : tanggal;
        }

        const tanggal = new Date(text);

        return Number.isNaN(tanggal.getTime())
            ? null
            : tanggal;
    },


    renderStat(label, value, unit) {

        return `
            <div class="barang-detail-stat-card">

                <span class="barang-detail-stat-label">
                    ${this.escapeHTML(label)}
                </span>

                <strong class="barang-detail-stat-value">
                    ${this.formatNumber(value)}
                </strong>

                <span class="barang-detail-stat-unit">
                    ${this.escapeHTML(unit)}
                </span>

            </div>
        `;
    },


    renderField(label, value) {

        return `
            <div class="barang-detail-field">

                <span>
                    ${this.escapeHTML(label)}
                </span>

                <strong>
                    ${this.escapeHTML(
                        value === undefined ||
                        value === null ||
                        value === ""
                            ? "-"
                            : value
                    )}
                </strong>

            </div>
        `;
    },


    bindEvents() {

        if (!this.modal) {
            return;
        }

        const closeButton =
            this.modal.querySelector(
                "#barang-detail-close"
            );

        const footerButton =
            this.modal.querySelector(
                "#barang-detail-tutup"
            );

        const overlay =
            this.modal.querySelector(
                ".barang-detail-overlay"
            );

        const unitTable =
            this.modal.querySelector(
                ".barang-detail-table"
            );

        if (closeButton) {
            closeButton.onclick = () => {
                this.close();
            };
        }

        if (footerButton) {
            footerButton.onclick = () => {
                this.close();
            };
        }

        if (overlay) {
            overlay.onclick = event => {

                if (event.target === overlay) {
                    this.close();
                }
            };
        }

        if (unitTable) {

            unitTable.addEventListener(
                "click",
                event => {

                    const row = event.target.closest(
                        ".barang-detail-unit-row"
                    );

                    if (!row || !unitTable.contains(row)) {
                        return;
                    }

                    const index = Number(
                        row.dataset.unitIndex
                    );

                    this.editUnit(index).catch(error => {

                        console.error(
                            "Gagal membuka form edit satuan:",
                            error
                        );

                        Dialog.alert(
                            error.message ||
                            "Gagal membuka form edit satuan."
                        );
                    });
                }
            );

            unitTable.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key !== "Enter" &&
                        event.key !== " "
                    ) {
                        return;
                    }

                    const row = event.target.closest(
                        ".barang-detail-unit-row"
                    );

                    if (!row || !unitTable.contains(row)) {
                        return;
                    }

                    event.preventDefault();

                    const index = Number(
                        row.dataset.unitIndex
                    );

                    this.editUnit(index).catch(error => {

                        console.error(
                            "Gagal membuka form edit satuan:",
                            error
                        );

                        Dialog.alert(
                            error.message ||
                            "Gagal membuka form edit satuan."
                        );
                    });
                }
            );
        }

        this.handleEscape = event => {

            if (
                event.key === "Escape" &&
                this.modal
            ) {
                this.close();
            }
        };

        document.addEventListener(
            "keydown",
            this.handleEscape
        );
    },


    close() {

        if (this.handleEscape) {

            document.removeEventListener(
                "keydown",
                this.handleEscape
            );

            this.handleEscape = null;
        }

        const modal =
            this.modal ||
            document.getElementById(
                "barang-detail-modal"
            );

        if (modal) {
            modal.remove();
        }

        this.modal = null;
    },


    formatNumber(value) {

        return new Intl.NumberFormat(
            "id-ID",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        ).format(
            Number(value) || 0
        );
    },


    formatCurrency(value) {

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        ).format(
            Number(value) || 0
        );
    },


    escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

};
