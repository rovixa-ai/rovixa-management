const DB = {

    name:
        "TreehouseManagementDB",

    version:
        14,


    instance:
        null,


    init() {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const request =
                    indexedDB.open(
                        this.name,
                        this.version
                    );


                request.onupgradeneeded =
                    event => {

                        const database =
                            event.target.result;


                        /*======================================
                        BARANG
                        ======================================*/

                        if (
                            !database.objectStoreNames.contains(
                                "barang"
                            )
                        ) {

                            database.createObjectStore(
                                "barang",
                                {
                                    keyPath:
                                        "kode"
                                }
                            );

                        }


                        /*======================================
                        SATUAN
                        ======================================*/

                        if (
                            !database.objectStoreNames.contains(
                                "satuan"
                            )
                        ) {

                            database.createObjectStore(
                                "satuan",
                                {
                                    keyPath:
                                        "id"
                                }
                            );

                        }


                        /*======================================
                        PEMBELIAN
                        ======================================*/

                        if (
                            !database.objectStoreNames.contains(
                                "pembelian"
                            )
                        ) {

                            database.createObjectStore(
                                "pembelian",
                                {
                                    keyPath:
                                        "id"
                                }
                            );

                        }


                        /*======================================
                        DETAIL PEMBELIAN
                        ======================================*/

                        if (
                            database.objectStoreNames.contains(
                                "detailPembelian"
                            )
                        ) {

                            database.deleteObjectStore(
                                "detailPembelian"
                            );

                        }


                        database.createObjectStore(
                            "detailPembelian",
                            {
                                autoIncrement:
                                    true
                            }
                        );


                        /*======================================
                        PENJUALAN
                        ======================================*/

                        if (
                            !database.objectStoreNames.contains(
                                "penjualan"
                            )
                        ) {

                            database.createObjectStore(
                                "penjualan",
                                {
                                    keyPath:
                                        "id"
                                }
                            );

                        }


                        /*======================================
                        DETAIL PENJUALAN
                        ======================================*/

                        if (
                            database.objectStoreNames.contains(
                                "detailPenjualan"
                            )
                        ) {

                            database.deleteObjectStore(
                                "detailPenjualan"
                            );

                        }


                        database.createObjectStore(
                            "detailPenjualan",
                            {
                                autoIncrement:
                                    true
                            }
                        );


                        /*======================================
                        PEMBAYARAN PENJUALAN
                        ======================================*/

                        if (
                            database.objectStoreNames.contains(
                                "pembayaranPenjualan"
                            )
                        ) {

                            database.deleteObjectStore(
                                "pembayaranPenjualan"
                            );

                        }


                        database.createObjectStore(
                            "pembayaranPenjualan",
                            {
                                autoIncrement:
                                    true
                            }
                        );


                        /*======================================
                        PEMBAYARAN PEMBELIAN
                        ======================================*/

                        if (
                            !database.objectStoreNames.contains(
                                "pembayaranPembelian"
                            )
                        ) {

                            database.createObjectStore(
                                "pembayaranPembelian",
                                {
                                    keyPath:
                                        "id"
                                }
                            );

                        }


                        /*======================================
                        STOK ADJUSTMENT
                        ======================================*/

                        if (
                            !database.objectStoreNames.contains(
                                "stokAdjustment"
                            )
                        ) {

                            database.createObjectStore(
                                "stokAdjustment",
                                {
                                    keyPath:
                                        "id"
                                }
                            );

                        }


                        /*======================================
                        EXPENSE
                        ======================================*/

                        if (
                            !database.objectStoreNames.contains(
                                "expense"
                            )
                        ) {

                            database.createObjectStore(
                                "expense",
                                {
                                    keyPath:
                                        "id"
                                }
                            );

                        }


                        /*======================================
                        SYNC QUEUE
                        ======================================*/

                        if (
                            !database.objectStoreNames.contains(
                                "syncQueue"
                            )
                        ) {

                            database.createObjectStore(
                                "syncQueue",
                                {
                                    keyPath:
                                        "id"
                                }
                            );

                        }


                        /*======================================
                        CONFIG
                        ======================================*/

                        if (
                            !database.objectStoreNames.contains(
                                "config"
                            )
                        ) {

                            database.createObjectStore(
                                "config",
                                {
                                    keyPath:
                                        "key"
                                }
                            );

                        }


                        /*======================================
                        USERS / KASIR
                        ======================================*/

                        if (
                            !database.objectStoreNames.contains(
                                "users"
                            )
                        ) {

                            database.createObjectStore(
                                "users",
                                {
                                    keyPath:
                                        "id"
                                }
                            );

                        }

                    };


                request.onsuccess =
                    event => {

                        this.instance =
                            event.target.result;


                        


                        resolve(
                            this.instance
                        );

                    };


                request.onerror =
                    event => {

                        console.error(
                            "IndexedDB Error:",
                            event.target.error
                        );


                        reject(
                            event.target.error
                        );

                    };

            }
        );

    },


    getStore(
        storeName,
        mode = "readonly"
    ) {

        if (!this.instance) {

            throw new Error(
                "IndexedDB belum diinisialisasi."
            );

        }


        const transaction =
            this.instance.transaction(
                storeName,
                mode
            );


        return transaction.objectStore(
            storeName
        );

    },


    put(
        storeName,
        data
    ) {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const store =
                    this.getStore(
                        storeName,
                        "readwrite"
                    );


                const request =
                    store.put(
                        data
                    );


                request.onsuccess =
                    () => {

                        resolve(
                            request.result
                        );

                    };


                request.onerror =
                    () => {

                        reject(
                            request.error
                        );

                    };

            }
        );

    },


    add(
        storeName,
        data
    ) {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const store =
                    this.getStore(
                        storeName,
                        "readwrite"
                    );


                const request =
                    store.add(
                        data
                    );


                request.onsuccess =
                    () => {

                        resolve(
                            request.result
                        );

                    };


                request.onerror =
                    () => {

                        reject(
                            request.error
                        );

                    };

            }
        );

    },


    get(
        storeName,
        key
    ) {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const store =
                    this.getStore(
                        storeName
                    );


                const request =
                    store.get(
                        key
                    );


                request.onsuccess =
                    () => {

                        resolve(
                            request.result ||
                            null
                        );

                    };


                request.onerror =
                    () => {

                        reject(
                            request.error
                        );

                    };

            }
        );

    },


    getAll(
        storeName
    ) {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const store =
                    this.getStore(
                        storeName
                    );


                const request =
                    store.getAll();


                request.onsuccess =
                    () => {

                        resolve(
                            request.result ||
                            []
                        );

                    };


                request.onerror =
                    () => {

                        reject(
                            request.error
                        );

                    };

            }
        );

    },


    clear(
        storeName
    ) {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const store =
                    this.getStore(
                        storeName,
                        "readwrite"
                    );


                const request =
                    store.clear();


                request.onsuccess =
                    () => {

                        resolve();

                    };


                request.onerror =
                    () => {

                        reject(
                            request.error
                        );

                    };

            }
        );

    },


    delete(
        storeName,
        key
    ) {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const store =
                    this.getStore(
                        storeName,
                        "readwrite"
                    );


                const request =
                    store.delete(
                        key
                    );


                request.onsuccess =
                    () => {

                        resolve();

                    };


                request.onerror =
                    () => {

                        reject(
                            request.error
                        );

                    };

            }
        );

    },


    async replaceAll(
        storeName,
        dataList
    ) {

        await this.clear(
            storeName
        );


        for (
            const data of dataList
        ) {

            await this.put(
                storeName,
                data
            );

        }

    }


};