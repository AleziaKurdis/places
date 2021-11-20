# places
The "Places" application is a redesign of the "Explore" application of Vircadia.
In order to build prototypes of new features or new design approach to make this kind of tool evolves, 
it was necessary to clean up the existing solution. The "Explore" application being it-self too much built over the old temporary solution.
It was simply easier and faster to rebuild it from scratch.

This specific version of the "Places" application will be the start point to explore additional features.

## What has been changed compare the "Explore" application:

### Complete retirement of the "beacon" solution... 
The "Places" application is 100% driven by the Metaverse Server's Place API.
The beacon solution having too much flaws. It makes sense to just get rid of it. 
_(Thank you "Decentralized Goto", you have been very useful at a critical moment. We will never forget. R.I.P.)_

### Place API data extraction...
The extraction of the Place API data is done from the .js side, rather than the UI layer (.html).
Doing this, allows to exclude the places that are not compatible with the protocol version use by Vircadia's Interface. 
(It is not filtered out in the "Explore" app.)
It also keeps the logic separated from the UI layer, which can be useful to anyone who want to simply redesign the UI.

### Removal of the pager solution...
The pager has been replaced by a scrollable list, with a "Load More..." button.
A "sidewalk" area next to the scrollbar has been inserted for a comfortable usage in HMD mode.

### Current location address...
The current location address is displayed at the footer of the "Places" application. 
This is also for HMD, since we can't see the desktop window header and there was nowhere we could see that info.

### The good things has been kept...
The navigation buttons, the search/address bar, the place entries with the blurry picture. Those thing were good so they have been reused.

### Presence of Life...
Since it was clearly a problem to get the number of user for a specific place without any potential cheating.
This concept has simply been abandoned. It has been replaced, instead, by a "presence of life " indicator.
The domain for it's part has the number of attendance.
So you know that on a specific place, that you can expect to reach someone, but it could be somewhere else in the domain.
The number of user or the presence of life is also no more criteria to be in top of the list.
Some people in a domain is definitely not an indicator that there is a party that you can join.

###There is 2 places list...
Because there was different needs, 2 list formats are available.

#### "Explore & Events" (that you get at the opening of the application)
This list aims to make discover places and figure where the interesting event could be.
The place with a picture will appears at the first part of the list, follow by those that doesn't have one.
Setting a picture on a place implicitly means that you do something to make it more attractive. So we can expect that those place might have something to visit.
At the opposite, places without picture are those that don't expect visitor as in a museum. 
They are publicly open, but those place are workplace, test environment, in setup or just too private to be advertised.
Withing these 2 group, each place get a seeded random ordering. 
This is to give a chance to ever place to be sometime at the top of the list. (in their respective category)
The sequence is random, but it get changed only every 5 days. 
It would be very annoying if the list was completely shuffled each time you open the application, while you get through the list.
The beauty of the seeded random is that everyone has the same chances so it gets rid of any idiotic race to be at the top: 
like artificial count inflation or place name with AAA, AAAA or AAAAA to appear at first. 

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
There are no more any dependency on 3rd party libraries. Basically it's 3 file with a bunch of icons/picture.

##WHY ALL THIS:
From all this, the next step is to develop a way to help people to know where exactly they will be truly welcomed, 
and where are the ongoing events. All this has been put in place to start the exploration of these objectives.
There is no objective here to replace the current "Explore" application unless the future developpement of this makes it a more useful tool. 
In the worst case it could end as an alternative UI available in the "More+" app. repository.

##Script to run in Vircadia:
https://aleziakurdis.github.io/places/places.js
