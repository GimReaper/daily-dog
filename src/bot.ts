import { ActivityHandler, MessageFactory, Attachment } from 'botbuilder';
const RedditImageFetcher = require("reddit-image-fetcher");

const CONVERSATION_DATA_PROPERTY = 'conversationData';
const USER_PROFILE_PROPERTY = 'userProfile';
const DOG_SUBREDDITS = ['PuppySmiles', 'Cutedogsreddit'];
const CAT_SUBREDDITS = ['Thisismylifemeow', 'IllegallySmolCats', 'catpics'];
const MODE_MESSAGE = "You are in ";

export class DailyDogBot extends ActivityHandler {
    conversationDataAccessor: any;
    userProfileAccessor: any;
    conversationState: any;
    userState: any;
    constructor(conversationState, userState) {
        super();
        // Create the state property accessors for the conversation data and user profile.
        this.conversationDataAccessor = conversationState.createProperty(CONVERSATION_DATA_PROPERTY);
        this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);

        // The state management objects for the conversation and user state.
        this.conversationState = conversationState;
        this.userState = userState;
        
        this.onMessage(async (context, next) => {
            // Get the state properties from the turn context.
            const userProfile = await this.userProfileAccessor.get(context, {});
            const conversationData = await this.conversationDataAccessor.get(context, {isCatMode: false});
            const activityText = context.activity.text.toLowerCase();
            if (activityText === "cat mode" || activityText == "dog mode") {
                conversationData.isCatMode = activityText === "cat mode";
                const modeMessage = `${MODE_MESSAGE} ${activityText}`
                await context.sendActivity(MessageFactory.text(modeMessage, modeMessage));
            }
            else {
                const source_subreddits = conversationData.isCatMode ? CAT_SUBREDDITS : DOG_SUBREDDITS;
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
    
    async run(context) {
        await super.run(context);

        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
    
}

