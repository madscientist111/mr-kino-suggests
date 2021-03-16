const axios = require("axios");
const Discord = require("discord.js");
const imdb = require("imdb");
const lb = require("letterboxd-search");

const baseReq = "https://api.themoviedb.org/3/movie/";

module.exports = {
    name: "suggest",
    description: "sugesst!",
    execute(message, args) {
        const req = baseReq + args + "?api_key=" + process.env.TMDB_TOKEN;
        console.log("req is ", req);

        axios
            .get(req)
            .then(async (response) => {
                const data = await response.data;
                console.log(data);
                // const imdb_id = await data.imdb_id;
                console.log("Title is");
                const lbQuery =
                    (await data.title) +
                    " " +
                    String(data.release_date).slice(0, 4);

                console.log("lb query is ", lbQuery);
                const x = await lb
                    .search(lbQuery)
                    .then((resp) => {
                        data.lb = resp;
                        console.log("new");
                        console.log(data.lb);
                    })
                    .catch((err) => {
                        console.log(err);
                        // lb.search(data.title)
                        //     .then((resp) => {
                        //         data.lb = resp;
                        //         console.log("new");
                        //         console.log(data.lb);
                        //     })
                        //     .catch((err) => console.log(err));
                    });
                console.log("x is ", x);
                const img = data.lb.backdropImage ? data.lb.backdropImage : "https://www.themoviedb.org/t/p/w600_and_h900_bestv2" +
                      data.poster_path;

                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setAuthor(
                        "Mr.Kino",
                        "https://i.ibb.co/PDnLkQp/vga.png",
                        "https://www.youtube.com/user/VGApdpu"
                    )
                    .setTitle(data.original_title)
                    .setURL("https://imdb.com/title/" + data.imdb_id)
                    .setDescription(data.overview)
                    .setThumbnail(
                        "https://www.themoviedb.org/t/p/w600_and_h900_bestv2" +
                            data.poster_path
                    )
                    .addFields(
                        {
                            name: "Trailer:",
                            value: "Some value here",
                        },
                        { name: "\u200B", value: "\u200B" },
                        {
                            name: "IMDB Popularity",
                            value: "Some value here",
                            inline: true,
                        },
                        {
                            name: "TMDV Popularitt",
                            value: "Some value here",
                            inline: true,
                        }
                    )
                    .addField("Inline field title", "Some value here", true)
                    .setImage(
                        img
                            ? img
                            : "https://avatars.githubusercontent.com/u/22892193?s=460&u=96585117354875608d384137828c890a3b47a017&v=4"
                    )
                    .setTimestamp()
                    .setFooter(
                        "by shoo with love from VGA",
                        "https://avatars.githubusercontent.com/u/22892193?s=460&u=96585117354875608d384137828c890a3b47a017&v=4"
                    );
                console.log("****************here****************");
                message.channel.send(exampleEmbed);
            })
            .catch((err) => {
                console.log(err);
            });
        //const specReq = baseReq + args + "?api_key=" + process.env.TMDB_TOKEN;
        //console.log(specReq);
    },
};
