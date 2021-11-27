module.exports = {
  event(client) {
    client.on("guildMemberAdd", (join) => {
      if (join.guild.id !== process.env.GUILD_ID) return;
      const channel = join.guild.channels.cache.get(process.env.WELCOME_ID);
      channel.send(`Welcome <@${join.id}> to **Rebel Grenades**`);

      let guild = client.guilds.cache.get(process.env.GUILD_ID);
      let memberCountVC = guild.channels.cache.get(
        process.env.MEMBER_COUNT_VC_ID
      );

      memberCountVC.setName(`Members: ${guild.memberCount}`);
    });
  },
};
