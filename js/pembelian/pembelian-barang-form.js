/*======================================
PEMBELIAN BARANG + SATUAN FORM
======================================*/

const PembelianBarangForm = {


    /*======================================
    OPEN FORM
    ======================================*/

    async open(
        options = {}
    ) {

        document
            .getElementById("page")
            .innerHTML = `

            <div class="barang-page">


                <div class="barang-header">

                    <div>

                        <h2>
                            Tambah Barang
                        </h2>

                        <p>
                            Tambah barang dan satuan dari pembelian
                        </p>

                    </div>

                </div>


                <div class="barang-form-card">


                    <!-- ==========================
                    DATA BARANG
                    =========================== -->

                    <div>

                        <h3>
                            Data Barang
                        </h3>

                    </div>


                    <div
                        class="barang-form-grid"
                    >


                        <div
                            class="barang-field"
                        >

                            <label>
                                Kode Barang
                            </label>

                            <input
                                id="pembelian-barang-kode"
                                placeholder="Memuat kode..."
                                readonly
                            >

                        </div>


                        <div
                            class="barang-field"
                        >

                            <label>
                                Nama Barang
                            </label>

                            <input
                                id="pembelian-barang-nama"
                                placeholder="Nama barang"
                            >

                        </div>


                        <div
                            class="barang-field"
                        >

                            <label>
                                Kategori
                            </label>

                            <input
                                id="pembelian-barang-kategori"
                                placeholder="Kategori"
                            >

                        </div>


                        <div
                            class="barang-field"
                        >

                            <label>
                                Satuan Dasar
                            </label>

                            <input
                                id="pembelian-barang-satuan-dasar"
                                placeholder="Contoh: PCS"
                            >

                        </div>


                        <div
                            class="barang-field"
                        >

                            <label>
                                Status
                            </label>

                            <select
                                id="pembelian-barang-status"
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


                    <!-- ==========================
                    DATA SATUAN
                    =========================== -->

                    <div
                        style="
                            margin-top: 24px;
                        "
                    >

                        <h3>
                            Satuan Pembelian
                        </h3>

                        <p>
                            Satuan yang digunakan saat pembelian
                        </p>

                    </div>


                    <div
                        class="barang-form-grid"
                    >


                        <div
                            class="barang-field"
                        >

                            <label>
                                Satuan
                            </label>

                            <input
                                id="pembelian-satuan-nama"
                                placeholder="Contoh: DUS"
                            >

                        </div>


                        <div
                            class="barang-field"
                        >

                            <label>
                                Barcode Satuan
                            </label>

                            <input
                                id="pembelian-satuan-barcode"
                                placeholder="Barcode satuan"
                                inputmode="numeric"
                            >

                        </div>


                        <div
                            class="barang-field"
                        >

                            <label>
                                Isi / Konversi
                            </label>

                            <input
                                id="pembelian-satuan-konversi"
                                type="number"
                                min="1"
                                value="1"
                            >

                        </div>


                        <div
                            class="barang-field"
                        >

                            <label>
                                Harga Jual
                            </label>

                            <input
                                id="pembelian-satuan-harga-jual"
                                type="number"
                                min="0"
                                value="0"
                            >

                        </div>


                    </div>


                    <!-- ==========================
                    ACTION
                    =========================== -->

                    <div
                        class="barang-form-actions"
                    >

                        <button
                            class="btn-secondary"
                            id="pembelian-barang-batal"
                        >

                            Batal

                        </button>


                        <button
                            class="btn-primary"
                            id="pembelian-barang-simpan"
                        >

                            Simpan

                        </button>

                    </div>


                </div>


            </div>

        `;


        /*======================================
        GENERATE KODE
        ======================================*/

        await this.generateKode();


        /*======================================
        BARCODE DARI PEMBELIAN
        ======================================*/

        if (
            options.barcode
        ) {

            const barcode =
                document.getElementById(
                    "pembelian-satuan-barcode"
                );


            if (barcode) {

                barcode.value =
                    options.barcode;

            }

        }


        /*======================================
        EVENT BATAL
        ======================================*/

        document
            .getElementById(
                "pembelian-barang-batal"
            )
            .addEventListener(
                "click",
                () => {

                    Router.go(
                        "pembelian"
                    );

                }
            );


        /*======================================
        EVENT SIMPAN
        ======================================*/

        document
            .getElementById(
                "pembelian-barang-simpan"
            )
            .addEventListener(
                "click",
                () => {

                    this.save(
                        options
                    );

                }
            );


        /*======================================
        FOCUS NAMA
        ======================================*/

        document
            .getElementById(
                "pembelian-barang-nama"
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
                    "pembelian-barang-kode"
                );


            if (input) {

                input.value =
                    kodeBaru;

            }


            

        }

        catch (error) {

            console.error(
                "GENERATE KODE PEMBELIAN ERROR:",
                error
            );


            const input =
                document.getElementById(
                    "pembelian-barang-kode"
                );


            if (input) {

                input.value =
                    "BRG0001";

            }

        }

    },


    /*======================================
    SAVE BARANG + SATUAN
    ======================================*/

    async save(
        options = {}
    ) {

        const button =
            document.getElementById(
                "pembelian-barang-simpan"
            );


        /*======================================
        DATA BARANG
        ======================================*/

        const kode =
            document
                .getElementById(
                    "pembelian-barang-kode"
                )
                .value
                .trim()
                .toUpperCase();


        const nama =
            document
                .getElementById(
                    "pembelian-barang-nama"
                )
                .value
                .trim();


        const kategori =
            document
                .getElementById(
                    "pembelian-barang-kategori"
                )
                .value
                .trim();


        const satuanDasar =
            document
                .getElementById(
                    "pembelian-barang-satuan-dasar"
                )
                .value
                .trim()
                .toUpperCase();


        const status =
            document
                .getElementById(
                    "pembelian-barang-status"
                )
                .value;


        /*======================================
        DATA SATUAN PEMBELIAN
        ======================================*/

        const satuanPembelian =
            document
                .getElementById(
                    "pembelian-satuan-nama"
                )
                .value
                .trim()
                .toUpperCase();


        const barcodeSatuan =
            document
                .getElementById(
                    "pembelian-satuan-barcode"
                )
                .value
                .trim();


        const konversi =
            Number(
                document
                    .getElementById(
                        "pembelian-satuan-konversi"
                    )
                    .value
            );


        const hargaJual =
            Number(
                document
                    .getElementById(
                        "pembelian-satuan-harga-jual"
                    )
                    .value
            );


        /*======================================
        VALIDASI BARANG
        ======================================*/

        if (!kode) {

            Dialog.alert(
                "Kode barang wajib diisi."
            );

            return;

        }


        if (!nama) {

            Dialog.alert(
                "Nama barang wajib diisi."
            );

            document
                .getElementById(
                    "pembelian-barang-nama"
                )
                .focus();

            return;

        }


        if (!satuanDasar) {

            Dialog.alert(
                "Satuan dasar wajib diisi."
            );

            document
                .getElementById(
                    "pembelian-barang-satuan-dasar"
                )
                .focus();

            return;

        }


        /*======================================
        VALIDASI SATUAN
        ======================================*/

        if (!satuanPembelian) {

            Dialog.alert(
                "Satuan pembelian wajib diisi."
            );

            document
                .getElementById(
                    "pembelian-satuan-nama"
                )
                .focus();

            return;

        }


        if (
            !Number.isFinite(
                konversi
            ) ||
            konversi < 1
        ) {

            Dialog.alert(
                "Isi / konversi harus minimal 1."
            );

            document
                .getElementById(
                    "pembelian-satuan-konversi"
                )
                .focus();

            return;

        }


        if (
            !Number.isFinite(
                hargaJual
            ) ||
            hargaJual < 0
        ) {

           Dialog.alert(
                "Harga jual tidak valid."
            );

            document
                .getElementById(
                    "pembelian-satuan-harga-jual"
                )
                .focus();

            return;

        }


        /*======================================
        CEK SATUAN SAMA
        ======================================*/

        const satuanSama =
            satuanDasar ===
            satuanPembelian;


        /*======================================
        DATA BARANG
        ======================================*/

        const dataBarang = {

            kode:
                kode,

            barcode:
                barcodeSatuan,

            nama:
                nama,

            kategori:
                kategori,

            satuanDasar:
                satuanDasar,

            stok:
                0,

            status:
                status

        };


        /*======================================
        DATA SATUAN DASAR
        ======================================*/

        const dataSatuanDasar = {

            id:
                kode +
                "|" +
                satuanDasar,

            kode:
                kode,

            satuan:
                satuanDasar,

            isi:
                1,

            hargaJual:
                satuanSama
                    ? hargaJual
                    : 0,

            barcodeSatuan:
                satuanSama
                    ? barcodeSatuan
                    : "",

            status:
                status,

            syncStatus:
                "pending",

            createdAt:
                new Date()
                    .toISOString(),

            syncedAt:
                null

        };


        /*======================================
        DATA SATUAN PEMBELIAN
        ======================================*/

        const dataSatuanPembelian = {

            id:
                kode +
                "|" +
                satuanPembelian,

            kode:
                kode,

            satuan:
                satuanPembelian,

            isi:
                konversi,

            hargaJual:
                hargaJual,

            barcodeSatuan:
                barcodeSatuan,

            status:
                status,

            syncStatus:
                "pending",

            createdAt:
                new Date()
                    .toISOString(),

            syncedAt:
                null

        };


        /*======================================
        LOCK BUTTON
        ======================================*/

        if (button) {

            button.disabled =
                true;

            button.textContent =
                "Menyimpan...";

        }


        try {

            /*==================================
            SIMPAN BARANG
            ==================================*/

            


            await Sync.addBarang(
                dataBarang
            );


            /*==================================
            CEK BARANG
            ==================================*/

            const barangBaru =
                await DB.get(
                    "barang",
                    kode
                );


            if (!barangBaru) {

                throw new Error(
                    "Barang berhasil disimpan tetapi tidak ditemukan di penyimpanan lokal."
                );

            }


            /*==================================
            SIMPAN SATUAN DASAR
            ==================================*/

            

            await Sync.addSatuan(
                dataSatuanDasar
            );


            /*==================================
            SIMPAN SATUAN PEMBELIAN
            ==================================*/

            if (!satuanSama) {

                


                await Sync.addSatuan(
                    dataSatuanPembelian
                );

            }


            /*==================================
            SYNC BACKGROUND
            ==================================*/

            Sync.process()
                .catch(
                    error => {

                        console.error(
                            "SYNC PEMBELIAN BARANG ERROR:",
                            error
                        );

                    }
                );


            /*==================================
            KEMBALI KE PEMBELIAN
            ==================================*/

            if (
                options.returnTo ===
                "pembelian"
            ) {

                Pembelian.pendingBarcode =
                    barcodeSatuan;


                Pembelian.preserveItems =
                    true;


                Router.go(
                    "pembelian"
                );


                return;

            }


            /*==================================
            FALLBACK
            ==================================*/

            Dialog.alert(
                "Barang dan satuan berhasil disimpan."
            );


            Router.go(
                "barang"
            );

        }

        catch (error) {

            console.error(
                "SAVE PEMBELIAN BARANG ERROR:",
                error
            );


            Dialog.alert(
                error.message ||
                "Gagal menyimpan barang dan satuan."
            );


            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    "Simpan";

            }

        }

    }

};