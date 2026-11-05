
/* ======================================
   ROVIXA POS
   INCOMING INCREMENTAL SYNC
   BARANG, SATUAN, PENJUALAN,
   PEMBELIAN & EXPENSE
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

            /* ======================================
               DATABASE EXPENSE
            ====================================== */

            const expenseDatabase =
                ExpenseDatabaseConfig.getActiveDatabase();

            if (
                !expenseDatabase ||
                Number(expenseDatabase.year) !==
                Number(salesDatabase.year)
            ) {
                throw new Error(
                    "Tahun database Expense tidak sesuai."
                );
            }

            if (!expenseDatabase.expense) {
                throw new Error(
                    "Konfigurasi database Expense tidak lengkap."
                );
            }

            const database = {

                ...salesDatabase,

                penjualanId: salesDatabase.penjualan,
                detailPenjualanId: salesDatabase.detailPenjualan,
                pembayaranId: salesDatabase.pembayaran,

                pembelianId: purchaseDatabase.pembelian,
                detailPembelianId: purchaseDatabase.detailPembelian,
                pembayaranPembelianId: purchaseDatabase.pembayaran,

                expenseId: expenseDatabase.expense

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
                !Array.isArray(data.expense) ||
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
       PARALLEL MODULE PROCESSING
    ====================================== */

    async applyChanges(data) {

        await Promise.all([

            this.applyMasterChanges(data),

            this.applyPenjualanChanges(data),

            this.applyPembelianChanges(data),

            this.applyExpenseChanges(data)

        ]);

    },


    /* ======================================
       APPLY BARANG & SATUAN
    ====================================== */

    async applyMasterChanges(data) {

        const hasBarang =
            data.barang.length > 0;

        const hasSatuan =
            data.satuan.length > 0;

        if (!hasBarang && !hasSatuan) {
            return;
        }

        let queue = [];

        if (hasBarang || hasSatuan) {

            queue =
                await DB.getAll("syncQueue") || [];

        }

        const pendingBarang = new Set();
        const pendingSatuan = new Set();

        for (const item of queue) {

            if (
                item.status !== "pending" &&
                item.status !== "syncing"
            ) {
                continue;
            }

            if (
                hasBarang &&
                (
                    item.type === "barang" ||
                    item.type === "barangUpdate"
                )
            ) {

                if (item.referenceId) {
                    pendingBarang.add(
                        String(item.referenceId)
                    );
                }

            }

            if (
                hasSatuan &&
                item.type === "satuan"
            ) {

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

        const tasks = [];

        if (barangRows.length > 0) {

            tasks.push(
                DB.bulkPut(
                    "barang",
                    barangRows
                )
            );

        }

        if (satuanRows.length > 0) {

            tasks.push(
                DB.bulkPut(
                    "satuan",
                    satuanRows
                )
            );

        }

        if (tasks.length > 0) {
            await Promise.all(tasks);
        }

    },


    /* ======================================
       APPLY PENJUALAN CHANGES
    ====================================== */

    async applyPenjualanChanges(data) {

        const hasPenjualan =
            data.penjualan.length > 0;

        const hasDetail =
            data.detailPenjualan.length > 0;

        const hasPembayaran =
            data.pembayaranPenjualan.length > 0;

        if (
            !hasPenjualan &&
            !hasDetail &&
            !hasPembayaran
        ) {
            return;
        }

        const penjualanRows = [];

        const existingPenjualan = new Set();

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

        /*
         * Baca header lokal hanya jika
         * detail atau pembayaran perlu diperiksa.
         */

        if (hasDetail || hasPembayaran) {

            const localPenjualan =
                await DB.getAll("penjualan");

            for (const item of localPenjualan || []) {

                if (item?.id) {

                    existingPenjualan.add(
                        String(item.id)
                    );

                }

            }

        }

        const tasks = [];

        if (penjualanRows.length > 0) {

            tasks.push(
                DB.bulkPut(
                    "penjualan",
                    penjualanRows
                )
            );

        }

        /*
         * DETAIL PENJUALAN
         */

        if (hasDetail) {

            const localDetail =
                await DB.getAll("detailPenjualan");

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

            if (detailRows.length > 0) {

                tasks.push(
                    DB.bulkAdd(
                        "detailPenjualan",
                        detailRows
                    )
                );

            }

        }

        /*
         * PEMBAYARAN PENJUALAN
         */

        if (hasPembayaran) {

            const localPembayaran =
                await DB.getAll("pembayaranPenjualan");

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

            if (pembayaranRows.length > 0) {

                tasks.push(
                    DB.bulkAdd(
                        "pembayaranPenjualan",
                        pembayaranRows
                    )
                );

            }

        }

        if (tasks.length > 0) {
            await Promise.all(tasks);
        }

    },


    /* ======================================
       APPLY PEMBELIAN CHANGES
    ====================================== */

    async applyPembelianChanges(data) {

        const hasPembelian =
            data.pembelian.length > 0;

        const hasDetail =
            data.detailPembelian.length > 0;

        const hasPembayaran =
            data.pembayaranPembelian.length > 0;

        if (
            !hasPembelian &&
            !hasDetail &&
            !hasPembayaran
        ) {
            return;
        }

        const pembelianRows = [];

        const existingPembelian = new Set();

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

        /*
         * Baca header lokal hanya jika
         * detail atau pembayaran perlu diperiksa.
         */

        if (hasDetail || hasPembayaran) {

            const localPembelian =
                await DB.getAll("pembelian");

            for (const item of localPembelian || []) {

                if (item?.id) {

                    existingPembelian.add(
                        String(item.id)
                    );

                }

            }

        }

        const tasks = [];

        if (pembelianRows.length > 0) {

            tasks.push(
                DB.bulkPut(
                    "pembelian",
                    pembelianRows
                )
            );

        }

        /*
         * DETAIL PEMBELIAN
         */

        if (hasDetail) {

            const localDetailPembelian =
                await DB.getAll("detailPembelian");

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

            if (detailRows.length > 0) {

                tasks.push(
                    DB.bulkAdd(
                        "detailPembelian",
                        detailRows
                    )
                );

            }

        }

        /*
         * PEMBAYARAN PEMBELIAN
         */

        if (hasPembayaran) {

            const localPembayaranPembelian =
                await DB.getAll("pembayaranPembelian");

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

            if (pembayaranRows.length > 0) {

                tasks.push(
                    DB.bulkPut(
                        "pembayaranPembelian",
                        pembayaranRows
                    )
                );

            }

        }

        if (tasks.length > 0) {
            await Promise.all(tasks);
        }

    },


   /* ======================================
   APPLY EXPENSE CHANGES
====================================== */

async applyExpenseChanges(data) {

    const expenses =
        Array.isArray(data.expense)
            ? data.expense
            : [];

    if (expenses.length === 0) {
        return;
    }

    /*
    ======================================
       BACA QUEUE LOKAL
       LINDUNGI EXPENSE PENDING
    ======================================
    */

    const queue =
        await DB.getAll("syncQueue") || [];

    const pendingExpenseIds = new Set();

    for (const item of queue) {

        if (
            item.type !== "expense" ||
            (
                item.status !== "pending" &&
                item.status !== "syncing"
            )
        ) {
            continue;
        }

        if (item.referenceId) {

            pendingExpenseIds.add(
                String(item.referenceId)
            );

        }

    }

    /*
    ======================================
       BACA DATA EXPENSE LOKAL
    ======================================
    */

    const localExpenses =
        await DB.getAll("expense") || [];

    const localById = new Map();
    const localBySpreadsheetId = new Map();

    for (const item of localExpenses) {

        if (!item) {
            continue;
        }

        if (item.id) {

            localById.set(
                String(item.id),
                item
            );

        }

        if (item.spreadsheetId) {

            localBySpreadsheetId.set(
                String(item.spreadsheetId),
                item
            );

        }

    }

    /*
    ======================================
       SIAPKAN DATA DARI SERVER
    ======================================
    */

    const expenseRows = [];

    for (const expense of expenses) {

        if (
            !expense ||
            !expense.id
        ) {
            continue;
        }

        const serverId =
            String(expense.id).trim();

        if (!serverId) {
            continue;
        }

        /*
        ==================================
           CARI DATA LOKAL
        ==================================
        */

        const matchedLocal =
            localById.get(serverId) ||
            localBySpreadsheetId.get(serverId);

        /*
        ==================================
           LINDUNGI DATA PENDING
        ==================================
        */

        if (
            matchedLocal &&
            pendingExpenseIds.has(
                String(matchedLocal.id)
            )
        ) {
            continue;
        }

        if (
            pendingExpenseIds.has(serverId)
        ) {
            continue;
        }

        /*
        ==================================
           PERTAHANKAN PRIMARY KEY LOKAL
        ==================================
        */

        const normalizedExpense = {

            ...(matchedLocal || {}),

            id:
                matchedLocal
                    ? matchedLocal.id
                    : serverId,

            tanggal:
                expense.tanggal,

            kategori:
                expense.kategori,

            keterangan:
                expense.keterangan,

            jumlah:
                Number(expense.jumlah) || 0,

            metode:
                expense.metode,

            status:
                expense.status,

            spreadsheetId:
                serverId,

            syncStatus:
                "synced"

        };

        expenseRows.push(
            normalizedExpense
        );

    }

    /*
    ======================================
       SIMPAN BULK
    ======================================
    */

    if (expenseRows.length > 0) {

        await DB.bulkPut(
            "expense",
            expenseRows
        );

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
