const Sync = {

    processing: false,

    initialized: false,


    /*======================================
    INIT AUTO SYNC
    ======================================*/

    init() {

        if (
            this.initialized
        ) {

            return;

        }


        this.initialized =
            true;


        /*
        ======================================
        INTERNET KEMBALI ONLINE
        ======================================
        */

        window.addEventListener(
            "online",
            () => {

                


                this.process();

            }
        );


        /*
        ======================================
        INTERNET PUTUS
        ======================================
        */

        window.addEventListener(
            "offline",
            () => {

                

            }
        );


        /*
        ======================================
        COBA SYNC SAAT APP DIBUKA
        ======================================
        */

        if (
            navigator.onLine
        ) {

            


            this.process();

        }

    },


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
    AUTO SYNC
    ======================================*/

    autoProcess() {

        setTimeout(
            () => {

                this.process();

            },
            100
        );

    },


    /*======================================
    PROCESS SYNC QUEUE
    ======================================*/

    async process() {

        if (
            !navigator.onLine
        ) {

            

            return;

        }


        if (
            this.processing
        ) {

            

            return;

        }


        this.processing =
            true;


        try {

            const queueList =
                await DB.getAll(
                    "syncQueue"
                );


            const pendingList =
                queueList.filter(
                    item =>
                        item.status ===
                        "pending"
                );


           


            for (
                const queue of pendingList
            ) {

                await this.processItem(
                    queue
                );

            }

        }

        catch (error) {

            console.error(
                "SYNC PROCESS ERROR:",
                error
            );

        }

        finally {

            this.processing =
                false;

        }

    },


    /*======================================
    PROCESS ITEM
    ======================================*/

    async processItem(
        queue
    ) {

        try {

            queue.status =
                "syncing";


            await DB.put(
                "syncQueue",
                queue
            );


            if (
                queue.type ===
                "pembelian"
            ) {

                await this.syncPembelian(
                    queue
                );

            }


            if (
                queue.type ===
                "expense"
            ) {

                await this.syncExpense(
                    queue
                );

            }


            if (
                queue.type ===
                "barang"
            ) {

                await this.syncBarang(
                    queue
                );

            }


            if (
                queue.type ===
                "barangUpdate"
            ) {

                await this.syncUpdateBarang(
                    queue
                );

            }


            if (
                queue.type ===
                "satuan"
            ) {

                await this.syncSatuan(
                    queue
                );

            }


            if (
                queue.type ===
                "stokAdjustment"
            ) {

                await this.syncStokAdjustment(
                    queue
                );

            }


            queue.status =
                "success";


            queue.syncedAt =
                new Date()
                    .toISOString();


            await DB.put(
                "syncQueue",
                queue
            );


            

        }

        catch (error) {

            console.error(
                "SYNC FAILED:",
                queue.id,
                error
            );


            queue.status =
                "pending";


            queue.retry =
                Number(
                    queue.retry || 0
                ) + 1;


            queue.lastError =
                error.message;


            await DB.put(
                "syncQueue",
                queue
            );

        }

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

    },


    /*======================================
    SYNC EXPENSE
    ======================================*/

    async syncExpense(queue) {

        // ======================================
        // AMBIL DATA EXPENSE
        // ======================================

        const expense =
            await DB.get(
                "expense",
                queue.referenceId
            );


        if (!expense) {

            throw new Error(
                "Data Expense tidak ditemukan."
            );

        }


        // ======================================
        // VALIDASI DATABASE
        // ======================================

        const database =
            expense.database ||
            {};


        const year =
            Number(
                database.year
            );


        const spreadsheetId =
            String(
                database.expense || ""
            ).trim();


        if (!year) {

            throw new Error(
                "Tahun database Expense tidak tersedia."
            );

        }


        if (!spreadsheetId) {

            throw new Error(

                "Spreadsheet Expense tahun " +
                year +
                " tidak tersedia."

            );

        }


        // ======================================
        // KIRIM KE APPS SCRIPT
        // ======================================

        const result =
            await API.saveExpense({

                tanggal:
                    expense.tanggal,

                kategori:
                    expense.kategori,

                keterangan:
                    expense.keterangan,

                jumlah:
                    expense.jumlah,

                metode:
                    expense.metode,

                status:
                    expense.status,

                database: {

                    year:
                        year,

                    expense:
                        spreadsheetId

                }

            });


        


        // ======================================
        // VALIDASI RESPONSE
        // ======================================

        if (
            !result ||
            result.success !== true
        ) {

            throw new Error(

                result?.message ||
                "Expense gagal disinkronkan."

            );

        }


        // ======================================
        // SIMPAN ID SPREADSHEET
        // ======================================

        const transactionId =
            String(
                result.id || ""
            ).trim();


        if (!transactionId) {

            throw new Error(
                "ID Expense dari Spreadsheet tidak diterima."
            );

        }


        expense.spreadsheetId =
            transactionId;


        // ======================================
        // UPDATE STATUS LOCAL
        // ======================================

        expense.syncStatus =
            "synced";


        expense.syncedAt =
            new Date()
                .toISOString();


        await DB.put(
            "expense",
            expense
        );


        return result;

    },


    /*======================================
       ADD EXPENSE
    ======================================*/

    async addExpense(
        data,
        database
    ) {

        /* ==================================
           VALIDASI DATA
        ================================== */

        if (
            !data ||
            typeof data !== "object"
        ) {

            throw new Error(
                "Data Expense tidak valid."
            );

        }


        /* ==================================
           VALIDASI DATABASE
        ================================== */

        if (
            !database ||
            typeof database !== "object"
        ) {

            throw new Error(
                "Database Expense tidak tersedia."
            );

        }


        /* ==================================
           DATA EXPENSE
        ================================== */

        const tanggal =
            String(
                data.tanggal || ""
            ).trim();


        const kategori =
            String(
                data.kategori || ""
            ).trim();


        const keterangan =
            String(
                data.keterangan || ""
            ).trim();


        const jumlah =
            Number(
                data.jumlah
            ) || 0;


        const metode =
            String(
                data.metode || ""
            ).trim();


        const status =
            String(
                data.status || "Aktif"
            ).trim();


        /* ==================================
           DATABASE
        ================================== */

        const year =
            Number(
                database.year
            );


        const expenseDatabaseId =
            String(
                database.expense || ""
            ).trim();


        /* ==================================
           VALIDASI FIELD
        ================================== */

        if (!tanggal) {

            throw new Error(
                "Tanggal Expense belum diisi."
            );

        }


        if (!kategori) {

            throw new Error(
                "Kategori Expense belum diisi."
            );

        }


        if (!keterangan) {

            throw new Error(
                "Keterangan Expense belum diisi."
            );

        }


        if (jumlah <= 0) {

            throw new Error(
                "Jumlah Expense harus lebih dari 0."
            );

        }


        if (!metode) {

            throw new Error(
                "Metode pembayaran Expense belum diisi."
            );

        }


        if (!year) {

            throw new Error(
                "Tahun database Expense tidak valid."
            );

        }


        if (!expenseDatabaseId) {

            throw new Error(

                "Spreadsheet Expense tahun " +
                year +
                " belum dikonfigurasi."

            );

        }


        /* ==================================
           VALIDASI TAHUN
           TANGGAL VS DATABASE
        ================================== */

        const tanggalYear =
            Number(
                tanggal.substring(
                    0,
                    4
                )
            );


        if (!tanggalYear) {

            throw new Error(
                "Tahun tanggal Expense tidak valid."
            );

        }


        if (
            tanggalYear !==
            year
        ) {

            throw new Error(

                "Tahun tanggal Expense (" +
                tanggalYear +
                ") tidak sesuai dengan database Expense (" +
                year +
                ")."

            );

        }


        /* ==================================
           ID LOCAL
        ================================== */

        const timestamp =
            Date.now();


        const random =
            Math.random()
                .toString(36)
                .substring(
                    2,
                    8
                );


        const localId =
            "LOCAL-EXP-" +
            timestamp +
            "-" +
            random;


        /* ==================================
           DATA LOCAL EXPENSE
        ================================== */

        const expense = {

            id:
                localId,

            tanggal:
                tanggal,

            kategori:
                kategori,

            keterangan:
                keterangan,

            jumlah:
                jumlah,

            metode:
                metode,

            status:
                status,

            database: {

                year:
                    year,

                expense:
                    expenseDatabaseId

            },

            syncStatus:
                "pending",

            createdAt:
                new Date()
                    .toISOString(),

            syncedAt:
                null

        };


        


        /* ==================================
           SIMPAN KE INDEXEDDB
        ================================== */

        await DB.put(
            "expense",
            expense
        );


        /* ==================================
           SYNC QUEUE
        ================================== */

        const queueId =
            "SYNC-EXP-" +
            timestamp +
            "-" +
            random;


        const queue = {

            id:
                queueId,

            type:
                "expense",

            referenceId:
                localId,

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


        /* ==================================
           PROSES SYNC OTOMATIS
        ================================== */

        this.autoProcess();


        /* ==================================
           RETURN
        ================================== */

        return expense;

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

    },


    /*======================================
    RETRY
    ======================================*/

    async retry() {

        const queueList =
            await DB.getAll(
                "syncQueue"
            );


        const failedList =
            queueList.filter(
                item =>
                    item.status ===
                    "pending"
            );


        for (
            const item of failedList
        ) {

            item.status =
                "pending";


            await DB.put(
                "syncQueue",
                item
            );

        }


        await this.process();

    },


    /*======================================
    GET PENDING COUNT
    ======================================*/

    async getPendingCount() {

        const queueList =
            await DB.getAll(
                "syncQueue"
            );


        return queueList.filter(
            item =>
                item.status ===
                "pending"
        ).length;

    }

};