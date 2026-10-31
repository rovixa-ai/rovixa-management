const Download = {

    async bootstrap() {

        try {

           


            /* ======================================
               MASTER DATABASE
            ====================================== */

            const data =
                StoreConfig.bootstrapData ||
                {};


            


            const barang =
                Array.isArray(
                    data.barang
                )
                    ? data.barang
                    : [];


            const satuan =
                Array.isArray(
                    data.satuan
                )
                    ? data.satuan
                    : [];


            await DB.replaceAll(
                "barang",
                barang
            );


            await DB.replaceAll(
                "satuan",
                satuan
            );


            


            /* ======================================
               DATABASE YEAR
               SERVER RESOLVER
            ====================================== */

            const penjualanYear =
                DatabaseConfig
                    .getActiveYear();


            


            if (!penjualanYear) {

                throw new Error(
                    "Tahun Penjualan tidak valid."
                );

            }


            const pembelianYear =
                PembelianDatabaseConfig
                    .getActiveYear();


            


            if (!pembelianYear) {

                throw new Error(
                    "Tahun Pembelian tidak valid."
                );

            }


            const expenseYear =
                ExpenseDatabaseConfig
                    .getActiveYear();


           


            if (!expenseYear) {

                throw new Error(
                    "Tahun Expense tidak valid."
                );

            }


            /* ======================================
               RESOLVE DATABASE
               PARALEL
            ====================================== */

            


            const [
                penjualanDatabase,
                pembelianDatabase,
                expenseDatabase
            ] =
                await Promise.all([

                    API.get(
                        "resolvePenjualanDatabase",
                        {
                            year:
                                penjualanYear
                        }
                    ),

                    API.get(
                        "resolvePembelianDatabase",
                        {
                            year:
                                pembelianYear
                        }
                    ),

                    API.get(
                        "resolveExpenseDatabase",
                        {
                            year:
                                expenseYear
                        }
                    )

                ]);


            /* ======================================
               VALIDASI DATABASE PENJUALAN
            ====================================== */

            


            if (
                !penjualanDatabase ||
                penjualanDatabase.success !==
                    true
            ) {

                throw new Error(
                    penjualanDatabase &&
                    penjualanDatabase.message

                        ? penjualanDatabase.message

                        : "Database Penjualan gagal ditemukan atau dibuat."
                );

            }


            if (
                !penjualanDatabase.penjualan ||
                !penjualanDatabase.detailPenjualan ||
                !penjualanDatabase.pembayaran
            ) {

                throw new Error(
                    "Database Penjualan tidak lengkap."
                );

            }


            /* ======================================
               VALIDASI DATABASE PEMBELIAN
            ====================================== */

            


            if (
                !pembelianDatabase ||
                pembelianDatabase.success !==
                    true
            ) {

                throw new Error(
                    pembelianDatabase &&
                    pembelianDatabase.message

                        ? pembelianDatabase.message

                        : "Database Pembelian gagal ditemukan atau dibuat."
                );

            }


            if (
                !pembelianDatabase.pembelian ||
                !pembelianDatabase.detailPembelian ||
                !pembelianDatabase.pembayaran
            ) {

                throw new Error(
                    "Database Pembelian tidak lengkap."
                );

            }


            /* ======================================
               VALIDASI DATABASE EXPENSE
            ====================================== */

            

            if (
                !expenseDatabase ||
                expenseDatabase.success !==
                    true
            ) {

                throw new Error(
                    expenseDatabase &&
                    expenseDatabase.message

                        ? expenseDatabase.message

                        : "Database Expense gagal ditemukan atau dibuat."
                );

            }


            if (
                !expenseDatabase.expense
            ) {

                throw new Error(
                    "Database Expense tidak lengkap."
                );

            }


            /* ======================================
               DATABASE OBJECT
            ====================================== */

            const database = {

                year:
                    Number(
                        penjualanDatabase.year ||
                        penjualanYear
                    ),

                penjualan:
                    String(
                        penjualanDatabase.penjualan ||
                        ""
                    ).trim(),

                detailPenjualan:
                    String(
                        penjualanDatabase.detailPenjualan ||
                        ""
                    ).trim(),

                pembayaran:
                    String(
                        penjualanDatabase.pembayaran ||
                        ""
                    ).trim()

            };


            const pembelianDatabaseConfig = {

                year:
                    Number(
                        pembelianDatabase.year ||
                        pembelianYear
                    ),

                pembelian:
                    String(
                        pembelianDatabase.pembelian ||
                        ""
                    ).trim(),

                detailPembelian:
                    String(
                        pembelianDatabase.detailPembelian ||
                        ""
                    ).trim(),

                pembayaran:
                    String(
                        pembelianDatabase.pembayaran ||
                        ""
                    ).trim()

            };


            const expenseDatabaseConfig = {

                year:
                    Number(
                        expenseDatabase.year ||
                        expenseYear
                    ),

                expense:
                    String(
                        expenseDatabase.expense ||
                        ""
                    ).trim()

            };


           


            /* ======================================
               DOWNLOAD DATABASE TRANSAKSI
               PARALEL
            ====================================== */

            


            const [
                penjualanResponse,
                pembelianResponse,
                expenseResponse
            ] =
                await Promise.all([

                    API.getDownloadPenjualan(
                        database
                    ),

                    API.getDownloadPembelian(
                        pembelianDatabaseConfig
                    ),

                    API.getDownloadExpense({

                        year:
                            expenseDatabaseConfig.year,

                        expenseId:
                            expenseDatabaseConfig.expense

                    })

                ]);


            /* ======================================
               VALIDASI PENJUALAN
            ====================================== */

            

            if (
                !penjualanResponse ||
                !penjualanResponse.success
            ) {

                throw new Error(
                    penjualanResponse &&
                    penjualanResponse.message

                        ? penjualanResponse.message

                        : "Gagal mengambil data Penjualan."
                );

            }


            /* ======================================
               DATA PENJUALAN
            ====================================== */

            const penjualanData =
                penjualanResponse.data || {};


            const penjualan =
                Array.isArray(
                    penjualanData.penjualan
                )
                    ? penjualanData.penjualan
                    : [];


            const detailPenjualan =
                Array.isArray(
                    penjualanData.detailPenjualan
                )
                    ? penjualanData.detailPenjualan
                    : [];


            const pembayaranPenjualan =
                Array.isArray(
                    penjualanData.pembayaranPenjualan
                )
                    ? penjualanData.pembayaranPenjualan
                    : [];


            await DB.replaceAll(
                "penjualan",
                penjualan
            );


            await DB.replaceAll(
                "detailPenjualan",
                detailPenjualan
            );


            await DB.replaceAll(
                "pembayaranPenjualan",
                pembayaranPenjualan
            );


           


            /* ======================================
               VALIDASI PEMBELIAN
            ====================================== */

            


            if (
                !pembelianResponse ||
                !pembelianResponse.success
            ) {

                throw new Error(
                    pembelianResponse &&
                    pembelianResponse.message

                        ? pembelianResponse.message

                        : "Gagal mengambil data Pembelian."
                );

            }


            /* ======================================
               DATA PEMBELIAN
            ====================================== */

            const pembelianData =
                pembelianResponse.data || {};


            const pembelian =
                Array.isArray(
                    pembelianData.pembelian
                )
                    ? pembelianData.pembelian
                    : [];


            const detailPembelian =
                Array.isArray(
                    pembelianData.detailPembelian
                )
                    ? pembelianData.detailPembelian
                    : [];


            const pembayaranPembelian =
                Array.isArray(
                    pembelianData.pembayaranPembelian
                )
                    ? pembelianData.pembayaranPembelian
                    : [];


            await DB.replaceAll(
                "pembelian",
                pembelian
            );


            await DB.replaceAll(
                "detailPembelian",
                detailPembelian
            );


            await DB.replaceAll(
                "pembayaranPembelian",
                pembayaranPembelian
            );


            


            /* ======================================
               VALIDASI EXPENSE
            ====================================== */

            


            if (
                !expenseResponse ||
                !expenseResponse.success
            ) {

                throw new Error(
                    expenseResponse &&
                    expenseResponse.message

                        ? expenseResponse.message

                        : "Gagal mengambil data Expense."
                );

            }


            /* ======================================
               DATA EXPENSE
            ====================================== */

            const expenseData =
                expenseResponse.data || {};


            const expense =
                Array.isArray(
                    expenseData.expense
                )
                    ? expenseData.expense
                    : [];


            /*
             * Data dari Spreadsheet menggunakan
             * spreadsheetId sebagai ID transaksi.
             *
             * IndexedDB tetap membutuhkan
             * id sebagai primary key.
             *
             * Karena data download tidak memiliki
             * local id, buat local id baru.
             */

            const expenseLocal =
                expense.map(
                    item => {

                        return {

                            id:
                                "LOCAL-EXP-" +
                                Date.now() +
                                "-" +
                                Math.random()
                                    .toString(36)
                                    .slice(2, 10),

                            spreadsheetId:
                                String(
                                    item.spreadsheetId ||
                                    ""
                                ).trim(),

                            tanggal:
                                item.tanggal || "",

                            kategori:
                                item.kategori || "",

                            keterangan:
                                item.keterangan || "",

                            jumlah:
                                Number(
                                    item.jumlah
                                ) || 0,

                            metode:
                                item.metode || "",

                            status:
                                item.status || "Aktif",

                            syncStatus:
                                "synced",

                            syncedAt:
                                new Date()
                                    .toISOString(),

                            database: {

                                year:
                                    Number(
                                        expenseDatabaseConfig.year
                                    ),

                                expense:
                                    expenseDatabaseConfig.expense

                            }

                        };

                    }
                );


            await DB.replaceAll(
                "expense",
                expenseLocal
            );


            

            /* ======================================
               LAST BOOTSTRAP
            ====================================== */

            await DB.put(
                "config",
                {

                    key:
                        "lastBootstrap",

                    value:
                        new Date()
                            .toISOString()

                }
            );


            


            return {

                success:
                    true,

                barang:
                    barang.length,

                satuan:
                    satuan.length,

                penjualan:
                    penjualan.length,

                detailPenjualan:
                    detailPenjualan.length,

                pembayaranPenjualan:
                    pembayaranPenjualan.length,

                pembelian:
                    pembelian.length,

                detailPembelian:
                    detailPembelian.length,

                pembayaranPembelian:
                    pembayaranPembelian.length,

                expense:
                    expenseLocal.length

            };

        }


        catch (error) {

            console.error(
                "BOOTSTRAP DOWNLOAD ERROR:",
                error
            );


            return {

                success:
                    false,

                message:
                    error.message

            };

        }

    }

};