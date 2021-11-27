module.exports = {
  async setup(client) {
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v9");
    const { Collection } = require("discord.js");
    const fs = require("fs");

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
    let applicationCommandData = [];

    // Add slash commands to Collection
    client.slash = new Collection();

    try {
      const folders = fs.readdirSync("./src/commands");
      for (const folder of folders) {
        const files = fs
          .readdirSync(`./src/commands/${folder}`)
          .filter((file) => file.endsWith(".js"));
        for (const file of files) {
          const command = require(`../commands/${folder}/${file}`);
          client.slash.set(command.data.name, command);

          if (command.permissions && command.permissions !== 1) {
            command.data.defaultPermission = false;
          }

          applicationCommandData.push(command.data.toJSON());
        }
      }
    } catch (err) {
      console.error(err);
    }

    // Uncomment if messing with permissions a lot or need it
    // Removing and adding all of the slash commands each time fills up the daily quota smh
    /* CLEAR SLASH COMMANDS */
    // let nothing = [];
    // rest
    //   .put(
    //     Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
    //     {
    //       body: nothing,
    //     }
    //   )
    //   .then(() =>
    //     console.log(
    //       chalk.bold.blue("[BOT]") +
    //         " Successfully cleared application commands"
    //     )
    //   )
    //   .catch(console.error);
    /***********************/

    await rest
      .put(
        Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
        { body: applicationCommandData }
      )
      .catch(console.error);

    console.log("[BOT] Successfully registered application commands");

    client.slash.forEach(async (com) => {
      if (com.permissions && com.permissions == 1) return;

      const commands = await client.guilds.cache
        .get(process.env.GUILD_ID)
        ?.commands.fetch();
      const command = await commands.find(
        (command) => command.name === com.data.name
      );

      // console.log(await command.permissions.fetch());

      /*
       * 1. @everyone
       * 2. Member
       * 3. VIP
       * 4. Moderator
       * 5. Social Staff
       * 6. Manager
       * 7. Admin
       * 8. Bot Manager
       * 9. Owner
       * 10. Bot Owner
       */

      let permissions = [
        {
          id: "",
          type: "ROLE",
          permission: true,
        },
      ];

      switch (com.permissions) {
        case 2:
          permissions[0].id = process.env.MEMBER_ROLE_ID;
          await command.permissions.add({ permissions });
          break;
        case 3:
          permissions[0].id = process.env.VIP_ROLE_ID;
          await command.permissions.add({ permissions });
          break;
        case 4:
          permissions[0].id = process.env.MODERATOR_ROLE_ID;
          await command.permissions.add({ permissions });
          break;
        case 5:
          permissions[0].id = process.env.SOCIAL_STAFF_ROLE_ID;
          await command.permissions.add({ permissions });
          break;
        case 6:
          permissions[0].id = process.env.MANAGER_ROLE_ID;
          await command.permissions.add({ permissions });
          break;
        case 7:
          permissions[0].id = process.env.ADMIN_ROLE_ID;
          await command.permissions.add({ permissions });
          break;
        case 8:
          permissions[0].id = process.env.BOT_MANAGER_ROLE_ID;
          await command.permissions.add({ permissions });
          break;
        case 9:
          let permission = [
            {
              id: process.env.GUILD_OWNER_ID,
              type: "USER",
              permission: true,
            },
          ];
          await command.permissions.add({ permission });
          break;
        case 10:
          let permission2 = [
            {
              id: process.env.BOT_OWNER_ID,
              type: "USER",
              permission: true,
            },
          ];
          await command.permissions.add({ permission2 });
          break;
      }
    });
  },
};
