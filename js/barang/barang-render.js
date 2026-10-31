const BarangRender = {

    render() {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof BarangMobileRender !==
                "undefined"
            ) {

                return BarangMobileRender.render();

            }

            return "";

        }


        if (
            typeof BarangDesktopRender !==
            "undefined"
        ) {

            return BarangDesktopRender.render();

        }


        return "";

    }

};