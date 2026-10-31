/* ======================================
   TREEHOUSE POS
   LAPORAN EXPENSE MODAL
   RENDER
====================================== */

const LaporanExpenseModalRender = {

    render() {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof LaporanExpenseModalMobileRender !==
                "undefined"
            ) {

                return LaporanExpenseModalMobileRender.render();

            }

            return "";

        }


        if (
            typeof LaporanExpenseModalDesktopRender !==
            "undefined"
        ) {

            return LaporanExpenseModalDesktopRender.render();

        }


        return "";

    }

};