const axios = require("axios");
const Discord = require("discord.js");
const { scrapper } = require("imdb-scrapper");
const lb = require("letterboxd-search");
const rt = require("rottentomatoes-data");
const baseReq = "https://api.themoviedb.org/3/movie/";

module.exports = {
    name: "suggest",
    description: "sugesst!",
    execute(message, args) {
        const req = baseReq + args[0] + "?api_key=" + process.env.TMDB_TOKEN;

        axios
            .get(req)
            .then(async (response) => {
                const data = await response.data;
                const imdb_id = await data.imdb_id;
                let imdb_data = 0;
                if (imdb_id) {
                    await scrapper(imdb_id)
                        .then((res) => (imdb_data = res))
                        .catch((err) => console.log(err));
                } //     .then((res) => console.log(res))
                //     .catch((err) => console.log("err"));
                // const imdb_data = await imdb(imdb_id, (res, err) => {
                //     if (err) console.log(err);
                //     else {
                //         data.imdb_new_data = res;
                //         console.log('res')
                //         console.log(res)
                //     }
                // console.log(imdb_data);
                const year = String(data.release_date).slice(0, 4);
                const lbQuery = await data.title;
                if (imdb_id)
                    await rt.fetchRottenTomatoesData(lbQuery).then((res) => {
                        data.rt = res.movie.meterScore;
                    });
                let x = await lb.search(lbQuery);
                if (x.statusCode != 200 || x.year != year)
                    x = await lb.search(lbQuery + " " + year);
                    data.lb = x;
                const img =
                    data.lb.statusCode == 200
                        ? data.lb.backdropImage
                        : "https://www.themoviedb.org/t/p/w600_and_h900_bestv2" +
                          data.poster_path;

                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setAuthor(
                        "Recommendation of the day!",
                        "https://i.ibb.co/PDnLkQp/vga.png",
                        "https://www.youtube.com/user/VGApdpu"
                    )
                    .setTitle(
                        imdb_data.title ? imdb_data.title : data.original_title
                    )
                    .setURL("https://imdb.com/title/" + data.imdb_id)
                    .setDescription(data.overview)
                    .setThumbnail(
                        "https://www.themoviedb.org/t/p/w600_and_h900_bestv2" +
                            data.poster_path
                    )
                    .addFields(
                        {
                            name: "Directed By:",
                            value: data.lb.director
                                ? data.lb.director
                                : "Unavailable",
                        },
                        {
                            name: "Runtime",
                            value: data.lb.runtimeMinutes
                                ? data.lb.runtimeMinutes + " Mins"
                                : "Unavailable",
                        },
                        {
                            name: "Trailer:",
                            value: data.lb.trailer
                                ? data.lb.trailer
                                : "Unavailable",
                        },
                        // { name: "\u200B", value: "\u200B" },
                        {
                            name: "IMDB",
                            value: imdb_data.rating
                                ? imdb_data.rating + " / 10"
                                : "Unavailable",
                            inline: true,
                        },
                        {
                            name: "TMDB",
                            value: data.vote_average
                                ? data.vote_average + " / 10"
                                : "Unavailable",
                            inline: true,
                        }
                    )
                    .addField(
                        "Letterboxd",
                        data.lb.averageRating + " / 5",
                        true
                    )
                    .addField("Rotten Tomatoes", data.rt + "%", true)
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
