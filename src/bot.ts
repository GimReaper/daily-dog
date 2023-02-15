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
        //     peopleList.push(membersAdded);
        //     await next();
        // });
        
        const millisecond = 1;
        const second = 1000 * millisecond;
        const minute = 60 * second;
        const hour = 60 * minute;
        const day = 24 * hour;
        function sendDogMessages() {

            // TODO send messages
            // for(people of peopleList){
                
            // }

            // inside so that is gets called again and again...
            setInterval(sendDogMessages, day);
        }

        sendDogMessages();
    }
}

