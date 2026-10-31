const StoreConfigRender = {

    page() {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof StoreConfigMobileRender !==
                "undefined"
            ) {

                return StoreConfigMobileRender.page();

            }

            return "";

        }


        if (
            typeof StoreConfigDesktopRender !==
            "undefined"
        ) {

            return StoreConfigDesktopRender.page();

        }


        return "";

    }

};