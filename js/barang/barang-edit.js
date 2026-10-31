const BarangEdit = {

/*======================================
OPEN FORM EDIT
======================================*/

async open(
    barang
) {

    if (!barang) {

        Dialog.alert(
            "Data barang tidak ditemukan."
        );

        return;

    }


    


    document
        .getElementById("page")
        .innerHTML = `

            <div class="barang-page barang-edit-page">


                <div class="barang-header">

                    <div>

                        <h2>
                            Edit Barang
                        </h2>

                        <p>
                            Ubah data master barang
                        </p>

                    </div>

                </div>


                <div class="barang-form-card barang-edit-card">


                    <div
                        class="barang-form-grid barang-edit-grid"
                    >


                        <!-- KODE -->

                        <div
                            class="barang-field"
                        >

                            <label>
                                Kode Barang
                            </label>

                            <input
                                id="edit-barang-kode"
                                value="${this.escapeHTML(
                                    barang.kode
                                )}"
                                disabled
                            >

                        </div>


                        <!-- BARCODE -->

                        <div
                            class="barang-field"
                        >

                            <label>
                                Barcode
                            </label>

                            <input
                                id="edit-barang-barcode"
                                value="${this.escapeHTML(
                                    barang.barcode
                                )}"
                            >

                        </div>


                        <!-- NAMA -->

                        <div
                            class="barang-field"
                        >

                            <label>
                                Nama Barang
                            </label>

                            <input
                                id="edit-barang-nama"
                                value="${this.escapeHTML(
                                    barang.nama
                                )}"
                            >

                        </div>


                        <!-- KATEGORI -->

                        <div
                            class="barang-field"
                        >

                            <label>
                                Kategori
                            </label>

                            <input
                                id="edit-barang-kategori"
                                value="${this.escapeHTML(
                                    barang.kategori
                                )}"
                            >

                        </div>


                        <!-- SATUAN DASAR -->

                        <div
                            class="barang-field"
                        >

                            <label>
                                Satuan Dasar
                            </label>

                            <input
                                id="edit-barang-satuan"
                                value="${this.escapeHTML(
                                    barang.satuanDasar
                                )}"
                            >

                        </div>


                        <!-- STOK -->

                        <div
                            class="barang-field"
                        >

                            <label>
                                Stok
                            </label>

                            <input
                                id="edit-barang-stok"
                                type="number"
                                value="${Number(
                                    barang.stok || 0
                                )}"
                                disabled
                            >

                        </div>


                        <!-- STATUS -->

                        <div
                            class="barang-field"
                        >

                            <label>
                                Status
                            </label>

                            <select
                                id="edit-barang-status"
                            >

                                <option
                                    value="Aktif"
                                    ${
                                        String(
                                            barang.status
                                        ) === "Aktif"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Aktif
                                </option>

                                <option
                                    value="Nonaktif"
                                    ${
                                        String(
                                            barang.status
                                        ) === "Nonaktif"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Nonaktif
                                </option>

                            </select>

                        </div>


                    </div>


                    <div
                        class="barang-form-actions barang-edit-actions"
                    >

                        <button
                            class="btn-secondary"
                            id="edit-barang-batal"
                        >

                            Batal

                        </button>


                        <button
                            class="btn-primary"
                            id="edit-barang-simpan"
                        >

                            Simpan Perubahan

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
            "edit-barang-batal"
        )
        .addEventListener(
            "click",
            () => {

                Barang.menu(
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
            "edit-barang-simpan"
        )
        .addEventListener(
            "click",
            () => {

                this.save(
                    barang
                );

            }
        );

},


/*======================================
SAVE
======================================*/

async save(
    barangLama
) {

    const data = {

        kode:
            barangLama.kode,

        barcode:
            document
                .getElementById(
                    "edit-barang-barcode"
                )
                .value
                .trim(),

        nama:
            document
                .getElementById(
                    "edit-barang-nama"
                )
                .value
                .trim(),

        kategori:
            document
                .getElementById(
                    "edit-barang-kategori"
                )
                .value
                .trim(),

        satuanDasar:
            document
                .getElementById(
                    "edit-barang-satuan"
                )
                .value
                .trim(),

        status:
            document
                .getElementById(
                    "edit-barang-status"
                )
                .value

    };


    /*
    ======================================
    VALIDASI
    ======================================
    */

    if (!data.nama) {

        Dialog.alert(
            "Nama barang wajib diisi."
        );

        return;

    }


    if (!data.satuanDasar) {

        Dialog.alert(
            "Satuan dasar wajib diisi."
        );

        return;

    }


    try {

        


        /*
        ==================================
        AMBIL DATA BARANG TERBARU
        ==================================
        */

        const barang =
            await DB.get(
                "barang",
                data.kode
            );


        if (!barang) {

            throw new Error(
                "Data barang lokal tidak ditemukan."
            );

        }


        /*
        ==================================
        UPDATE DATA
        ==================================
        */

        barang.barcode =
            data.barcode;

        barang.nama =
            data.nama;

        barang.kategori =
            data.kategori;

        barang.satuanDasar =
            data.satuanDasar;

        barang.status =
            data.status;


        /*
        ==================================
        STOK TIDAK DIUBAH
        ==================================
        */

        // barang.stok tetap


        /*
        ==================================
        STATUS SYNC
        ==================================
        */

        barang.syncStatus =
            "pending";

        barang.syncedAt =
            null;


        /*
        ==================================
        SIMPAN BARANG LOKAL
        ==================================
        */

        await DB.put(
            "barang",
            barang
        );


        


        /*
        ==================================
        BUAT SYNC QUEUE
        ==================================
        */

        const queue = {

            id:
                "SYNC-EDIT-BRG-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8),

            type:
                "barangUpdate",

            referenceId:
                barang.kode,

            status:
                "pending",

            retry:
                0,

            createdAt:
                new Date()
                    .toISOString(),

            lastError:
                null

        };

        await DB.put(
            "syncQueue",
            queue
        );


        (
            "SYNC QUEUE EDIT BARANG:",
            queue
        );


        /*
        ==================================
        COBA SYNC SEKARANG
        ==================================
        */

        await Sync.process();


        /*
        ==================================
        CEK HASIL SYNC
        ==================================
        */

        const updatedBarang =
            await DB.get(
                "barang",
                barang.kode
            );


        if (
            updatedBarang &&
            updatedBarang.syncStatus ===
            "synced"
        ) {

            Dialog.alert(
                "Data barang berhasil diperbarui dan disinkronkan."
            );

        }

        else {

           Dialog.alert(
                "Data barang berhasil diperbarui secara lokal. Akan disinkronkan otomatis saat koneksi tersedia."
            );

        }


        Router.go(
            "barang"
        );

    }

    catch (error) {

        console.error(
            "EDIT BARANG ERROR:",
            error
        );


        Dialog.alert(
            error.message ||
            "Gagal memperbarui barang."
        );

    }

},


/*======================================
ESCAPE HTML
======================================*/

escapeHTML(
    value
) {

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