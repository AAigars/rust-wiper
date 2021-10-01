class RustMaps {
    constructor(key) {
        this.axios = require("axios").default.create({
            baseURL: "https://rustmaps.com/api/v2",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        this.axios.interceptors.request.use(req => {
            req.headers["X-API-Key"] = key;
            return req;
        });
    }

    async generateMap(seed, size) {
        const response = (await this.axios.post(`/maps/${seed}/${size}`));
        if(response.status == 200 || response.status == 409) {
            return response.data["mapId"];
        }else {
            return null;
        }
    }

    async getMap(mapId) {
        try {
            const response = await this.axios.get(`/maps/${mapId}`);
            if(response.status == 200) {
                return response.data.thumbnailUrl;
            }else {
                return null;
            }
        }catch(error) {
            if(error.response.status == 409) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                return await this.getMap(mapId);
            }else {
                return null;
            }
        }
    }
}; 

module.exports = RustMaps;