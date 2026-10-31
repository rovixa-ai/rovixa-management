const LaporanExpenseFilter = {


    /* ======================================
       EVENT
    ====================================== */

    event() {

        const bulan =
            document.getElementById(
                "laporanExpenseTanggal"
            );


        const kategori =
            document.getElementById(
                "laporanExpenseKategori"
            );


        const metode =
            document.getElementById(
                "laporanExpenseMetode"
            );


        const reset =
            document.getElementById(
                "laporanExpenseResetButton"
            );


        if (bulan) {

            bulan.addEventListener(
                "change",
                () => {

                    this.filter();

                }
            );

        }


        if (kategori) {

            kategori.addEventListener(
                "change",
                () => {

                    this.filter();

                }
            );

        }


        if (metode) {

            metode.addEventListener(
                "change",
                () => {

                    this.filter();

                }
            );

        }


        if (reset) {

            reset.addEventListener(
                "click",
                () => {

                    this.reset();

                }
            );

        }

    },


    /* ======================================
       LOAD KATEGORI
    ====================================== */

    loadKategori() {

        const select =
            document.getElementById(
                "laporanExpenseKategori"
            );


        if (!select) {

            return;

        }


        const currentValue =
            select.value;


        const kategoriSet =
            new Set();


        LaporanExpense.data.forEach(
            expense => {

                const kategori =
                    String(
                        expense.kategori || ""
                    ).trim();


                if (kategori) {

                    kategoriSet.add(
                        kategori
                    );

                }

            }
        );


        const kategoriList =
            Array.from(
                kategoriSet
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    a.localeCompare(
                        b
                    )
            );


        select.innerHTML = `

            <option value="">
                Semua Kategori
            </option>

        `;


        kategoriList.forEach(
            kategori => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    kategori;


                option.textContent =
                    kategori;


                select.appendChild(
                    option
                );

            }
        );


        if (
            kategoriList.includes(
                currentValue
            )
        ) {

            select.value =
                currentValue;

        }

    },


    /* ======================================
       FILTER BULANAN
    ====================================== */

    async filter() {

        const bulanInput =
            document.getElementById(
                "laporanExpenseTanggal"
            );


        const kategoriInput =
            document.getElementById(
                "laporanExpenseKategori"
            );


        const metodeInput =
            document.getElementById(
                "laporanExpenseMetode"
            );


        /* ======================================
           VALIDASI BULAN
        ====================================== */

        if (
            !bulanInput ||
            !bulanInput.value
        ) {

            Dialog.error(
                "Silakan pilih bulan."
            );

            return;

        }


        const parts =
            bulanInput.value.split(
                "-"
            );


        if (
            parts.length !== 2
        ) {

            Dialog.error(
                "Bulan laporan tidak valid."
            );

            return;

        }


        const tahun =
            Number(
                parts[0]
            );


        const bulan =
            Number(
                parts[1]
            );


        if (
            !tahun ||
            !bulan ||
            bulan < 1 ||
            bulan > 12
        ) {

            Dialog.error(
                "Bulan dan tahun laporan tidak valid."
            );

            return;

        }


        /* ======================================
           FILTER KATEGORI
        ====================================== */

        const selectedKategori =
            kategoriInput
                ? kategoriInput.value
                : "";


        /* ======================================
           FILTER METODE
        ====================================== */

        const selectedMetode =
            metodeInput
                ? metodeInput.value
                : "";


        /* ======================================
           LOADING GLOBAL
        ====================================== */

        Loading.show(
            "Mengambil dan memproses data expense...",
            "Memuat Laporan Expense"
        );


        try {

            /* ==================================
               LOAD DATA LOCAL
            ================================== */

            const expense =
                await DB.getAll(
                    "expense"
                );


            


            /* ==================================
               FILTER EXPENSE
            ================================== */

            const transactions =
                expense

                    .filter(
                        row => {

                            const tanggal =
                                String(
                                    row.tanggal || ""
                                ).trim();


                            if (!tanggal) {

                                return false;

                            }


                            const date =
                                new Date(
                                    tanggal
                                );


                            if (
                                isNaN(
                                    date.getTime()
                                )
                            ) {

                                return false;

                            }


                            const rowYear =
                                date.getFullYear();


                            const rowMonth =
                                date.getMonth() + 1;


                            if (
                                rowYear !==
                                tahun
                            ) {

                                return false;

                            }


                            if (
                                rowMonth !==
                                bulan
                            ) {

                                return false;

                            }


                            const kategori =
                                String(
                                    row.kategori || ""
                                ).trim();


                            if (
                                selectedKategori &&
                                kategori !==
                                selectedKategori
                            ) {

                                return false;

                            }


                            const metode =
                                String(
                                    row.metode || ""
                                ).trim();


                            if (
                                selectedMetode &&
                                metode !==
                                selectedMetode
                            ) {

                                return false;

                            }


                            return true;

                        }
                    )

                    .map(
                        row => {

                            const tanggal =
                                String(
                                    row.tanggal || ""
                                );


                            const date =
                                new Date(
                                    tanggal
                                );


                            return {

                                id:
                                    String(
                                        row.id || ""
                                    ).trim(),

                                spreadsheetId:
                                    String(
                                        row.spreadsheetId || ""
                                    ).trim(),

                                tanggal:
                                    tanggal,

                                kategori:
                                    String(
                                        row.kategori || ""
                                    ).trim(),

                                keterangan:
                                    String(
                                        row.keterangan || ""
                                    ).trim(),

                                jumlah:
                                    Number(
                                        row.jumlah
                                    ) || 0,

                                metode:
                                    String(
                                        row.metode || ""
                                    ).trim(),

                                status:
                                    String(
                                        row.status || ""
                                    ).trim(),

                                jam:
                                    isNaN(
                                        date.getTime()
                                    )
                                        ? ""
                                        : date
                                            .toTimeString()
                                            .substring(
                                                0,
                                                5
                                            )

                            };

                        }
                    );


            /* ==================================
               SUMMARY
            ================================== */

            let totalExpense =
                0;


            let totalCash =
                0;


            let totalTransfer =
                0;


            let totalQRIS =
                0;


            let totalKartu =
                0;


            transactions.forEach(
                transaction => {

                    const jumlah =
                        Number(
                            transaction.jumlah
                        ) || 0;


                    totalExpense +=
                        jumlah;


                    const metode =
                        String(
                            transaction.metode || ""
                        )
                            .trim()
                            .toLowerCase();


                    if (
                        metode ===
                        "cash"
                    ) {

                        totalCash +=
                            jumlah;

                    }

                    else if (
                        metode ===
                        "transfer"
                    ) {

                        totalTransfer +=
                            jumlah;

                    }

                    else if (
                        metode ===
                        "qris"
                    ) {

                        totalQRIS +=
                            jumlah;

                    }

                    else if (
                        metode ===
                        "kartu"
                    ) {

                        totalKartu +=
                            jumlah;

                    }

                }
            );


            const totalPayment =
                totalCash +
                totalTransfer +
                totalQRIS +
                totalKartu;


            /* ==================================
               SUMMARY OBJECT
            ================================== */

            const summary = {

                totalTransaksi:
                    transactions.length,

                totalExpense:
                    totalExpense,

                cash:
                    totalCash,

                transfer:
                    totalTransfer,

                qris:
                    totalQRIS,

                kartu:
                    totalKartu,

                totalPayment:
                    totalPayment

            };


            /* ==================================
               DAILY
            ================================== */

            const dailyMap =
                new Map();


            transactions.forEach(
                transaction => {

                    const date =
                        new Date(
                            transaction.tanggal
                        );


                    if (
                        isNaN(
                            date.getTime()
                        )
                    ) {

                        return;

                    }


                    const tanggal =
                        date
                            .toISOString()
                            .substring(
                                0,
                                10
                            );


                    if (
                        !dailyMap.has(
                            tanggal
                        )
                    ) {

                        dailyMap.set(
                            tanggal,
                            {

                                tanggal:
                                    tanggal,

                                totalTransaksi:
                                    0,

                                total:
                                    0,

                                cash:
                                    0,

                                transfer:
                                    0,

                                qris:
                                    0,

                                kartu:
                                    0,

                                transactions:
                                    []

                            }
                        );

                    }


                    const day =
                        dailyMap.get(
                            tanggal
                        );


                    const jumlah =
                        Number(
                            transaction.jumlah
                        ) || 0;


                    day.totalTransaksi +=
                        1;


                    day.total +=
                        jumlah;


                    const metode =
                        String(
                            transaction.metode || ""
                        )
                            .trim()
                            .toLowerCase();


                    if (
                        metode ===
                        "cash"
                    ) {

                        day.cash +=
                            jumlah;

                    }

                    else if (
                        metode ===
                        "transfer"
                    ) {

                        day.transfer +=
                            jumlah;

                    }

                    else if (
                        metode ===
                        "qris"
                    ) {

                        day.qris +=
                            jumlah;

                    }

                    else if (
                        metode ===
                        "kartu"
                    ) {

                        day.kartu +=
                            jumlah;

                    }


                    day.transactions.push(
                        transaction
                    );

                }
            );


            const daily =
                Array.from(
                    dailyMap.values()
                )
                .sort(
                    (
                        a,
                        b
                    ) =>
                        a.tanggal.localeCompare(
                            b.tanggal
                        )
                );


            /* ==================================
               REPORT
            ================================== */

            const report = {

                success:
                    true,

                filter: {

                    tahun:
                        tahun,

                    bulan:
                        bulan,

                    kategori:
                        selectedKategori,

                    metode:
                        selectedMetode

                },

                summary:
                    summary,

                transactions:
                    transactions,

                daily:
                    daily

            };


            /* ==================================
               SIMPAN REPORT
            ================================== */

            LaporanExpense.report =
                report;


            LaporanExpense.data =
                report;


            LaporanExpense.filtered =
                transactions;


            /* ==================================
               SUMMARY
            ================================== */

            LaporanExpenseSummary
                .render(
                    summary
                );


            /* ==================================
               TABLE
            ================================== */

            LaporanExpenseTable
                .render(
                    transactions
                );

        }

        catch (error) {

            console.error(
                "LaporanExpenseFilter.filter:",
                error
            );


            LaporanExpense.data =
                null;


            LaporanExpense.report =
                null;


            LaporanExpense.filtered =
                [];


            LaporanExpenseSummary
                .reset();


            LaporanExpenseTable
                .render(
                    []
                );


            Dialog.error(
                error.message ||
                "Gagal memuat laporan expense."
            );

        }

        finally {

            Loading.hide();

        }

    },


    /* ======================================
       RESET
    ====================================== */

    reset() {

        const bulan =
            document.getElementById(
                "laporanExpenseTanggal"
            );


        const kategori =
            document.getElementById(
                "laporanExpenseKategori"
            );


        const metode =
            document.getElementById(
                "laporanExpenseMetode"
            );


        if (bulan) {

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


            bulan.value =
                year +
                "-" +
                month;

        }


        if (kategori) {

            kategori.value =
                "";

        }


        if (metode) {

            metode.value =
                "";

        }


        this.filter();

    }

};