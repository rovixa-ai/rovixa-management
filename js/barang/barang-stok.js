/*======================================
    BARANG STOK
======================================*/

Object.assign(
    Barang,
    {


        /*======================================
        PENYESUAIAN STOK
        ======================================*/

        penyesuaianStok(
            barang
        ) {

            const page =
                document.getElementById(
                    "page"
                );


            if (!page) {

                return;

            }


            page.innerHTML = `

                <div class="barang-page barang-stok-adjustment-page">


                    <div class="barang-header">

                        <div>

                            <h2>
                                Penyesuaian Stok
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

                    </div>


                    <div
                        class="barang-form-card barang-stok-adjustment-card"
                    >


                        <div
                            class="barang-form-grid barang-stok-adjustment-grid"
                        >


                            <div
                                class="barang-field"
                            >

                                <label>
                                    Kode Barang
                                </label>

                                <input
                                    id="stok-kode"
                                    value="${this.escapeHTML(
                                        barang.kode
                                    )}"
                                    disabled
                                >

                            </div>


                            <div
                                class="barang-field"
                            >

                                <label>
                                    Nama Barang
                                </label>

                                <input
                                    id="stok-nama"
                                    value="${this.escapeHTML(
                                        barang.nama
                                    )}"
                                    disabled
                                >

                            </div>


                            <div
                                class="barang-field"
                            >

                                <label>
                                    Stok Saat Ini
                                </label>

                                <input
                                    id="stok-saat-ini"
                                    value="${this.formatNumber(
                                        barang.stok
                                    )}"
                                    disabled
                                >

                            </div>


                            <div
                                class="barang-field"
                            >

                                <label>
                                    Jenis Penyesuaian
                                </label>

                                <select
                                    id="stok-jenis"
                                >

                                    <option value="">
                                        Pilih jenis
                                    </option>

                                    <option value="tambah">
                                        Tambah Stok
                                    </option>

                                    <option value="kurangi">
                                        Kurangi Stok
                                    </option>

                                </select>

                            </div>


                            <div
                                class="barang-field"
                            >

                                <label>
                                    Jumlah
                                </label>

                                <input
                                    id="stok-jumlah"
                                    type="number"
                                    min="1"
                                    step="1"
                                    placeholder="Jumlah stok"
                                >

                            </div>


                            <div
                                class="barang-field"
                            >

                                <label>
                                    Alasan
                                </label>

                                <select
                                    id="stok-alasan"
                                >

                                    <option value="">
                                        Pilih alasan
                                    </option>

                                    <option value="Stok Opname">
                                        Stok Opname
                                    </option>

                                    <option value="Barang Rusak">
                                        Barang Rusak
                                    </option>

                                    <option value="Barang Hilang">
                                        Barang Hilang
                                    </option>

                                    <option value="Koreksi Stok">
                                        Koreksi Stok
                                    </option>

                                    <option value="Lainnya">
                                        Lainnya
                                    </option>

                                </select>

                            </div>


                            <div
                                class="barang-field barang-stok-adjustment-full"
                            >

                                <label>
                                    Catatan
                                </label>

                                <textarea
                                    id="stok-catatan"
                                    rows="4"
                                    placeholder="Catatan tambahan..."
                                ></textarea>

                            </div>


                        </div>


                        <div
                            class="barang-form-actions barang-stok-adjustment-actions"
                        >


                            <button
                                class="btn-secondary"
                                id="stok-batal"
                            >

                                Batal

                            </button>


                            <button
                                class="btn-primary"
                                id="stok-simpan"
                            >

                                Simpan Penyesuaian

                            </button>


                        </div>


                    </div>


                </div>

            `;


            /*
            ======================================
            BATAL
            ======================================
            */

            document
                .getElementById(
                    "stok-batal"
                )
                .addEventListener(
                    "click",
                    () => {

                        this.menu(
                            barang
                        );

                    }
                );


            /*
            ======================================
            SIMPAN
            ======================================
            */

            document
                .getElementById(
                    "stok-simpan"
                )
                .addEventListener(
                    "click",
                    () => {

                        this.savePenyesuaianStok(
                            barang
                        );

                    }
                );

        },


        /*======================================
        SAVE PENYESUAIAN STOK
        ======================================*/

        async savePenyesuaianStok(
            barang
        ) {

            const jenis =
                document
                    .getElementById(
                        "stok-jenis"
                    )
                    .value;


            const jumlah =
                Number(
                    document
                        .getElementById(
                            "stok-jumlah"
                        )
                        .value
                );


            const alasan =
                document
                    .getElementById(
                        "stok-alasan"
                    )
                    .value;


            const catatan =
                document
                    .getElementById(
                        "stok-catatan"
                    )
                    .value
                    .trim();


            /*
            ======================================
            VALIDASI
            ======================================
            */

            if (!jenis) {

                Dialog.alert(
                    "Jenis penyesuaian wajib dipilih."
                );

                return;

            }


            if (
                !jumlah ||
                jumlah < 1
            ) {

                Dialog.alert(
                    "Jumlah harus lebih dari 0."
                );

                return;

            }


            if (!Number.isInteger(jumlah)) {

                Dialog.alert(
                    "Jumlah harus berupa angka bulat."
                );

                return;

            }


            if (!alasan) {

               Dialog.alert(
                    "Alasan wajib dipilih."
                );

                return;

            }


            const stokSebelum =
                Number(
                    barang.stok || 0
                );


            let stokSesudah;


            if (
                jenis ===
                "tambah"
            ) {

                stokSesudah =
                    stokSebelum +
                    jumlah;

            }

            else {

                stokSesudah =
                    stokSebelum -
                    jumlah;


                if (
                    stokSesudah < 0
                ) {

                    Dialog.alert(
                        "Stok tidak mencukupi."
                    );

                    return;

                }

            }


            const data = {

                kode:
                    barang.kode,

                jenis,

                jumlah,

                stokSebelum,

                stokSesudah,

                alasan,

                catatan

            };


            

            /*
            ======================================
            SIMPAN LOCAL
            ======================================
            */

            try {

                const result =
                    await Sync.addStokAdjustment(
                        data
                    );


                

                await Sync.process();


               Dialog.alert(
                    "Penyesuaian stok berhasil disimpan."
                );


                Router.go(
                    "barang"
                );

            }

            catch (error) {

                console.error(
                    "SAVE PENYESUAIAN STOK ERROR:",
                    error
                );


                Dialog.alert(
                    error.message ||
                    "Gagal menyimpan penyesuaian stok."
                );

            }

        }

    }
);