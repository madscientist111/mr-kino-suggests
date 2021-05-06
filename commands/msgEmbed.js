const Discord = require("discord.js")

// Writing the common information across embeds
const msgEmbed = (data, url, img) => {
    const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setAuthor(
            "Recommendation of the day!",
            "https://i.ibb.co/PDnLkQp/vga.png",
            "https://www.youtube.com/user/VGApdpu"
        )
        .setURL(url)
        .setThumbnail(
            "https://www.themoviedb.org/t/p/w600_and_h900_bestv2" +
                data.poster_path
        )
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

        return exampleEmbed
}

module.exports = msgEmbed
