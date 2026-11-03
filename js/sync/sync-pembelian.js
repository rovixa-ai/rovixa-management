
/*======================================
ROVIXA POS
SYNC PEMBELIAN
======================================*/

Object.assign(Sync, {


    /*======================================
    ADD PEMBELIAN
    SERVER RESOLVER DATABASE
    ======================================*/

    async addPembelian(
        data
    ) {

        const id =
            "LOCAL-PB-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8);


        let year;


        try {

            if (
                typeof PembelianDatabaseConfig ===
                "undefined"
            ) {

                throw new Error(
                    "PembelianDatabaseConfig tidak tersedia."
                );

            }


            year =
                Number(
                    PembelianDatabaseConfig
                        .getActiveYear()
                );

        }

        catch (error) {

            throw new Error(
                "Tahun database Pembelian belum dapat ditentukan: " +
                error.message
            );

        }


        if (!year) {

            throw new Error(
                "Tahun database Pembelian tidak ditemukan."
            );

        }


        /*======================================
        RESOLVE DATABASE KE SERVER
        ======================================*/

        let response;


        try {

            response =
                await API.get(
                    "resolvePembelianDatabase",
                    {
                        year:
                            year
                    }
                );

        }

        catch (error) {

            throw new Error(

                "Database Pembelian gagal ditentukan dari server: " +
                error.message

            );

        }


        /*======================================
        VALIDASI RESPONSE
        ======================================*/

        if (
            !response ||
            response.success !== true
        ) {

            throw new Error(

                response?.message ||

                "Database Pembelian gagal ditemukan atau dibuat."

            );

        }


        const resolvedYear =
            Number(
                response.year ||
                year
            );


        const pembelianId =
            String(
                response.pembelian ||
                ""
            ).trim();


        const detailPembelianId =
            String(
                response.detailPembelian ||
                ""
            ).trim();


        const pembayaranId =
            String(
                response.pembayaran ||
                ""
            ).trim();


        if (!resolvedYear) {

            throw new Error(
                "Tahun database Pembelian tidak diterima dari server."
            );

        }


        if (!pembelianId) {

            throw new Error(
                "Spreadsheet Pembelian tidak diterima dari server."
            );

        }


        if (!detailPembelianId) {

            throw new Error(
                "Spreadsheet Detail Pembelian tidak diterima dari server."
            );

        }


        if (!pembayaranId) {

            throw new Error(
                "Spreadsheet Pembayaran tidak diterima dari server."
            );

        }


        /*======================================
        DATABASE SNAPSHOT
        ======================================*/

        const databaseSnapshot = {

            year:
                resolvedYear,

            pembelianId:
                pembelianId,

            detailPembelianId:
                detailPembelianId,

            pembayaranId:
                pembayaranId

        };


        const pembelian = {

            id,

            ...data,


            database:
                databaseSnapshot,


            syncStatus:
                "pending",


            stockUpdated:
                false,

            stockUpdatedAt:
                null,


            createdAt:
                new Date()
                    .toISOString(),

            syncedAt:
                null

        };


        await DB.put(
            "pembelian",
            pembelian
        );


        const queue = {

            id:
                "SYNC-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8),

            type:
                "pembelian",

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


        return pembelian;

    },


    /*======================================
    SYNC PEMBELIAN
    ======================================*/

    async syncPembelian(
        queue
    ) {

        const pembelian =
            await DB.get(
                "pembelian",
                queue.referenceId
            );


        if (!pembelian) {

            throw new Error(
                "Data pembelian lokal tidak ditemukan."
            );

        }


        const result =
            await API.savePembelian(
                pembelian
            );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result?.message ||
                "Server menolak pembelian."
            );

        }


        if (
            Array.isArray(
                pembelian.items
            )
        ) {

            for (
                const item of pembelian.items
            ) {

                const barang =
                    await DB.get(
                        "barang",
                        item.barang
                    );


                if (!barang) {

                    throw new Error(
                        "Barang lokal tidak ditemukan: " +
                        item.barang
                    );

                }


                const satuanList =
                    await DB.getAll(
                        "satuan"
                    );


                const satuan =
                    satuanList.find(
                        value =>

                            String(
                                value.kode
                            ) ===
                            String(
                                item.barang
                            )

                            &&

                            String(
                                value.satuan
                            ).toLowerCase() ===
                            String(
                                item.satuan
                            ).toLowerCase()
                    );


                const isi =
                    Number(
                        satuan?.isi || 1
                    );


                const qty =
                    Number(
                        item.qty || 0
                    );


                const jumlahStok =
                    qty * isi;


                const stokSebelum =
                    Number(
                        barang.stok || 0
                    );


                const stokSesudah =
                    stokSebelum +
                    jumlahStok;


                barang.stok =
                    stokSesudah;


                await DB.put(
                    "barang",
                    barang
                );

            }

        }


        pembelian.syncStatus =
            "synced";


        pembelian.syncedAt =
            new Date()
                .toISOString();


        await DB.put(
            "pembelian",
            pembelian
        );


        return result;

    }

});
