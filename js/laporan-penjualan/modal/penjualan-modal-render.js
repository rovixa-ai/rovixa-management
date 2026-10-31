const PenjualanLaporanModalRender = {

    render() {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof PenjualanLaporanModalMobileRender !==
                "undefined"
            ) {

                return PenjualanLaporanModalMobileRender.render();

            }

            return "";

        }


        if (
            typeof PenjualanLaporanModalDesktopRender !==
            "undefined"
        ) {

            return PenjualanLaporanModalDesktopRender.render();

        }


        return "";

    }

};