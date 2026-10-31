const Router = {

    currentPage: "dashboard",


    go(page) {

        this.currentPage = page;

        App.loadPage(page);

    }

};