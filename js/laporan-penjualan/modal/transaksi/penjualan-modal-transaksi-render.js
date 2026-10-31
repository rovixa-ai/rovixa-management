const PenjualanTransaksiModalRender = {

    render(tanggal, transactions) {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof PenjualanTransaksiModalMobileRender !==
                "undefined"
            ) {

                return PenjualanTransaksiModalMobileRender.render(
                    tanggal,
                    transactions
                );

            }

            return "";

        }


        if (
            typeof PenjualanTransaksiModalDesktopRender !==
            "undefined"
        ) {

            return PenjualanTransaksiModalDesktopRender.render(
                tanggal,
                transactions
            );

        }


        return "";

    }

};