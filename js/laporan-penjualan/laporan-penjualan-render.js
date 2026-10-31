const LaporanPenjualanRender = {

    render() {

        const isMobile =
            window.innerWidth <= 768;

        if (isMobile) {

            if (
                typeof LaporanPenjualanMobileRender !==
                "undefined"
            ) {

                return LaporanPenjualanMobileRender.render();

            }

            return "";

        }


        if (
            typeof LaporanPenjualanDesktopRender !==
            "undefined"
        ) {

            return LaporanPenjualanDesktopRender.render();

        }


        return "";

    }

};