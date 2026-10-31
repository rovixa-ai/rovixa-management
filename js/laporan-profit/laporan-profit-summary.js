const LaporanProfitSummary = {

    render() {

        const data =
            LaporanProfit.filtered ||
            [];

        let totalPenjualan = 0;
        let totalHpp = 0;
        let totalGrossProfit = 0;
        let totalExpense = 0;
        let totalNetProfit = 0;


        data.forEach(row => {

            totalPenjualan +=
                Number(
                    row.penjualan
                ) || 0;

            totalHpp +=
                Number(
                    row.hpp
                ) || 0;

            totalGrossProfit +=
                Number(
                    row.grossProfit
                ) || 0;

            totalExpense +=
                Number(
                    row.expense
                ) || 0;

            totalNetProfit +=
                Number(
                    row.netProfit
                ) || 0;

        });


        /*
        ======================================
        TOTAL PENJUALAN
        ======================================
        */

        const totalPenjualanElement =
            document.getElementById(
                "laporanProfitTotalPenjualan"
            );

        if (totalPenjualanElement) {

            totalPenjualanElement.textContent =
                this.formatCurrency(
                    totalPenjualan
                );

        }


        /*
        ======================================
        TOTAL HPP
        ======================================
        */

        const totalHppElement =
            document.getElementById(
                "laporanProfitTotalHpp"
            );

        if (totalHppElement) {

            totalHppElement.textContent =
                this.formatCurrency(
                    totalHpp
                );

        }


        /*
        ======================================
        GROSS PROFIT
        ======================================
        */

        const grossProfitElement =
            document.getElementById(
                "laporanProfitGrossProfit"
            );

        if (grossProfitElement) {

            grossProfitElement.textContent =
                this.formatCurrency(
                    totalGrossProfit
                );

        }


        /*
        ======================================
        TOTAL EXPENSE
        ======================================
        */

        const totalExpenseElement =
            document.getElementById(
                "laporanProfitTotalExpense"
            );

        if (totalExpenseElement) {

            totalExpenseElement.textContent =
                this.formatCurrency(
                    totalExpense
                );

        }


        /*
        ======================================
        NET PROFIT
        ======================================
        */

        const totalNetProfitElement =
            document.getElementById(
                "laporanProfitNetProfit"
            );

        if (totalNetProfitElement) {

            totalNetProfitElement.textContent =
                this.formatCurrency(
                    totalNetProfit
                );

        }

    },


    formatCurrency(value) {

        const number =
            Number(value) || 0;

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        ).format(number);

    }

};