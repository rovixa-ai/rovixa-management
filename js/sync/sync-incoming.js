
/* ======================================
   ROVIXA POS
   INCOMING INCREMENTAL SYNC
   BARANG, SATUAN & PENJUALAN
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
                    "Tahun database Penjualan tidak sesuai."
                );
            }

            await this.applyChanges(data);

            /*
             * Simpan checkpoint hanya setelah
             * seluruh perubahan berhasil diproses.
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

            /*
             * Header dari server dapat diperbarui
             * jika transaksi tersebut sudah ada.
             */

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
       DETAIL SIGNATURE
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
       PAYMENT SIGNATURE
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
       NORMALIZE DETAIL
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
       NORMALIZE PAYMENT
    ====================================== */

    normalizePayment(pembayaran) {

        return {

            id: pembayaran.id,

            metode: pembayaran.metode,

            nominal: pembayaran.nominal,

            kembalian: pembayaran.kembalian

        };

    }

};
