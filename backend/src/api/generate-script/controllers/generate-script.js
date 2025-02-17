'use strict';

/**
 * A set of functions called "actions" for `generate-script`
 */

module.exports = {
  generateScript: async (ctx, next) => {
    try {
      const operatingSystem = ctx.request.query.operatingSystem
      const packagesToGenerateScriptFor = ctx.request.query.packages

      const availablePackages = await strapi.entityService.findMany(
        "api::package.package",
        {
          fields: ["id", "command"],
          filters: {
            $and: [{
                operating_systems: {
                  name: operatingSystem,
                },
                name: { $in: packagesToGenerateScriptFor }
              }
            ]
          },
          populate: '*'
        }
      );
      
      const header = `
##############################################################################
#      .___                 __         .__  .__            .__  __           #
#      |   | ____   _______/  |______  |  | |  |           |__|/  |_         #
#      |   |/    \ /  ___/\   __\__  \ |  | |  |    ______ |  \   __\        #
#      |   |   |  \\___ \  |  |  / __ \|  |_|  |__ /_____/ |  ||  |          #
#      |___|___|  /____  > |__| (____  /____/____/         |__||__|          #
#               \/     \/            \/                                      #
#                                                                            #
#    🪄 This install script was automagically generated by Install-It 🪄      #
#                Making package installation and setup easier                #
#                              install.lukas.sh                              #
#                                                                            #
##############################################################################

`

      let singleCommand = ''
      for (const availablePackage of availablePackages) {
        singleCommand += availablePackage.command
      }

      ctx.body = header + singleCommand
    } catch (err) {
      ctx.body = err
    }
  }
};
