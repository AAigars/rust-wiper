class Discord {
    constructor(webhook) {
        this.axios = require("axios").default.create({
            baseURL: webhook,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    sendNotification(name, ip, seed, size, type, thumbnail) {
        this.axios.post(null, {
            embeds: [
                {
                    "title": `${name} - Just Wiped!`,
                    "description": "Check out the map in detail on https://rustmaps.com",
                    "color": 12582656,
                    "image": {
                        "url": thumbnail,
                    },
                    "fields": [
                        {
                            "name": "Map Seed",
                            "value": seed,
                            "inline": true
                        },
                        {
                            "name": "Map Size",
                            "value": size,
                            "inline": true
                        },
                        {
                            "name": "Wipe Type",
                            "value": type,
                            "inline": true
                        },
                        {
                            "name": "Click & Connect",
                            "value": `steam://connect/${ip}`
                        }
                    ]
                }
            ]
        });
    }
}; 

module.exports = Discord;