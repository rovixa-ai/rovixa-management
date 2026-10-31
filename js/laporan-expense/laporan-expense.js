const LaporanExpense = {

    data: [],

    filtered: [],

    report: null,


    /* ======================================
       RENDER
    ====================================== */

    render() {

        return LaporanExpenseRender.render();

    },


    /* ======================================
       INIT
    ====================================== */

    async init() {

        this.event();

        await this.load();

    },


    /* ======================================
       EVENT
    ====================================== */

    event() {

        LaporanExpenseFilter.event();

    },


    /* ======================================
       LOAD
    ====================================== */

    async load() {

        try {

            const data =
                await DB.getAll(
                    "expense"
                );


            this.data =
                Array.isArray(data)
                    ? data
                    : [];


            /* ==============================
               KATEGORI
            ============================== */

            LaporanExpenseFilter
                .loadKategori();


            /* ==============================
               DEFAULT BULAN
            ============================== */

            const tanggal =
                document.getElementById(
                    "laporanExpenseTanggal"
                );


            if (tanggal) {

                const today =
                    new Date();


                const year =
                    today.getFullYear();


                const month =
                    String(
                        today.getMonth() + 1
                    )
                    .padStart(
                        2,
                        "0"
                    );


                tanggal.value =
                    year +
                    "-" +
                    month;

            }


            /* ==============================
               FILTER AWAL
            ============================== */

            await LaporanExpenseFilter
                .filter();

        }
        catch (error) {

            console.error(
                "LAPORAN EXPENSE LOAD ERROR:",
                error
            );


            this.data = [];

            this.report = null;

            this.filtered = [];


            LaporanExpenseSummary
                .reset();


            LaporanExpenseTable
                .render([]);

        }

    },


    /* ======================================
       LOADING
    ====================================== */

    setLoading(
        loading
    ) {

        const button =
            document.getElementById(
                "laporanExpenseFilterButton"
            );


        if (!button) {

            return;

        }


        if (loading) {

            button.disabled = true;

            button.textContent =
                "Memuat...";

        }
        else {

            button.disabled = false;

            button.textContent =
                "Filter";

        }

    }

};
