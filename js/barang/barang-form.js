/*======================================
BARANG FORM
======================================*/

const BarangForm = {


    /*======================================
    OPEN FORM
    ======================================*/

    async open(
        options = {}
    ) {

        document
            .getElementById("page")
            .innerHTML = `

                <div class="barang-form-page barang-tambah-page">


                    <div class="barang-form-header barang-tambah-header">

                        <div>

                            <h2>
                                Tambah Barang
                            </h2>

                            <p>
                                Data master barang
                            </p>

                        </div>

                    </div>


                    <div class="barang-form-card barang-tambah-card">


                        <div
                            class="barang-form-grid barang-tambah-grid"
                        >


                            <div
                                class="barang-field barang-tambah-field"
                            >

                                <label>
                                    Kode Barang
                                </label>

                                <input
                                    id="barang-kode"
                                    placeholder="Memuat kode..."
                                    readonly
                                >

                            </div>


                            <div
                                class="barang-field barang-tambah-field"
                            >

                                <label>
                                    Barcode
                                </label>

                                <input
                                    id="barang-barcode"
                                    placeholder="Barcode barang"
                                >

                            </div>


                            <div
                                class="barang-field barang-tambah-field"
                            >

                                <label>
                                    Nama Barang
                                </label>

                                <input
                                    id="barang-nama"
                                    placeholder="Nama barang"
                                >

                            </div>


                            <div
                                class="barang-field barang-tambah-field"
                            >

                                <label>
                                    Kategori
                                </label>

                                <input
                                    id="barang-kategori"
                                    placeholder="Kategori"
                                >

                            </div>


                            <div
                                class="barang-field barang-tambah-field"
                            >

                                <label>
                                    Satuan Dasar
                                </label>

                                <input
                                    id="barang-satuan"
                                    placeholder="Pcs"
                                >

                            </div>


                            <div
                                class="barang-field barang-tambah-field"
                            >

                                <label>
                                    Status
                                </label>

                                <select
                                    id="barang-status"
                                >

                                    <option value="Aktif">
                                        Aktif
                                    </option>

                                    <option value="Nonaktif">
                                        Nonaktif
                                    </option>

                                </select>

                            </div>


                        </div>


                        <div
                            class="barang-form-actions barang-tambah-actions"
                        >

                            <button
                                class="btn-secondary"
                                id="barang-batal"
                            >

                                Batal

                            </button>


                            <button
                                class="btn-primary"
                                id="barang-simpan"
                            >

                                Simpan

                            </button>

                        </div>


                    </div>


                </div>

            `;


        /*
        ======================================
        GENERATE KODE
        ======================================
        */

        await this.generateKode();


        /* ======================================
        BARCODE DARI PEMBELIAN
        ====================================== */

        if (options.barcode) {

            const barcodeInput =
                document.getElementById(
                    "barang-barcode"
                );


            if (barcodeInput) {

                barcodeInput.value =
                    options.barcode;

            }

        }


        /*
        ======================================
        EVENT BATAL
        ======================================
        */

        document
            .getElementById(
                "barang-batal"
            )
            .addEventListener(
                "click",
                () => {

                    Router.go(
                        "barang"
                    );

                }
            );


        /*
        ======================================
        EVENT SIMPAN
        ======================================
        */

        document
            .getElementById(
                "barang-simpan"
            )
            .addEventListener(
                "click",
                () => {

                    this.save();

                }
            );


        /*
        ======================================
        FOCUS NAMA
        ======================================
        */

        document
            .getElementById(
                "barang-nama"
            )
            .focus();

    },


    /*======================================
    GENERATE KODE BARANG
    ======================================*/

    async generateKode() {

        try {

            const data =
                await DB.getAll(
                    "barang"
                );


            const barang =
                Array.isArray(data)
                    ? data
                    : [];


            let nomorTerbesar =
                0;


            barang.forEach(
                item => {

                    const kode =
                        String(
                            item.kode || ""
                        )
                        .toUpperCase();


                    const match =
                        kode.match(
                            /^BRG(\d+)$/
                        );


                    if (match) {

                        const nomor =
                            Number(
                                match[1]
                            );


                        if (
                            nomor >
                            nomorTerbesar
                        ) {

                            nomorTerbesar =
                                nomor;

                        }

                    }

                }
            );


            const nextNumber =
                nomorTerbesar + 1;


            const kodeBaru =
                "BRG" +
                String(
                    nextNumber
                )
                .padStart(
                    4,
                    "0"
                );


            const input =
                document.getElementById(
                    "barang-kode"
                );


            if (input) {

                input.value =
                    kodeBaru;

            }


            

        }

        catch (error) {

            console.error(
                "GENERATE KODE ERROR:",
                error
            );


            const input =
                document.getElementById(
                    "barang-kode"
                );


            if (input) {

                input.value =
                    "BRG0001";

            }

        }

    },


    /*======================================
    SAVE BARANG
    ======================================*/

    async save() {

        const button =
            document.getElementById(
                "barang-simpan"
            );


        const data = {

            kode:
                document
                    .getElementById(
                        "barang-kode"
                    )
                    .value
                    .trim()
                    .toUpperCase(),

            barcode:
                document
                    .getElementById(
                        "barang-barcode"
                    )
                    .value
                    .trim(),

            nama:
                document
                    .getElementById(
                        "barang-nama"
                    )
                    .value
                    .trim(),

            kategori:
                document
                    .getElementById(
                        "barang-kategori"
                    )
                    .value
                    .trim(),

            satuanDasar:
                document
                    .getElementById(
                        "barang-satuan"
                    )
                    .value
                    .trim(),

            stok:
                0,

            status:
                document
                    .getElementById(
                        "barang-status"
                    )
                    .value

        };


        /*
        ======================================
        VALIDASI
        ======================================
        */

        if (!data.kode) {

            Dialog.alert(
                "Kode barang wajib diisi."
            );

            document
                .getElementById(
                    "barang-kode"
                )
                .focus();

            return;

        }


        if (!data.nama) {

            Dialog.alert(
                "Nama barang wajib diisi."
            );

            document
                .getElementById(
                    "barang-nama"
                )
                .focus();

            return;

        }


        if (!data.satuanDasar) {

            Dialog.alert(
                "Satuan dasar wajib diisi."
            );

            document
                .getElementById(
                    "barang-satuan"
                )
                .focus();

            return;

        }


        try {

            if (button) {

                button.disabled = true;

                button.textContent =
                    "Menyimpan...";

            }




            await Sync.addBarang(
                data
            );


            


            const barangBaru =
                await DB.get(
                    "barang",
                    data.kode
                );


            if (!barangBaru) {

                throw new Error(
                    "Barang berhasil disimpan tetapi tidak ditemukan di penyimpanan lokal."
                );

            }


            Sync.process()
                .catch(
                    error => {

                        console.error(
                            "SYNC BARANG ERROR:",
                            error
                        );

                    }
                );


            


            Satuan.form(
                barangBaru,
                {

                    returnTo:
                        "pembelian",

                    barcode:
                        data.barcode

                }
            );

        }

        catch (error) {

            console.error(
                "SAVE BARANG ERROR:",
                error
            );


            Dialog.alert(
                error.message ||
                "Gagal menyimpan barang."
            );


            if (button) {

                button.disabled = false;

                button.textContent =
                    "Simpan";

            }

        }

    },

};