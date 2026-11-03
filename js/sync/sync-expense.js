
/*======================================
ROVIXA POS
SYNC EXPENSE
======================================*/

Object.assign(Sync, {


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

    }

});
