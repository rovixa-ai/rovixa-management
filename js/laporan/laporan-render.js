const LaporanRender = {

    render() {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof LaporanMobileRender !==
                "undefined"
            ) {

                return LaporanMobileRender.render();

            }

            return "";

        }


        if (
            typeof LaporanDesktopRender !==
            "undefined"
        ) {

            return LaporanDesktopRender.render();

        }


        return "";

    }

};