/* Languway-English: CEFR curriculum map (A1 to C1).
   5 levels x 10 units x 5 lessons = 250 lessons.  Each lesson is either an existing, already tested lesson
   written for the first course ("K.U.L" = content file K, unit U, lesson L, see lv01..lv20.js)
   or one of the 44 lessons written for this course ("n:key", see lvnew.js).
   Grammar: g is a list of rule numbers from grammar.js / grammar2.js, or "n:key" for the 7 rules below.
   Lessons 1-2 of a unit use the first rule, lessons 3-5 use the last one. */
window.NEWG={
pron:{t:"Subject pronouns: I, you, he, she, it, we, they",f:"I · you · he · she · it · we · they",e:"We use subject pronouns instead of a name. Use he for a man or a boy, she for a woman or a girl, it for a thing or an animal, and they for more than one person or thing.",a:"نستخدم ضمائر الفاعل بدل الاسم: he للمذكر، she للمؤنث، it لغير العاقل، they للجمع.",x:["Sara is a student. She is happy.","The book is new. It is on the desk.","Ali and Omar are friends. They play football."],m:["Sara is my friend. He is kind.","Sara is my friend. She is kind."],q:[["Ahmad is my brother. ___ is ten.","He","She","It","They"],["My mother and I are at home. ___ are happy.","We","They","She","You"],["The cat is small. ___ is black.","It","He","They","We"]]},
plu:{t:"Singular and plural nouns",f:"book → books · box → boxes · child → children",e:"Singular means one and plural means more than one. Add s to most nouns. Add es after s, x, ch and sh. Some nouns are irregular, for example man becomes men and child becomes children.",a:"المفرد لواحد والجمع لأكثر من واحد. نضيف s غالبًا، وes بعد s وx وch وsh، وبعض الكلمات شاذة مثل child → children.",x:["One book, two books.","One box, three boxes.","One child, four children."],m:["I have two book.","I have two books."],q:[["There are three ___ on the table.","books","book","bookes","bookis"],["I see two ___ in the garden.","children","childs","childes","child"],["There are five ___ in the room.","boxes","boxs","box","boxies"]]},
dem:{t:"This, that, these and those",f:"this / these = near · that / those = far",e:"Use this and these for things that are near you. Use that and those for things that are far from you. This and that are for one thing. These and those are for more than one.",a:"this وthese للقريب، that وthose للبعيد؛ this وthat للمفرد، these وthose للجمع.",x:["This is my bag.","That is my school over there.","These are my books and those are your pens."],m:["These is my book.","This is my book."],q:[["___ is my pen here in my hand.","This","That","Those","These"],["___ houses over there are big.","Those","This","That","It"],["___ are my shoes here by my feet.","These","This","That","Those"]]},
qf:{t:"Basic question forms",f:"Question word + am / is / are / do / does + subject",e:"To ask a question with be, put am, is or are before the subject: Is she a teacher? With other verbs use do or does: Do you like tea? Does he work here? The question words are what, where, when, who, why and how.",a:"مع be نقدّم am/is/are على الفاعل، ومع باقي الأفعال نستخدم do/does قبل الفاعل. وكلمات السؤال: what, where, when, who, why, how.",x:["Is she a doctor?","Do you like football?","Where does he work?"],m:["Do she like tea?","Does she like tea?"],q:[["___ he live here?","Does","Do","Is","Are"],["Where ___ you from?","are","do","does","is"],["___ you like coffee?","Do","Does","Is","Are"]]},
conj:{t:"Basic conjunctions: and, but, or, because, so",f:"and (add) · but (contrast) · or (choice) · because (reason) · so (result)",e:"Conjunctions join two ideas. Use and to add, but to show a difference, or to give a choice, because to give a reason and so to give a result.",a:"حروف العطف تربط الأفكار: and للإضافة، but للتعارض، or للاختيار، because للسبب، so للنتيجة.",x:["I like tea and coffee.","I am tired, but I am happy.","I stayed at home because it was raining."],m:["I was ill because I stayed at home.","I was ill, so I stayed at home."],q:[["I am happy ___ it is my birthday.","because","but","or","so"],["Do you want tea ___ coffee?","or","but","so","because"],["She was hungry, ___ she ate a sandwich.","so","because","but","or"]]},
obj:{t:"Object pronouns: me, you, him, her, it, us, them",f:"I → me · he → him · she → her · we → us · they → them",e:"Use object pronouns after a verb or a preposition. We say She helps me, not She helps I. The object pronouns are me, you, him, her, it, us and them.",a:"ضمائر المفعول تأتي بعد الفعل أو حرف الجر: me, you, him, her, it, us, them.",x:["My teacher helps me.","I can see them in the garden.","Please give it to her."],m:["He called I yesterday.","He called me yesterday."],q:[["I love my parents. I call ___ every day.","them","they","their","he"],["Sara is new. Please help ___.","her","she","hers","he"],["Our teacher likes ___, so he gives us extra help.","us","we","our","ours"]]},
idiom:{t:"Idiomatic expressions",f:"a fixed phrase whose meaning is not the sum of its words",e:"An idiom is a fixed expression with a meaning that is different from the meanings of its words. For example, a piece of cake means something very easy. Learn idioms as whole phrases and use them in informal speech and writing.",a:"العبارة الاصطلاحية تعبير ثابت معناه يختلف عن معاني كلماته منفردة، مثل a piece of cake أي شيء سهل جدًا. تعلّمها كعبارة كاملة.",x:["The exam was a piece of cake.","Let's call it a day and go home.","She spilled the beans about the surprise party."],m:["The test was a slice of cake.","The test was a piece of cake."],q:[["If a task is a piece of cake, it is ...","very easy","very sweet","very old","very dangerous"],["Let's call it a day means ...","let's stop working","let's phone a friend","let's go on a trip","let's start again"],["Spill the beans means ...","tell a secret","cook dinner","make a mess","lose money"]]}
};
window.CEFRL=[
 {c:"A1",n:"Beginner",ar:"مبتدئ",d:"You can understand and use very simple everyday phrases and introduce yourself.",goal:"Build the foundation: greetings, numbers, family, home, food, places and the basic sentence."},
 {c:"A2",n:"Elementary",ar:"أساسي",d:"You can talk about daily life, shopping, travel and the past and the future in simple sentences.",goal:"Communicate in everyday situations with more independence."},
 {c:"B1",n:"Intermediate",ar:"متوسط",d:"You can handle most situations, describe experiences and explain your opinions.",goal:"Move from simple sentences to independent communication."},
 {c:"B2",n:"Upper Intermediate",ar:"فوق المتوسط",d:"You can understand complex texts and discuss specialised topics clearly and in detail.",goal:"Understand, analyse and argue with fluency."},
 {c:"C1",n:"Advanced",ar:"متقدم",d:"You can use English flexibly and fluently for study, work and social life.",goal:"Use English accurately and flexibly in academic and professional settings."}];
window.CURR=[
/* ---------------- A1 ---------------- */
{lv:1,t:"Introducing Yourself",ar:"التعريف بالنفس",g:[0],L:["1.1.2","n:a1-from","n:a1-he","n:a1-job","n:a1-intro"]},
{lv:1,t:"Greetings and Meeting People",ar:"التحيات والتعارف",g:["n:pron"],L:["1.1.1","n:a1-greet","n:a1-howru","1.1.3","n:a1-meet"]},
{lv:1,t:"Numbers, Days, Months and Time",ar:"الأرقام والأيام والأشهر والوقت",g:["n:plu"],L:["1.2.1","n:a1-num2","n:a1-days","n:a1-months","n:a1-clock"]},
{lv:1,t:"Family and Friends",ar:"العائلة والأصدقاء",g:[2],L:["1.3.1","n:a1-fam2","1.3.2","1.3.3","n:a1-bff"]},
{lv:1,t:"My Home and My Things",ar:"المنزل وأغراضي",g:["n:dem"],L:["1.4.3","1.2.2","1.2.3","2.3.1","2.3.2"]},
{lv:1,t:"Food and Drink",ar:"الطعام والشراب",g:[1],L:["1.4.2","2.2.1","2.2.2","2.2.3","n:a1-cafe"]},
{lv:1,t:"Places and Directions",ar:"الأماكن والاتجاهات",g:[4],L:["2.1.1","n:a1-where","2.1.2","n:a1-lr","2.1.3"]},
{lv:1,t:"Daily Activities",ar:"الأنشطة اليومية",g:[3],L:["1.4.1","n:a1-morn","n:a1-school","n:a1-eve","n:a1-wknd"]},
{lv:1,t:"Questions and Answers",ar:"الأسئلة والإجابات البسيطة",g:["n:qf"],L:["n:a1-wh","n:a1-when","n:a1-yn","n:a1-hm","n:a1-info"]},
{lv:1,t:"Building Basic Sentences",ar:"تكوين الجمل الأساسية",g:[7],L:["n:a1-can","2.4.1","2.4.2","2.4.3","n:a1-sent"]},
/* ---------------- A2 ---------------- */
{lv:2,t:"Shopping and Prices",ar:"التسوق والأسعار",g:[5],L:["5.2.1","n:a2-price","n:a2-clothesbuy","5.2.2","5.2.3"]},
{lv:2,t:"Travel and Transport",ar:"السفر والمواصلات",g:[19],L:["3.3.1","n:a2-ticket","3.3.2","n:a2-taxi","3.3.3"]},
{lv:2,t:"Restaurants and Orders",ar:"المطاعم والطلبات",g:[8],L:["n:a2-rest","n:a2-order","4.4.1","4.4.2","n:a2-pay"]},
{lv:2,t:"Health and the Body",ar:"الصحة والجسم",g:[11],L:["3.4.1","3.4.2","n:a2-doctor","n:a2-pharm","3.4.3"]},
{lv:2,t:"Weather and Seasons",ar:"الطقس والفصول",g:[6],L:["2.3.3","n:a2-hotcold","4.3.3","n:a2-rain","5.4.2"]},
{lv:2,t:"Work and Jobs",ar:"العمل والمهن",g:[9],L:["3.2.1","3.2.2","3.2.3","3.1.2","n:a2-work"]},
{lv:2,t:"Study and Education",ar:"الدراسة والتعليم",g:["n:obj"],L:["5.1.1","n:a2-class","5.1.2","n:a2-homew","5.1.3"]},
{lv:2,t:"Hobbies and Interests",ar:"الهوايات والاهتمامات",g:["n:conj"],L:["n:a2-music","4.2.1","4.2.2","n:a2-books","4.2.3"]},
{lv:2,t:"Describing People and Places",ar:"وصف الأشخاص والأماكن",g:[14,18],L:["n:a2-people","5.3.1","5.3.2","4.3.1","5.3.3"]},
{lv:2,t:"The Past and Future Plans",ar:"الحديث عن الماضي والخطط المستقبلية",g:[10,12,13],L:["4.1.1","4.1.2","4.1.3","5.4.1","5.4.3"]},
/* ---------------- B1 ---------------- */
{lv:3,t:"Social Relationships",ar:"العلاقات الاجتماعية",g:[16,24,28],L:["8.1.1","7.3.1","8.4.3","6.4.1","9.4.1"]},
{lv:3,t:"Technology and the Internet",ar:"التكنولوجيا والإنترنت",g:[21],L:["8.2.1","8.2.2","8.2.3","6.2.2","7.2.3"]},
{lv:3,t:"Culture and Societies",ar:"الثقافة والمجتمعات",g:[15,32],L:["8.4.1","8.4.2","9.3.1","9.3.2","6.4.3"]},
{lv:3,t:"Education and Jobs",ar:"التعليم والوظائف",g:[17,26],L:["7.2.1","7.2.2","9.1.1","9.1.2","9.1.3"]},
{lv:3,t:"Travel and Different Cultures",ar:"السفر والثقافات المختلفة",g:[27],L:["8.3.1","8.3.2","8.3.3","6.4.2","8.1.2"]},
{lv:3,t:"News and Events",ar:"الأخبار والأحداث",g:[25],L:["6.2.1","6.2.3","7.1.1","7.1.2","7.1.3"]},
{lv:3,t:"Environment and Nature",ar:"البيئة والطبيعة",g:[30],L:["6.3.1","6.3.2","6.3.3","9.2.1","7.3.2"]},
{lv:3,t:"Health and Lifestyle",ar:"الصحة ونمط الحياة",g:[20,29],L:["6.1.1","6.1.2","6.1.3","7.3.3","10.1.3"]},
{lv:3,t:"Ambitions and Goals",ar:"الطموحات والأهداف",g:[65],L:["7.4.1","7.4.2","7.4.3","10.3.2","9.4.3"]},
{lv:3,t:"Opinions and Discussion",ar:"إبداء الرأي ومناقشة الأفكار",g:[51,45],L:["9.2.2","9.2.3","9.3.3","9.4.2","8.1.3"]},
/* ---------------- B2 ---------------- */
{lv:4,t:"Economy and Business",ar:"الاقتصاد والأعمال",g:[31,48],L:["12.1.1","12.1.2","12.1.3","10.3.1","10.3.3"]},
{lv:4,t:"Science and Technology",ar:"العلوم والتكنولوجيا",g:[33],L:["10.1.1","10.1.2","11.3.1","11.3.2","11.3.3"]},
{lv:4,t:"Media and Journalism",ar:"الإعلام والصحافة",g:[41],L:["11.2.1","11.2.2","11.2.3","13.2.1","13.2.3"]},
{lv:4,t:"Social Issues",ar:"القضايا الاجتماعية",g:[34,78],L:["12.2.1","12.2.2","12.2.3","11.4.1","11.4.2"]},
{lv:4,t:"Politics and Society",ar:"السياسة والمجتمع",g:[39,73],L:["11.1.1","11.1.2","11.1.3","15.2.1","15.2.2"]},
{lv:4,t:"Academic Education",ar:"التعليم الأكاديمي",g:[44],L:["12.4.1","12.4.2","12.4.3","15.1.1","15.4.1"]},
{lv:4,t:"Culture and Literature",ar:"الثقافة والأدب",g:[42,71],L:["13.3.1","13.3.2","13.3.3","14.3.1","11.4.3"]},
{lv:4,t:"Environment and Climate Change",ar:"البيئة والتغير المناخي",g:[35,50],L:["13.1.1","13.1.2","13.1.3","12.3.3","15.3.2"]},
{lv:4,t:"Leadership and Management",ar:"القيادة والإدارة",g:[47,63],L:["14.4.1","14.4.2","14.4.3","14.1.3","14.2.3"]},
{lv:4,t:"Critical Thinking and Debate",ar:"التفكير النقدي والنقاشات",g:[58,64],L:["10.4.1","10.4.2","10.4.3","15.1.3","15.4.3"]},
/* ---------------- C1 ---------------- */
{lv:5,t:"Academic Analysis",ar:"التحليل الأكاديمي",g:[62,56],L:["18.1.1","18.1.2","18.1.3","16.1.1","16.1.2"]},
{lv:5,t:"Philosophical and Critical Thinking",ar:"التفكير الفلسفي والنقدي",g:[57,60],L:["18.2.1","18.2.2","18.2.3","17.4.1","17.4.3"]},
{lv:5,t:"Advanced Business and Economics",ar:"الأعمال والاقتصاد المتقدم",g:[67],L:["17.3.1","17.3.2","17.3.3","14.1.2","14.1.1"]},
{lv:5,t:"Rhetoric and Persuasion",ar:"الخطاب والإقناع",g:[69,68],L:["17.1.1","17.1.2","17.1.3","16.4.3","20.3.3"]},
{lv:5,t:"Literature and Text Analysis",ar:"الأدب وتحليل النصوص",g:["n:idiom"],L:["20.3.1","20.1.2","20.1.3","17.4.2","18.3.3"]},
{lv:5,t:"Media and Public Discourse",ar:"الإعلام والخطاب العام",g:[70],L:["16.4.1","16.4.2","16.2.1","16.2.2","16.2.3"]},
{lv:5,t:"Advanced Professional Communication",ar:"التواصل المهني المتقدم",g:[55,72],L:["20.2.1","20.2.2","20.2.3","16.3.1","16.3.3"]},
{lv:5,t:"Scientific Research",ar:"البحث العلمي",g:[54],L:["17.2.1","17.2.2","17.2.3","16.1.3","19.2.1"]},
{lv:5,t:"Complex Discussions and Abstract Ideas",ar:"النقاشات المعقدة والأفكار المجردة",g:[52,75],L:["18.3.1","18.3.2","19.1.1","19.1.2","19.2.2"]},
{lv:5,t:"Nuance, Register and Mastery",ar:"الفروق الدقيقة والأساليب الرسمية وغير الرسمية",g:[61,74,79],L:["18.4.1","18.4.2","18.4.3","20.4.1","20.4.3"]}
];

Object.assign(window.NEWG,{
alpha:{t:"The English alphabet",f:"26 letters · 5 vowels (a e i o u) · 21 consonants",e:"English has 26 letters. Five letters are vowels: a, e, i, o and u. The other 21 letters are consonants. Each letter has a capital form (A) and a small form (a). Every letter has a name and a sound.",a:"في الإنجليزية 26 حرفاً: خمسة منها حروف علّة (a e i o u) و21 حرفاً ساكناً. لكل حرف شكل كبير (A) وشكل صغير (a)، ولكل حرف اسم وصوت.",x:["A a: apple","B b: bag","Z z: zebra"],m:["The letters b and d are the same.","The letters b and d are different: b has its circle on the right, d has it on the left."],q:[["How many letters are in the English alphabet?","26","24","28","20"],["Which letter is a vowel?","E","B","T","M"],["Which word starts with a vowel?","apple","bag","cat","dog"]]},
sounds:{t:"Short vowels, magic e and digraphs",f:"cat · pig · box · cake · chair · ship · think",e:"Short vowel sounds are in words like cat, bed, pig, hot and cup. When a word ends in e, the e is silent and the vowel says its name: cake, bike, home. Two letters can make one sound: ch in chair, sh in ship and th in think.",a:"الحروف المتحركة القصيرة مثل cat وbed وpig. وعندما تنتهي الكلمة بحرف e صامت (magic e) ينطق الحرف المتحرك باسمه: cake وbike. وبعض الحروف تجتمع لتعطي صوتاً واحداً: ch وsh وth.",x:["cat, hat, map","cake, bike, home","chair, ship, think"],m:["I read cake as cack.","The final e is silent and makes the a say its name, so we read cake as kayk."],q:[["Which word has the sh sound?","ship","chair","cat","bed"],["In cake, what does the final e do?","It is silent","It says e","It says k","It says o"],["Which word has a short o sound?","hot","cake","bike","home"]]},
writing:{t:"Capital letters and punctuation",f:"Capital letter + words + full stop or question mark",e:"A sentence starts with a capital letter and ends with a full stop (.) or a question mark (?). Names, the word I and the days of the week also start with a capital letter. Leave a space between words.",a:"تبدأ الجملة بحرف كبير وتنتهي بنقطة (.) أو علامة استفهام (?). والأسماء والضمير I وأيام الأسبوع تبدأ بحرف كبير أيضاً، مع ترك مسافة بين الكلمات.",x:["My name is Sara.","Is this your bag?","I can swim."],m:["my name is omar","My name is Omar."],q:[["Which sentence is correct?","I have a cat.","i have a cat.","I have a cat","i have a Cat"],["What ends a question?","A question mark","A full stop","A space","A capital letter"],["Which word needs a capital letter?","Monday","table","green","fast"]]},
words:{t:"Naming, doing and describing words",f:"noun (a cat) · verb (run) · adjective (big)",e:"A noun names a person, an animal, a place or a thing: boy, dog, garden, ball. A verb shows what someone does: run, jump, bring. An adjective describes a noun: a big dog, a red ball. A short sentence needs a noun and a verb: The dog runs.",a:"الاسم (noun) يسمّي شخصاً أو حيواناً أو مكاناً أو شيئاً، والفعل (verb) يدل على عمل، والصفة (adjective) تصف الاسم. والجملة القصيرة تحتاج اسماً وفعلاً: The dog runs.",x:["The boy runs.","A big dog jumps.","The red ball is in the garden."],m:["Dog the runs.","The dog runs."],q:[["Which word is a noun?","garden","run","big","fast"],["Which word is a verb?","jump","ball","red","little"],["Which sentence is in the right order?","The dog runs.","Dog the runs.","Runs the dog.","The runs dog."]]}
});
const _S=(k)=>"s:"+k;
window.CURR=[
{lv:1,t:"The English Alphabet",ar:"الأبجدية الإنجليزية",g:["n:alpha"],L:["s-a1","s-a2","s-a3","s-a4","s-a5"].map(_S)},
{lv:1,t:"Sounds and First Words",ar:"الأصوات والكلمات الأولى",g:["n:sounds"],L:["s-b1","s-b2","s-b3","s-b4","s-b5"].map(_S)},
{lv:1,t:"Writing Basics",ar:"أساسيات الكتابة",g:["n:writing"],L:["s-c1","s-c2","s-c3","s-c4","s-c5"].map(_S)},
{lv:1,t:"Your First Sentences",ar:"جملك الأولى",g:["n:words"],L:["s-d1","s-d2","s-d3","s-d4","s-d5"].map(_S)}
].concat(window.CURR.map(u=>Object.assign({},u,{lv:u.lv+1})));
window.CEFRL.unshift({c:"Pre-A1",n:"Starter",ar:"تأسيس",d:"You learn the English letters and sounds, and you read and write your first words and sentences.",goal:"Start from zero: the alphabet, sounds, writing basics and your first sentences."});
