const PembelianTransaksiModalRender = {

    render(
        tanggal,
        transactions
    ) {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof PembelianTransaksiModalMobileRender !==
                "undefined"
            ) {

                return PembelianTransaksiModalMobileRender.render(
                    tanggal,
                    transactions
                );

            }

            return "";

        }


        if (
            typeof PembelianTransaksiModalDesktopRender !==
            "undefined"
        ) {

            return PembelianTransaksiModalDesktopRender.render(
                tanggal,
                transactions
            );

        }


        return "";

    }

};