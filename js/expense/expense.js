const Expense = {

    /* ==================================
       RENDER
    ================================== */

    render() {

        return ExpenseRender.render();

    },


    /* ==================================
       INIT
    ================================== */

    async init() {

        this.setTanggal();

        this.event();

        this.updateTotal();

        await this.activateDatabaseByDate();

    },


    /* ==================================
       SET TANGGAL
    ================================== */

    setTanggal() {

        const input =
            document.getElementById(
                "expense-tanggal"
            );


        if (!input) {

            return;

        }


        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );


        input.value =
            `${year}-${month}-${day}`;

    },


    /* ==================================
       EVENT
    ================================== */

    event() {

        const tanggal =
            document.getElementById(
                "expense-tanggal"
            );


        const jumlah =
            document.getElementById(
                "expense-jumlah"
            );


        const batal =
            document.getElementById(
                "expense-batal"
            );


        const simpan =
            document.getElementById(
                "expense-simpan"
            );


        if (tanggal) {

            tanggal.addEventListener(
                "change",
                async () => {

                    await this.activateDatabaseByDate();

                }
            );

        }


        if (jumlah) {

            jumlah.addEventListener(
                "input",
                () => {

                    this.updateTotal();

                }
            );

        }


        if (batal) {

            batal.addEventListener(
                "click",
                () => {

                    Router.go(
                        "dashboard"
                    );

                }
            );

        }


        if (simpan) {

            simpan.addEventListener(
                "click",
                async () => {

                    if (simpan.disabled) {

                        return;

                    }


                    const originalText =
                        simpan.textContent;


                    simpan.disabled =
                        true;


                    simpan.textContent =
                        "Menyimpan...";


                    try {

                        await this.save();

                    }

                    finally {

                        simpan.disabled =
                            false;

                        simpan.textContent =
                            originalText;

                    }

                }
            );

        }

    },


    /* ==================================
       AKTIFKAN DATABASE BERDASARKAN
       TANGGAL
    ================================== */

    async activateDatabaseByDate() {

        const tanggal =
            document.getElementById(
                "expense-tanggal"
            )?.value;


        if (!tanggal) {

            return false;

        }


        const year =
            Number(
                tanggal.substring(
                    0,
                    4
                )
            );


        if (!year) {

            return false;

        }


        const simpan =
            document.getElementById(
                "expense-simpan"
            );


        if (simpan) {

            simpan.disabled =
                true;

        }


        try {

            const database =
                await this.ensureDatabase(
                    year
                );


            


            return true;

        }

        catch (error) {

            console.error(
                "EXPENSE DATABASE ACTIVATION ERROR:",
                error
            );


            Dialog.alert(

                "Database Expense tahun " +
                year +
                " gagal diaktifkan.\n\n" +
                error.message

            );


            return false;

        }

        finally {

            if (simpan) {

                simpan.disabled =
                    false;

            }

        }

    },


    /* ==================================
       ENSURE DATABASE
       SERVER RESOLVER
    ================================== */

    async ensureDatabase(year) {

        year =
            Number(
                year
            );


        if (!year) {

            throw new Error(
                "Tahun database Expense tidak valid."
            );

        }


        if (
            typeof API ===
            "undefined"
        ) {

            throw new Error(
                "API tidak tersedia."
            );

        }


        /* ==================================
           RESOLVE DATABASE
        ================================== */

        const response =
            await API.get(

                "resolveExpenseDatabase",

                {

                    year:
                        year

                }

            );


        


        /* ==================================
           VALIDASI RESPONSE
        ================================== */

        if (
            !response ||
            response.success !== true
        ) {

            throw new Error(

                response?.message ||

                "Database Expense gagal ditemukan atau dibuat."

            );

        }


        const spreadsheetId =
            String(
                response.expense ||
                ""
            ).trim();


        if (!spreadsheetId) {

            throw new Error(
                "Spreadsheet ID Expense tidak diterima dari server."
            );

        }


        /* ==================================
           DATABASE AKTIF
        ================================== */

        return {

            year:
                Number(
                    response.year ||
                    year
                ),

            expense:
                spreadsheetId

        };

    },


    /* ==================================
       UPDATE TOTAL
    ================================== */

    updateTotal() {

        const jumlah =
            Number(
                document.getElementById(
                    "expense-jumlah"
                )?.value
            ) || 0;


        const total =
            document.getElementById(
                "expense-total"
            );


        const grandTotal =
            document.getElementById(
                "expense-grand-total"
            );


        const formatted =
            this.formatRupiah(
                jumlah
            );


        if (total) {

            total.textContent =
                formatted;

        }


        if (grandTotal) {

            grandTotal.textContent =
                formatted;

        }

    },


    /* ==================================
       FORMAT RUPIAH
    ================================== */

    formatRupiah(value) {

        return new Intl.NumberFormat(

            "id-ID",

            {

                style:
                    "currency",

                currency:
                    "IDR",

                maximumFractionDigits:
                    0

            }

        ).format(

            Number(value) || 0

        );

    },


    /* ==================================
       SAVE
    ================================== */

    async save() {

        try {

            const tanggal =
                document.getElementById(
                    "expense-tanggal"
                )?.value;


            const kategori =
                document.getElementById(
                    "expense-kategori"
                )?.value
                    .trim();


            const keterangan =
                document.getElementById(
                    "expense-keterangan"
                )?.value
                    .trim();


            const jumlah =
                Number(
                    document.getElementById(
                        "expense-jumlah"
                    )?.value
                ) || 0;


            const metode =
                document.getElementById(
                    "expense-metode"
                )?.value;


            /* ==================================
               VALIDASI
            ================================== */

            if (!tanggal) {

               Dialog.alert(
                    "Tanggal belum diisi."
                );

                return;

            }


            if (!kategori) {

                Dialog.alert(
                    "Kategori belum diisi."
                );

                return;

            }


            if (!keterangan) {

                Dialog.alert(
                    "Keterangan belum diisi."
                );

                return;

            }


            if (jumlah <= 0) {

                Dialog.alert(
                    "Jumlah expense harus lebih dari 0."
                );

                return;

            }


            /* ==================================
               TAHUN TANGGAL
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


            /* ==================================
               PASTIKAN DATABASE TAHUN
               SUDAH AKTIF
            ================================== */

            const database =
                await this.ensureDatabase(
                    tanggalYear
                );


            if (
                !database ||
                !database.expense
            ) {

                throw new Error(

                    "Database Expense tahun " +
                    tanggalYear +
                    " tidak tersedia."

                );

            }


            /* ==================================
               PASTIKAN TAHUN AKTIF
            ================================== */

            ExpenseDatabaseConfig
                .setActiveYear(
                    tanggalYear
                );


            /* ==================================
               DATA
            ================================== */

            const data = {

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
                    "Aktif"

            };


            


            /* ==================================
               SAVE LOCAL
            ================================== */

            const expense =
                await Sync.addExpense(

                    data,

                    database

                );


            


            Dialog.alert(
                "Expense berhasil disimpan."
            );


            Router.go(
                "dashboard"
            );

        }

        catch (error) {

            console.error(
                "EXPENSE SAVE ERROR:",
                error
            );


            Dialog.alert(

                "Expense gagal disimpan.\n\n" +
                error.message

            );

        }

    }

};