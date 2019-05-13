import tweepy

#API key goes here:
auth = tweepy.OAuthHandler('your-key-here', 'your-key-here')
auth.set_access_token('your-key-here', 'your-key-here')

#coordinates bounding Union Square Park
#I recomend creating a bounding box at openstreetmap.org/export
minlat = 40.73450
minlon = -73.99187
maxlat = 40.73715
maxlon = -73.98903

api = tweepy.API(auth)

#override tweepy.StreamListener to add logic to on_status
class MyStreamListener(tweepy.StreamListener):

    def on_status(self, status):
        #print links to each tweet within cordinates
        print("https://twitter.com/" + status.user.screen_name + "/status/" + status.id_str)

myStreamListener = MyStreamListener()
myStream = tweepy.Stream(auth = api.auth, listener=myStreamListener)
#filter for as many as 25 bounding boxes simultaneously.  format is shown below
myStream.filter(locations=[minlon, minlat, maxlon, maxlat])
#myStream.filter(locations=[minlon, minlat, maxlon, maxlat, minlon2, minlat2, maxlon2, maxlat2, minlon3, minlat3, maxlon3, maxlat3])


