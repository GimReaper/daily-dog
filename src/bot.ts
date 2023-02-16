import {
    ActivityHandler,
    MessageFactory,
    Attachment,
    TurnContext,
    ConversationReference
} from 'botbuilder';

// they messed up their .d.ts or exports, so we have to use require
const RedditImageFetcher = require("reddit-image-fetcher");

const DOG_SUBREDDITS = ['PuppySmiles', 'Cutedogsreddit'];
const CAT_SUBREDDITS = ['Thisismylifemeow', 'IllegallySmolCats', 'catpics'];
const MODE_MESSAGE = "You are in ";

export type Conversation = {
    isCatMode: boolean,
    reference: Partial<ConversationReference>
};

export class DailyDogBot extends ActivityHandler {
    constructor(
        storedConversations: Map<string, Conversation>,
    ) {
        super();

        this.onMessage(async (context, next) => {
            const reference = TurnContext.getConversationReference(context.activity);
            const conversationId = reference.conversation.id;

            if (! storedConversations.has(conversationId)) {
                const newConversation: Conversation = {isCatMode: false, reference: reference};
                storedConversations.set(conversationId, newConversation);
            }

            const conversation = storedConversations.get(conversationId);
            const activityText = context.activity.text.toLowerCase();
            if (activityText === "cat mode" || activityText == "dog mode") {
                conversation.isCatMode = activityText === "cat mode";
                const modeMessage = `${MODE_MESSAGE} ${activityText}`
                await context.sendActivity(MessageFactory.text(modeMessage, modeMessage));
            }
            else {
                await this.sendImage(context, conversation.isCatMode);
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        // TODO: Store new users so that we can later send them dogs everyday.
        // this.onMembersAdded(async (context, next) => {
        //     const membersAdded = context.activity.membersAdded;
        //     peopleList.push(membersAdded);
        //     await next();
        // });
    }

    public async sendImage(context: TurnContext, isCatMode: boolean) {
        const source_subreddits = isCatMode ? CAT_SUBREDDITS : DOG_SUBREDDITS;
        // get an dog picture.
        const redditInfo = await RedditImageFetcher.fetch({
            type: 'custom',
            total: 1, 
            subreddit: source_subreddits,
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
    }
}

