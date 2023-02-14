import { ActivityHandler, MessageFactory } from 'botbuilder';

export class DailyDogBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            // TODO get an dog picture.  Then send it.

            // Message Factory doesn't have a .image(),, but it dose have an .attachemnt() so maybe that's what we want.
            await context.sendActivity(MessageFactory.text("dog picture"));
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        // TODO: Store new users so that we can later send them dogs everyday.
        // this.onMembersAdded(async (context, next) => {
        //     const membersAdded = context.activity.membersAdded;
        //     const welcomeText = 'Hello and welcome!';
        //     for (const member of membersAdded) {
        //         if (member.id !== context.activity.recipient.id) {
        //             await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
        //         }
        //     }
        //     // By calling next() you ensure that the next BotHandler is run.
        //     await next();
        // });
    }
}
