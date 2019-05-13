import time
import tweepy

#API key goes here:
auth = tweepy.OAuthHandler('your-key-here', 'your-key-here')
auth.set_access_token('your-key-here', 'your-key-here')

#enter the screen name for the account 
targetUser = "potus"
targetUserID = "822215679726100480"
#will toggle friend collecting phase
collectingFriends = True
#in this array we will store user IDs who are followed by the target account
friendsList = []

api = tweepy.API(auth)

#override tweepy.StreamListener to add logic to on_status
class MyStreamListener(tweepy.StreamListener):

    def on_status(self, status):
        #double checks targetUser is following the account.  Deleate the next two lines to include mentions
        follows = api.show_friendship(targetUserID, targetUser, status.user.id, status.user.screen_name)
        if follows[0].following:
            print(str(status.user.screen_name) + " " +ascii(status.text))

users = tweepy.Cursor(api.friends, screen_name=targetUser).items()

while collectingFriends:            #while using Cursor
    try:
        user = next(users)          #get next page of users target follows
    except tweepy.TweepError:       #if we exceed limits, wait...
        time.sleep(60*15)           #wait for it...
        user = next(users)          #try again
    except StopIteration:           #after we have them all, or up to 5000 user IDs
        collectingFriends = False   #ends friend collection when out of accounts
        break
    print ("@" + user.screen_name)  #prints username of friend
    friendsList.append(user.id)     #adds this friend's ID to the array

#begin streaming
friendsStr = ', '.join(map(str, friendsList))       #turns friendList array into a string we'll pass to the filter
myStreamListener = MyStreamListener()
myStream = tweepy.Stream(auth = api.auth, listener=myStreamListener)
#consider using a "high" filter_level when managing high volume filters.
#Filter_level are 'none' 'low' 'medium' 'high'
myStream.filter(follow=[friendsStr], filter_level='high')


    

