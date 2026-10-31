const LaporanExpenseSummary = {


    /* ======================================
       RENDER SUMMARY
    ====================================== */

    render(
        summary
    ) {

        summary =
            summary || {};


        this.setText(
            "laporanExpenseTotalTransaksi",
            Number(
                summary.totalTransaksi
            ) || 0
        );


        this.setText(
            "laporanExpenseTotal",
            this.formatRupiah(
                summary.totalExpense
            )
        );


        this.setText(
            "laporanExpenseCash",
            this.formatRupiah(
                summary.cash
            )
        );


        this.setText(
            "laporanExpenseTransfer",
            this.formatRupiah(
                summary.transfer
            )
        );


        this.setText(
            "laporanExpenseQRIS",
            this.formatRupiah(
                summary.qris
            )
        );


        this.setText(
            "laporanExpenseKartu",
            this.formatRupiah(
                summary.kartu
            )
        );

    },


    /* ======================================
       RESET SUMMARY
    ====================================== */

    reset() {

        this.setText(
            "laporanExpenseTotalTransaksi",
            0
        );


        this.setText(
            "laporanExpenseTotal",
            this.formatRupiah(
                0
            )
        );


        this.setText(
            "laporanExpenseCash",
            this.formatRupiah(
                0
            )
        );


        this.setText(
            "laporanExpenseTransfer",
            this.formatRupiah(
                0
            )
        );


        this.setText(
            "laporanExpenseQRIS",
            this.formatRupiah(
                0
            )
        );


        this.setText(
            "laporanExpenseKartu",
            this.formatRupiah(
                0
            )
        );

    },


    /* ======================================
       SET TEXT
    ====================================== */

    setText(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );


        if (!element) {

            return;

        }


        element.textContent =
            value;

    },


    /* ======================================
       FORMAT RUPIAH
    ====================================== */

    formatRupiah(
        value
    ) {

        const number =
            Number(
                value
            ) || 0;


        return (
            "Rp " +
            number.toLocaleString(
                "id-ID"
            )
        );

    }

};
