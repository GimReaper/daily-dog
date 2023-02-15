import { ActivityHandler, MessageFactory, Attachment } from 'botbuilder';
import RedditImageFetcher from "reddit-image-fetcher";

export class DailyDogBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            // get an dog picture.
            const redditInfo = await RedditImageFetcher.fetch({
                type: 'custom',
                total: 1, 
                subreddit: ['PuppySmiles', 'Cutedogsreddit'],
                allowNSFW: false
            });

            const imageUrl = redditInfo[0].image;
            const lastIdx = imageUrl.lastIndexOf(".");
            const imageType = "image/" + imageUrl.slice(lastIdx + 1 );

            const image: Attachment = {
                contentType: imageType,
                contentUrl: imageUrl,
            };

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
