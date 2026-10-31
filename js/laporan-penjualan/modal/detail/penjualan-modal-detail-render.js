const LaporanPenjualanDetailModalRender = {

    render(row, items, payments) {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof LaporanPenjualanDetailModalMobileRender !==
                "undefined"
            ) {

                return LaporanPenjualanDetailModalMobileRender.render(
                    row,
                    items,
                    payments
                );

            }

            return "";

        }


        if (
            typeof LaporanPenjualanDetailModalDesktopRender !==
            "undefined"
        ) {

            return LaporanPenjualanDetailModalDesktopRender.render(
                row,
                items,
                payments
            );

        }


        return "";

    }

};