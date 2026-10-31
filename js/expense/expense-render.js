const ExpenseRender = {

    render() {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof ExpenseMobileRender !==
                "undefined"
            ) {

                return ExpenseMobileRender.render();

            }

            return "";

        }


        if (
            typeof ExpenseDesktopRender !==
            "undefined"
        ) {

            return ExpenseDesktopRender.render();

        }


        return "";

    }

};