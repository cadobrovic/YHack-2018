# YHack-2018

I used this application to gain access
to a Tesla's odometer and unlock it at YHack 2018!

The app works with Smartcar API. So with a developer account on their site,
I was able to retrieve authentication by directing my site to their login
page and then take the code in the callback URL. 

This then gets passed into further functions before I instantiate a new vehicle
object with their API and use that to access the fields I had specified in
my authentication request.

I then unlocked the Tesla Smartcar had in the parking lot as well as pulled
data from the car and presented it to the site page.
