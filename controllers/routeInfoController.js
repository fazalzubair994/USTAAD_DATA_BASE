const getRouteInfo = (req, res) => {
  const routesInfo = {
    User_Routes: [
      {
        method: "GET",
        route: "/api/users/getAll",
        description: "Returns all the users",
      },
      {
        method: "POST",
        route: "/api/users/checkUser",
        description: "Checks if a user exists and adds a new one if not",
        body: {
          userInfo: {
            id: "string",
            name: "string",
            email: "string",
          },
        },
      },
      {
        method: "PATCH",
        route: "/api/users/updateUserResults",
        description: "Updates the results for a user",
        body: {
          results: {
            userId: "string",
            keyboardLyout: "string",
            drills: "object",
            games: "object",
          },
        },
      },
    ],

    Keyboard_Routes: [
      {
        method: "GET",
        route: "/api/keyboards/allkeyboards",
        description: "Returns a list of all keyboards",
      },
      {
        method: "GET",
        route: "/api/keyboards/QWERTY keyboard",
        description:
          "Returns a keyboard by keyboard name, [QWERTY keyboard] keyboard name withou brackets and qoutes just write the exact keyboard name.",
      },
      {
        method: "POST",
        route: "/api/keyboards/add",
        description: "Adds a new keyboard to the list",
        body: {
          properties: {
            dynamicShifting: false,
            name: "Layout Name",
            iD: 3,
            languageFamily: "Family of Language",
            supportConverter: false,
            userInterfaceID: 1,
            practiceMeterialID: 1,
            downloadLink: "",
            description:
              "This is simple QWERTY Keyboard and this is the most popular keyboard layout in the word.",
          },
          Rows: [[], [], [], [], []],
        },
      },
      {
        method: "DELETE",
        route: "/api/keyboards/Phonetic keyboard",
        description:
          "Delete a keyboard by keyboard name. [Phonetic keyboard] keyboard name withou brackets and qoutes just write the exact keyboard name. ",
      },
    ],

    UserInterface_Routes: [
      {
        description:
          "To Update any User Interface you have to get that user Interface by id/getAll and edit that single interface and before pushing to the data base just delete the old one from the data base and then add that updated user interface.",
      },
      {
        method: "GET",
        route: "/api/ui/getAll",
        description: "Returns a list of all userInterfaces",
      },
      {
        method: "GET",
        route: "/api/ui/23",
        description: "Returns a user Interface by id, ",
      },
      {
        method: "POST",
        route: "/api/ui/add",
        description: "Adds a new user Interface to the list",
        body: {
          id: "3",
          DrillUI: {
            description:
              "All the fonts sizes of Drill and font settings will be stored here",
          },
          HomeTab: { description: "User Interface of HomeTab will go here. " },
          GamesTab: {
            description: "User Interface of GamesTab will go here. ",
          },
          TypingTest: {
            description: "User Interface of Typing Test will go here. ",
          },
        },
      },
      {
        method: "DELETE",
        route: "/api/ui/2",
        description:
          "Delete a user Interface by id. [2] delete the userInterface using the id from the list  ",
      },
    ],

    DrillData_Routes: [
      {
        description:
          "To Update any Drill Meterial you have to get that drill meterial by id/getAll and edit that single meterial and before pushing to the data base just delete the old one from the data base and then add that updated drill meterial.",
      },
      {
        method: "GET",
        route: "/api/drillData/getAll",
        description: "Returns a list of all Drill Meterials",
      },
      {
        method: "GET",
        route: "/api/drillData/23",
        description: "Returns a Drill Meterials by id, ",
      },
      {
        method: "POST",
        route: "/api/drillData/add",
        description: "Adds a new Drill Meterials to the list",
        body: {
          id: "3",
          "1.1-1": "aassaaddaa",
          "1.1-2": "asdfjkl;",
          "Drill Meterial Serial number": "The Meterisl",
        },
      },
      {
        method: "DELETE",
        route: "/api/drillData/2",
        description:
          "Delete a Drill Meterial by id. [2] delete the drillMeterial using the id from the list  ",
      },
    ],

    LanguageCards_Routes: [
      {
        method: "GET",
        path: "/language-cards",
        description: "Retrieves all language cards from the database.",
        responses: {
          200: {
            description: "Returns a JSON array of all language cards.",
          },
          404: {
            description: "No Language Cards found.",
          },
        },
      },
      {
        method: "POST",
        path: "/language-cards",
        description: "Adds a new language card to the database.",
        requestBody: {
          type: "object",
          properties: {
            languageFamily: {
              type: "string",
              description: "Family of the language.",
            },
            languageDescription: {
              type: "string",
              description: "Description of the language.",
            },
            id: {
              type: "integer",
              description: "Unique ID for the language card.",
            },
            requestFont: {
              type: "string",
              description: "Font name requested for the language.",
            },
            fontURL: {
              type: "string",
              description: "URL to the font resource.",
            },
            primaryFontSize: {
              type: "integer",
              description: "Primary font size.",
            },
            secondaryFontSize: {
              type: "integer",
              description: "Secondary font size.",
            },
          },
          example: {
            languageFamily: "Urdu",
            languageDescription: "Description of the language.",
            id: 22,
            requestFont: "Noto Nastaliq Urdu",
            fontURL:
              "https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400..700&display=swap",
            primaryFontSize: 25,
            secondaryFontSize: 25,
          },
        },
        responses: {
          200: {
            description: "New Card has been Added.....",
          },
          404: {
            description: "Error in Language Card: [error details].",
          },
        },
      },
      {
        method: "GET",
        path: "/language-cards/:id",
        description:
          "Retrieves a single language card based on the provided ID.",
        parameters: {
          id: {
            type: "integer",
            description: "The ID of the language card to retrieve.",
          },
        },
        responses: {
          200: {
            description:
              "Returns the JSON object of the requested language card.",
          },
          404: {
            description: "No card Available with this id: [id].",
          },
          404: {
            description: "Invalid ID....",
          },
        },
      },
      {
        method: "DELETE",
        path: "/language-cards/:id",
        description:
          "Deletes a language card from the database based on the provided ID.",
        parameters: {
          id: {
            type: "integer",
            description: "The ID of the language card to delete.",
          },
        },
        responses: {
          200: {
            description: "Deletion successful for id: [id].",
          },
          404: {
            description: "No card available with id: [id].",
          },
          404: {
            description: "Invalid ID....: [id].",
          },
        },
      },
    ],

    Certificates_Routes: [{}],

    // Add more route info as needed...
  };

  res.json(routesInfo);
};

module.exports = { getRouteInfo };
