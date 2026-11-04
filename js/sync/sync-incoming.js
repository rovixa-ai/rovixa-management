
/* ======================================
   ROVIXA POS
   INCOMING INCREMENTAL SYNC
   BARANG, SATUAN, PENJUALAN & PEMBELIAN
   BULK DATABASE OPTIMIZATION
====================================== */

"use strict";

const IncomingSync = {

    processing: false,

    LAST_SYNC_KEY: "lastIncrementalSync",

    /* ======================================
       START INCOMING SYNC
    ====================================== */

    async process() {

        if (this.processing || !navigator.onLine) {
            return;
        }

        this.processing = true;

        try {

            const salesDatabase =
                DatabaseConfig.getActiveDatabase();

            if (
                !salesDatabase ||
                !salesDatabase.year ||
                !salesDatabase.penjualan ||
                !salesDatabase.detailPenjualan ||
                !salesDatabase.pembayaran
            ) {
                throw new Error(
                    "Konfigurasi database Penjualan tidak valid."
                );
            }

            const purchaseDatabase =
                PembelianDatabaseConfig.getActiveDatabase();

            if (
                !purchaseDatabase ||
                Number(purchaseDatabase.year) !==
                Number(salesDatabase.year)
            ) {
                throw new Error(
                    "Tahun database Pembelian tidak sesuai."
                );
            }

            const database = {

                ...salesDatabase,

                penjualanId: salesDatabase.penjualan,
                detailPenjualanId: salesDatabase.detailPenjualan,
                pembayaranId: salesDatabase.pembayaran,

                pembelianId: purchaseDatabase.pembelian,
                detailPembelianId: purchaseDatabase.detailPembelian,
                pembayaranPembelianId: purchaseDatabase.pembayaran

            };

            if (
                !database.pembelianId ||
                !database.detailPembelianId ||
                !database.pembayaranPembelianId
            ) {
                throw new Error(
                    "Konfigurasi database Pembelian tidak lengkap."
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

            const data = response.data;

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

            const lastSyncTime =
                new Date(data.lastSync).getTime();

            if (!Number.isFinite(lastSyncTime)) {
                throw new Error(
                    "Checkpoint dari server tidak valid."
                );
            }

            await this.applyChanges(data);

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

        await this.applyMasterChanges(data);

        await this.applyPenjualanChanges(data);

        await this.applyPembelianChanges(data);

    },


    /* ======================================
       APPLY BARANG & SATUAN
    ====================================== */

    async applyMasterChanges(data) {

        const queue =
            await DB.getAll("syncQueue");

        const pendingBarang = new Set();
        const pendingSatuan = new Set();

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

        const barangRows = [];
        const satuanRows = [];

        for (const barang of data.barang) {

            if (
                !barang ||
                !barang.kode
            ) {
                continue;
            }

            const kode = String(barang.kode);

            if (pendingBarang.has(kode)) {
                continue;
            }

            barangRows.push(barang);

        }

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

            satuanRows.push({
                ...satuan,
                id
            });

        }

        await Promise.all([

            DB.bulkPut(
                "barang",
                barangRows
            ),

            DB.bulkPut(
                "satuan",
                satuanRows
            )

        ]);

    },


    /* ======================================
       APPLY PENJUALAN CHANGES
    ====================================== */

    async applyPenjualanChanges(data) {

        const [
            localPenjualan,
            localDetail,
            localPembayaran
        ] = await Promise.all([

            DB.getAll("penjualan"),
            DB.getAll("detailPenjualan"),
            DB.getAll("pembayaranPenjualan")

        ]);

        const existingPenjualan = new Set();

        for (const item of localPenjualan || []) {

            if (item?.id) {
                existingPenjualan.add(
                    String(item.id)
                );
            }

        }

        const penjualanRows = [];

        for (const penjualan of data.penjualan) {

            if (
                !penjualan ||
                !penjualan.id
            ) {
                continue;
            }

            penjualanRows.push(penjualan);

            existingPenjualan.add(
                String(penjualan.id)
            );

        }

        const existingDetail = new Set();

        for (const detail of localDetail || []) {

            existingDetail.add(
                this.createDetailSignature(detail)
            );

        }

        const detailRows = [];

        for (const detail of data.detailPenjualan) {

            if (
                !detail ||
                !detail.id
            ) {
                continue;
            }

            if (
                !existingPenjualan.has(
                    String(detail.id)
                )
            ) {
                continue;
            }

            const signature =
                this.createDetailSignature(detail);

            if (existingDetail.has(signature)) {
                continue;
            }

            detailRows.push(
                this.normalizeDetail(detail)
            );

            existingDetail.add(signature);

        }

        const existingPembayaran = new Set();

        for (const pembayaran of localPembayaran || []) {

            existingPembayaran.add(
                this.createPaymentSignature(pembayaran)
            );

        }

        const pembayaranRows = [];

        for (const pembayaran of data.pembayaranPenjualan) {

            if (
                !pembayaran ||
                !pembayaran.id
            ) {
                continue;
            }

            if (
                !existingPenjualan.has(
                    String(pembayaran.id)
                )
            ) {
                continue;
            }

            const signature =
                this.createPaymentSignature(pembayaran);

            if (existingPembayaran.has(signature)) {
                continue;
            }

            pembayaranRows.push(
                this.normalizePayment(pembayaran)
            );

            existingPembayaran.add(signature);

        }

        await Promise.all([

            DB.bulkPut(
                "penjualan",
                penjualanRows
            ),

            DB.bulkAdd(
                "detailPenjualan",
                detailRows
            ),

            DB.bulkAdd(
                "pembayaranPenjualan",
                pembayaranRows
            )

        ]);

    },


    /* ======================================
       APPLY PEMBELIAN CHANGES
    ====================================== */

    async applyPembelianChanges(data) {

        const [
            localPembelian,
            localDetailPembelian,
            localPembayaranPembelian
        ] = await Promise.all([

            DB.getAll("pembelian"),
            DB.getAll("detailPembelian"),
            DB.getAll("pembayaranPembelian")

        ]);

        const existingPembelian = new Set();

        for (const item of localPembelian || []) {

            if (item?.id) {
                existingPembelian.add(
                    String(item.id)
                );
            }

        }

        const pembelianRows = [];

        for (const pembelian of data.pembelian) {

            if (
                !pembelian ||
                !pembelian.id
            ) {
                continue;
            }

            pembelianRows.push(pembelian);

            existingPembelian.add(
                String(pembelian.id)
            );

        }

        const existingDetail = new Set();

        for (const detail of localDetailPembelian || []) {

            existingDetail.add(
                this.createPembelianDetailSignature(detail)
            );

        }

        const detailRows = [];

        for (const detail of data.detailPembelian) {

            if (
                !detail ||
                !detail.id
            ) {
                continue;
            }

            if (
                !existingPembelian.has(
                    String(detail.id)
                )
            ) {
                continue;
            }

            const signature =
                this.createPembelianDetailSignature(detail);

            if (existingDetail.has(signature)) {
                continue;
            }

            detailRows.push(
                this.normalizePembelianDetail(detail)
            );

            existingDetail.add(signature);

        }

        const existingPembayaran = new Set();

        for (const pembayaran of localPembayaranPembelian || []) {

            existingPembayaran.add(
                this.createPembelianPaymentSignature(pembayaran)
            );

        }

        const pembayaranRows = [];

        for (const pembayaran of data.pembayaranPembelian) {

            if (
                !pembayaran ||
                !pembayaran.id
            ) {
                continue;
            }

            if (
                !existingPembelian.has(
                    String(pembayaran.id)
                )
            ) {
                continue;
            }

            const signature =
                this.createPembelianPaymentSignature(pembayaran);

            if (existingPembayaran.has(signature)) {
                continue;
            }

            pembayaranRows.push(
                this.normalizePembelianPayment(pembayaran)
            );

            existingPembayaran.add(signature);

        }

        await Promise.all([

            DB.bulkPut(
                "pembelian",
                pembelianRows
            ),

            DB.bulkAdd(
                "detailPembelian",
                detailRows
            ),

            DB.bulkPut(
                "pembayaranPembelian",
                pembayaranRows
            )

        ]);

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
            String(
                detail.nama ||
                detail.namaBarang ||
                ""
            ),
            String(detail.satuan || ""),
            Number(detail.qty || 0),
            Number(
                detail.isi ??
                detail.konversi ??
                0
            ),
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

            nama:
                detail.nama ||
                detail.namaBarang ||
                "",

            satuan: detail.satuan,

            qty: detail.qty,

            isi:
                detail.isi ??
                detail.konversi ??
                0,

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

            String(pembayaran.id || ""),
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

            id: pembayaran.id,
            metode: pembayaran.metode,
            nominal: pembayaran.nominal,
            kembalian: pembayaran.kembalian

        };

    }

};
