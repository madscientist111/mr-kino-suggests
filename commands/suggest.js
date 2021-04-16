const axios = require("axios");
const Discord = require("discord.js");
const { scrapper } = require("imdb-scrapper");
const lb = require("letterboxd-search");
const rt = require("rottentomatoes-data");
const msgEmbed = require("./msgEmbed.js");
const baseReq = "https://api.themoviedb.org/3/movie/";

module.exports = {
    name: "suggest",
    description: "sugesst!",
    execute(message, args) {
        // console.log(args);
        const req = baseReq + args[0] + "?api_key=" + process.env.TMDB_TOKEN;
        // console.log("req is ", req);

        axios
            .get(req)
            .then(async (response) => {
                console.log("got the request");
                const data = await response.data;
                // console.log("got tmdb data");
                // console.log(data);
                const imdb_id = await data.imdb_id;
                // console.log("imdb id is ", imdb_id);
                let imdb_data = 0;
                if (imdb_id) {
                    await scrapper(imdb_id)
                        .then((res) => (imdb_data = res))
                        .catch((err) => console.log(err));
                }
                // console.log("Title is");
                const year = String(data.release_date).slice(0, 4);
                const lbQuery = await String(data.title)
                    .replace(/'/g, "")
                    .replace(/ /g, "-")
                    .toLowerCase();
                // console.log("lb query is ", lbQuery);
                // if (imdb_id)
                //     await rt.fetchRottenTomatoesData(lbQuery).then((res) => {
                //         // console.log("rt res is ");
                //         // console.log(res);
                //         data.rt = res.movie.meterScore;
                //     });
                // console.log("pehleeee");
                let x = await lb.search(lbQuery);
                let lbq = lbQuery;
                // console.log("x");
                // console.log(x);
                if (x.reject) console.log("err");
                // console.log("x ", x);
                // console.log("first");
                if (x.statusCode != 200 || x.year != year) {
                    // console.log("we inside here x is");
                    // console.log(x.year);
                    // console.log(typeof x.year);
                    if (x.year) {
                        // console.log("goes inside");
                        const lbQuery2 = lbQuery + "-" + year;
                        // console.log("lbq2 ", lbQuery2);
                        x = await lb.search(lbQuery2);
                        lbq = lbQuery2;
                    }
                }
                console.log("lbq");
                lbq =
                    "https://letterboxd.com/film/" +
                    lbq
                        .toLowerCase()
                        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
                        .replace(/ /g, "-");

                console.log(lbq);
                // console.log("sec");
                data.lb = x;
                const imdbUrl = "https://imdb.com/title/" + imdb_id;
                const tmdbUrl = "https://tmdb.org/movie/" + args[0];
                let url = imdb_id ? imdbUrl : tmdbUrl;
                console.log("url is ", url);
                // console.log("x is ", x);
                const img =
                    data.lb.statusCode == 200
                        ? data.lb.backdropImage
                        : "https://www.themoviedb.org/t/p/w600_and_h900_bestv2" +
                          data.poster_path;

                const exampleEmbed = msgEmbed(data, url, img);

                    exampleEmbed.setDescription(data.overview)
                    .setTitle(
                        imdb_data.title ? imdb_data.title : data.original_title
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
                                ? imdb_data.rating +
                                  " / 10" +
                                  "\n" +
                                  `[_visit_](${imdbUrl})`
                                : "Unavailable",
                            inline: true,
                        },
                        {
                            name: "TMDB",
                            value: data.vote_average
                                ? data.vote_average +
                                  " / 10" +
                                  "\n" +
                                  `[_visit_](${tmdbUrl})`
                                : "Unavailable",
                            inline: true,
                        }
                    )
                    .addField(
                        "Letterboxd",
                        data.lb.averageRating != "unde"
                            ? data.lb.averageRating +
                                  " / 5" +
                                  "\n" +
                                  `[_visit_](${lbq})`
                            : "Unavailable",
                        true
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
