# places
## Prototype to test new ways for the "Explore" app.
With objective to try new approach regarding the design of the « Explore » application.
I have built this fully functional prototype to see if some new suggested features really worth it.
The idea here, is to try it before even consider any changes in the current « Explore » application or in the API side.
For that reason, it’s more efficient and faster to try it apart before.  

So here’s the experimental application (I named it "Places" to avoid any confusion with the built-in « Explore » app.)

Here's the url of the script to run the application : https://aleziakurdis.github.io/places/places.js  
(To install in ??? interface: Edit > Running Scripts... Load scripts from url)    


Next, you will find the list of the different features or changes that have been put in this prototype and the reasons why they have been designed like this:

## What has been changed compare the "Explore" application:

### Retirement of the "beacon" solution... 
The beacon solution having too much flaws, it has been decommissionned for this re-built.
It won't be possible to create new beacon using this application.  
However, it will continue to list the beacon's places 
_(It has been very useful for in early time. Thank you)_


### Place API data extraction...
The extraction of the Place API data is done from the .js side, rather than the UI layer (.html).
Doing this, allows to exclude the places that are not compatible with the protocol version use by Vircadia's Interface. 
(It is not filtered out in the "Explore" app.)
It also keeps the logic separated from the UI layer, which can be useful to anyone who want to simply redesign the UI.

But that's for this prototype. In the future, the "Explore" app. is appealed to be redesign a couple of time again, 
when the number of places will become too high and certainaly another time when Vircadia will get decentralized.
The data processing will need at some point to happen in the API it-self to really scale.
So the "how to do it" will changed, but the "what it needs to do" might stay valid. _(A good reason to start to define now the "what it needs to do")_

### Removal of the pager solution...
The pager has been replaced by a scrollable list, with a "Load More..." button.
A "sidewalk" area next to the scrollbar has been inserted for a comfortable usage in HMD mode.

### Current location address...
The current location address is displayed at the footer of the "Places" application. 
This is also for HMD, since we can't see the desktop window header and there was nowhere we could see that info.

### The good things has been kept...
The navigation buttons, the search/address bar, the place entries with the blurry picture. Those things were good so they have been reused.

### Presence of Life...
Since it was clearly a problem to get the number of user for a specific place without any potential cheating.
This concept has simply been evacuated in this design. It has been replaced, instead, by a "presence of life " indicator.
The domain for it's part has the number of attendance.
So you know that on a specific place, that you can expect to reach someone, but it could be somewhere else in the domain.
The number of user or the presence of life is also no more criteria to be in top of the list.
Some people in a domain is definitely not an indicator that there is a party that you can join.

### There are 2 places list...
Because there was different needs, two list formats are available.

#### "Explore" (that you get at the opening of the application)
This list aims to make discover places and figure where the interesting event could be.
The place with a picture will appears at the first part of the list, follow by those that doesn't have one.
Setting a picture on a place implicitly means that you do something to make it more attractive. So we can expect that those place might have something to visit.
At the opposite, places without picture are those that don't expect visitor as in a museum. 
They are publicly open, but those place are workplace, test environment, in setup or just too private to be advertised.
Withing these 2 groups, each place get a seeded random ordering. 
This is to give a chance to ever place to be sometime at the top of the list. (in their respective category)
The sequence is random, but it get changed only every 5 days. 
It would be very annoying if the list was completely shuffled each time you open the application, while you get through the list.
The beauty of the seeded random is that everyone has the same chances, so it gets rid of any idiotic race to be at the top: 
like artificial count inflation or place name starting with AAA, AAAA or AAAAA to appear at first. (We saw that a lot before. In Second Life specifically.)

#### "By Domains" 
This list offer a more classic view. 
It's the list of the domain, ordered by number of attendance, then alphabetically, with their places listed below.
In that list you can see the count of user at the domain level. (This is reflecting what it is truly, with less concerns that what we have with the "Explore" app.)
It keeps thing transparent. Now you see the real amount of people.

### Place entries...
The place entries are now displaying the first line of the description instead of the manager name.
This information is clearly more useful to figure what the place is, even if we have only the 55 first character, this seems to work fine in most of the case.
Each place entry has now a link to open a "Place Detail" panel that open full page, with the picture, the description, and all the other important information: Title, owner, maturity level, domain name, count and capacity.

### Filters...
Both list can be filtered to display only the place that have "presence of life". 
You can also filter by maturity level.

### Technology...
This version is 100% js/html5/css.
There are no dependency on 3rd party libraries. Basically it's 3 files with a bunch of icons/picture.

