const axios = require("axios");
const Discord = require("discord.js");
const msgEmbed = require("./msgEmbed.js");
const baseReq = "https://api.themoviedb.org/3/tv/";

module.exports = {
    name: "tv",
    description: "tv!",
    execute(message, args) {
        // console.log(args);
        const req = baseReq + args[0] + "?api_key=" + process.env.TMDB_TOKEN;
        // console.log("req is ", req);

        axios
            .get(req)
            .then(async (response) => {
                console.log("got the request");
                const data = await response.data;
                // console.log(data);
                // console.log(data.original_name);
                const img =
                    "https://www.themoviedb.org/t/p/w600_and_h900_bestv2" +
                    data.poster_path;
                let url = "https://tmdb.org/tv/" + args[0];
                const creators = data.created_by
                    .map((creator) => creator.name)
                    .join("\n");
                console.log(creators);
                const exampleEmbed = msgEmbed(data, url, img);

                    exampleEmbed.setTitle(data.original_name)
                    .setDescription(
                        (data.tagline ? "_" +
                            data.tagline +
                            "_" : "") +
                            (data.tagline ? "\n \n" : "") +
                            data.overview
                    )
                    .addFields(
                        {
                            name: "Created by:",
                            value: creators
                                ? creators
                                : "Unavailable",
                        },
                        {
                            name: "Runtime Per Episode:",
                            value: data.episode_run_time
                                ? data.episode_run_time + " Mins"
                                : "undefined",
                        },
                        // { name: "\u200B", value: "\u200B" },
                        {
                            name: "TMDB Score:",
                            value: data.vote_average
                                ? data.vote_average + " / 10"
                                : "Unavailable",
                            inline: true,
                        }
                    );
                console.log("****************here****************");
                const chan =
                    args.length > 1
                        ? message.client.channels.cache.get(args[2])
                        : message.channel;
                chan.send(exampleEmbed);
            })
            .catch((err) => {
                console.log(err);
            });
        //const specReq = baseReq + args + "?api_key=" + process.env.TMDB_TOKEN;
        //console.log(specReq);
    },
};
