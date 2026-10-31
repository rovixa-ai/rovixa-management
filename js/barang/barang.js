const Barang = {

    data: [],


    /*======================================
    RENDER HALAMAN
    ======================================*/

    render() {

        return BarangRender.render();

    },


    /*======================================
    INIT
    ======================================*/

    async init() {

        const button =
            document.getElementById(
                "barang-tambah"
            );


        if (button) {

            button.addEventListener(
                "click",
                () => {

                    BarangForm.open();

                }
            );

        }


        const search =
            document.getElementById(
                "barang-search"
            );


        if (search) {

            search.addEventListener(
                "input",
                event => {

                    this.search(
                        event.target.value
                    );

                }
            );

        }


        await this.load();

    },


    /*======================================
    LOAD DARI INDEXEDDB
    ======================================*/

    async load() {

        try {

            const data =
                await DB.getAll(
                    "barang"
                );


            


            this.data =
                Array.isArray(data)
                    ? data
                    : [];


            /* ======================================
               URUTKAN STOK
               TERKECIL → TERBESAR
               ====================================== */

            this.data.sort(
                (a, b) =>
                    Number(a.stok || 0) -
                    Number(b.stok || 0)
            );


            this.renderList(
                this.data
            );

        }

        catch (error) {

            console.error(
                "LOAD BARANG ERROR:",
                error
            );


            const tbody =
                document.getElementById(
                    "barang-list"
                );


            if (tbody) {

                tbody.innerHTML = `

                    <tr>

                        <td
                            colspan="7"
                            class="barang-empty"
                        >

                            Gagal membaca data barang.

                        </td>

                    </tr>

                `;

            }

        }

    },


    /*======================================
    SEARCH
    ======================================*/

    search(keyword) {

        const value =
            String(
                keyword || ""
            )
            .trim()
            .toLowerCase();


        if (!value) {

            this.renderList(
                this.data
            );

            return;

        }


        const result =
            this.data.filter(
                item => {

                    return (

                        String(
                            item.kode || ""
                        )
                        .toLowerCase()
                        .includes(value)

                        ||

                        String(
                            item.barcode || ""
                        )
                        .toLowerCase()
                        .includes(value)

                        ||

                        String(
                            item.nama || ""
                        )
                        .toLowerCase()
                        .includes(value)

                        ||

                        String(
                            item.kategori || ""
                        )
                        .toLowerCase()
                        .includes(value)

                    );

                }
            );


        this.renderList(
            result
        );

    },


    /*======================================
    RENDER LIST
    ======================================*/

    renderList(data) {

        const tbody =
            document.getElementById(
                "barang-list"
            );


        if (!tbody) {

            return;

        }


        if (!data.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="barang-empty"
                    >

                        Belum ada data barang.

                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML =
            data
                .map(
                    item => `

                        <tr
                            class="barang-row"
                            data-kode="${this.escapeHTML(
                                item.kode
                            )}"
                        >

                            <td>
                                ${this.escapeHTML(
                                    item.kode
                                )}
                            </td>

                            <td>
                                ${this.escapeHTML(
                                    item.barcode
                                )}
                            </td>

                            <td>
                                ${this.escapeHTML(
                                    item.nama
                                )}
                            </td>

                            <td>
                                ${this.escapeHTML(
                                    item.kategori
                                )}
                            </td>

                            <td>
                                ${this.escapeHTML(
                                    item.satuanDasar
                                )}
                            </td>

                            <td>
                                ${this.formatNumber(
                                    item.stok
                                )}
                            </td>

                            <td>

                                <span
                                    class="barang-status ${
                                        String(
                                            item.status
                                        ) === "Aktif"
                                            ? "active"
                                            : "inactive"
                                    }"
                                >

                                    ${this.escapeHTML(
                                        item.status
                                    )}

                                </span>

                            </td>

                        </tr>

                    `
                )
                .join("");


        /*
        ======================================
        CLICK BARANG
        ======================================
        */

        tbody
            .querySelectorAll(
                ".barang-row"
            )
            .forEach(
                row => {

                    row.addEventListener(
                        "click",
                        () => {

                            const kode =
                                row.dataset.kode;


                            const barang =
                                data.find(
                                    item =>
                                        String(
                                            item.kode
                                        ) ===
                                        String(
                                            kode
                                        )
                                );


                            if (!barang) {

                                return;

                            }


                            this.menu(
                                barang
                            );

                        }
                    );

                }
            );

    },


    /*======================================
    TAMBAH SATUAN
    ======================================*/

    tambahSatuan(
        barang
    ) {

        Satuan.form(
            barang
        );

    },


    /*======================================
    RIWAYAT STOK
    ======================================*/

    riwayatStok(
        barang
    ) {

        BarangRiwayat.open(
            barang
        );

    },


    /*======================================
    EDIT BARANG
    ======================================*/

    edit(
        barang
    ) {

        


       Dialog.alert(
            "Edit barang akan dibuat pada tahap berikutnya."
        );

    },


    /*======================================
    FORMAT ANGKA
    ======================================*/

    formatNumber(value) {

        return Number(
            value || 0
        ).toLocaleString(
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