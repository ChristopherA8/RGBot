module.exports = {
  async slashHandler(interaction, client) {
    if (!client.slash.has(interaction.commandName)) return;
    const slash = client.slash.get(interaction.commandName);

    try {
      slash.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.channel.send(`${error}\n||<@279032930926592000>||`);
    }
  },
};
