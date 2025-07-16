import $ from "jquery";
import prompts from "./prompts";
import characters from "./characters";

type Prompt = typeof prompts[number];

const incomes = {
  "very-low": {
    name: "Less than $30,000",
    label: "low-income",
    value: -4,
  },
  low: {
    name: "$30,001-$48,000",
    label: "middle-low-income",
    value: -2,
  },
  middle: {
    name: "$48,001-$75,000",
    label: "middle-income",
    value: 0,
  },
  "middle-high": {
    name: "$75,001-$110,000",
    label: "middle-high-income",
    value: 2,
  },
  high: {
    name: "$110,000 or more",
    label: "high-income",
    value: 4,
  },
} as const;

const races = {
  white: {
    name: "White",
    label: "white",
    value: 2,
  },
  black: {
    name: "Black",
    label: "black",
    value: -2,
  },
  latino: {
    name: "Latino",
    label: "Latino",
    value: -2,
  },
  asian: {
    name: "Asian",
    label: "Asian",
    value: 0,
  },
  native: {
    name: "Native American",
    label: "Native American",
    value: -4,
  },
};

const schools = {
  public: {
    name: "Public",
    label: "public school",
    value: 0,
  },
  private: {
    name: "Private",
    label: "private school",
    value: 3,
  },
};

const parents = {
  finished: {
    name: "Finished College",
    label: "finished college",
    value: 2,
  },
  "no-finish": {
    name: "Didn't Finish College",
    label: "did not finish college",
    value: 0,
  },
};

const GameOfCollege = {
  data: {
    score: 0, // track the dropout chance of the player
    race: null as null | keyof typeof races, // chosen race of player
    income: null as null | keyof typeof incomes, // chosen income level of player
    parents: null as null | keyof typeof parents, // chosen parents of player
    school: null as null | keyof typeof schools, // chosen high school of player
    currentPrompt: null as null | string, // current prompt screen
    nextPrompt: null as null | string, // next prompt screen
    specialPrompt: false, // used with special prompts
    difficulty: {
      // breakdown of difficulty levels
      income: incomes,
      race: races,
      school: schools,
      parents: parents,
    },
    end: {
      // end states
      nograd: {
        header: "Failed to graduate",
        text: "It’s been a rough journey. You’ve been in school for six years, racked up a lot of debt, and haven’t graduated yet. Now, you wonder if college was worth the cost.",
        img: "/game-of-college-assets/no-grad.svg",
      },
      graddebt: {
        header: "Degree with debt",
        text: "Nice job. You graduated in five years but have substantial debt. You found an entry-level job but will have to add a second gig on the side to help pay off your loans.",
        img: "/game-of-college-assets/grad-debt.svg",
      },
      gradnodebt: {
        header: "Debt-free college",
        text: "You did it! You graduated in four years with little to no debt and got a good entry-level job doing work you enjoy.",
        img: "/game-of-college-assets/grad-no-debt.svg",
      },
    },
  },
  prompts,
  character: characters,
  version: "thr", // which version of the game are we on (cal or thr)
  lockSwipe: false, // lock the swipe functionality
  lockOptions: false, // prevent player from clicking on a button
  amPrompt: true, // used for swipe logic for prompt or explain outcome
  func: {
    buildScreen: (screen: string) => {
      // build the screen based on the prompt
      if (screen === "title") {
        $("#goc-title-container").fadeOut(500);
        $("#goc-about-container").fadeIn(500);
        return;
      } else if (screen === "about") {
        $("#goc-about-container").fadeOut(500);
        $("#goc-character-container").fadeIn(500);
        return;
      } else if (screen === "character" || screen === "reset-random") {
        GameOfCollege.func.initializeScore();
        GameOfCollege.data.currentPrompt = "prompt_one";
        GameOfCollege.data.nextPrompt = "prompt_two";
        const prompt = GameOfCollege.func.determinePrompt(
          GameOfCollege.data.currentPrompt,
        );
        GameOfCollege.func.updatePrompt(prompt);

        $("#goc-character-container").fadeOut(500);
        $("#goc-end-container").fadeOut(500);
        $("#goc-game-container")
          .add("#goc-game-container #prompt_one")
          .fadeIn(500);
      } else if (screen === "reset") {
        $("#goc-end-container").fadeOut(500);
        $("#goc-character-container").fadeIn(500);
        return;
      } else if (screen === "end_screen") {
        GameOfCollege.func.checkEndGame(GameOfCollege.data.score);
        $("#goc-game-container").fadeOut(500);
        $("#goc-end-container").fadeIn(500);
        return;
      }
    },
    calculateDifficulty: () => {
      // calculate game difficulty based on choices
      let difficulty = 0;
      let difficultyName = "Normal";
      let difficultyChoices = "You are a ";

      for (let i = 0; i < 4; i++) {
        switch (i) {
          case 0:
            difficultyChoices +=
              GameOfCollege.data.difficulty.income[GameOfCollege.data.income!]
                .label + ", ";
            difficulty +=
              GameOfCollege.data.difficulty.income[GameOfCollege.data.income!]
                .value;
            break;
          case 1:
            difficultyChoices +=
              GameOfCollege.data.difficulty.race[GameOfCollege.data.race!]
                .label + ", ";
            difficulty +=
              GameOfCollege.data.difficulty.race[GameOfCollege.data.race!].value;
            break;
          case 2:
            difficultyChoices +=
              GameOfCollege.data.difficulty.school[GameOfCollege.data.school!]
                .label + " student whose parents ";
            difficulty +=
              GameOfCollege.data.difficulty.school[GameOfCollege.data.school!]
                .value;
            break;
          case 3:
            difficultyChoices +=
              GameOfCollege.data.difficulty.parents[GameOfCollege.data.parents!]
                .label + ".";
            difficulty +=
              GameOfCollege.data.difficulty.parents[GameOfCollege.data.parents!]
                .value;
            break;
        }
      }

      // calculate difficulty score
      if (difficulty < -4) {
        difficultyName = "Very Hard";
      } else if (difficulty < -1) {
        difficultyName = "Hard";
      } else if (difficulty >= -1 && difficulty <= 1) {
        difficultyName = "Normal";
      } else if (difficulty > 1 && difficulty <= 4) {
        difficultyName = "Easy";
      } else if (difficulty > 4) {
        difficultyName = "Very Easy";
      }
      return { value: difficultyName, choices: difficultyChoices };
    },
    checkEndGame: (score: number) => {
      // check to see how player fared in the game
      const difficulty = GameOfCollege.func.calculateDifficulty();

      // which end screen?
      if (score < 25) {
        // no grad
        $("#goc-end-container .goc-graphic img").attr(
          "src",
          GameOfCollege.data.end.nograd.img,
        );
        $('#goc-end-container div[data-role="content"] h2').html(
          GameOfCollege.data.end.nograd.header,
        );
        $('#goc-end-container div[data-role="content"] p').html(
          GameOfCollege.data.end.nograd.text,
        );
      } else if (score < 36) {
        //grad w debt
        $("#goc-end-container .goc-graphic img").attr(
          "src",
          GameOfCollege.data.end.graddebt.img,
        );
        $('#goc-end-container div[data-role="content"] h2').html(
          GameOfCollege.data.end.graddebt.header,
        );
        $('#goc-end-container div[data-role="content"] p').html(
          GameOfCollege.data.end.graddebt.text,
        );
      } else {
        //grad no debt
        $("#goc-end-container .goc-graphic img").attr(
          "src",
          GameOfCollege.data.end.gradnodebt.img,
        );
        $('#goc-end-container div[data-role="content"] h2').html(
          GameOfCollege.data.end.gradnodebt.header,
        );
        $('#goc-end-container div[data-role="content"] p').html(
          GameOfCollege.data.end.gradnodebt.text,
        );
      }

      $('#goc-end-container div[data-role="difficulty"] p:eq(0)').html(
        difficulty.value,
      );
      $('#goc-end-container div[data-role="difficulty"] p:eq(1)').html(
        difficulty.choices,
      );
    },
    determineOutcome: (current: string, button: string) => {
      // which prompt outcome happens
      const prompt = GameOfCollege.func.determinePrompt(current);
      const $promptContainer = $("#" + prompt.prompt_id);
      const option = prompt.options[button];
      let explainText = "";

      // check if outcome is random and execute
      if (typeof option.chance !== "undefined" || option.chance !== null) {
        const randomNumber = Math.random();
        if (randomNumber <= option.chance) {
          if (button === "left") {
            explainText = prompt.expanded_text_left_fail;
          } else if (button === "right") {
            explainText = prompt.expanded_text_right_fail;
          }
          GameOfCollege.data.score += option.chance_score;
          $promptContainer
            .find('.goc-explain div[data-role="content"] p')
            .html(explainText);
          return;
        }
      }

      if (button === "left") {
        explainText = prompt.expanded_text_left_succeed;
      } else if (button === "right") {
        explainText = prompt.expanded_text_right_succeed;
      }

      GameOfCollege.data.score += option.score;
      $promptContainer
        .find('.goc-explain div[data-role="content"] p')
        .html(explainText);
    },
    determinePrompt: (current: string) => {
      // which prompt are we pulling based on character options
      let prompt;
      switch (current) {
        case "prompt_one":
          if (GameOfCollege.data.school === "private") {
            prompt = GameOfCollege.func.retreivePrompt("prompt_one", "private");
          } else if (GameOfCollege.data.school === "public") {
            prompt = GameOfCollege.func.retreivePrompt("prompt_one", "public");
          }
          break;
        case "prompt_two":
          prompt = GameOfCollege.func.retreivePrompt("prompt_two", "all");
          break;
        case "prompt_three":
          if (
            GameOfCollege.data.income === "middle-high" ||
            GameOfCollege.data.income === "high"
          ) {
            prompt = GameOfCollege.func.retreivePrompt(
              "prompt_three",
              "high_income",
            );
          } else {
            prompt = GameOfCollege.func.retreivePrompt(
              "prompt_three",
              "low_income",
            );
          }
          break;
        case "prompt_four":
          if (GameOfCollege.version === "thr") {
            if (
              GameOfCollege.data.income === "middle" ||
              GameOfCollege.data.income === "middle-high" ||
              GameOfCollege.data.income === "high"
            ) {
              prompt = GameOfCollege.func.retreivePrompt(
                "prompt_four",
                "high_income",
              );
            } else {
              prompt = GameOfCollege.func.retreivePrompt(
                "prompt_four",
                "low_income",
              );
            }
          } else if (GameOfCollege.version === "cal") {
            if (
              GameOfCollege.data.income === "middle-high" ||
              GameOfCollege.data.income === "high"
            ) {
              prompt = GameOfCollege.func.retreivePrompt(
                "prompt_four",
                "high_income",
              );
            } else {
              prompt = GameOfCollege.func.retreivePrompt(
                "prompt_four",
                "low_income",
              );
            }
          }
          break;
        case "prompt_five":
          prompt = GameOfCollege.func.retreivePrompt("prompt_five", "all");
          break;
        case "prompt_six":
          if (GameOfCollege.version === "thr") {
            if (
              GameOfCollege.data.income === "middle" ||
              GameOfCollege.data.income === "middle-high" ||
              GameOfCollege.data.income === "high"
            ) {
              prompt = GameOfCollege.func.retreivePrompt(
                "prompt_six",
                "high_income",
              );
            } else {
              prompt = GameOfCollege.func.retreivePrompt(
                "prompt_six",
                "low_income",
              );
            }
          } else if (GameOfCollege.version === "cal") {
            prompt = GameOfCollege.func.retreivePrompt("prompt_six", "all");
          }
          break;
        case "prompt_seven":
          if (GameOfCollege.version === "thr") {
            if (
              GameOfCollege.data.income === "middle" ||
              GameOfCollege.data.income === "middle-high" ||
              GameOfCollege.data.income === "high"
            ) {
              prompt = GameOfCollege.func.retreivePrompt(
                "prompt_seven",
                "high_income",
              );
              GameOfCollege.data.specialPrompt = true;
              GameOfCollege.data.score += prompt.options.left.score;
              $(
                '#prompt_seven .goc-prompt div[data-role="buttons"] div[data-role="right"]',
              ).hide();
              $("#prompt_seven .goc-img-typical").hide();
              $("#prompt_seven .goc-img-alternative").show();
            } else {
              prompt = GameOfCollege.func.retreivePrompt(
                "prompt_seven",
                "low_income",
              );
              $("#prompt_seven .goc-img-alternative").hide();
              $("#prompt_seven .goc-img-typical").show();
            }
          } else if (GameOfCollege.version === "cal") {
            if (
              GameOfCollege.data.income === "middle-high" ||
              GameOfCollege.data.income === "high"
            ) {
              prompt = GameOfCollege.func.retreivePrompt(
                "prompt_seven",
                "high_income",
              );
              GameOfCollege.data.specialPrompt = true;
              GameOfCollege.data.score += prompt.options.left.score;
              $(
                '#prompt_seven .goc-prompt div[data-role="buttons"] div[data-role="right"]',
              ).hide();
              $("#prompt_seven .goc-img-typical").hide();
              $("#prompt_seven .goc-img-alternative").show();
            } else {
              prompt = GameOfCollege.func.retreivePrompt(
                "prompt_seven",
                "low_income",
              );
              $("#prompt_seven .goc-img-alternative").hide();
              $("#prompt_seven .goc-img-typical").show();
            }
          }
          break;
        case "prompt_eight":
          prompt = GameOfCollege.func.retreivePrompt("prompt_eight", "all");
          break;
        case "prompt_nine":
          prompt = GameOfCollege.func.retreivePrompt("prompt_nine", "all");
          break;
        case "prompt_ten":
          prompt = GameOfCollege.func.retreivePrompt("prompt_ten", "all");
          break;
        case "prompt_eleven":
          prompt = GameOfCollege.func.retreivePrompt("prompt_eleven", "all");
          break;
      }
      return prompt!;
    },
    eventTracking: (type: string, value?: string) => {
      // used for GA event tracking
      const { gtag } = window;
      if (!gtag) return;
      switch (type) {
        case "finished":
          gtag("event", "engagement", {
            event_category: "A Game of College",
            event_label: "finished game",
          });
          break;
        case "replay":
          gtag("event", "engagement", {
            event_category: "A Game of College",
            event_label: "replayed game",
          });
          break;
        case "depth":
          gtag("event", "engagement", {
            event_category: "A Game of College",
            event_label: value,
          });
          break;
        case "random":
          gtag("event", "engagement", {
            event_category: "A Game of College",
            event_label: "random character",
          });
          break;
        case "manual":
          gtag("event", "engagement", {
            event_category: "A Game of College",
            event_label: "made character",
          });
          break;
      }
    },
    initializeGame: () => {
      // initialize the game events
      // preload images
      for (let i = 0; i < GameOfCollege.prompts.length; i++) {
        GameOfCollege.func.preloadImages(
          GameOfCollege.prompts[i].image_desktop_url,
        );

        if (
          typeof GameOfCollege.prompts[i].image_alternative !== "undefined" ||
          GameOfCollege.prompts[i].image_alternative !== null
        ) {
          GameOfCollege.func.preloadImages(
            GameOfCollege.prompts[i].image_alternative,
          );
        }
      }
      GameOfCollege.func.preloadImages(GameOfCollege.data.end.nograd.img);
      GameOfCollege.func.preloadImages(GameOfCollege.data.end.gradnodebt.img);
      GameOfCollege.func.preloadImages(GameOfCollege.data.end.graddebt.img);

      //event listening title screen
      $("#goc-title-container .goc-button").on("click", function () {
        GameOfCollege.func.buildScreen("title");
      });

      //event listening about screen
      $("#goc-about-container .goc-button").on("click", function () {
        GameOfCollege.func.buildScreen("about");
      });

      //event listening character screen
      $("#goc-character-container .goc-button").on("click", function () {
        if ($(this).attr("data-role") === "choices") {
          //grab character values
          GameOfCollege.data.income = $(
            '#goc-character-container select[name="income"]',
          )
            .children("option:selected")
            .val();
          GameOfCollege.data.parents = $(
            '#goc-character-container select[name="parents"]',
          )
            .children("option:selected")
            .val();
          GameOfCollege.data.race = $(
            '#goc-character-container select[name="race"]',
          )
            .children("option:selected")
            .val();
          GameOfCollege.data.school = $(
            '#goc-character-container select[name="school"]',
          )
            .children("option:selected")
            .val();
          GameOfCollege.func.buildScreen("character");
          GameOfCollege.func.eventTracking("manual");
        } else {
          GameOfCollege.func.randomCharacter();
          GameOfCollege.func.buildScreen("character");
          GameOfCollege.func.eventTracking("random");
        }

        // generate difficulty modal
        const difficulty = GameOfCollege.func.calculateDifficulty();
        $("#difficulty-screen").fadeIn(500);
        $("#difficulty-screen p:eq(0)").html(difficulty.value);
        $("#difficulty-screen p:eq(1)").html(difficulty.choices);
      });

      //event listening end screen
      $("#goc-end-container .goc-button").on("click", function () {
        if ($(this).attr("data-role") === "choices") {
          GameOfCollege.func.resetGame();
          GameOfCollege.func.buildScreen("reset");
          GameOfCollege.func.eventTracking("replay");
        } else {
          GameOfCollege.func.resetGame();
          GameOfCollege.func.randomCharacter();
          GameOfCollege.func.buildScreen("reset-random");
          GameOfCollege.func.eventTracking("replay");
          GameOfCollege.func.eventTracking("random");

          // generate difficulty modal
          const difficulty = GameOfCollege.func.calculateDifficulty();
          $("#difficulty-screen").fadeIn(500);
          $("#difficulty-screen p:eq(0)").html(difficulty.value);
          $("#difficulty-screen p:eq(1)").html(difficulty.choices);
        }
      });
      $("#goc-end-container").on("swipeleft swiperight", function (event) {
        event.preventDefault();
        if (event.type === "swipeleft") {
          GameOfCollege.func.resetGame();
          GameOfCollege.func.randomCharacter();
          GameOfCollege.func.buildScreen("reset-random");
          GameOfCollege.func.eventTracking("replay");
          GameOfCollege.func.eventTracking("random");

          // generate difficulty modal
          const difficulty = GameOfCollege.func.calculateDifficulty();
          $("#difficulty-screen").fadeIn(500);
          $("#difficulty-screen p:eq(0)").html(difficulty.value);
          $("#difficulty-screen p:eq(1)").html(difficulty.choices);
        } else if (event.type === "swiperight") {
          GameOfCollege.func.resetGame();
          GameOfCollege.func.buildScreen("reset");
          GameOfCollege.func.eventTracking("replay");
        }
      });

      //event listening swipe functionality
      $("#goc-game-container").on("swipeleft swiperight", function (event) {
        event.preventDefault();
        if (event.type === "swipeleft") {
          if (GameOfCollege.amPrompt) {
            GameOfCollege.func.processPromptButton("right");
          } else {
            GameOfCollege.func.processExplainButton();
          }
        } else if (event.type === "swiperight") {
          if (GameOfCollege.amPrompt) {
            GameOfCollege.func.processPromptButton("left");
          } else {
            GameOfCollege.func.processExplainButton();
          }
        }
      });

      //event listening prompt buttons
      $("#goc-game-container .goc-prompt .goc-button").on("click", function () {
        if (!GameOfCollege.lockSwipe) {
          GameOfCollege.func.processPromptButton($(this).attr("data-role")!);
        }
      });

      //event listening explain button
      $("#goc-game-container .goc-explain .goc-button").on(
        "click",
        function () {
          GameOfCollege.func.processExplainButton();
        },
      );

      //event listening difficulty popup button
      $("#difficulty-screen .goc-button").on("click", function () {
        $("#difficulty-screen").fadeOut(500);
      });

      $("#loading-screen").fadeOut(500, function () {
        $(this).remove();
      });
    },
    initializeLinks: (prompt: string) => {
      // make all links go to new tab
      $("#" + prompt + " a").attr("target", "_blank");
    },
    initializeScore: () => {
      // initialize score based on character options
      for (let i = 0; i < GameOfCollege.character.length; i++) {
        // income trait
        if (GameOfCollege.data.income === GameOfCollege.character[i].value) {
          GameOfCollege.data.score += GameOfCollege.character[i].score;
          continue;
        }

        // parents trait
        if (GameOfCollege.data.parents === GameOfCollege.character[i].value) {
          GameOfCollege.data.score += GameOfCollege.character[i].score;
          continue;
        }

        // race trait
        if (GameOfCollege.data.race === GameOfCollege.character[i].value) {
          GameOfCollege.data.score += GameOfCollege.character[i].score;
          continue;
        }

        // school trait
        if (GameOfCollege.data.school === GameOfCollege.character[i].value) {
          GameOfCollege.data.score += GameOfCollege.character[i].score;
          continue;
        }
      }
    },
    preloadImages: (url: string) => {
      // preload images
      const image = new Image();
      image.src = url;
    },
    processExplainButton: () => {
      if (!GameOfCollege.lockOptions) {
        GameOfCollege.lockOptions = true;
        GameOfCollege.amPrompt = true;

        $("#goc-game-container #" + GameOfCollege.data.currentPrompt).fadeOut(
          500,
        );

        if (GameOfCollege.data.nextPrompt === "end_screen") {
          GameOfCollege.func.eventTracking("finished");
          GameOfCollege.func.buildScreen("end_screen");
        } else {
          const prompt = GameOfCollege.func.determinePrompt(
            GameOfCollege.data.nextPrompt!,
          );
          GameOfCollege.func.updatePrompt(prompt);

          $("#goc-game-container #" + GameOfCollege.data.nextPrompt).fadeIn(
            500,
            function () {
              GameOfCollege.data.currentPrompt = GameOfCollege.data.nextPrompt;
              GameOfCollege.data.nextPrompt = $(
                "#goc-game-container #" + GameOfCollege.data.currentPrompt,
              ).attr("data-next_prompt")!;
              GameOfCollege.lockOptions = false;
            },
          );
        }
        GameOfCollege.lockSwipe = false;
      }
    },
    processPromptButton: (button: string) => {
      if (!GameOfCollege.lockOptions && !GameOfCollege.lockSwipe) {
        GameOfCollege.lockOptions = true;
        GameOfCollege.lockSwipe = true;
        GameOfCollege.amPrompt = false;

        // special treatment for skipping explain step of prompt
        if (GameOfCollege.data.specialPrompt) {
          GameOfCollege.data.specialPrompt = false;
          GameOfCollege.lockSwipe = false;

          $("#goc-game-container #" + GameOfCollege.data.currentPrompt).fadeOut(
            500,
          );

          const prompt = GameOfCollege.func.determinePrompt(
            GameOfCollege.data.nextPrompt!,
          );
          GameOfCollege.func.updatePrompt(prompt);

          $("#goc-game-container #" + GameOfCollege.data.nextPrompt).fadeIn(
            500,
            function () {
              GameOfCollege.data.currentPrompt = GameOfCollege.data.nextPrompt;
              GameOfCollege.data.nextPrompt = $(
                "#goc-game-container #" + GameOfCollege.data.currentPrompt,
              ).attr("data-next_prompt")!;
              GameOfCollege.lockOptions = false;
            },
          );
        } else {
          GameOfCollege.func.determineOutcome(
            GameOfCollege.data.currentPrompt!,
            button,
          );
          GameOfCollege.func.initializeLinks(GameOfCollege.data.currentPrompt);
        }

        // transition prompt to explain div
        $(
          "#goc-game-container #" +
            GameOfCollege.data.currentPrompt +
            " .goc-prompt",
        ).fadeOut(500);
        $(
          "#goc-game-container #" +
            GameOfCollege.data.currentPrompt +
            " .goc-explain",
        ).fadeIn(500, function () {
          GameOfCollege.lockOptions = false;
        });
      }
    },
    randomCharacter: () => {
      // provide random character attributes
      const income = ["very-low", "low", "middle", "middle-high", "high"] as const;
      const parents = ["finished", "no-finish"] as const;
      const race = ["white", "black", "latino", "asian", "native"] as const;
      const school = ["public", "private"] as const;

      for (let i = 0; i < 4; i++) {
        let randomNumber;
        let max;
        switch (i) {
          case 0:
            max = income.length - 1;
            randomNumber = Math.floor(Math.random() * (max - 0 + 1) + 0);
            GameOfCollege.data.income = income[randomNumber];
            break;
          case 1:
            max = parents.length - 1;
            randomNumber = Math.floor(Math.random() * (max - 0 + 1) + 0);
            GameOfCollege.data.parents = parents[randomNumber];
            break;
          case 2:
            max = race.length - 1;
            randomNumber = Math.floor(Math.random() * (max - 0 + 1) + 0);
            GameOfCollege.data.race = race[randomNumber];
            break;
          case 3:
            max = school.length - 1;
            randomNumber = Math.floor(Math.random() * (max - 0 + 1) + 0);
            GameOfCollege.data.school = school[randomNumber];
            break;
        }
      }
    },
    resetGame: () => {
      // reset game to original variables
      const data = GameOfCollege.data;
      data.score = 0;
      data.race = null;
      data.income = null;
      data.parents = null;
      data.school = null;
      data.currentPrompt = null;
      data.nextPrompt = null;
      // data.difficultyText = null;
      GameOfCollege.lockOptions = false;

      $("#goc-game-container .goc-game-item")
        .add("#goc-game-container .goc-game-item .goc-explain")
        .hide();
      $("#goc-game-container .goc-game-item .goc-prompt")
        .add(
          '#goc-game-container .goc-game-item .goc-prompt div[data-role="buttons"] div',
        )
        .show();
    },
    retreivePrompt: (prompt: string, condition: string) => {
      // retreive the data for a particular prompt
      const prompts = GameOfCollege.prompts;
      for (let i = 0; i < prompts.length; i++) {
        if (prompt === prompts[i].prompt_id) {
          if (condition === prompts[i].prompt_condition) {
            return prompts[i];
          }
        }
      }
    },
    updatePrompt: (prompt: Prompt) => {
      // update prompt based on character choices
      const $promptContainer = $("#" + prompt.prompt_id);
      $promptContainer
        .find('.goc-prompt div[data-role="content"] p')
        .html(prompt.initial_text);
      $promptContainer
        .find('.goc-prompt div[data-role="buttons"] div[data-role="left"] p')
        .html(prompt.options.left.button_text);
      $promptContainer
        .find('.goc-prompt div[data-role="buttons"] div[data-role="right"] p')
        .html(prompt.options.right.button_text);
      GameOfCollege.func.eventTracking("depth", prompt.prompt_id);
      GameOfCollege.func.initializeLinks(prompt.prompt_id);
    },
  },
};

export default GameOfCollege;
