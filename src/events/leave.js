module.exports = {
  event(client) {
    client.on("guildMemberRemove", (leave) => {
      if (leave.guild.id !== process.env.GUILD_ID) return;
      let guild = client.guilds.cache.get(process.env.GUILD_ID);
      let memberCountVC = guild.channels.cache.get(
        process.env.MEMBER_COUNT_VC_ID
      );

      memberCountVC.setName(`Members: ${guild.memberCount}`);
    });
  },
};
