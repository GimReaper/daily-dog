import { ActivityHandler, MessageFactory, Attachment } from 'botbuilder';

export class DailyDogBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            // TODO get an dog picture.

            const image: Attachment = {
                contentType: "image/jpg",
                contentUrl: "https://media.istockphoto.com/id/467923438/photo/silly-dog-tilts-head-in-front-of-barn.jpg?s=612x612&w=0&k=20&c=haPwfoPl_ggvNKAga_Qv4r88qWdcpH-qZ5DaBba6-8U=",
            };
            // Message Factory doesn't have a .image(),, but it dose have an .attachemnt() so maybe that's what we want.
            const message = MessageFactory.attachment(image);
            await context.sendActivity(message);
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
