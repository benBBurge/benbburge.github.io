import json
import tweepy
from authlib.client import AssertionSession

#create_assertion_session is authlib magic, which will generate a new authentication token each use
def create_assertion_session(conf_file, scopes, subject=None):
    with open(conf_file, 'r') as f:
        conf = json.load(f)

    token_url = conf['token_uri']
    issuer = conf['client_email']
    key = conf['private_key']
    key_id = conf.get('private_key_id')

    header = {'alg': 'RS256'}
    if key_id:
        header['kid'] = key_id

    #Google puts scope in payload
    claims = {'scope': ' '.join(scopes)}
    return AssertionSession(
        grant_type=AssertionSession.JWT_BEARER_GRANT_TYPE,
        token_url=token_url,
        issuer=issuer,
        audience=token_url,
        claims=claims,
        subject=subject,
        key=key,
        header=header,
    )
#authenticates session wihtin scopes
scopes = [
    'https://spreadsheets.google.com/feeds',
    'https://www.googleapis.com/auth/drive',
]
session = create_assertion_session('client_secret.json', scopes)
#gspread simplifies our interactions with the Google Docs/Sheets API
from gspread import Client
index = 2
gc = Client(None, session)
sheet = gc.open('your-google-sheets-name').sheet1

#Twitter API key goes here:
auth = tweepy.OAuthHandler('your-key-here', 'your-key-here')
auth.set_access_token('your-key-here', 'your-key-here')

api = tweepy.API(auth)

#override tweepy.StreamListener to add logic to on_status
class MyStreamListener(tweepy.StreamListener):

    def on_status(self, status):
        #only interacts with following users
        follows = api.show_friendship("your-twitter-id", "your-twitter-username", status.user.id, status.user.screen_name)
        #if a non-quote-tweet makes it past our filter, the program will crash while we're writting that element to our row
        if status.is_quote_status & follows[1].following:   #target follows subject, stops us tweeting at ourselves
            #print URL in console.
            print("https://twitter.com/" + status.user.screen_name + "/status/" + status.id_str + " captured to log.")
            #into row we store: username, status text, status URL, and URL of linked status.  REMOVE LINKED STATUS URL to also capture non-quote-tweets
            row = [str(status.created_at), "@" + status.user.screen_name, status.text, "https://twitter.com/" + status.user.screen_name + "/status/" + status.id_str, "https://twitter.com/" + status.quoted_status.user.screen_name + "/status/" + status.quoted_status.id_str]
            #Tweets are stored in google sheet!
            sheet.insert_row(row, index)
            api.retweet(status.id)
            if not follows[1].followed_by:   #if subject doesn't follow target
                api.create_friendship(status.user.id)   #follow them!

    

myStreamListener = MyStreamListener()
myStream = tweepy.Stream(auth = api.auth, listener=myStreamListener)
#add up to 400 hashtags and/or keywords
myStream.filter(track=["#NNDID","#NNDIC","#NNDTest"])


