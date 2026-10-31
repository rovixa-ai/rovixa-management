const LaporanProfitRender = {

    render() {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof LaporanProfitMobileRender !==
                "undefined"
            ) {

                return LaporanProfitMobileRender.render();

            }

            return "";

        }


        if (
            typeof LaporanProfitDesktopRender !==
            "undefined"
        ) {

            return LaporanProfitDesktopRender.render();

        }


        return "";

    }

};