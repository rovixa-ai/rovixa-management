const LaporanProfitDetailModalRender = {

    render(transaction) {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof LaporanProfitDetailModalMobileRender !==
                "undefined"
            ) {

                return LaporanProfitDetailModalMobileRender.render(
                    transaction
                );

            }

            return "";

        }


        if (
            typeof LaporanProfitDetailModalDesktopRender !==
            "undefined"
        ) {

            return LaporanProfitDetailModalDesktopRender.render(
                transaction
            );

        }


        return "";

    }

};