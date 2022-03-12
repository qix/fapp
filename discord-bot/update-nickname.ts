import { Client, HexColorString, MessageEmbed } from "discord.js";
import { got } from "got";
import { invariant } from "./invariant";
import { FRIENDS_GUILD_ID, withActiveClient } from "./config";

withActiveClient(async function updateNicknames(client: Client) {
  const guild = await client.guilds.fetch(FRIENDS_GUILD_ID);

  console.log("Fetching members...");
  const members = await guild.members.fetch();

  const db = await got("http://localhost:3000/api/discordMembers", {
    responseType: "json",
  });
  console.log(db.body);

  for (const member of members.values()) {
    const { id, username, discriminator } = member.user;

    console.log(`${member.user.id} -- ${username}#${discriminator}`);
  }
  //await meyer.setNickname("Mike Meyer");
});
