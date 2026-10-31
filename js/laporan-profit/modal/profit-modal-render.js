const LaporanProfitModalRender = {

    render(tanggal, transactions) {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof LaporanProfitModalMobileRender !==
                "undefined"
            ) {

                return LaporanProfitModalMobileRender.render(
                    tanggal,
                    transactions
                );

            }

            return "";

        }


        if (
            typeof LaporanProfitModalDesktopRender !==
            "undefined"
        ) {

            return LaporanProfitModalDesktopRender.render(
                tanggal,
                transactions
            );

        }


        return "";

    }

};