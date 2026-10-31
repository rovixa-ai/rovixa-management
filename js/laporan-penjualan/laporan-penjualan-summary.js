Object.assign(LaporanPenjualan, {

    resetSummary() {

        this.setText(
            "laporanPenjualanTotalTransaksi",
            "0"
        );

        this.setText(
            "laporanPenjualanTotalItem",
            "0"
        );

        this.setText(
            "laporanPenjualanSubtotal",
            "Rp 0"
        );

        this.setText(
            "laporanPenjualanDiscount",
            "Rp 0"
        );

        this.setText(
            "laporanPenjualanTotal",
            "Rp 0"
        );

        this.setText(
            "laporanPenjualanCash",
            "Rp 0"
        );

        this.setText(
            "laporanPenjualanQRIS",
            "Rp 0"
        );

        this.setText(
            "laporanPenjualanDebit",
            "Rp 0"
        );

        this.setText(
            "laporanPenjualanTransfer",
            "Rp 0"
        );

        this.setText(
            "laporanPenjualanTotalPayment",
            "Rp 0"
        );

    },


    renderSummary(summary = {}) {

        this.setText(
            "laporanPenjualanTotalTransaksi",
            this.number(
                summary.totalTransaksi || 0
            )
        );


        this.setText(
            "laporanPenjualanTotalItem",
            this.number(
                summary.totalItem || 0
            )
        );


        this.setText(
            "laporanPenjualanSubtotal",
            this.money(
                summary.subtotal || 0
            )
        );


        this.setText(
            "laporanPenjualanDiscount",
            this.money(
                summary.discount || 0
            )
        );


        this.setText(
            "laporanPenjualanTotal",
            this.money(
                summary.total || 0
            )
        );


        this.setText(
            "laporanPenjualanCash",
            this.money(
                summary.cash || 0
            )
        );


        this.setText(
            "laporanPenjualanQRIS",
            this.money(
                summary.qris || 0
            )
        );


        this.setText(
            "laporanPenjualanDebit",
            this.money(
                summary.debit || 0
            )
        );


        this.setText(
            "laporanPenjualanTransfer",
            this.money(
                summary.transfer || 0
            )
        );


        this.setText(
            "laporanPenjualanTotalPayment",
            this.money(
                summary.totalPayment || 0
            )
        );

    }

});