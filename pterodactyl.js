class Pterodactyl {
    constructor(url, key) {
        this.axios = require("axios").default.create({
            baseURL: url,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        this.axios.interceptors.request.use(req => {
            req.headers["Authorization"] = `Bearer ${key}`;
            return req;
        });
    }

    getResources(id) {
        return this.axios.get(`/api/client/servers/${id}/resources`);
    }

    async getFiles(id, path) {
        return (await this.axios.get(`/api/client/servers/${id}/files/list?directory=${encodeURI(path)}`)).data;
    }

    deleteFile(id, root, file) {
        return this.axios.post(`/api/client/servers/${id}/files/delete`, {
            root,
            files: [file]
        })
    }

    sendCommand(id, command) {
        return this.axios.post(`/api/client/servers/${id}/command`, {
            command
        });
    }

    sendPowerState(id, signal) {
        return this.axios.post(`/api/client/servers/${id}/power`, {
            signal
        });
    }

    changeStartup(id, key, value) {
        return this.axios.put(`/api/client/servers/${id}/startup/variable`, {
            key,
            value: `${value}`
        });
    }
};

module.exports = Pterodactyl;