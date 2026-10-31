const PembelianLaporanModalRender = {

    render() {

        const isMobile =
            window.innerWidth <= 768;

        if (isMobile) {

            if (
                typeof PembelianLaporanModalMobileRender !==
                "undefined"
            ) {
                return PembelianLaporanModalMobileRender.render();
            }

            return "";
        }

        if (
            typeof PembelianLaporanModalDesktopRender !==
            "undefined"
        ) {
            return PembelianLaporanModalDesktopRender.render();
        }

        return "";
    }

};