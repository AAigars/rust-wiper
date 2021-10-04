const CronJob = require("cron").CronJob;

const config = require("./config");
const discord = new (require("./discord"))(config.DISCORD.WEBHOOK);
const pterodactyl = new (require("./pterodactyl"))(
    config.PTERODACTYL.URL,
    config.PTERODACTYL.API_KEY
);
const rustMaps = new (require("./rustmaps"))(config.RUSTMAPS.API_KEY);

const wipeServer = async (wipe) => {
    await pterodactyl.sendCommand(wipe.PTERODACTYL_ID, "say Server wiping!");
    await new Promise((resolve) => setTimeout(resolve, 100));

    await pterodactyl.sendPowerState(wipe.PTERODACTYL_ID, "kill");
    console.log(`${wipe.SERVER_NAME} | Killed.`);

    const seed = Math.floor(Math.random() * 899999 + 100000);
    await pterodactyl.changeStartup(wipe.PTERODACTYL_ID, "WORLD_SEED", seed);
    console.log(`${wipe.SERVER_NAME} | Changed seed: ${seed}`);

    const files = await pterodactyl.getFiles(
        wipe.PTERODACTYL_ID,
        `/server/${wipe.SERVER_IDENTITY}`
    );
    files.data.forEach(async (file) => {
        const name = file.attributes.name;
        if (
            name == "cfg" ||
            name == "companion.id" ||
            name.includes("player.blueprints")
        )
            return;

        await pterodactyl.deleteFile(
            wipe.PTERODACTYL_ID,
            `/server/${wipe.SERVER_IDENTITY}`,
            name
        );
        console.log(
            `${wipe.SERVER_NAME} | Wiped /server/${wipe.SERVER_IDENTITY}/${name}`
        );
    });

    await pterodactyl.sendPowerState(wipe.PTERODACTYL_ID, "start");
    console.log(`${wipe.SERVER_NAME} | Started.`);

    const mapId = await rustMaps.generateMap(seed, wipe.SERVER_SIZE);
    if (!mapId) return;
    console.log(`${wipe.SERVER_NAME} | Map Id: ${mapId}`);

    const mapThumbnail = await rustMaps.getMap(mapId);
    console.log(`${wipe.SERVER_NAME} | Map Thumbnail: ${mapThumbnail}`);
    discord.sendNotification(
        wipe.SERVER_NAME,
        wipe.SERVER_IP,
        seed,
        wipe.SERVER_SIZE,
        "Map Wipe",
        mapThumbnail
    );
};

config.WIPES.forEach((wipe) => {
    console.log(`${wipe.SERVER_NAME} | Scheduled for ${wipe.TIME}`);
    new CronJob(
        wipe.TIME,
        () => wipeServer(wipe),
        null,
        null,
        wipe.TIMEZONE
    ).start();
});
