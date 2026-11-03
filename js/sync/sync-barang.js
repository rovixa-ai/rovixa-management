
/*======================================
ROVIXA POS
SYNC BARANG DAN SATUAN
======================================*/

Object.assign(Sync, {


    /*======================================
    ADD BARANG
    ======================================*/

    async addBarang(
        data
    ) {

        if (!data.kode) {

            throw new Error(
                "Kode barang wajib diisi."
            );

        }


        const existing =
            await DB.get(
                "barang",
                data.kode
            );


        if (existing) {

            throw new Error(
                "Kode barang sudah ada."
            );

        }


        const barang = {

            kode:
                data.kode,

            barcode:
                data.barcode || "",

            nama:
                data.nama,

            kategori:
                data.kategori || "",

            satuanDasar:
                data.satuanDasar,

            stok:
                Number(
                    data.stok || 0
                ),

            status:
                data.status || "Aktif"

        };


        await DB.put(
            "barang",
            barang
        );


        const queue = {

            id:
                "SYNC-BRG-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8),

            type:
                "barang",

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


        this.autoProcess();


        return barang;

    },


    /*======================================
    UPDATE BARANG
    ======================================*/

    async updateBarang(
        data
    ) {

        if (!data) {

            throw new Error(
                "Data barang kosong."
            );

        }


        if (!data.kode) {

            throw new Error(
                "Kode barang wajib ada."
            );

        }


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


        const updatedBarang = {

            ...barang,

            barcode:
                data.barcode || "",

            nama:
                data.nama || "",

            kategori:
                data.kategori || "",

            satuanDasar:
                data.satuanDasar || "",

            status:
                data.status || "Aktif",

            stok:
                barang.stok || 0,

            syncStatus:
                "pending",

            syncedAt:
                null

        };


        if (!updatedBarang.nama) {

            throw new Error(
                "Nama barang wajib diisi."
            );

        }


        if (!updatedBarang.satuanDasar) {

            throw new Error(
                "Satuan dasar wajib diisi."
            );

        }


        await DB.put(
            "barang",
            updatedBarang
        );


        const queue = {

            id:
                "SYNC-BRG-EDIT-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8),

            type:
                "barangUpdate",

            referenceId:
                updatedBarang.kode,

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


        return updatedBarang;

    },


    /*======================================
    ADD SATUAN
    ======================================*/

    async addSatuan(
        data
    ) {

        if (!data) {

            throw new Error(
                "Data satuan kosong."
            );

        }


        if (!data.kode) {

            throw new Error(
                "Kode barang wajib diisi."
            );

        }


        if (!data.satuan) {

            throw new Error(
                "Satuan wajib diisi."
            );

        }


        const id =
            data.kode +
            "|" +
            data.satuan;


        const existing =
            await DB.get(
                "satuan",
                id
            );


        if (existing) {

            return {

                duplicate: true,

                data: existing

            };

        }


        const satuan = {

            id,

            kode:
                data.kode,

            satuan:
                data.satuan,

            isi:
                Number(
                    data.isi
                ) || 1,

            hargaJual:
                Number(
                    data.hargaJual
                ) || 0,

            discount:
                Number(
                    data.discount
                ) || 0,

            barcodeSatuan:
                data.barcodeSatuan ||
                "",

            status:
                data.status ||
                "Aktif",

            syncStatus:
                "pending",

            createdAt:
                new Date()
                    .toISOString(),

            syncedAt:
                null

        };


        await DB.put(
            "satuan",
            satuan
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

            referenceId:
                id,

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


        this.autoProcess();


        return satuan;

    },


    /*======================================
    SYNC BARANG
    ======================================*/

    async syncBarang(
        queue
    ) {

        const barang =
            await DB.get(
                "barang",
                queue.referenceId
            );


        if (!barang) {

            throw new Error(
                "Data barang lokal tidak ditemukan."
            );

        }


        const result =
            await API.saveBarang(
                barang
            );


        if (
            !result ||
            !result.success
        ) {

            const message =
                result?.message ||
                "Server menolak barang.";


            if (
                message ===
                "Kode barang sudah terdaftar."
            ) {

                console.warn(
                    "BARANG SUDAH ADA DI SERVER:",
                    barang.kode
                );

            }

            else {

                throw new Error(
                    message
                );

            }

        }


        barang.syncStatus =
            "synced";


        barang.syncedAt =
            new Date()
                .toISOString();


        await DB.put(
            "barang",
            barang
        );


        return result;

    },


    /*======================================
    SYNC UPDATE BARANG
    ======================================*/

    async syncUpdateBarang(
        queue
    ) {

        const barang =
            await DB.get(
                "barang",
                queue.referenceId
            );


        if (!barang) {

            throw new Error(
                "Data barang lokal tidak ditemukan."
            );

        }


        const result =
            await API.updateBarang(
                barang
            );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result?.message ||
                "Server menolak perubahan barang."
            );

        }


        barang.syncStatus =
            "synced";


        barang.syncedAt =
            new Date()
                .toISOString();


        await DB.put(
            "barang",
            barang
        );


        return result;

    },


    /*======================================
    SYNC SATUAN
    ======================================*/

    async syncSatuan(
        queue
    ) {

        const satuan =
            await DB.get(
                "satuan",
                queue.referenceId
            );


        if (!satuan) {

            throw new Error(
                "Data satuan lokal tidak ditemukan."
            );

        }


        let result;


        if (
            queue.action ===
            "update"
        ) {

            result =
                await API.updateSatuan({

                    ...satuan,

                    oldKode:
                        queue.oldKode,

                    oldSatuan:
                        queue.oldSatuan

                });

        }


        else {

            result =
                await API.saveSatuan(
                    satuan
                );

        }


        if (
            !result ||
            !result.success
        ) {

            const message =
                String(
                    result?.message ||
                    "Server menolak satuan."
                );


            if (
                queue.action !==
                    "update"
                &&
                message
                    .toLowerCase()
                    .includes(
                        "satuan untuk barang ini sudah terdaftar"
                    )
            ) {

                const hapus =
                    confirm(
                        "Satuan untuk barang ini sudah terdaftar.\n\n" +
                        "Barang : " +
                        (satuan.kode || "-") +
                        "\n" +
                        "Satuan : " +
                        (satuan.satuan || "-") +
                        "\n\n" +
                        "Apakah data sync yang gagal ingin dihapus dari antrian?"
                    );


                if (hapus) {

                    await DB.delete(
                        "syncQueue",
                        queue.id
                    );


                    satuan.syncStatus =
                        "synced";


                    satuan.syncedAt =
                        new Date()
                            .toISOString();


                    await DB.put(
                        "satuan",
                        satuan
                    );


                    return {

                        success: true,

                        duplicate: true,

                        removed: true,

                        message:
                            "Data sync satuan duplikat telah dihapus."

                    };

                }


                throw new Error(
                    message
                );

            }


            throw new Error(
                message
            );

        }


        satuan.syncStatus =
            "synced";


        satuan.syncedAt =
            new Date()
                .toISOString();


        await DB.put(
            "satuan",
            satuan
        );


        return result;

    }

});
