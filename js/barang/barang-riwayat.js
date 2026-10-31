const BarangRiwayat = {

    /*======================================
    OPEN RIWAYAT STOK
    ======================================*/

    async open(barang) {

        


        document
            .getElementById("page")
            .innerHTML = `

                <div class="barang-page barang-riwayat-page">

                    <div class="barang-header">

                        <div>

                            <h2>
                                Riwayat Stok
                            </h2>

                            <p>
                                ${this.escapeHTML(
                                    barang.kode
                                )}
                                -
                                ${this.escapeHTML(
                                    barang.nama
                                )}
                            </p>

                        </div>

                        <button
                            class="btn-secondary"
                            id="riwayat-kembali"
                        >
                            Kembali
                        </button>

                    </div>


                    <div
                        class="barang-riwayat-list"
                        id="barang-riwayat-list"
                    >

                        <div class="barang-riwayat-empty">
                            Memuat riwayat...
                        </div>

                    </div>

                </div>

            `;


        document
            .getElementById(
                "riwayat-kembali"
            )
            .addEventListener(
                "click",
                () => {

                    Barang.menu(
                        barang
                    );

                }
            );


        await this.load(
            barang
        );

    },


    /*======================================
    LOAD RIWAYAT LOKAL
    ======================================*/

    async load(barang) {

        const container =
            document.getElementById(
                "barang-riwayat-list"
            );


        if (!container) {

            return;

        }


        try {

            const data =
                await DB.getAll(
                    "stokAdjustment"
                );


            

            const list =
                data
                    .filter(
                        item =>
                            String(
                                item.kode
                            ) ===
                            String(
                                barang.kode
                            )
                    )
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            new Date(
                                b.createdAt
                            ) -
                            new Date(
                                a.createdAt
                            )
                    );


            if (!list.length) {

                container.innerHTML = `

                    <div class="barang-riwayat-empty">

                        <div class="barang-riwayat-empty-icon">
                            <span>↻</span>
                        </div>

                        <strong>
                            Belum Ada Riwayat Stok
                        </strong>

                        <p>
                            Riwayat penyesuaian stok barang ini
                            akan ditampilkan di sini.
                        </p>

                    </div>

                `;

                return;

            }


            container.innerHTML =
                list
                    .map(
                        item => {

                            const tambah =
                                item.jenis === "tambah";


                            return `

                                <div class="barang-riwayat-card">

                                    <div class="barang-riwayat-card-header">

                                        <div class="barang-riwayat-card-title">

                                            <span class="barang-riwayat-indicator ${tambah ? "tambah" : "kurangi"}"></span>

                                            <span class="barang-riwayat-jenis ${tambah ? "tambah" : "kurangi"}">

                                                ${tambah ? "Stok Ditambahkan" : "Stok Dikurangi"}

                                            </span>

                                        </div>

                                        <span class="barang-riwayat-tanggal">

                                            ${this.formatDate(
                                                item.createdAt
                                            )}

                                        </span>

                                    </div>


                                    <div class="barang-riwayat-jumlah">

                                        <span class="barang-riwayat-label">
                                            Jumlah Penyesuaian
                                        </span>

                                        <strong class="${tambah ? "tambah" : "kurangi"}">

                                            ${tambah ? "+" : "−"}${this.formatNumber(
                                                item.jumlah
                                            )}

                                        </strong>

                                    </div>


                                    <div class="barang-riwayat-stok-grid">

                                        <div class="barang-riwayat-stok-item">

                                            <span>
                                                Stok Sebelum
                                            </span>

                                            <strong>
                                                ${this.formatNumber(
                                                    item.stokSebelum
                                                )}
                                            </strong>

                                        </div>


                                        <div class="barang-riwayat-stok-arrow">
                                            →
                                        </div>


                                        <div class="barang-riwayat-stok-item">

                                            <span>
                                                Stok Sesudah
                                            </span>

                                            <strong>
                                                ${this.formatNumber(
                                                    item.stokSesudah
                                                )}
                                            </strong>

                                        </div>

                                    </div>


                                    <div class="barang-riwayat-detail">

                                        <div class="barang-riwayat-detail-item">

                                            <span>
                                                Alasan
                                            </span>

                                            <p>
                                                ${this.escapeHTML(
                                                    item.alasan || "-"
                                                )}
                                            </p>

                                        </div>


                                        <div class="barang-riwayat-detail-item">

                                            <span>
                                                Catatan
                                            </span>

                                            <p>
                                                ${this.escapeHTML(
                                                    item.catatan || "-"
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            `;

                        }
                    )
                    .join("");

        }

        catch (error) {

            console.error(
                "LOAD RIWAYAT STOK ERROR:",
                error
            );


            container.innerHTML = `

                <div class="barang-riwayat-empty barang-riwayat-error">

                    <strong>
                        Gagal Membaca Riwayat Stok
                    </strong>

                    <p>
                        Terjadi kesalahan saat mengambil data riwayat.
                    </p>

                </div>

            `;

        }

    },


    /*======================================
    FORMAT TANGGAL
    ======================================*/

    formatDate(value) {

        if (!value) {

            return "-";

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

            return "-";

        }


        return date.toLocaleString(
            "id-ID",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    },


    /*======================================
    FORMAT ANGKA
    ======================================*/

    formatNumber(value) {

        return Number(
            value || 0
        )
        .toLocaleString(
            "id-ID"
        );

    },


    /*======================================
    ESCAPE HTML
    ======================================*/

    escapeHTML(value) {

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