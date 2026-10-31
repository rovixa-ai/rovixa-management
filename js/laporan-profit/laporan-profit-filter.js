const LaporanProfitFilter = {

    init() {

        const tanggalInput =
            document.getElementById(
                "laporanProfitTanggal"
            );

        const kasirInput =
            document.getElementById(
                "laporanProfitKasir"
            );

        const resetButton =
            document.getElementById(
                "laporanProfitResetButton"
            );


        /*
        ======================================
        DEFAULT BULAN
        ======================================
        */

        if (
            tanggalInput &&
            !tanggalInput.value
        ) {

            const now =
                new Date();

            const tahun =
                now.getFullYear();

            const bulan =
                String(
                    now.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );

            tanggalInput.value =
                `${tahun}-${bulan}`;

        }


        /*
        ======================================
        PERIODE
        LANGSUNG UPDATE DATA
        ======================================
        */

        if (tanggalInput) {

            tanggalInput.addEventListener(
                "change",
                async () => {

                    LaporanProfit.filter.tanggal =
                        tanggalInput.value;

                    await LaporanProfit.load();

                }
            );

        }


        /*
        ======================================
        KASIR
        LANGSUNG UPDATE DATA
        ======================================
        */

        if (kasirInput) {

            kasirInput.addEventListener(
                "change",
                async () => {

                    LaporanProfit.filter.kasir =
                        kasirInput.value;

                    await LaporanProfit.load();

                }
            );

        }


        /*
        ======================================
        RESET BUTTON
        ======================================
        */

        if (resetButton) {

            resetButton.addEventListener(
                "click",
                async () => {

                    const now =
                        new Date();

                    const tahun =
                        now.getFullYear();

                    const bulan =
                        String(
                            now.getMonth() + 1
                        ).padStart(
                            2,
                            "0"
                        );

                    const periode =
                        `${tahun}-${bulan}`;


                    if (tanggalInput) {

                        tanggalInput.value =
                            periode;

                    }


                    if (kasirInput) {

                        kasirInput.value =
                            "";

                    }


                    LaporanProfit.filter = {

                        tanggal:
                            periode,

                        kasir:
                            ""

                    };


                    await LaporanProfit.load();

                }
            );

        }


        /*
        ======================================
        UPDATE KASIR AWAL
        ======================================
        */

        this.updateKasirOptions(
            [],
            ""
        );

    },


    updateKasirOptions(
        transactions = [],
        selectedKasir = ""
    ) {

        const kasirInput =
            document.getElementById(
                "laporanProfitKasir"
            );

        if (!kasirInput) {
            return;
        }


        /*
        ======================================
        SIMPAN KASIR UNIK
        ======================================
        */

        const kasirSet =
            new Set();


        transactions.forEach(
            row => {

                const kasir =
                    String(
                        row.kasir || ""
                    ).trim();

                if (kasir) {

                    kasirSet.add(
                        kasir
                    );

                }

            }
        );


        const kasirList =
            Array.from(
                kasirSet
            ).sort(
                (a, b) =>
                    a.localeCompare(
                        b
                    )
            );


        /*
        ======================================
        RENDER OPTION
        ======================================
        */

        kasirInput.innerHTML = "";


        const allOption =
            document.createElement(
                "option"
            );

        allOption.value = "";

        allOption.textContent =
            "Semua Kasir";

        kasirInput.appendChild(
            allOption
        );


        kasirList.forEach(
            kasir => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    kasir;

                option.textContent =
                    kasir;

                kasirInput.appendChild(
                    option
                );

            }
        );


        /*
        ======================================
        KEMBALIKAN SELECTION
        ======================================
        */

        if (
            selectedKasir &&
            kasirList.includes(
                selectedKasir
            )
        ) {

            kasirInput.value =
                selectedKasir;

        } else {

            kasirInput.value =
                "";

        }

    }

};