import {
    ActivityHandler,
    MessageFactory,
    Attachment,
    ConversationState,
    UserState,
    TurnContext,
} from 'botbuilder';

// they messed up their .d.ts or exports, so we have to use require
const RedditImageFetcher = require("reddit-image-fetcher");

const CONVERSATION_DATA_PROPERTY = 'conversationData';
const USER_PROFILE_PROPERTY = 'userProfile';
const DOG_SUBREDDITS = ['PuppySmiles', 'Cutedogsreddit'];
const CAT_SUBREDDITS = ['Thisismylifemeow', 'IllegallySmolCats', 'catpics'];
const MODE_MESSAGE = "You are in ";
const millisecond = 1;
const second = 1000 * millisecond;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

type ConversationData = {isCatMode: boolean};

export class DailyDogBot extends ActivityHandler {
    constructor(
        private conversationState: ConversationState,
        private userState: UserState,
    ) {
        super();
        // Create the state property accessors for the conversation data and uer profile.
        const conversationDataAccessor = conversationState.createProperty<ConversationData>(CONVERSATION_DATA_PROPERTY);
        const userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);
        
        this.onMessage(async (context, next) => {
            // Get the state properties from the turn context.
            const userProfile = await userProfileAccessor.get(context, {});
            const conversationData = await conversationDataAccessor.get(context, {isCatMode: false});
            const activityText = context.activity.text.toLowerCase();
            if (activityText === "cat mode" || activityText == "dog mode") {
                conversationData.isCatMode = activityText === "cat mode";
                const modeMessage = `${MODE_MESSAGE} ${activityText}`
                await context.sendActivity(modeMessage);
            }
            else {
                const source_subreddits = conversationData.isCatMode ? CAT_SUBREDDITS : DOG_SUBREDDITS;
                // get an dog or cat picture.
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
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        // TODO: Store new users so that we can later send them dogs everyday.
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    const welcomeMessage = 'Welcome to the daily dog bot! To switch to cat mode, type "cat mode". To switch back to dog mode, type "dog mode" in the chat.';
                    await context.sendActivity(welcomeMessage);
                }
            }

            await next();
        });

        function sendDogMessages() {

            // TODO send messages
            // for(people of peopleList){
                
            // }

            // inside so that is gets called again and again...
            setInterval(sendDogMessages, day);
        }

        sendDogMessages();
    }
    
    async run(context: TurnContext) {
        await super.run(context);

        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
    
}

