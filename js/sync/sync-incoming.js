
/* ======================================
   ROVIXA POS
   INCOMING INCREMENTAL SYNC
   BARANG & SATUAN
====================================== */

"use strict";

const IncomingSync = {

    processing: false,

    /* ======================================
       CONFIGURATION
    ====================================== */

    LAST_SYNC_KEY: "lastIncrementalSync",

    /* ======================================
       START INCOMING SYNC
    ====================================== */

    async process() {

        if (this.processing) {
            return;
        }

        if (!navigator.onLine) {
            return;
        }

        this.processing = true;

        try {

            const since =
                await this.getLastSync();

            const response =
                await API.get(
                    "syncChanges",
                    {
                        since: since || ""
                    }
                );

            if (
                !response ||
                response.success !== true
            ) {
                throw new Error(
                    response?.message ||
                    "Gagal mengambil perubahan dari server."
                );
            }

            const data =
                response.data;

            if (
                !data ||
                !Array.isArray(data.barang) ||
                !Array.isArray(data.satuan) ||
                !data.lastSync
            ) {
                throw new Error(
                    "Format data incremental sync tidak valid."
                );
            }

            await this.applyChanges(data);

            /*
             * Simpan checkpoint hanya setelah
             * seluruh perubahan berhasil diproses.
             */

            await DB.put(
                "config",
                {
                    key: this.LAST_SYNC_KEY,
                    value: data.lastSync
                }
            );

        }
        catch (error) {

            console.error(
                "Incoming sync gagal:",
                error
            );

        }
        finally {

            this.processing = false;

        }

    },


    /* ======================================
       GET LAST SYNC CHECKPOINT
    ====================================== */

    async getLastSync() {

        const checkpoint =
            await DB.get(
                "config",
                this.LAST_SYNC_KEY
            );

        if (checkpoint?.value) {
            return checkpoint.value;
        }

        /*
         * Bootstrap pertama tetap menjadi
         * titik awal incremental sync.
         */

        const bootstrap =
            await DB.get(
                "config",
                "lastBootstrap"
            );

        if (bootstrap?.value) {
            return bootstrap.value;
        }

        return "";

    },


    /* ======================================
       APPLY SERVER CHANGES
    ====================================== */

    async applyChanges(data) {

        const queue =
            await DB.getAll("syncQueue");

        const pendingBarang =
            new Set();

        const pendingSatuan =
            new Set();

        /*
         * Identifikasi data lokal yang masih
         * menunggu proses outgoing sync.
         */

        for (const item of queue || []) {

            if (
                item.status !== "pending" &&
                item.status !== "syncing"
            ) {
                continue;
            }

            if (
                item.type === "barang" ||
                item.type === "barangUpdate"
            ) {

                if (item.referenceId) {
                    pendingBarang.add(
                        String(item.referenceId)
                    );
                }

            }

            if (item.type === "satuan") {

                if (item.referenceId) {
                    pendingSatuan.add(
                        String(item.referenceId)
                    );
                }

            }

        }

        /*
         * UPDATE BARANG
         */

        for (const barang of data.barang) {

            if (
                !barang ||
                !barang.kode
            ) {
                continue;
            }

            const kode =
                String(barang.kode);

            if (pendingBarang.has(kode)) {
                continue;
            }

            await DB.put(
                "barang",
                barang
            );

        }

        /*
         * UPDATE SATUAN
         */

        for (const satuan of data.satuan) {

            if (
                !satuan ||
                !satuan.kode ||
                !satuan.satuan
            ) {
                continue;
            }

            const id =
                satuan.id ||
                `${satuan.kode}|${satuan.satuan}`;

            if (pendingSatuan.has(String(id))) {
                continue;
            }

            await DB.put(
                "satuan",
                {
                    ...satuan,
                    id
                }
            );

        }

    }

};
