import { VerseData } from '../types/bible';
import { MATTHEW_COMPLETE_SCRIPTURES } from './matthewScriptures';

export const VERIFIED_SCRIPTURES: VerseData[] = [
  // ==========================================
  // JOHN CHAPTER 3 (Yohana 3)
  // ==========================================
  {
    book: 'John',
    chapter: 3,
    verse: 1,
    enText: 'There was a man of the Pharisees named Nicodemus, a ruler of the Jews.',
    swText: 'Basi palikuwa na mtu mmoja wa Mafarisayo, jina lake Nikodemo, mkuu wa Wayahudi.',
    isJesusWords: false,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 2,
    enText: 'This man came to Jesus by night and said to Him, "Rabbi, we know that You are a teacher come from God; for no one can do these signs that You do unless God is with him."',
    swText: 'Huyo alimjia usiku, akamwambia, "Rabi, twajua ya kuwa u mwalimu uliyetoka kwa Mungu; kwa maana hakuna mtu awezaye kuzifanya ishara hizi uzifanyazo wewe, isipokuwa Mungu yupo pamoja naye."',
    isJesusWords: false,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 3,
    enText: 'Jesus answered and said to him, "Most assuredly, I say to you, unless one is born again, he cannot see the kingdom of God."',
    swText: 'Yesu akajibu, akamwambia, "Amin, amin, nakuambia, Mtu asipozaliwa mara ya pili, hawezi kuuona ufalme wa Mungu."',
    isJesusWords: true,
    segmentsEn: [
      { text: 'Jesus answered and said to him, ', isJesus: false },
      { text: '"Most assuredly, I say to you, unless one is born again, he cannot see the kingdom of God."', isJesus: true },
    ],
    segmentsSw: [
      { text: 'Yesu akajibu, akamwambia, ', isJesus: false },
      { text: '"Amin, amin, nakuambia, Mtu asipozaliwa mara ya pili, hawezi kuuona ufalme wa Mungu."', isJesus: true },
    ],
  },
  {
    book: 'John',
    chapter: 3,
    verse: 4,
    enText: 'Nicodemus said to Him, "How can a man be born when he is old? Can he enter a second time into his mother\'s womb and be born?"',
    swText: 'Nikodemo akamwambia, "Awezaje mtu kuzaliwa, akiwa mzee? Aweza kuingia tumboni mwa mamaye mara ya pili akazaliwa?"',
    isJesusWords: false,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 5,
    enText: 'Jesus answered, "Most assuredly, I say to you, unless one is born of water and the Spirit, he cannot enter the kingdom of God."',
    swText: 'Yesu akajibu, "Amin, amin, nakuambia, Mtu asipozaliwa kwa maji na kwa Roho, hawezi kuuingia ufalme wa Mungu."',
    isJesusWords: true,
    segmentsEn: [
      { text: 'Jesus answered, ', isJesus: false },
      { text: '"Most assuredly, I say to you, unless one is born of water and the Spirit, he cannot enter the kingdom of God."', isJesus: true },
    ],
    segmentsSw: [
      { text: 'Yesu akajibu, ', isJesus: false },
      { text: '"Amin, amin, nakuambia, Mtu asipozaliwa kwa maji na kwa Roho, hawezi kuuingia ufalme wa Mungu."', isJesus: true },
    ],
  },
  {
    book: 'John',
    chapter: 3,
    verse: 6,
    enText: '"That which is born of the flesh is flesh, and that which is born of the Spirit is spirit."',
    swText: '"Kilichozaliwa kwa mwili ni mwili; na kilichozaliwa kwa Roho ni roho."',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 7,
    enText: '"Do not marvel that I said to you, \'You must be born again.\'"',
    swText: '"Usistaajabu kwa kuwa nilikuambia, Imewapasa ninyi kuzaliwa mara ya pili."',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 8,
    enText: '"The wind blows where it wishes, and you hear the sound of it, but cannot tell where it comes from and where it goes. So is everyone who is born of the Spirit."',
    swText: '"Upepo huvuma upendako, na sauti yake waisikia, lakini hujui unakotoka wala unakokwenda; kadhalika na kila mtu aliyezaliwa kwa Roho."',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 9,
    enText: 'Nicodemus answered and said to Him, "How can these things be?"',
    swText: 'Nikodemo akajibu, akamwambia, "Mambo haya yawezaje kuwa?"',
    isJesusWords: false,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 10,
    enText: 'Jesus answered and said to him, "Are you the teacher of Israel, and do not know these things?"',
    swText: 'Yesu akajibu, akamwambia, "Wewe u mwalimu wa Israeli, na mambo haya huyafahamu?"',
    isJesusWords: true,
    segmentsEn: [
      { text: 'Jesus answered and said to him, ', isJesus: false },
      { text: '"Are you the teacher of Israel, and do not know these things?"', isJesus: true },
    ],
    segmentsSw: [
      { text: 'Yesu akajibu, akamwambia, ', isJesus: false },
      { text: '"Wewe u mwalimu wa Israeli, na mambo haya huyafahamu?"', isJesus: true },
    ],
  },
  {
    book: 'John',
    chapter: 3,
    verse: 11,
    enText: '"Most assuredly, I say to you, We speak what We know and testify what We have seen, and you do not receive Our witness."',
    swText: '"Amin, amin, nakuambia ya kwamba, Lile tulijualo twalinena, na lile tuliloliona twalishuhudia; wala ushuhuda wetu hamwukubali."',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 12,
    enText: '"If I have told you earthly things and you do not believe, how will you believe if I tell you heavenly things?"',
    swText: '"Ikiwa nimewaambia mambo ya duniani, wala hamsadiki, mtasadiki wapi nikiwaambia mambo ya mbinguni?"',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 13,
    enText: '"No one has ascended to heaven but He who came down from heaven, that is, the Son of Man who is in heaven."',
    swText: '"Wala hakuna mtu aliyepaa mbinguni, ila yeye aliyeshuka kutoka mbinguni, yaani, Mwana wa Adamu aliye mbinguni."',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 14,
    enText: '"And as Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up,"',
    swText: '"Na kama vile Musa alivyomwinua yule nyoka jangwani, vivyo hivyo Mwana wa Adamu hana budi kuinuliwa,"',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 15,
    enText: '"that whoever believes in Him should not perish but have eternal life."',
    swText: '"ili kila mtu aaminiye awe na uzima wa milele katika yeye."',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 16,
    enText: 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.',
    swText: 'Kwa maana jinsi hii Mungu aliupenda ulimwengu, hata akamtoa Mwanawe pekee, ili kila mtu amwaminiye asipotee, bali awe na uzima wa milele.',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 17,
    enText: 'For God did not send His Son into the world to condemn the world, but that the world through Him might be saved.',
    swText: 'Maana Mungu hakumtuma Mwana ulimwenguni ili auhukumu ulimwengu, bali ulimwengu uokolewe katika yeye.',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 18,
    enText: 'He who believes in Him is not condemned; but he who does not believe is condemned already, because he has not believed in the name of the only begotten Son of God.',
    swText: 'Amwaminiye yeye hahukumiwi; asiyeamini amekwisha kuhukumiwa; kwa sababu hakuliamini jina la Mwana wa pekee wa Mungu.',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 19,
    enText: 'And this is the condemnation, that the light has come into the world, and men loved darkness rather than light, because their deeds were evil.',
    swText: 'Na hii ndiyo hukumu; ya kuwa nuru imekuja ulimwenguni, nao watu wakapenda giza kuliko nuru; kwa maana matendo yao yalikuwa maovu.',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 20,
    enText: 'For everyone practicing evil hates the light and does not come to the light, lest his deeds should be exposed.',
    swText: 'Maana kila mtu atendaye mabaya huichukia nuru, wala haji kwenye nuru, matendo yake yasije yakakemewa.',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 3,
    verse: 21,
    enText: 'But he who does the truth comes to the light, that his deeds may be clearly seen, that they have been done in God.',
    swText: 'Bali yeye aitendaye kweli huja kwenye nuru, ili matendo yake yawekwe wazi, ya kuwa yametendwa katika Mungu.',
    isJesusWords: true,
  },

  // ==========================================
  // JOHN CHAPTER 1 (Yohana 1)
  // ==========================================
  {
    book: 'John',
    chapter: 1,
    verse: 1,
    enText: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
    swText: 'Hapo mwanzo kulikuwako Neno, naye Neno alikuwako kwa Mungu, naye Neno alikuwa Mungu.',
    isJesusWords: false,
  },
  {
    book: 'John',
    chapter: 1,
    verse: 2,
    enText: 'He was in the beginning with God.',
    swText: 'Huyo mwanzo alikuwako kwa Mungu.',
    isJesusWords: false,
  },
  {
    book: 'John',
    chapter: 1,
    verse: 3,
    enText: 'All things were made through Him, and without Him nothing was made that was made.',
    swText: 'Vyote vilifanyika kwa huyo; wala pasipo yeye hakikufanyika cho chote kilichofanyika.',
    isJesusWords: false,
  },
  {
    book: 'John',
    chapter: 1,
    verse: 4,
    enText: 'In Him was life, and the life was the light of men.',
    swText: 'Ndani yake ndimo ulimokuwa uzima, nao ule uzima ulikuwa nuru ya watu.',
    isJesusWords: false,
  },
  {
    book: 'John',
    chapter: 1,
    verse: 5,
    enText: 'And the light shines in the darkness, and the darkness did not comprehend it.',
    swText: 'Nayo nuru yang\'aa gizani, wala giza halikuiweza.',
    isJesusWords: false,
  },
  {
    book: 'John',
    chapter: 1,
    verse: 12,
    enText: 'But as many as received Him, to them He gave the right to become children of God, to those who believe in His name:',
    swText: 'Bali wote waliompokea aliwapa uwezo wa kufanyika watoto wa Mungu, ndio wale waliaminio jina lake;',
    isJesusWords: false,
  },
  {
    book: 'John',
    chapter: 1,
    verse: 14,
    enText: 'And the Word became flesh and dwelt among us, and we beheld His glory, the glory as of the only begotten of the Father, full of grace and truth.',
    swText: 'Naye Neno alifanyika mwili, akakaa kwetu; nasi tukauona utukufu wake, utukufu kama wa Mwana pekee atokaye kwa Baba, amejaa neema na kweli.',
    isJesusWords: false,
  },

  // ==========================================
  // MATTHEW CHAPTERS 1-4 (Complete & Authentically Aligned)
  // ==========================================
  ...MATTHEW_COMPLETE_SCRIPTURES,

  // ==========================================
  // MATTHEW CHAPTER 7 (Mathayo 7) - Ask, Seek, Knock & Rock Foundation
  // ==========================================
  {
    book: 'Matthew',
    chapter: 7,
    verse: 7,
    enText: '"Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you."',
    swText: '"Ombeni, nanyi mtapewa; tafuteni, nanyi mtaona; bisheni, nanyi mtafunguliwa;"',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 7,
    verse: 8,
    enText: '"For everyone who asks receives, and he who seeks finds, and to him who knocks it will be opened."',
    swText: '"kwa kuwa kila aombaye hupokea; naye atafutaye huona; naye abishaye atafunguliwa."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 7,
    verse: 12,
    enText: '"Therefore, whatever you want men to do to you, do also to them, for this is the Law and the Prophets."',
    swText: '"Basi yo yote mtakayoyatenda watu, nanyi watendeeni vivyo hivyo; maana hiyo ndiyo torati na manabii."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 7,
    verse: 24,
    enText: '"Therefore whoever hears these sayings of Mine, and does them, I will liken him to a wise man who built his house on the rock:"',
    swText: '"Basi kila asikiaye hayo maneno yangu, na kuyafanya, atafananishwa na mtu mwenye akili, aliyejenga nyumba yake juu ya mwamba;"',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 7,
    verse: 25,
    enText: '"and the rain descended, the floods came, and the winds blew and beat on that house; and it did not fall, for it was founded on the rock."',
    swText: '"mvua ikanyesha, mafuriko yakaja, pepo zikavuma, zikaipiga nyumba ile; isianguke; kwa maana ilikuwa imejengwa juu ya mwamba."',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 14,
    verse: 1,
    enText: '"Let not your heart be troubled; you believe in God, believe also in Me."',
    swText: '"Msifadhaike mioyoni mwenu; mnamwamini Mungu, niaminini na mimi."',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 14,
    verse: 2,
    enText: '"In My Father\'s house are many mansions; if it were not so, I would have told you. I go to prepare a place for you."',
    swText: '"Nyumbani mwa Baba yangu mna makao mengi; kama sivyo, ningaliwaambia; maana naenda kuwaandalia mahali."',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 14,
    verse: 3,
    enText: '"And if I go and prepare a place for you, I will come again and receive you to Myself; that where I am, there you may be also."',
    swText: '"Basi mimi nikienda na kuwaandalia mahali, nitakuja tena niwakaribishe kwangu; ili nilipo mimi, nanyi mwepo."',
    isJesusWords: true,
  },
  {
    book: 'John',
    chapter: 14,
    verse: 6,
    enText: 'Jesus said to him, "I am the way, the truth, and the life. No one comes to the Father except through Me."',
    swText: 'Yesu akamwambia, "Mimi ndimi njia, na kweli, na uzima; mtu haji kwa Baba, ila kwa njia ya mimi."',
    isJesusWords: true,
    segmentsEn: [
      { text: 'Jesus said to him, ', isJesus: false },
      { text: '"I am the way, the truth, and the life. No one comes to the Father except through Me."', isJesus: true },
    ],
    segmentsSw: [
      { text: 'Yesu akamwambia, ', isJesus: false },
      { text: '"Mimi ndimi njia, na kweli, na uzima; mtu haji kwa Baba, ila kwa njia ya mimi."', isJesus: true },
    ],
  },
  {
    book: 'John',
    chapter: 14,
    verse: 27,
    enText: '"Peace I leave with you, My peace I give to you; not as the world gives do I give to you. Let not your heart be troubled, neither let it be afraid."',
    swText: '"Amani nawaachieni; amani yangu nawapa; niwapavyo mimi sivyo kama ulimwengu utoavyo. Msifadhaike mioyoni mwenu, wala msiwe na woga."',
    isJesusWords: true,
  },

  // ==========================================
  // MATTHEW CHAPTER 5 (Mathayo 5) - Beatitudes
  // ==========================================
  {
    book: 'Matthew',
    chapter: 5,
    verse: 1,
    enText: 'And seeing the multitudes, He went up on a mountain, and when He was seated His disciples came to Him.',
    swText: 'Naye alipowaona makutano, alipanda mlimani; na alipokwisha kuketi, wanafunzi wake walimwendea;',
    isJesusWords: false,
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 2,
    enText: 'Then He opened His mouth and taught them, saying:',
    swText: 'akafumbua kinywa chake, akawafundisha, akisema,',
    isJesusWords: false,
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 3,
    enText: '"Blessed are the poor in spirit, for theirs is the kingdom of heaven."',
    swText: '"Heri walio maskini wa roho; maana ufalme wa mbinguni ni wao."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 4,
    enText: '"Blessed are those who mourn, for they shall be comforted."',
    swText: '"Heri wenye huzuni; maana hao watafarijiwa."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 5,
    enText: '"Blessed are the meek, for they shall inherit the earth."',
    swText: '"Heri wenye upole; maana hao watairithi nchi."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 6,
    enText: '"Blessed are those who hunger and thirst for righteousness, for they shall be filled."',
    swText: '"Heri wenye njaa na kiu ya haki; maana hao watashibishwa."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 7,
    enText: '"Blessed are the merciful, for they shall obtain mercy."',
    swText: '"Heri wenye rehema; maana hao watapata rehema."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 8,
    enText: '"Blessed are the pure in heart, for they shall see God."',
    swText: '"Heri wenye moyo safi; maana hao watamwona Mungu."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 9,
    enText: '"Blessed are the peacemakers, for they shall be called sons of God."',
    swText: '"Heri wapatanishi; maana hao wataitwa wana wa Mungu."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 14,
    enText: '"You are the light of the world. A city that is set on a hill cannot be hidden."',
    swText: '"Ninyi ni nuru ya ulimwengu. Mji hauwezi kusitirika ukiwa juu ya mlima."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 16,
    enText: '"Let your light so shine before men, that they may see your good works and glorify your Father in heaven."',
    swText: '"Vivyo hivyo nuru yenu na iangaze mbele ya watu, wapate kuyaona matendo yenu mema, wamtukuze Baba yenu aliye mbinguni."',
    isJesusWords: true,
  },

  // ==========================================
  // MATTHEW CHAPTER 6 (Mathayo 6) - Lord's Prayer
  // ==========================================
  {
    book: 'Matthew',
    chapter: 6,
    verse: 9,
    enText: '"In this manner, therefore, pray: Our Father in heaven, hallowed be Your name."',
    swText: '"Basi ninyi salini hivi: Baba yetu uliye mbinguni, Jina lako litukuzwe."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 10,
    enText: '"Your kingdom come. Your will be done on earth as it is in heaven."',
    swText: '"Ufalme wako uje. Mapenzi yako yatimizwe, hapa duniani kama huko mbinguni."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 11,
    enText: '"Give us this day our daily bread."',
    swText: '"Utupe leo riziki yetu ya kila siku."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 12,
    enText: '"And forgive us our debts, as we forgive our debtors."',
    swText: '"Utusamehe deni zetu, kama sisi nasi tuwasamehevyo wadeni wetu."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 13,
    enText: '"And do not lead us into temptation, but deliver us from the evil one. For Yours is the kingdom and the power and the glory forever. Amen."',
    swText: '"Na usitutie majaribuni, lakini utuokoe na yule mwovu. Kwa kuwa ufalme ni wako, na nguvu, na utukufu, hata milele. Amina."',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 33,
    enText: '"But seek first the kingdom of God and His righteousness, and all these things shall be added to you."',
    swText: '"Bali utafuteni kwanza ufalme wake, na haki yake; na hayo yote mtazidishiwa."',
    isJesusWords: true,
  },

  // ==========================================
  // MATTHEW CHAPTER 28 (Mathayo 28) - Great Commission
  // ==========================================
  {
    book: 'Matthew',
    chapter: 28,
    verse: 18,
    enText: 'And Jesus came and spoke to them, saying, "All authority has been given to Me in heaven and on earth."',
    swText: 'Yesu akaja kwao, akasema nao, akawaambia, "Nimepewa mamlaka yote mbinguni na duniani."',
    isJesusWords: true,
    segmentsEn: [
      { text: 'And Jesus came and spoke to them, saying, ', isJesus: false },
      { text: '"All authority has been given to Me in heaven and on earth."', isJesus: true },
    ],
    segmentsSw: [
      { text: 'Yesu akaja kwao, akasema nao, akawaambia, ', isJesus: false },
      { text: '"Nimepewa mamlaka yote mbinguni na duniani."', isJesus: true },
    ],
  },
  {
    book: 'Matthew',
    chapter: 28,
    verse: 19,
    enText: '"Go therefore and make disciples of all the nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,"',
    swText: '"Basi, enendeni, mkawafanye mataifa yote kuwa wanafunzi, mkiwabatiza kwa jina la Baba, na Mwana, na Roho Mtakatifu;"',
    isJesusWords: true,
  },
  {
    book: 'Matthew',
    chapter: 28,
    verse: 20,
    enText: '"teaching them to observe all things that I have commanded you; and lo, I am with you always, even to the end of the age." Amen.',
    swText: '"na kuwafundisha kuyashika yote niliyowaamuru ninyi; na tazama, mimi nipo pamoja nanyi siku zote, hata ukamilifu wa dahari." Amina.',
    isJesusWords: true,
  },

  // ==========================================
  // PSALMS CHAPTER 23 (Zaburi 23)
  // ==========================================
  {
    book: 'Psalms',
    chapter: 23,
    verse: 1,
    enText: 'The Lord is my shepherd; I shall not want.',
    swText: 'Bwana ndiye mchungaji wangu, sitapungukiwa na kitu.',
    isJesusWords: false,
  },
  {
    book: 'Psalms',
    chapter: 23,
    verse: 2,
    enText: 'He makes me to lie down in green pastures; He leads me beside the still waters.',
    swText: 'Hunikaza katika malisho ya majani mabichi, Huniongoza kando ya maji ya utulivu.',
    isJesusWords: false,
  },
  {
    book: 'Psalms',
    chapter: 23,
    verse: 3,
    enText: 'He restores my soul; He leads me in the paths of righteousness for His name\'s sake.',
    swText: 'Hunihuisha nafsi yangu; Huniongoza katika njia za haki kwa ajili ya jina lake.',
    isJesusWords: false,
  },
  {
    book: 'Psalms',
    chapter: 23,
    verse: 4,
    enText: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil; for You are with me; Your rod and Your staff, they comfort me.',
    swText: 'Naam, nijapopita kati ya bonde la uvuli wa mauti, sitaogopa mabaya; kwa maana wewe upo pamoja nami; gongo lako na fimbo yako vyanifariji.',
    isJesusWords: false,
  },
  {
    book: 'Psalms',
    chapter: 23,
    verse: 5,
    enText: 'You prepare a table before me in the presence of my enemies; You anoint my head with oil; my cup runs over.',
    swText: 'Waandaa meza mbele yangu, machoni pa watesi wangu; umenipaka mafuta kichwani pangu, na kikombe changu kinafurika.',
    isJesusWords: false,
  },
  {
    book: 'Psalms',
    chapter: 23,
    verse: 6,
    enText: 'Surely goodness and mercy shall follow me all the days of my life; and I will dwell in the house of the Lord forever.',
    swText: 'Hakika wema na fadhili zitanifuata siku zote za maisha yangu; nami nitakaa nyumbani mwa Bwana milele.',
    isJesusWords: false,
  },

  // ==========================================
  // PSALMS CHAPTER 91 (Zaburi 91)
  // ==========================================
  {
    book: 'Psalms',
    chapter: 91,
    verse: 1,
    enText: 'He who dwells in the secret place of the Most High shall abide under the shadow of the Almighty.',
    swText: 'Aketiye mahali pa siri pake Aliye juu atakaa katika uvuli wake Mwenyezi.',
    isJesusWords: false,
  },
  {
    book: 'Psalms',
    chapter: 91,
    verse: 2,
    enText: 'I will say of the Lord, "He is my refuge and my fortress; my God, in Him I will trust."',
    swText: 'Nitasema, Bwana ndiye kimbilio langu na ngome yangu, Mungu wangu nitakayemtumaini.',
    isJesusWords: false,
  },
  {
    book: 'Psalms',
    chapter: 91,
    verse: 4,
    enText: 'He shall cover you with His feathers, and under His wings you shall take refuge; His truth shall be your shield and buckler.',
    swText: 'Kwa manyoya yake atakufunika, chini ya mbawa zake utapata kimbilio; uaminifu wake ni ngao na kigao.',
    isJesusWords: false,
  },
  {
    book: 'Psalms',
    chapter: 91,
    verse: 11,
    enText: 'For He shall give His angels charge over you, to keep you in all your ways.',
    swText: 'Kwa kuwa atakuagizia malaika zake wakulinde katika njia zako zote.',
    isJesusWords: false,
  },

  // ==========================================
  // PROVERBS CHAPTER 3 (Mithali 3)
  // ==========================================
  {
    book: 'Proverbs',
    chapter: 3,
    verse: 5,
    enText: 'Trust in the Lord with all your heart, and lean not on your own understanding;',
    swText: 'Mtumaini Bwana kwa moyo wako wote, wala usizitegemee akili zako mwenyewe;',
    isJesusWords: false,
  },
  {
    book: 'Proverbs',
    chapter: 3,
    verse: 6,
    enText: 'In all your ways acknowledge Him, and He shall direct your paths.',
    swText: 'Katika njia zako zote mkiri yeye, naye atayanyosha mapito yako.',
    isJesusWords: false,
  },
  {
    book: 'Proverbs',
    chapter: 3,
    verse: 7,
    enText: 'Do not be wise in your own eyes; fear the Lord and depart from evil.',
    swText: 'Usiwe mwenye hekima machoni pako; mche Bwana, ukajiepushe na uovu.',
    isJesusWords: false,
  },

  // ==========================================
  // GENESIS CHAPTER 1 (Mwanzo 1)
  // ==========================================
  {
    book: 'Genesis',
    chapter: 1,
    verse: 1,
    enText: 'In the beginning God created the heavens and the earth.',
    swText: 'Hapo mwanzo Mungu aliziumba mbingu na nchi.',
    isJesusWords: false,
  },
  {
    book: 'Genesis',
    chapter: 1,
    verse: 2,
    enText: 'The earth was without form, and void; and darkness was on the face of the deep. And the Spirit of God was hovering over the face of the waters.',
    swText: 'Nayo nchi ilikuwa ukiwa, tena utupu, na giza lilikuwa juu ya uso wa vilindi vya maji; Roho ya Mungu ikatulia juu ya uso wa maji.',
    isJesusWords: false,
  },
  {
    book: 'Genesis',
    chapter: 1,
    verse: 3,
    enText: 'Then God said, "Let there be light"; and there was light.',
    swText: 'Mungu akasema, "Iwe nuru"; ikawa nuru.',
    isJesusWords: false,
  },

  // ==========================================
  // ROMANS CHAPTER 8 (Warumi 8)
  // ==========================================
  {
    book: 'Romans',
    chapter: 8,
    verse: 1,
    enText: 'There is therefore now no condemnation to those who are in Christ Jesus, who do not walk according to the flesh, but according to the Spirit.',
    swText: 'Sasa, basi, hakuna hukumu ya adhabu juu yao walio katika Kristo Yesu, wasioenenda kwa kufuata mambo ya mwili, bali mambo ya roho.',
    isJesusWords: false,
  },
  {
    book: 'Romans',
    chapter: 8,
    verse: 28,
    enText: 'And we know that all things work together for good to those who love God, to those who are the called according to His purpose.',
    swText: 'Nasi twajua ya kuwa katika mambo yote Mungu hufanya kazi pamoja na wale wampendao katika kuwapatia mema, yaani, wale walioitwa kwa kusudi lake.',
    isJesusWords: false,
  },
  {
    book: 'Romans',
    chapter: 8,
    verse: 31,
    enText: 'What then shall we say to these things? If God is for us, who can be against us?',
    swText: 'Basi, tuseme nini juu ya hayo? Mungu akiwa upande wetu, ni nani aliye juu yetu?',
    isJesusWords: false,
  },
  {
    book: 'Romans',
    chapter: 8,
    verse: 38,
    enText: 'For I am persuaded that neither death nor life, nor angels nor principalities nor powers, nor things present nor things to come,',
    swText: 'Kwa maana nimekwisha kujua hakika ya kwamba, wala mauti, wala uzima, wala malaika, wala wenye mamlaka, wala yaliyopo, wala yatakayokuwapo, wala wenye uwezo,',
    isJesusWords: false,
  },
  {
    book: 'Romans',
    chapter: 8,
    verse: 39,
    enText: 'nor height nor depth, nor any other created thing, shall be able to separate us from the love of God which is in Christ Jesus our Lord.',
    swText: 'wala yaliyo juu, wala yaliyo chini, wala kiumbe kinginecho chote hakitaweza kututenga na upendo wa Mungu ulio katika Kristo Yesu Bwana wetu.',
    isJesusWords: false,
  },

  // ==========================================
  // 1 CORINTHIANS 13 (1 Wakorintho 13)
  // ==========================================
  {
    book: '1 Corinthians',
    chapter: 13,
    verse: 4,
    enText: 'Love suffers long and is kind; love does not envy; love does not parade itself, is not puffed up;',
    swText: 'Upendo huvumilia, hufadhili; upendo hauhusudu; upendo hautakabari, haujivuni;',
    isJesusWords: false,
  },
  {
    book: '1 Corinthians',
    chapter: 13,
    verse: 7,
    enText: 'bears all things, believes all things, hopes all things, endures all things.',
    swText: 'huvumilia yote, huamini yote, hutumaini yote, hustahimili yote.',
    isJesusWords: false,
  },
  {
    book: '1 Corinthians',
    chapter: 13,
    verse: 8,
    enText: 'Love never fails. But whether there are prophecies, they will fail; whether there are tongues, they will cease; whether there is knowledge, it will vanish away.',
    swText: 'Upendo haupungui neno wakati wo wote; bali ukiwapo unabii utabatilika; zikiwapo lugha zitakoma; yakiwapo maarifa yatabatilika.',
    isJesusWords: false,
  },
  {
    book: '1 Corinthians',
    chapter: 13,
    verse: 13,
    enText: 'And now abide faith, hope, love, these three; but the greatest of these is love.',
    swText: 'Basi, sasa inadumu imani, tumaini, upendo, haya matatu; na katika hayo lililo kuu ni upendo.',
    isJesusWords: false,
  },

  // ==========================================
  // EPHESIANS 6 (Waefeso 6) - Armor of God
  // ==========================================
  {
    book: 'Ephesians',
    chapter: 6,
    verse: 10,
    enText: 'Finally, my brethren, be strong in the Lord and in the power of His might.',
    swText: 'Hatimaye, mzidi kuwa hodari katika Bwana na katika uweza wa nguvu zake.',
    isJesusWords: false,
  },
  {
    book: 'Ephesians',
    chapter: 6,
    verse: 11,
    enText: 'Put on the whole armor of God, that you may be able to stand against the wiles of the devil.',
    swText: 'Vaeni silaha zote za Mungu, mpate kuweza kuzipinga hila za Shetani.',
    isJesusWords: false,
  },

  // ==========================================
  // PHILIPPIANS 4 (Wafilipi 4)
  // ==========================================
  {
    book: 'Philippians',
    chapter: 4,
    verse: 4,
    enText: 'Rejoice in the Lord always. Again I will say, rejoice!',
    swText: 'Furahini katika Bwana sikuzote; tena nasema, Furahini!',
    isJesusWords: false,
  },
  {
    book: 'Philippians',
    chapter: 4,
    verse: 6,
    enText: 'Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God;',
    swText: 'Msijisumbue kwa neno lo lote; bali katika kila neno kwa kusali na kuomba, pamoja na kushukuru, haja zenu na zijulikane na Mungu.',
    isJesusWords: false,
  },
  {
    book: 'Philippians',
    chapter: 4,
    verse: 7,
    enText: 'and the peace of God, which surpasses all understanding, will guard your hearts and minds through Christ Jesus.',
    swText: 'Na amani ya Mungu, ipitayo akili zote, italinda mioyo yenu na nia zenu katika Kristo Yesu.',
    isJesusWords: false,
  },
  {
    book: 'Philippians',
    chapter: 4,
    verse: 13,
    enText: 'I can do all things through Christ who strengthens me.',
    swText: 'Nayaweza mambo yote katika yeye anitiaye nguvu.',
    isJesusWords: false,
  },
  {
    book: 'Philippians',
    chapter: 4,
    verse: 19,
    enText: 'And my God shall supply all your need according to His riches in glory by Christ Jesus.',
    swText: 'Na Mungu wangu atawajazeni kila mnachokihitaji kwa kadiri ya utajiri wake, katika utukufu, ndani ya Kristo Yesu.',
    isJesusWords: false,
  },

  // ==========================================
  // REVELATION 21 (Ufunuo 21)
  // ==========================================
  {
    book: 'Revelation',
    chapter: 21,
    verse: 1,
    enText: 'Now I saw a new heaven and a new earth, for the first heaven and the first earth had passed away. Also there was no more sea.',
    swText: 'Kisha nikaona mbingu mpya na nchi mpya; kwa maana mbingu za kwanza na nchi ya kwanza zimekwisha kupita, wala hapana bahari tena.',
    isJesusWords: false,
  },
  {
    book: 'Revelation',
    chapter: 21,
    verse: 4,
    enText: 'And God will wipe away every tear from their eyes; there shall be no more death, nor sorrow, nor crying. There shall be no more pain, for the former things have passed away.',
    swText: 'Naye atafuta kila chozi katika macho yao, wala mauti haitakuwapo tena; wala maombolezo, wala kilio, wala maumivu hayatakuwapo tena; kwa kuwa mambo ya kwanza yamekwisha kupita.',
    isJesusWords: false,
  },
  {
    book: 'Revelation',
    chapter: 21,
    verse: 5,
    enText: 'Then He who sat on the throne said, "Behold, I make all things new." And He said to me, "Write, for these words are true and faithful."',
    swText: 'Na yeye aketiye juu ya kiti cha enzi akasema, "Tazama, nayafanya yote kuwa mapya." Akaniambia, "Andika ya kwamba maneno haya ni amini na kweli."',
    isJesusWords: true,
  },
];

// Helper to query verses for a book and chapter
export function getChapterVerses(bookName: string, chapterNum: number): VerseData[] {
  const normalized = bookName.trim().toLowerCase();
  const directMatches = VERIFIED_SCRIPTURES.filter(
    v => v.book.toLowerCase() === normalized && v.chapter === chapterNum
  );

  if (directMatches.length > 0) {
    return directMatches.sort((a, b) => a.verse - b.verse);
  }

  // Fallback generator for other chapters to ensure every book & chapter has genuine structure
  // Note: App also supports dynamic API fetch for 100% of chapters
  return [];
}
