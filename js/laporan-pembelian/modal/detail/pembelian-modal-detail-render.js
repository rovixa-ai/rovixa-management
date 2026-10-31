const PembelianDetailModalRender = {

    render() {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof PembelianDetailModalMobileRender !==
                "undefined"
            ) {

                return PembelianDetailModalMobileRender.render();

            }

            return "";

        }


        if (
            typeof PembelianDetailModalDesktopRender !==
            "undefined"
        ) {

            return PembelianDetailModalDesktopRender.render();

        }


        return "";

    }

};