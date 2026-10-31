const LaporanPembelianRender = {

    render() {

        const isMobile =
            window.innerWidth <= 768;

        if (isMobile) {

            if (
                typeof LaporanPembelianMobileRender !==
                "undefined"
            ) {
                return LaporanPembelianMobileRender.render();
            }

            return "";
        }

        if (
            typeof LaporanPembelianDesktopRender !==
            "undefined"
        ) {
            return LaporanPembelianDesktopRender.render();
        }

        return "";
    }

};