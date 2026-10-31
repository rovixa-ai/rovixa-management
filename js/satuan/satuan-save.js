
/*======================================
TREEHOUSE POS
SATUAN SAVE
======================================*/

const SatuanSave = {

    /*======================================
    SAVE
    ======================================*/

    async save(existingData = null) {

        const kode =
            document
                .getElementById("satuan-barang")
                .value;

        const satuan =
            document
                .getElementById("satuan-nama")
                .value
                .trim();

        const barcodeSatuan =
            document
                .getElementById("satuan-barcode")
                .value
                .trim();

        const konversiInput =
            document.getElementById(
                "satuan-konversi"
            ).value;

        const isi =
            SatuanForm.parseKonversi(
                konversiInput
            );

        const hargaJual =
            Number(
                document
                    .getElementById("satuan-harga-jual")
                    .value
            ) || 0;

        const discount =
            Number(
                document
                    .getElementById("satuan-discount")
                    .value
            ) || 0;

        /*==================================
        VALIDASI BARANG
        ==================================*/

        if (!kode) {

            Dialog.alert(
                "Barang wajib dipilih."
            );

            return;
        }

        /*==================================
        VALIDASI SATUAN
        ==================================*/

        if (!satuan) {

            Dialog.alert(
                "Satuan wajib diisi."
            );

            return;
        }

        /*==================================
        VALIDASI FORMAT KONVERSI
        ==================================*/

        if (!Number.isFinite(isi)) {

            Dialog.alert(
                "Format konversi tidak valid. Gunakan contoh 0,5, 1/2, atau 2 1/2."
            );

            return;
        }

        /*==================================
        DATA LAMA UNTUK EDIT
        ==================================*/

        const oldKode =
            existingData?.kode ||
            kode;

        const oldSatuan =
            existingData?.satuan ||
            satuan;

        /*==================================
        ID SATUAN
        ==================================*/

        const id =
            existingData?.id ||
            (
                kode +
                "|" +
                satuan
            );

        /*==================================
        DATA SATUAN
        ==================================*/

        const data = {

            id,

            kode,

            satuan,

            isi,

            hargaJual,

            discount,

            barcodeSatuan,

            status:
                existingData?.status ||
                "Aktif",

            syncStatus:
                "pending",

            createdAt:
                existingData?.createdAt ||
                new Date().toISOString(),

            syncedAt:
                null

        };

        try {

            /*==================================
            EDIT DATA LAMA
            ==================================*/

            if (existingData) {

                await DB.put(
                    "satuan",
                    data
                );

                const queue = {

                    id:
                        "SYNC-SAT-" +
                        Date.now() +
                        "-" +
                        Math.random()
                            .toString(36)
                            .substring(2, 8),

                    type:
                        "satuan",

                    action:
                        "update",

                    referenceId:
                        id,

                    oldKode:
                        oldKode,

                    oldSatuan:
                        oldSatuan,

                    status:
                        "pending",

                    retry:
                        0,

                    createdAt:
                        new Date().toISOString(),

                    lastError:
                        null

                };

                await DB.put(
                    "syncQueue",
                    queue
                );

                /*==================================
                KEMBALI KE PEMBELIAN
                ==================================*/

                if (
                    Satuan.formOptions.returnTo ===
                    "pembelian"
                ) {

                    Pembelian.pendingBarcode =
                        data.barcodeSatuan;

                    Pembelian.preserveItems =
                        true;

                    SatuanForm.close();

                    Router.go(
                        "pembelian"
                    );

                    setTimeout(
                        () => {

                            Sync.process()
                                .catch(error => {

                                    console.error(
                                        "SYNC ERROR:",
                                        error
                                    );

                                });

                        },
                        100
                    );

                    return;
                }

                /*==================================
                KEMBALI KE MODAL DETAIL BARANG
                KHUSUS EDIT SATUAN
                ==================================*/

                if (
                    Satuan.formOptions.returnTo ===
                    "barang-detail"
                ) {

                    const barangInduk =
                        Satuan.formOptions.barangInduk;

                    if (!barangInduk) {

                        Dialog.alert(
                            "Data barang tidak ditemukan."
                        );

                        return;
                    }

                    SatuanForm.close();

                    await BarangDetail.open(
                        barangInduk
                    );

                    Dialog.alert(
                        "Satuan berhasil diperbarui."
                    );

                    setTimeout(
                        () => {

                            Sync.process()
                                .catch(error => {

                                    console.error(
                                        "SYNC ERROR:",
                                        error
                                    );

                                });

                        },
                        100
                    );

                    return;
                }

                /*==================================
                ALUR EDIT NORMAL
                ==================================*/

                SatuanForm.close();

                Dialog.alert(
                    "Satuan berhasil diperbarui."
                );

                Router.go(
                    "satuan"
                );

                setTimeout(
                    () => {

                        Sync.process();

                    },
                    100
                );

                return;
            }

            /*==================================
            TAMBAH SATUAN BARU
            ==================================*/

            const result =
                await Sync.addSatuan(
                    data
                );

            /*==================================
            SATUAN SUDAH ADA
            ==================================*/

            if (
                result &&
                result.duplicate
            ) {

                const existing =
                    result.data;

                const edit =
                    confirm(
                        "Satuan untuk barang ini sudah ada.\n\n" +
                        "Klik OK untuk Edit.\n" +
                        "Klik Cancel untuk Batal."
                    );

                if (!edit) {

                    return;
                }

                SatuanForm.form(
                    existing,
                    Satuan.formOptions
                );

                return;
            }

            /*==================================
            KEMBALI KE PEMBELIAN
            ==================================*/

            if (
                Satuan.formOptions.returnTo ===
                "pembelian"
            ) {

                Pembelian.pendingBarcode =
                    data.barcodeSatuan;

                Pembelian.preserveItems =
                    true;

                SatuanForm.close();

                Router.go(
                    "pembelian"
                );

                setTimeout(
                    () => {

                        Sync.process()
                            .catch(error => {

                                console.error(
                                    "SYNC ERROR:",
                                    error
                                );

                            });

                    },
                    100
                );

                return;
            }

            /*==================================
            ALUR NORMAL TAMBAH SATUAN
            TETAP SEPERTI SEMULA
            ==================================*/

            SatuanForm.close();

            Dialog.alert(
                "Barang dan satuan berhasil disimpan."
            );

            Router.go(
                "barang"
            );

            setTimeout(
                () => {

                    Sync.process();

                },
                100
            );

        } catch (error) {

            console.error(
                "SAVE SATUAN ERROR:",
                error
            );

            Dialog.alert(
                error.message ||
                "Gagal menyimpan satuan."
            );

        }

    }

};
