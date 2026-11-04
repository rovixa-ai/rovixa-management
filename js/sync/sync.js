
/*======================================
ROVIXA POS
SYNC CORE
======================================*/

const Sync = {

    processing: false,

    initialized: false,


    /*======================================
    INIT AUTO SYNC
    ======================================*/

    init() {

        if (
            this.initialized
        ) {

            return;

        }


        this.initialized =
            true;


        /*
        ======================================
        INTERNET KEMBALI ONLINE
        ======================================
        */

        window.addEventListener(
            "online",
            () => {

                this.process();

               

            }
        );


        /*
        ======================================
        INTERNET PUTUS
        ======================================
        */

        window.addEventListener(
            "offline",
            () => {

            }
        );


        /*
        ======================================
        COBA SYNC SAAT APP DIBUKA
        ======================================
        */

        if (
            navigator.onLine
        ) {

            this.process();

            

        }

    },


    /*======================================
    AUTO SYNC
    ======================================*/

    autoProcess() {

        setTimeout(
            () => {

                this.process();

            },
            100
        );

    },


    /*======================================
    PROCESS SYNC QUEUE
    ======================================*/

    async process() {

        if (
            !navigator.onLine
        ) {

            return;

        }


        if (
            this.processing
        ) {

            return;

        }


        this.processing =
            true;


        try {

            const queueList =
                await DB.getAll(
                    "syncQueue"
                );


            const pendingList =
                queueList.filter(
                    item =>
                        item.status ===
                        "pending"
                );


            for (
                const queue of pendingList
            ) {

                await this.processItem(
                    queue
                );

            }

        }

        catch (error) {

            console.error(
                "SYNC PROCESS ERROR:",
                error
            );

        }

        finally {

            this.processing =
                false;

        }

    },


    /*======================================
    PROCESS ITEM
    ======================================*/

    async processItem(
        queue
    ) {

        try {

            queue.status =
                "syncing";


            await DB.put(
                "syncQueue",
                queue
            );


            if (
                queue.type ===
                "pembelian"
            ) {

                await this.syncPembelian(
                    queue
                );

            }


            if (
                queue.type ===
                "expense"
            ) {

                await this.syncExpense(
                    queue
                );

            }


            if (
                queue.type ===
                "barang"
            ) {

                await this.syncBarang(
                    queue
                );

            }


            if (
                queue.type ===
                "barangUpdate"
            ) {

                await this.syncUpdateBarang(
                    queue
                );

            }


            if (
                queue.type ===
                "satuan"
            ) {

                await this.syncSatuan(
                    queue
                );

            }


            if (
                queue.type ===
                "stokAdjustment"
            ) {

                await this.syncStokAdjustment(
                    queue
                );

            }


            queue.status =
                "success";


            queue.syncedAt =
                new Date()
                    .toISOString();


            await DB.put(
                "syncQueue",
                queue
            );

        }

        catch (error) {

            console.error(
                "SYNC FAILED:",
                queue.id,
                error
            );


            queue.status =
                "pending";


            queue.retry =
                Number(
                    queue.retry || 0
                ) + 1;


            queue.lastError =
                error.message;


            await DB.put(
                "syncQueue",
                queue
            );

        }

    },


    /*======================================
    RETRY
    ======================================*/

    async retry() {

        const queueList =
            await DB.getAll(
                "syncQueue"
            );


        const failedList =
            queueList.filter(
                item =>
                    item.status ===
                    "pending"
            );


        for (
            const item of failedList
        ) {

            item.status =
                "pending";


            await DB.put(
                "syncQueue",
                item
            );

        }


        await this.process();

    },


    /*======================================
    GET PENDING COUNT
    ======================================*/

    async getPendingCount() {

        const queueList =
            await DB.getAll(
                "syncQueue"
            );


        return queueList.filter(
            item =>
                item.status ===
                "pending"
        ).length;

    }

};
