const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("someone")
    .setDescription("Ping a random member"),
  permissions: 4,
  async execute(interaction) {
    const members = await interaction.guild.members.fetch();
    const randMember = members.random();
    interaction.reply(`<@${randMember.id}>`);
  },
};
