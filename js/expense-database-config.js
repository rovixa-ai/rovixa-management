const ExpenseDatabaseConfig = {

    /* ==================================
       STORAGE
    ================================== */

    STORAGE_KEY:
        "TREEHOUSE_POS_EXPENSE_DATABASE_CONFIG",


    /* ==================================
       INIT
    ================================== */

    init() {

        this.renderYears();

        this.loadForm();

        this.event();

    },


    /* ==================================
       GET CONFIG
    ================================== */

    getConfig() {

        try {

            const saved =
                localStorage.getItem(
                    this.STORAGE_KEY
                );


            if (!saved) {

                const config = {

                    activeYear:
                        new Date()
                            .getFullYear(),

                    databases: {}

                };


                localStorage.setItem(

                    this.STORAGE_KEY,

                    JSON.stringify(
                        config
                    )

                );


                return config;

            }


            const config =
                JSON.parse(
                    saved
                );


            if (
                !config ||
                typeof config !== "object"
            ) {

                throw new Error(
                    "Config Expense tidak valid."
                );

            }


            if (
                !config.databases ||
                typeof config.databases !== "object"
            ) {

                config.databases = {};

            }


            if (!config.activeYear) {

                config.activeYear =
                    new Date()
                        .getFullYear();

            }


            return config;

        }

        catch (error) {

            console.error(
                "EXPENSE DATABASE CONFIG ERROR:",
                error
            );


            const config = {

                activeYear:
                    new Date()
                        .getFullYear(),

                databases: {}

            };


            localStorage.setItem(

                this.STORAGE_KEY,

                JSON.stringify(
                    config
                )

            );


            return config;

        }

    },


    /* ==================================
       SAVE CONFIG
    ================================== */

    saveConfig(config) {

        if (
            !config ||
            typeof config !== "object"
        ) {

            throw new Error(
                "Config Expense tidak valid."
            );

        }


        localStorage.setItem(

            this.STORAGE_KEY,

            JSON.stringify(
                config
            )

        );


        return config;

    },


    /* ==================================
       ACTIVE YEAR
    ================================== */

    getActiveYear() {

        const config =
            this.getConfig();


        return Number(
            config.activeYear
        );

    },


    setActiveYear(year) {

        year =
            Number(
                year
            );


        if (!year) {

            throw new Error(
                "Tahun Expense tidak valid."
            );

        }


        const config =
            this.getConfig();


        config.activeYear =
            year;


        if (
            !config.databases[year]
        ) {

            config.databases[year] = {

                expense:
                    "",

                locked:
                    false

            };

        }


        this.saveConfig(
            config
        );


        return year;

    },


    /* ==================================
       YEAR DATABASE
    ================================== */

    getYearDatabase(year) {

        year =
            Number(
                year
            );


        if (!year) {

            throw new Error(
                "Tahun Expense tidak valid."
            );

        }


        const config =
            this.getConfig();


        if (
            !config.databases[year]
        ) {

            config.databases[year] = {

                expense:
                    "",

                locked:
                    false

            };


            this.saveConfig(
                config
            );

        }


        const database =
            config.databases[year];


        return {

            expense:
                database.expense || "",

            locked:
                database.locked === true

        };

    },


    /* ==================================
       SAVE YEAR DATABASE
    ================================== */

    saveYearDatabase(
        year,
        data = {}
    ) {

        year =
            Number(
                year
            );


        if (!year) {

            throw new Error(
                "Tahun Expense tidak valid."
            );

        }


        const config =
            this.getConfig();


        const current =
            config.databases[year] ||
            {

                expense:
                    "",

                locked:
                    false

            };


        config.databases[year] = {

            expense:
                data.expense !== undefined
                    ? String(
                        data.expense
                    ).trim()
                    : current.expense || "",

            locked:
                current.locked === true

        };


        this.saveConfig(
            config
        );


        return config.databases[year];

    },


    /* ==================================
       ACTIVE DATABASE
    ================================== */

    getActiveDatabase() {

        const year =
            this.getActiveYear();


        const database =
            this.getYearDatabase(
                year
            );


        return {

            year:
                year,

            expense:
                database.expense,

            locked:
                database.locked

        };

    },


    /* ==================================
       LOCK
    ================================== */

    lockYear(year) {

        year =
            Number(
                year
            );


        if (!year) {

            throw new Error(
                "Tahun Expense tidak valid."
            );

        }


        const config =
            this.getConfig();


        if (
            !config.databases[year]
        ) {

            config.databases[year] = {

                expense:
                    "",

                locked:
                    false

            };

        }


        config.databases[year].locked =
            true;


        this.saveConfig(
            config
        );


        return true;

    },


    /* ==================================
       UNLOCK
    ================================== */

    unlockYear(year) {

        year =
            Number(
                year
            );


        if (!year) {

            throw new Error(
                "Tahun Expense tidak valid."
            );

        }


        const config =
            this.getConfig();


        if (
            !config.databases[year]
        ) {

            config.databases[year] = {

                expense:
                    "",

                locked:
                    false

            };

        }


        config.databases[year].locked =
            false;


        this.saveConfig(
            config
        );


        return true;

    },


    /* ==================================
       IS LOCKED
    ================================== */

    isLocked(year) {

        const database =
            this.getYearDatabase(
                year
            );


        return (
            database.locked === true
        );

    },


    /* ==================================
       RENDER YEARS
    ================================== */

    renderYears() {

        const select =
            document.getElementById(
                "expenseConfigYear"
            );


        if (!select) {

            return;

        }


        const currentYear =
            new Date()
                .getFullYear();


        const config =
            this.getConfig();


        const years = [];


        for (
            let year =
                currentYear - 5;

            year <=
                currentYear + 5;

            year++
        ) {

            years.push(
                year
            );

        }


        Object.keys(
            config.databases
        )
        .forEach(
            year => {

                const number =
                    Number(
                        year
                    );


                if (
                    number &&
                    !years.includes(
                        number
                    )
                ) {

                    years.push(
                        number
                    );

                }

            }
        );


        years.sort(
            (
                a,
                b
            ) =>
                b - a
        );


        select.innerHTML =
            "";


        years.forEach(
            year => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    year;


                option.textContent =
                    year;


                if (
                    year ===
                    Number(
                        config.activeYear
                    )
                ) {

                    option.selected =
                        true;

                }


                select.appendChild(
                    option
                );

            }
        );

    },


    /* ==================================
       LOAD FORM
    ================================== */

    loadForm() {

        const select =
            document.getElementById(
                "expenseConfigYear"
            );


        const input =
            document.getElementById(
                "expenseConfigDatabase"
            );


        if (
            !select ||
            !input
        ) {

            return;

        }


        const year =
            Number(
                select.value
            );


        const database =
            this.getYearDatabase(
                year
            );


        input.value =
            database.expense ||
            "";


        this.updateButton();

        this.updateLockState();

    },


    /* ==================================
       EVENT
    ================================== */

    event() {

        const select =
            document.getElementById(
                "expenseConfigYear"
            );


        const save =
            document.getElementById(
                "expenseConfigSave"
            );


        const render =
            document.getElementById(
                "expenseConfigRender"
            );


        if (select) {

            select.addEventListener(
                "change",
                () => {

                    this.setActiveYear(
                        select.value
                    );


                    this.loadForm();


                    this.clearStatus();

                }
            );

        }


        if (save) {

            save.addEventListener(
                "click",
                () => {

                    this.save();

                }
            );

        }


        if (render) {

            render.addEventListener(
                "click",
                () => {

                    this.renderDatabase();

                }
            );

        }

    },


    /* ==================================
       UPDATE RENDER BUTTON
    ================================== */

    updateButton() {

        const input =
            document.getElementById(
                "expenseConfigDatabase"
            );


        const button =
            document.getElementById(
                "expenseConfigRender"
            );


        if (
            !input ||
            !button
        ) {

            return;

        }


        if (
            input.value.trim()
        ) {

            button.disabled =
                true;


            button.textContent =
                "Tersedia";

        }

        else {

            button.disabled =
                false;


            button.textContent =
                "Render";

        }

    },


    /* ==================================
       UPDATE LOCK STATE
    ================================== */

    updateLockState() {

        const select =
            document.getElementById(
                "expenseConfigYear"
            );


        const input =
            document.getElementById(
                "expenseConfigDatabase"
            );


        const save =
            document.getElementById(
                "expenseConfigSave"
            );


        const render =
            document.getElementById(
                "expenseConfigRender"
            );


        if (!select) {

            return;

        }


        const year =
            Number(
                select.value
            );


        const locked =
            this.isLocked(
                year
            );


        if (input) {

            input.readOnly =
                locked;

        }


        if (save) {

            save.disabled =
                locked;

        }


        if (render) {

            render.disabled =
                locked ||
                Boolean(
                    input?.value.trim()
                );

        }

    },


    /* ==================================
       RENDER DATABASE
    ================================== */

    async renderDatabase() {

        const select =
            document.getElementById(
                "expenseConfigYear"
            );


        const input =
            document.getElementById(
                "expenseConfigDatabase"
            );


        const button =
            document.getElementById(
                "expenseConfigRender"
            );


        if (
            !select ||
            !input ||
            !button
        ) {

            return;

        }


        const year =
            Number(
                select.value
            );


        if (!year) {

            this.status(
                "Tahun belum dipilih.",
                "error"
            );


            return;

        }


        if (
            this.isLocked(
                year
            )
        ) {

            this.status(
                "Database Expense tahun " +
                year +
                " sudah dikunci.",
                "error"
            );


            return;

        }


        if (
            input.value.trim()
        ) {

            return;

        }


        const originalText =
            button.textContent;


        try {

            button.disabled =
                true;


            button.textContent =
                "Rendering...";


            this.status(
                "Membuat database Expense tahun " +
                year +
                "...",
                "info"
            );


            if (
                typeof API ===
                "undefined"
            ) {

                throw new Error(
                    "API tidak tersedia."
                );

            }


            const response =
                await API
                    .createExpenseDatabaseSpreadsheet(
                        year
                    );


            


            if (
                !response ||
                response.success !==
                    true
            ) {

                throw new Error(
                    response?.message ||
                    "Database Expense gagal dibuat."
                );

            }


            const spreadsheetId =
                String(
                    response.id ||
                    response.spreadsheetId ||
                    ""
                ).trim();


            if (!spreadsheetId) {

                throw new Error(
                    "Spreadsheet ID tidak diterima dari server."
                );

            }


            input.value =
                spreadsheetId;


            this.saveYearDatabase(

                year,

                {

                    expense:
                        spreadsheetId

                }

            );


            this.status(

                response.existing ===
                true

                    ?

                "Database Expense tahun " +
                year +
                " sudah tersedia."

                    :

                "Database Expense tahun " +
                year +
                " berhasil dibuat.",

                "success"

            );


            this.updateButton();

        }

        catch (error) {

            console.error(
                "EXPENSE DATABASE RENDER ERROR:",
                error
            );


            this.status(
                error.message ||
                "Gagal membuat database Expense.",
                "error"
            );


            button.disabled =
                false;


            button.textContent =
                originalText;

        }

    },


    /* ==================================
       SAVE
    ================================== */

    save() {

        try {

            const select =
                document.getElementById(
                    "expenseConfigYear"
                );


            const input =
                document.getElementById(
                    "expenseConfigDatabase"
                );


            if (
                !select ||
                !input
            ) {

                return;

            }


            const year =
                Number(
                    select.value
                );


            const expense =
                input.value
                    .trim();


            if (!year) {

                this.status(
                    "Tahun belum dipilih.",
                    "error"
                );


                return;

            }


            if (
                this.isLocked(
                    year
                )
            ) {

                this.status(
                    "Database Expense tahun " +
                    year +
                    " sudah dikunci.",
                    "error"
                );


                return;

            }


            if (!expense) {

                this.status(
                    "Spreadsheet Expense belum tersedia.",
                    "error"
                );


                return;

            }


            this.setActiveYear(
                year
            );


            this.saveYearDatabase(

                year,

                {

                    expense:
                        expense

                }

            );


            this.status(

                "Config Expense tahun " +
                year +
                " berhasil disimpan.",

                "success"

            );


            this.updateButton();

        }

        catch (error) {

            console.error(
                "EXPENSE CONFIG SAVE ERROR:",
                error
            );


            this.status(
                error.message ||
                "Config Expense gagal disimpan.",
                "error"
            );

        }

    },


    /* ==================================
       STATUS
    ================================== */

    status(
        message,
        type = "info"
    ) {

        const element =
            document.getElementById(
                "expenseConfigStatus"
            );


        if (!element) {

            return;

        }


        element.textContent =
            message;


        element.className =
            "config-status " +
            "config-status-" +
            type;

    },


    /* ==================================
       CLEAR STATUS
    ================================== */

    clearStatus() {

        const element =
            document.getElementById(
                "expenseConfigStatus"
            );


        if (!element) {

            return;

        }


        element.textContent =
            "";


        element.className =
            "config-status";

    }

};
