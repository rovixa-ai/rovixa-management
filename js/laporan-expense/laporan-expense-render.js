/*======================================
LAPORAN EXPENSE
RENDER
======================================*/

const LaporanExpenseRender = {

    render() {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof LaporanExpenseMobileRender !==
                "undefined"
            ) {

                return LaporanExpenseMobileRender.render();

            }

            return "";

        }


        if (
            typeof LaporanExpenseDesktopRender !==
            "undefined"
        ) {

            return LaporanExpenseDesktopRender.render();

        }


        return "";

    }

};