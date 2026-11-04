
/* ======================================
   ROVIXA POS
   INCOMING INCREMENTAL SYNC
   BARANG, SATUAN, PENJUALAN & PEMBELIAN
====================================== */

"use strict";

const IncomingSync = {

    processing: false,

    /* ======================================
       CONFIGURATION
    ====================================== */

    LAST_SYNC_KEY: "lastIncrementalSync",

    /* ======================================
       START INCOMING SYNC
    ====================================== */

    async process() {

        if (this.processing) {
            return;
        }

        if (!navigator.onLine) {
            return;
        }

        this.processing = true;

        try {

            const database =
                DatabaseConfig.getActiveDatabase();

            if (
                !database ||
                !database.year ||
                !database.penjualan ||
                !database.detailPenjualan ||
                !database.pembayaran
            ) {
                throw new Error(
                    "Konfigurasi database Penjualan tidak valid."
                );
            }

            const since =
                await this.getLastSync();

            const response =
                await API.getSyncChanges(
                    since,
                    database
                );

            if (
                !response ||
                response.success !== true
            ) {
                throw new Error(
                    response?.message ||
                    "Gagal mengambil perubahan dari server."
                );
            }

            const data =
                response.data;

            if (
                !data ||
                !Array.isArray(data.barang) ||
                !Array.isArray(data.satuan) ||
                !Array.isArray(data.penjualan) ||
                !Array.isArray(data.detailPenjualan) ||
                !Array.isArray(data.pembayaranPenjualan) ||
                !Array.isArray(data.pembelian) ||
                !Array.isArray(data.detailPembelian) ||
                !Array.isArray(data.pembayaranPembelian) ||
                !data.lastSync
            ) {
                throw new Error(
                    "Format data incremental sync tidak valid."
                );
            }

            if (
                Number(data.year) !==
                Number(database.year)
            ) {
                throw new Error(
                    "Tahun database tidak sesuai."
                );
            }

            /*
             * PASTIKAN CHECKPOINT VALID
             */

            const lastSyncTime =
                new Date(data.lastSync).getTime();

            if (!Number.isFinite(lastSyncTime)) {
                throw new Error(
                    "Checkpoint dari server tidak valid."
                );
            }

            /*
             * TERAPKAN PERUBAHAN SERVER
             */

            await this.applyChanges(data);

            /*
             * SIMPAN CHECKPOINT
             *
             * Hanya dilakukan setelah seluruh
             * perubahan berhasil diterapkan.
             */

            await DB.put(
                "config",
                {
                    key: this.LAST_SYNC_KEY,
                    value: data.lastSync
                }
            );

        }
        catch (error) {

            console.error(
                "Incoming sync gagal:",
                error
            );

        }
        finally {

            this.processing = false;

        }

    },


    /* ======================================
       GET LAST SYNC CHECKPOINT
    ====================================== */

    async getLastSync() {

        const checkpoint =
            await DB.get(
                "config",
                this.LAST_SYNC_KEY
            );

        if (checkpoint?.value) {
            return checkpoint.value;
        }

        /*
         * Bootstrap pertama tetap menjadi
         * titik awal incremental sync.
         */

        const bootstrap =
            await DB.get(
                "config",
                "lastBootstrap"
            );

        if (bootstrap?.value) {
            return bootstrap.value;
        }

        return "";

    },


    /* ======================================
       APPLY SERVER CHANGES
    ====================================== */

    async applyChanges(data) {

        /*
         * BARANG & SATUAN
         */

        await this.applyMasterChanges(data);

        /*
         * PENJUALAN
         */

        await this.applyPenjualanChanges(data);

        /*
         * PEMBELIAN
         */

        await this.applyPembelianChanges(data);

    },


    /* ======================================
       APPLY BARANG & SATUAN
    ====================================== */

    async applyMasterChanges(data) {

        const queue =
            await DB.getAll("syncQueue");

        const pendingBarang =
            new Set();

        const pendingSatuan =
            new Set();

        /*
         * Identifikasi data lokal yang masih
         * menunggu proses outgoing sync.
         */

        for (const item of queue || []) {

            if (
                item.status !== "pending" &&
                item.status !== "syncing"
            ) {
                continue;
            }

            if (
                item.type === "barang" ||
                item.type === "barangUpdate"
            ) {

                if (item.referenceId) {
                    pendingBarang.add(
                        String(item.referenceId)
                    );
                }

            }

            if (item.type === "satuan") {

                if (item.referenceId) {
                    pendingSatuan.add(
                        String(item.referenceId)
                    );
                }

            }

        }

        /*
         * UPDATE BARANG
         */

        for (const barang of data.barang) {

            if (
                !barang ||
                !barang.kode
            ) {
                continue;
            }

            const kode =
                String(barang.kode);

            if (pendingBarang.has(kode)) {
                continue;
            }

            await DB.put(
                "barang",
                barang
            );

        }

        /*
         * UPDATE SATUAN
         */

        for (const satuan of data.satuan) {

            if (
                !satuan ||
                !satuan.kode ||
                !satuan.satuan
            ) {
                continue;
            }

            const id =
                satuan.id ||
                `${satuan.kode}_${satuan.satuan}`;

            if (pendingSatuan.has(String(id))) {
                continue;
            }

            await DB.put(
                "satuan",
                {
                    ...satuan,
                    id
                }
            );

        }

    },


    /* ======================================
       APPLY PENJUALAN CHANGES
    ====================================== */

    async applyPenjualanChanges(data) {

        /*
         * Ambil data lokal yang sudah ada.
         */

        const [
            localPenjualan,
            localDetail,
            localPembayaran
        ] = await Promise.all([

            DB.getAll("penjualan"),

            DB.getAll("detailPenjualan"),

            DB.getAll("pembayaranPenjualan")

        ]);

        /*
         * INDEX HEADER PENJUALAN
         */

        const existingPenjualan =
            new Map();

        for (const item of localPenjualan || []) {

            if (
                !item ||
                !item.id
            ) {
                continue;
            }

            existingPenjualan.set(
                String(item.id),
                item
            );

        }

        /*
         * INSERT / UPDATE HEADER PENJUALAN
         */

        for (const penjualan of data.penjualan) {

            if (
                !penjualan ||
                !penjualan.id
            ) {
                continue;
            }

            const id =
                String(penjualan.id);

            await DB.put(
                "penjualan",
                penjualan
            );

            existingPenjualan.set(
                id,
                penjualan
            );

        }

        /*
         * INDEX DETAIL BERDASARKAN
         * IDENTITAS DAN ISI DATA.
         */

        const existingDetail =
            new Set();

        for (const detail of localDetail || []) {

            existingDetail.add(
                this.createDetailSignature(detail)
            );

        }

        /*
         * INSERT DETAIL PENJUALAN
         */

        for (const detail of data.detailPenjualan) {

            if (
                !detail ||
                !detail.id
            ) {
                continue;
            }

            const transactionId =
                String(detail.id);

            if (!existingPenjualan.has(transactionId)) {
                continue;
            }

            const signature =
                this.createDetailSignature(detail);

            if (existingDetail.has(signature)) {
                continue;
            }

            await DB.add(
                "detailPenjualan",
                this.normalizeDetail(detail)
            );

            existingDetail.add(signature);

        }

        /*
         * INDEX PEMBAYARAN BERDASARKAN
         * IDENTITAS DAN ISI DATA.
         */

        const existingPembayaran =
            new Set();

        for (const pembayaran of localPembayaran || []) {

            existingPembayaran.add(
                this.createPaymentSignature(pembayaran)
            );

        }

        /*
         * INSERT PEMBAYARAN PENJUALAN
         */

        for (const pembayaran of data.pembayaranPenjualan) {

            if (
                !pembayaran ||
                !pembayaran.id
            ) {
                continue;
            }

            const transactionId =
                String(pembayaran.id);

            if (!existingPenjualan.has(transactionId)) {
                continue;
            }

            const signature =
                this.createPaymentSignature(pembayaran);

            if (existingPembayaran.has(signature)) {
                continue;
            }

            await DB.add(
                "pembayaranPenjualan",
                this.normalizePayment(pembayaran)
            );

            existingPembayaran.add(signature);

        }

    },


    /* ======================================
   APPLY PEMBELIAN CHANGES
====================================== */

async applyPembelianChanges(data) {

    /*
     * AMBIL DATA LOKAL
     */

    const [
        localPembelian,
        localDetailPembelian,
        localPembayaranPembelian
    ] = await Promise.all([

        DB.getAll("pembelian"),

        DB.getAll("detailPembelian"),

        DB.getAll("pembayaranPembelian")

    ]);

    /*
     * INDEX HEADER PEMBELIAN
     */

    const existingPembelian =
        new Map();

    for (const item of localPembelian || []) {

        if (
            !item ||
            !item.id
        ) {
            continue;
        }

        existingPembelian.set(
            String(item.id),
            item
        );

    }

    /*
     * INSERT / UPDATE HEADER PEMBELIAN
     */

    for (const pembelian of data.pembelian) {

        if (
            !pembelian ||
            !pembelian.id
        ) {
            continue;
        }

        const id =
            String(pembelian.id);

        await DB.put(
            "pembelian",
            pembelian
        );

        existingPembelian.set(
            id,
            pembelian
        );

    }

    /*
     * INDEX DETAIL PEMBELIAN
     */

    const existingDetail =
        new Set();

    for (const detail of localDetailPembelian || []) {

        existingDetail.add(
            this.createPembelianDetailSignature(detail)
        );

    }

    /*
     * INSERT DETAIL PEMBELIAN
     */

    for (const detail of data.detailPembelian) {

        if (
            !detail ||
            !detail.id
        ) {
            continue;
        }

        const transactionId =
            String(detail.id);

        if (!existingPembelian.has(transactionId)) {
            continue;
        }

        const signature =
            this.createPembelianDetailSignature(detail);

        if (existingDetail.has(signature)) {
            continue;
        }

        await DB.add(
            "detailPembelian",
            this.normalizePembelianDetail(detail)
        );

        existingDetail.add(signature);

    }

    /*
     * INDEX PEMBAYARAN PEMBELIAN
     */

    const existingPembayaran =
        new Set();

    for (const pembayaran of localPembayaranPembelian || []) {

        existingPembayaran.add(
            this.createPembelianPaymentSignature(pembayaran)
        );

    }

    /*
     * INSERT PEMBAYARAN PEMBELIAN
     */

    for (const pembayaran of data.pembayaranPembelian) {

        if (
            !pembayaran ||
            !pembayaran.id
        ) {
            continue;
        }

        const transactionId =
            String(pembayaran.id);

        if (!existingPembelian.has(transactionId)) {
            continue;
        }

        const signature =
            this.createPembelianPaymentSignature(pembayaran);

        if (existingPembayaran.has(signature)) {
            continue;
        }

        await DB.put(
            "pembayaranPembelian",
            this.normalizePembelianPayment(pembayaran)
        );

        existingPembayaran.add(signature);

    }

},


    /* ======================================
       DETAIL SIGNATURE PENJUALAN
    ====================================== */

    createDetailSignature(detail) {

        return JSON.stringify([

            String(detail.id || ""),

            String(detail.kode || ""),

            String(detail.nama || ""),

            String(detail.satuan || ""),

            Number(detail.qty || 0),

            Number(detail.konversi || 0),

            Number(detail.harga || 0),

            Number(detail.discount || 0),

            Number(detail.subtotal || 0)

        ]);

    },


    /* ======================================
       PAYMENT SIGNATURE PENJUALAN
    ====================================== */

    createPaymentSignature(pembayaran) {

        return JSON.stringify([

            String(pembayaran.id || ""),

            String(pembayaran.metode || ""),

            Number(pembayaran.nominal || 0),

            Number(pembayaran.kembalian || 0)

        ]);

    },


    /* ======================================
       NORMALIZE DETAIL PENJUALAN
    ====================================== */

    normalizeDetail(detail) {

        return {

            id: detail.id,

            kode: detail.kode,

            nama: detail.nama,

            satuan: detail.satuan,

            qty: detail.qty,

            konversi: detail.konversi,

            harga: detail.harga,

            discount: detail.discount,

            subtotal: detail.subtotal

        };

    },


    /* ======================================
       NORMALIZE PAYMENT PENJUALAN
    ====================================== */

    normalizePayment(pembayaran) {

        return {

            id: pembayaran.id,

            metode: pembayaran.metode,

            nominal: pembayaran.nominal,

            kembalian: pembayaran.kembalian

        };

    },


    /* ======================================
       DETAIL SIGNATURE PEMBELIAN
    ====================================== */

    createPembelianDetailSignature(detail) {

        return JSON.stringify([

            String(detail.id || ""),

            String(detail.kode || ""),

            String(detail.namaBarang || ""),

            String(detail.satuan || ""),

            Number(detail.qty || 0),

            Number(detail.konversi || 0),

            Number(detail.harga || 0),

            Number(detail.disc || 0),

            Number(detail.total || 0)

        ]);

    },


    /* ======================================
       NORMALIZE DETAIL PEMBELIAN
    ====================================== */

    normalizePembelianDetail(detail) {

        return {

            id: detail.id,

            kode: detail.kode,

            namaBarang: detail.namaBarang,

            satuan: detail.satuan,

            qty: detail.qty,

            konversi: detail.konversi,

            harga: detail.harga,

            disc: detail.disc,

            total: detail.total

        };

    },


    /* ======================================
       PAYMENT SIGNATURE PEMBELIAN
    ====================================== */

    createPembelianPaymentSignature(pembayaran) {

        return JSON.stringify([

            String(pembayaran.metode || ""),

            Number(pembayaran.nominal || 0),

            Number(pembayaran.kembalian || 0)

        ]);

    },


    /* ======================================
       NORMALIZE PAYMENT PEMBELIAN
    ====================================== */

    normalizePembelianPayment(pembayaran) {

        return {

            metode: pembayaran.metode,

            nominal: pembayaran.nominal,

            kembalian: pembayaran.kembalian

        };

    }

};
