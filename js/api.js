const API = {

    URL: null,

    initialized: false,

    initPromise: null,


    /* ==================================
       INITIALIZE CLIENT API
       ================================== */

    async init() {

        if (this.initialized && this.URL) {
            return this.URL;
        }

        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = (async () => {

            if (
                !window.API_CONFIG ||
                typeof window.API_CONFIG.init !== "function"
            ) {

                throw new Error(
                    "Konfigurasi pelanggan belum tersedia."
                );

            }

            await window.API_CONFIG.init();

            const scriptUrl =
                String(
                    window.API_CONFIG.SCRIPT_URL || ""
                ).trim();

            if (
                !scriptUrl ||
                !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/
                    .test(scriptUrl)
            ) {

                throw new Error(
                    "URL Web App pelanggan tidak valid."
                );

            }

            this.URL = scriptUrl;

            this.initialized = true;

            return this.URL;

        })();

        try {

            return await this.initPromise;

        } catch (error) {

            this.URL = null;

            this.initialized = false;

            this.initPromise = null;

            throw error;

        }

    },


    /* ==================================
       GET REQUEST
       ================================== */

    async get(action, params = {}) {

        const url =
            await this.init();

        const query =
            new URLSearchParams({

                action,

                ...params

            });

        const response =
            await fetch(
                `${url}?${query.toString()}`
            );

        const text =
            await response.text();

        try {

            return JSON.parse(
                text
            );

        } catch (error) {

            console.error(
                "API RESPONSE:",
                text
            );

            throw new Error(
                "Response API bukan JSON"
            );

        }

    },


    /* ==================================
       POST REQUEST
       ================================== */

    async post(data = {}) {

        const url =
            await this.init();

        const response =
            await fetch(

                url,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(
                            data
                        )

                }

            );

        const text =
            await response.text();

        try {

            return JSON.parse(
                text
            );

        } catch (error) {

            console.error(
                "API RESPONSE:",
                text
            );

            throw new Error(
                "Response API bukan JSON"
            );

        }

    },


    /* ==================================
       STORE CONFIG
       ================================== */

    saveStoreConfig(data) {

        return this.post({

            action:
                "saveStoreConfig",

            ...data

        });

    },


    /* ==================================
       USER / LOGIN KASIR
       ================================== */

    getUsers() {

        return this.get(
            "users"
        );

    },


    saveUser(data) {

        return this.post({

            action:
                "saveUser",

            ...data

        });

    },


    updateUser(data) {

        return this.post({

            action:
                "updateUser",

            ...data

        });

    },


    deleteUser(id) {

        return this.post({

            action:
                "deleteUser",

            id:
                id

        });

    },


    /* ==================================
       BARANG
       ================================== */

    getBarang() {

        return this.get(
            "barang"
        );

    },


    /* ==================================
       SATUAN
       ================================== */

    getSatuan(barang) {

        return this.get(

            "satuan",

            {
                barang
            }

        );

    },


    /* ==================================
       BOOTSTRAP
       ================================== */

    getBootstrap() {

        return this.get(
            "bootstrap"
        );

    },


    /* ==================================
       BARANG
       ================================== */

    saveBarang(data) {

        return this.post({

            action:
                "saveBarang",

            ...data

        });

    },


    /* ==================================
       SATUAN
       ================================== */

    saveSatuan(data) {

        return this.post({

            action:
                "saveSatuan",

            ...data

        });

    },


    updateSatuan(data) {

        return this.post({

            action:
                "updateSatuan",

            ...data

        });

    },


    /* ==================================
       STOK ADJUSTMENT
       ================================== */

    saveStokAdjustment(data) {

        return this.post({

            action:
                "saveStokAdjustment",

            ...data

        });

    },


    /* ==================================
       UPDATE BARANG
       ================================== */

    updateBarang(data) {

        return this.post({

            action:
                "updateBarang",

            ...data

        });

    },


    /* ==================================
       PEMBELIAN
       ================================== */

    savePembelian(data) {

        return this.post({

            action:
                "savePembelian",

            ...data

        });

    },


    /* ==================================
       EXPENSE DATABASE
       ================================== */

    createExpenseDatabaseSpreadsheet(year) {

        return this.post({

            action:
                "createExpenseDatabaseSpreadsheet",

            year:
                year

        });

    },


    checkExpenseDatabaseSpreadsheet(
        year,
        expense
    ) {

        return this.post({

            action:
                "checkExpenseDatabaseSpreadsheet",

            year:
                year,

            expense:
                expense

        });

    },


    findExpenseDatabaseSpreadsheet(year) {

        return this.post({

            action:
                "findExpenseDatabaseSpreadsheet",

            year:
                year

        });

    },


    saveExpense(data) {

        return this.post({

            action:
                "saveExpense",

            ...data

        });

    },


    /* ==================================
       DOWNLOAD PENJUALAN
       ================================== */

    getDownloadPenjualan(database) {

        return this.get(
            "downloadPenjualan",
            {

                year:
                    database.year,

                penjualanId:
                    database.penjualan,

                detailPenjualanId:
                    database.detailPenjualan,

                pembayaranId:
                    database.pembayaran

            }
        );

    },


    /* ==================================
       DOWNLOAD PEMBELIAN
       ================================== */

    getDownloadPembelian(database) {

        return this.get(
            "downloadPembelian",
            {

                year:
                    database.year,

                pembelianId:
                    database.pembelian,

                detailPembelianId:
                    database.detailPembelian,

                pembayaranId:
                    database.pembayaran

            }
        );

    },


    /* ==================================
       LAPORAN PEMBELIAN PDF
       ================================== */

    getLaporanPembelianPdf() {

        return this.get(
            "getLaporanPembelianPdf"
        );

    },


    printLaporanPembelianBulanan(data = {}) {

        return this.post({

            action:
                "printLaporanPembelianBulanan",

            bulan:
                data.bulan,

            tahun:
                data.tahun,

            supplier:
                data.supplier || "",

            database: {

                year:
                    data.database?.year,

                pembelianId:
                    data.database?.pembelian,

                detailPembelianId:
                    data.database?.detailPembelian,

                pembayaranId:
                    data.database?.pembayaran

            }

        });

    },


    printLaporanPenjualanBulanan(data = {}) {

        return this.post({

            action:
                "printLaporanPenjualanBulanan",

            bulan:
                data.bulan,

            tahun:
                data.tahun,

            kasir:
                data.kasir || "",

            database: {

                year:
                    data.database?.year,

                penjualanId:
                    data.database?.penjualan,

                detailPenjualanId:
                    data.database?.detailPenjualan,

                pembayaranId:
                    data.database?.pembayaran

            }

        });

    },


    getLaporanPenjualanPdf() {

        return this.get(
            "getLaporanPenjualanPdf"
        );

    },


    /* ==================================
       DOWNLOAD EXPENSE
       ================================== */

    getDownloadExpense(database) {

        database =
            database || {};

        return this.get(
            "downloadExpense",
            {

                year:
                    database.year,

                expenseId:
                    database.expenseId

            }
        );

    }

};