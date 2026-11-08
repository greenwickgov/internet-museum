// Exhibit tuple: [year, exact Wikipedia title, short visual label, curator note, "look closer" detail]
const HALLS=[
{id:"origins",name:"Origins",era:"1960s–1980s",h:265,blurb:"Packets, protocols and the handful of machines that first spoke to each other.",items:[
[1969,"ARPANET","ARPANET","On 29 October 1969 a computer at UCLA tried to log in to one at Stanford. It was the first message sent across the network that grew into the internet.","The system crashed after two letters. The word was meant to be LOGIN."],
[1971,"Email","@","Ray Tomlinson made messages travel between separate computers and chose the @ sign to split a person’s name from their machine.","Before this, mail only reached people sharing the same computer."],
[1973,"Ethernet","Ethernet","At Xerox PARC, Robert Metcalfe sketched a way for many machines to share one cable. It still wires offices and homes today.","He imagined the cable as a shared “ether” that every computer listens to."],
[1978,"Bulletin board system","BBS","Two hobbyists in Chicago built the first public bulletin board, where anyone with a modem could dial in and leave a message.","It was built during a blizzard, while the roads were closed."],
[1983,"Internet protocol suite","TCP/IP","On 1 January 1983 every host on ARPANET switched to a common language. Many people count it as the internet’s true birthday.","Everyone had to switch on the same day, with no gradual rollout."],
[1985,"Domain Name System","DNS","Readable names replaced strings of numbers, and the first .com name was registered in March 1985.","Before DNS, one master file of host names was copied around by hand."]]},
{id:"web",name:"The Web",era:"1989–2000",h:200,blurb:"A physicist’s hypertext proposal turns a network into a place.",items:[
[1991,"World Wide Web","WWW","Tim Berners-Lee built the first web server and browser at CERN, so that scientists could link their documents together.","In 1993 CERN made the software free for anyone to use."],
[1993,"Mosaic (web browser)","Mosaic","Mosaic put images inline with text and ran on common computers. For many people it was the first time the web looked inviting.","One of its creators, Marc Andreessen, went on to co-found Netscape."],
[1994,"Netscape Navigator","Netscape","Netscape’s browser dominated the mid-1990s, and its 1995 stock debut helped ignite the dot-com boom.","It introduced JavaScript, now the language of nearly every web page."],
[1995,"Internet Explorer","IE","Microsoft bundled a browser with Windows, which started the browser wars and, later, antitrust trials.","At its peak it was used by the large majority of people online."],
[1995,"Amazon (company)","Amazon","Amazon launched as an online bookstore and showed that people would trust a website with their credit card.","Books were chosen because no shop could stock as many titles as a website could list."],
[1999,"Napster","Napster","Shawn Fanning’s file-sharing service let millions swap music, and forced the record industry to rethink how music is sold.","Court rulings shut it down in 2001, but it had already changed everyone’s expectations."]]},
{id:"search",name:"Search & Knowledge",era:"1990–2010s",h:35,blurb:"How we learned to ask the internet anything.",items:[
[1990,"Archie (search engine)","Archie","Archie indexed the file names on public FTP servers, which makes it the ancestor of every search box.","It arrived before the web existed."],
[1994,"Yahoo!","Yahoo!","Two Stanford students began with a hand-built directory of favourite links, sorted by topic.","Its first name was Jerry and David’s Guide to the World Wide Web."],
[1996,"Internet Archive","Archive","Brewster Kahle began saving copies of the web so that pages would not vanish when sites changed or closed.","Its Wayback Machine lets you see sites as they looked years ago."],
[1998,"Google Search","Google","Larry Page and Sergey Brin ranked pages by how many other pages linked to them, and results got much better.","The name is a play on googol, the number one followed by a hundred zeros."],
[2001,"Wikipedia","Wikipedia","An encyclopedia that anyone can edit grew into one of the most visited sites in the world.","Every article has a history tab showing each change ever made."],
[2005,"YouTube","YouTube","YouTube made posting a video as easy as sending an email, and created a new kind of celebrity.","The first upload was a short clip filmed at a zoo."]]},
{id:"social",name:"Social",era:"1997–2016",h:325,blurb:"The web turns personal: profiles, friends, feeds.",items:[
[1997,"SixDegrees.com","SixDegrees","Often called the first social network, it let people list friends and message them years before the idea went mainstream.","It was named after the idea that everyone is only a few introductions apart."],
[2003,"Myspace","Myspace","Customisable profiles with music and glitter backgrounds gave a generation its first online identity.","The Top 8 friends list turned friendship into a public ranking."],
[2004,"Facebook","Facebook","It began as a directory for Harvard students and became a social network for much of the world.","It started at one university and opened to the public in 2006."],
[2006,"Twitter","Twitter","Posts limited to 140 characters made public conversation instant, and helped invent the hashtag.","The first post announced that its creator was just setting up the service."],
[2010,"Instagram","Instagram","Square photos and filters turned every phone into a camera for sharing small moments.","It was bought by Facebook only eighteen months after launch."],
[2016,"TikTok","TikTok","Short vertical videos and a recommendation feed that learns quickly changed how entertainment spreads.","Its feed shows you what the system predicts you will like, not only what your friends post."]]},
{id:"play",name:"Games & Play",era:"1978–2017",h:130,blurb:"Where the network became a playground.",items:[
[1978,"MUD","MUD","Roy Trubshaw and Richard Bartle built a shared text world where strangers could explore rooms together.","There are no graphics at all. Everything is described in words."],
[1996,"Quake (video game)","Quake","Quake brought fast 3D action to the internet, and made words like ping and lag part of everyday life.","Its mod community helped create the modern game industry."],
[1997,"Ultima Online","Ultima","One of the first worlds where thousands of players shared a single persistent map.","Players held jobs, built houses and traded in a real economy."],
[2004,"World of Warcraft","WoW","Millions lived inside a shared fantasy world with its own economy, friendships and rituals.","Subscriptions peaked at more than ten million."],
[2009,"Minecraft","Minecraft","A game of building with blocks became a global creative platform used in homes and classrooms.","The first versions were released while the game was still being made."],
[2017,"Fortnite","Fortnite","A free battle royale mode turned a game into a place where friends gather, and where concerts are held.","Its in-game events have been watched live by millions at once."]]},
{id:"culture",name:"Culture & Memes",era:"1994–2012",h:12,blurb:"Jokes, glitter and viral ideas that spread faster than news.",items:[
[1994,"GeoCities","GeoCities","Free homepages sorted into themed neighbourhoods gave amateurs their own corner of the web.","Under construction signs and hit counters were everywhere."],
[1996,"Dancing Baby","Baby","A 3D baby animation spread by email chain and even reached television, one of the first things to go viral.","It was originally a demo made to show off animation software."],
[1998,"Hampster Dance","Hampster","Rows of animated hamsters danced to a sped-up tune on a page made as a friendly contest.","The spelling mistake in the name is part of the legend."],
[2007,"Lolcat","Lolcat","Pictures of cats with misspelled captions became a shared language and a whole genre of humour.","The broken grammar was part of the joke."],
[2007,"Rickrolling","Rickroll","A bait-and-switch prank made an old pop song the internet’s longest-running joke.","It worked because the link looked like something else."],
[2012,"Gangnam Style","Gangnam","A South Korean music video was the first on YouTube to pass a billion views.","It outgrew YouTube’s view counter, which had to be upgraded."]]},
{id:"now",name:"The Present",era:"2006–today",h:170,blurb:"Phones, clouds and models that talk back.",items:[
[2006,"Amazon Web Services","AWS","Renting computing power by the hour let a student start a company with a credit card.","It made servers something you rent rather than something you buy."],
[2007,"IPhone","iPhone","The internet moved into our pockets, with a full web browser in a phone that anyone could use.","Apps arrived a year later and changed what a phone was for."],
[2009,"Bitcoin","Bitcoin","A ledger that nobody owns, kept by thousands of computers, offered a new kind of digital trust.","Its creator used a pseudonym and has never been identified."],
[2019,"Starlink","Starlink","Thousands of small satellites in low orbit beam internet to places that cables never reached.","Each satellite is a node, and the sky is the infrastructure."],
[2020,"Zoom Video Communications","Zoom","When the world stayed home, video calls became how we worked, studied and met friends.","Daily meeting participants multiplied many times in a few months."],
[2022,"ChatGPT","ChatGPT","Conversation became an interface to the sum of the web, and drew a huge audience within days.","It is trained on text that people published to the web."]]}
];
if(typeof module!=="undefined")module.exports=HALLS;
