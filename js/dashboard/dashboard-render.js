
const DashboardRender = {

    mediaQuery: null,
    mediaQueryHandler: null,
    currentMode: null,

    render() {

        const isMobile =
            window.matchMedia("(max-width: 768px)").matches;

        this.currentMode =
            isMobile ? "mobile" : "desktop";

        if (isMobile) {

            if (
                typeof DashboardMobileRender !==
                "undefined"
            ) {

                return DashboardMobileRender.render();

            }

            return "";

        }

        if (
            typeof DashboardDesktopRender !==
            "undefined"
        ) {

            return DashboardDesktopRender.render();

        }

        return "";

    },


    initResponsive() {

        if (this.mediaQuery) {
            return;
        }

        this.mediaQuery =
            window.matchMedia("(max-width: 768px)");

        this.mediaQueryHandler = () => {

            if (
                typeof Router === "undefined" ||
                Router.currentPage !== "dashboard"
            ) {
                return;
            }

            const nextMode =
                this.mediaQuery.matches
                    ? "mobile"
                    : "desktop";

            if (nextMode === this.currentMode) {
                return;
            }

            const page =
                document.getElementById("page");

            if (!page) return;

            page.innerHTML = this.render();

            Dashboard.init();

        };

        this.mediaQuery.addEventListener(
            "change",
            this.mediaQueryHandler
        );

    }

};
