
/*======================================
ROVIXA POS
SYNC STOK ADJUSTMENT
======================================*/

Object.assign(Sync, {


    /*======================================
    ADD STOK ADJUSTMENT
    ======================================*/

    async addStokAdjustment(
        data
    ) {

        if (!data) {

            throw new Error(
                "Data penyesuaian kosong."
            );

        }


        if (!data.kode) {

            throw new Error(
                "Kode barang wajib ada."
            );

        }


        if (
            data.jenis !== "tambah" &&
            data.jenis !== "kurangi"
        ) {

            throw new Error(
                "Jenis penyesuaian tidak valid."
            );

        }


        const jumlah =
            Number(
                data.jumlah
            );


        if (
            !Number.isInteger(
                jumlah
            ) ||
            jumlah < 1
        ) {

            throw new Error(
                "Jumlah penyesuaian tidak valid."
            );

        }


        const stokSebelum =
            Number(
                data.stokSebelum || 0
            );


        const stokSesudah =
            Number(
                data.stokSesudah
            );


        if (
            stokSesudah < 0
        ) {

            throw new Error(
                "Stok tidak boleh negatif."
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


        const stokSekarang =
            Number(
                barang.stok || 0
            );


        if (
            stokSekarang !==
            stokSebelum
        ) {

            throw new Error(
                "Stok barang sudah berubah. Silakan buka kembali menu penyesuaian stok."
            );

        }


        const id =
            "LOCAL-STK-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8);


        const adjustment = {

            id,

            kode:
                data.kode,

            jenis:
                data.jenis,

            jumlah,

            stokSebelum,

            stokSesudah,

            alasan:
                data.alasan || "",

            catatan:
                data.catatan || "",

            syncStatus:
                "pending",

            createdAt:
                new Date()
                    .toISOString(),

            syncedAt:
                null

        };


        await DB.put(
            "stokAdjustment",
            adjustment
        );


        barang.stok =
            stokSesudah;


        await DB.put(
            "barang",
            barang
        );


        const queue = {

            id:
                "SYNC-STK-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8),

            type:
                "stokAdjustment",

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


        return adjustment;

    },


    /*======================================
    SYNC STOK ADJUSTMENT
    ======================================*/

    async syncStokAdjustment(
        queue
    ) {

        const adjustment =
            await DB.get(
                "stokAdjustment",
                queue.referenceId
            );


        if (!adjustment) {

            throw new Error(
                "Data penyesuaian stok lokal tidak ditemukan."
            );

        }


        const result =
            await API.saveStokAdjustment(
                adjustment
            );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result?.message ||
                "Server menolak penyesuaian stok."
            );

        }


        adjustment.syncStatus =
            "synced";


        adjustment.syncedAt =
            new Date()
                .toISOString();


        await DB.put(
            "stokAdjustment",
            adjustment
        );


        return result;

    }

});
