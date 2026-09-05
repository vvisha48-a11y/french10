// Content for Les Messages (Section B, 5 marks).
//
// Read as TEXT and JSON.parse'd from the bracketed slice — never require()d. Same idiom
// as letterdata.js / nomdata.js, so the array below must stay valid JSON.
//
// Readers must slice from the first bracket AFTER the assignment, not the first bracket
// in the file, or a bracket in this header would be picked up instead.
//
// PROVENANCE, and it matters:
//   * The 8 messages marked "source": "messages.txt" are the teacher's own material.
//     Their French is reproduced AS WRITTEN. Where it contains errors, the errors are
//     listed in "notes" as « wrong » → « right » pairs and rendered as correction cards
//     by retenir.js. They are teaching material, not defects to be quietly patched.
//   * Anything marked "draft": true is MINE, not a past paper. messages.txt contains
//     three invitations, three refusals and two announcements — and no acceptances at
//     all — so the acceptance models and every practice prompt are drafted in CBSE
//     style and await teacher review. No year is claimed for any of them.
//
// Lesson slides carry only ids and titles; their layouts live in msg-lessons.js.

const MESSAGEDATA = [
  {
    "group": "The Format",
    "topics": [
      { "id": "msg-quoi",      "kind": "lesson", "en": { "title": "What a Message Is" },        "fr": { "title": "Qu'est-ce qu'un message ?" } },
      { "id": "msg-boite",     "kind": "lesson", "en": { "title": "The Message Box" },          "fr": { "title": "La boîte du message" } },
      { "id": "msg-lieu-date", "kind": "lesson", "en": { "title": "Place, Date and Time" },     "fr": { "title": "Lieu, date et heure" } },
      { "id": "msg-salut",     "kind": "lesson", "en": { "title": "Who Are You Writing To?" },  "fr": { "title": "La salutation" } },
      { "id": "msg-corps",     "kind": "lesson", "en": { "title": "The Body — 3 Moves" },       "fr": { "title": "Le corps du message" } },
      { "id": "msg-signature", "kind": "lesson", "en": { "title": "Closing and Signature" },    "fr": { "title": "La formule finale" } },
      { "id": "msg-plan",      "kind": "lesson", "en": { "title": "The 4-Part Blueprint" },     "fr": { "title": "Le plan en 4 parties" } }
    ]
  },
  {
    "group": "The Three Types",
    "topics": [
      { "id": "msg-3types",     "kind": "lesson", "en": { "title": "The Three Types" },          "fr": { "title": "Les trois types" } },
      { "id": "msg-invitation", "kind": "lesson", "en": { "title": "1. The Invitation" },        "fr": { "title": "L'invitation" } },
      { "id": "msg-acceptation","kind": "lesson", "en": { "title": "2. The Acceptance" },        "fr": { "title": "L'acceptation" } },
      { "id": "msg-refus",      "kind": "lesson", "en": { "title": "3. The Refusal" },           "fr": { "title": "Le refus" } },
      { "id": "msg-compare",    "kind": "lesson", "en": { "title": "What Actually Changes" },    "fr": { "title": "Ce qui change" } },
      { "id": "msg-switcher",   "kind": "lesson", "en": { "title": "One Scene, Three Replies" }, "fr": { "title": "Une scène, trois réponses" } },
      { "id": "msg-hotspot",    "kind": "lesson", "en": { "title": "Where the 5 Marks Are" },    "fr": { "title": "Où sont les 5 points" } },
      { "id": "msg-builder",    "kind": "lesson", "en": { "title": "Build the Message" },        "fr": { "title": "Construis le message" } }
    ]
  },
  {
    "group": "Model Messages",
    "topics": [

      {
        "id": "msg-anniv-frere",
        "kind": "message",
        "type": "invitation",
        "lecon": "Invitation",
        "source": "messages.txt",
        "fr": { "title": "L'anniversaire de mon frère" },
        "en": { "title": "My Brother's Birthday" },
        "prompt": {
          "fr": "Écrivez un message à votre ami/e pour lui dire de venir chez vous pour vous aider à organiser la soirée d'anniversaire de votre frère cadet.",
          "en": "Write a message to your friend telling them to come to your house to help you organise your younger brother's birthday party."
        },
        "message": {
          "fr": {
            "date": "Delhi, le 28 novembre",
            "salutation": "Chère Nivya,",
            "paras": [
              "Je t'invite à l'anniversaire de mon frère cadet le 7 décembre chez moi. Nous nous amuserons bien. Je serai très contente si tu viens en avance pour m'aider à organiser la soirée. À bientôt !"
            ],
            "closing": ["Ton amie"],
            "signature": "Avaanika"
          },
          "en": {
            "date": "Delhi, 28 November",
            "salutation": "Dear Nivya,",
            "paras": [
              "I'm inviting you to my younger brother's birthday on 7 December at my house. We will have a lot of fun. I would be very happy if you came early to help me organise the evening. See you soon!"
            ],
            "closing": ["Your friend"],
            "signature": "Avaanika"
          }
        },
        "vocab": [
          ["un frère cadet", "a younger brother"],
          ["organiser une soirée", "to organise a party"],
          ["venir en avance", "to come early"],
          ["s'amuser", "to have fun"]
        ],
        "bank": [
          ["Je t'invite à…", "I'm inviting you to…"],
          ["Nous nous amuserons bien.", "We will have a lot of fun."],
          ["Je serai très content(e) si tu viens.", "I'll be very happy if you come."]
        ],
        "notes": [
          "Corrections apportées au français d'origine : « Le 28 Novembre » → « le 28 novembre ». Deux fautes dans trois mots : après le nom de ville, « le » ne prend pas de majuscule, et les mois ne prennent JAMAIS de majuscule en français — contrairement à l'anglais.",
          "Ajouts : « A bientôt » → « À bientôt ». Le A majuscule porte son accent. Beaucoup d'élèves l'oublient parce que le clavier ne le donne pas facilement — l'examinateur, lui, le voit.",
          "Grammaire à montrer : « Je serai très contente » — futur simple + accord au féminin, parce que la signataire s'appelle Avaanika. Si le signataire est un garçon, on écrit « content ». C'est le genre de détail qui rapporte le point de langue."
        ]
      },

      {
        "id": "msg-campagne",
        "kind": "message",
        "type": "invitation",
        "lecon": "Invitation",
        "source": "messages.txt",
        "fr": { "title": "Un week-end à la campagne" },
        "en": { "title": "A Weekend in the Countryside" },
        "prompt": {
          "fr": "Invitez votre ami(e) à passer quelques jours chez vous à la campagne. Rédigez l'invitation. (30 mots)",
          "en": "Invite your friend to spend a few days at your place in the countryside. Write the invitation. (30 words)"
        },
        "message": {
          "fr": {
            "date": "Bordeaux, le 20 mars",
            "salutation": "Chère Nivya,",
            "paras": [
              "Jeanne et moi, nous organisons un pique-nique ce week-end à la campagne. C'est un lieu parfait pour nous reposer après les examens. Je suis sûre que ça t'intéressera. J'attends ta réponse."
            ],
            "closing": ["À bientôt"],
            "signature": "Julie"
          },
          "en": {
            "date": "Bordeaux, 20 March",
            "salutation": "Dear Nivya,",
            "paras": [
              "Jeanne and I are organising a picnic this weekend in the countryside. It's a perfect place to rest after the exams. I'm sure it will interest you. I'm waiting for your reply."
            ],
            "closing": ["See you soon"],
            "signature": "Julie"
          }
        },
        "vocab": [
          ["un pique-nique", "a picnic"],
          ["à la campagne", "in the countryside"],
          ["se reposer", "to rest"],
          ["j'attends ta réponse", "I await your reply"]
        ],
        "bank": [
          ["Nous organisons…", "We are organising…"],
          ["C'est un lieu parfait pour…", "It's a perfect place to…"],
          ["Je suis sûr(e) que ça t'intéressera.", "I'm sure it will interest you."]
        ],
        "notes": [
          "Corrections apportées au français d'origine : « ce weekend » → « ce week-end ». En français le mot prend un trait d'union.",
          "ATTENTION au compte de mots : le sujet demande 30 mots. Le message en fait 34 — c'est parfait. Un message de 60 mots perd des points même s'il est sans faute : on vous demande d'être bref.",
          "Grammaire à montrer : « Je suis sûre » s'accorde avec Julie. « ça t'intéressera » est un futur simple — l'invitation se projette toujours dans l'avenir."
        ]
      },

      {
        "id": "msg-grandmere",
        "kind": "message",
        "type": "invitation",
        "lecon": "Invitation",
        "source": "messages.txt",
        "fr": { "title": "Les 60 ans de ma grand-mère" },
        "en": { "title": "My Grandmother's 60th" },
        "prompt": {
          "fr": "Préparez une invitation pour votre ami/amie pour une soirée chez vous.",
          "en": "Prepare an invitation for your friend for a party at your place."
        },
        "message": {
          "fr": {
            "date": "Mumbai, le 14 mai",
            "salutation": "Cher Paul,",
            "paras": [
              "J'ai le grand plaisir de t'inviter chez moi pour le 60ème anniversaire de ma grand-mère le 20 mai. Mes cousins et mes autres amis seront là. La soirée commencera à 18 h. Il y aura un grand repas. On va s'amuser."
            ],
            "closing": ["À bientôt"],
            "signature": "Julie"
          },
          "en": {
            "date": "Mumbai, 14 May",
            "salutation": "Dear Paul,",
            "paras": [
              "I have great pleasure in inviting you to my home for my grandmother's 60th birthday on 20 May. My cousins and my other friends will be there. The party will begin at 6 p.m. There will be a big meal. We're going to have fun."
            ],
            "closing": ["See you soon"],
            "signature": "Julie"
          }
        },
        "vocab": [
          ["avoir le plaisir de", "to have the pleasure of"],
          ["le 60ème anniversaire", "the 60th birthday"],
          ["un grand repas", "a big meal"],
          ["à 18 h", "at 6 p.m."]
        ],
        "bank": [
          ["J'ai le grand plaisir de t'inviter…", "I have great pleasure in inviting you…"],
          ["La soirée commencera à…", "The party will begin at…"],
          ["Il y aura…", "There will be…"]
        ],
        "notes": [
          "Corrections apportées au français d'origine : « Cher Paul » → « Cher Paul, ». La virgule après la salutation n'est pas facultative.",
          "Ajouts : « grand-mère » s'écrit avec un trait d'union. « 18 h » s'écrit avec une espace et sans point — jamais « 18h00 » ni « 6 pm ».",
          "Grammaire à montrer : trois futurs de suite — « seront », « commencera », « il y aura » — puis un futur proche, « on va s'amuser ». Alterner les deux futurs montre une vraie maîtrise et se remarque tout de suite."
        ]
      },

      {
        "id": "msg-acc-anniv",
        "kind": "message",
        "type": "acceptation",
        "lecon": "Acceptation",
        "draft": true,
        "fr": { "title": "J'accepte ton invitation" },
        "en": { "title": "Accepting the Invitation" },
        "prompt": {
          "fr": "Votre amie vous invite à l'anniversaire de son frère. Vous acceptez. Rédigez le message. (30 mots)",
          "en": "Your friend invites you to her brother's birthday. You accept. Write the message. (30 words)"
        },
        "message": {
          "fr": {
            "date": "Delhi, le 30 novembre",
            "salutation": "Chère Avaanika,",
            "paras": [
              "Merci beaucoup pour ton invitation. J'accepte avec plaisir ! Je viendrai le 7 décembre vers quinze heures pour t'aider à tout préparer. J'apporterai le gâteau. À samedi !"
            ],
            "closing": ["Ton amie"],
            "signature": "Nivya"
          },
          "en": {
            "date": "Delhi, 30 November",
            "salutation": "Dear Avaanika,",
            "paras": [
              "Thank you very much for your invitation. I accept with pleasure! I will come on 7 December at about three o'clock to help you get everything ready. I'll bring the cake. See you Saturday!"
            ],
            "closing": ["Your friend"],
            "signature": "Nivya"
          }
        },
        "vocab": [
          ["accepter avec plaisir", "to accept with pleasure"],
          ["vers quinze heures", "at about 3 p.m."],
          ["apporter", "to bring"],
          ["tout préparer", "to get everything ready"]
        ],
        "bank": [
          ["Merci beaucoup pour ton invitation.", "Thank you very much for your invitation."],
          ["J'accepte avec plaisir !", "I accept with pleasure!"],
          ["Je viendrai vers…", "I'll come at about…"]
        ],
        "notes": [
          "ATTENTION : ce modèle est un BROUILLON écrit pour combler un manque — le dossier source ne contenait aucune acceptation. À faire valider avant de le donner aux élèves.",
          "Grammaire à montrer : une acceptation dit toujours OUI dans les six premiers mots. Ne faites pas attendre le lecteur : « J'accepte avec plaisir ! » puis les détails."
        ]
      },

      {
        "id": "msg-acc-campagne",
        "kind": "message",
        "type": "acceptation",
        "lecon": "Acceptation",
        "draft": true,
        "fr": { "title": "Oui pour la campagne !" },
        "en": { "title": "Yes to the Countryside!" },
        "prompt": {
          "fr": "Votre amie vous invite à passer le week-end à la campagne. Vous acceptez et vous demandez une précision. Rédigez le message.",
          "en": "Your friend invites you to spend the weekend in the countryside. You accept and ask for one detail. Write the message."
        },
        "message": {
          "fr": {
            "date": "Bordeaux, le 22 mars",
            "salutation": "Chère Julie,",
            "paras": [
              "Quelle bonne idée ! J'accepte ton invitation avec joie. Je suis libre tout le week-end et j'ai vraiment besoin de me reposer après les examens. À quelle heure dois-je arriver ? Réponds-moi vite."
            ],
            "closing": ["Ton amie"],
            "signature": "Nivya"
          },
          "en": {
            "date": "Bordeaux, 22 March",
            "salutation": "Dear Julie,",
            "paras": [
              "What a good idea! I accept your invitation with joy. I'm free all weekend and I really need to rest after the exams. What time should I arrive? Write back soon."
            ],
            "closing": ["Your friend"],
            "signature": "Nivya"
          }
        },
        "vocab": [
          ["Quelle bonne idée !", "What a good idea!"],
          ["avec joie", "with joy"],
          ["être libre", "to be free"],
          ["avoir besoin de", "to need to"]
        ],
        "bank": [
          ["Quelle bonne idée !", "What a good idea!"],
          ["J'accepte ton invitation avec joie.", "I accept your invitation with joy."],
          ["À quelle heure dois-je arriver ?", "What time should I arrive?"]
        ],
        "notes": [
          "ATTENTION : modèle BROUILLON, à faire valider — voir la note sur msg-acc-anniv.",
          "Ajouts : poser une question à la fin (« À quelle heure dois-je arriver ? ») transforme un message plat en vrai échange. C'est un point de communication facile à gagner."
        ]
      },

      {
        "id": "msg-ref-cinema",
        "kind": "message",
        "type": "refus",
        "lecon": "Refus",
        "source": "messages.txt",
        "fr": { "title": "Je ne peux pas venir au cinéma" },
        "en": { "title": "I Can't Come to the Cinema" },
        "prompt": {
          "fr": "Votre ami vous a demandé de l'accompagner au cinéma. Mais vous ne pouvez pas le faire. Écrivez un message de refus et donnez une raison pour expliquer votre absence.",
          "en": "Your friend has asked you to go with him to the cinema. But you cannot. Write a message of refusal and give a reason to explain your absence."
        },
        "message": {
          "fr": {
            "date": "Delhi, le 14 mai",
            "salutation": "Chère Pauline,",
            "paras": [
              "Je te remercie de ton invitation mais je suis désolé, je ne peux pas venir car ma mère est malade et il n'y a personne à la maison."
            ],
            "closing": ["Ton ami"],
            "signature": "Pierre"
          },
          "en": {
            "date": "Delhi, 14 May",
            "salutation": "Dear Pauline,",
            "paras": [
              "Thank you for your invitation but I am sorry, I cannot come because my mother is ill and there is no one at home."
            ],
            "closing": ["Your friend"],
            "signature": "Pierre"
          }
        },
        "vocab": [
          ["remercier de", "to thank for"],
          ["être désolé(e)", "to be sorry"],
          ["car", "because"],
          ["il n'y a personne", "there is no one"]
        ],
        "bank": [
          ["Je te remercie de ton invitation.", "Thank you for your invitation."],
          ["Je suis désolé(e), je ne peux pas venir.", "I'm sorry, I can't come."],
          ["…car ma mère est malade.", "…because my mother is ill."]
        ],
        "notes": [
          "Corrections apportées au français d'origine : « Chère Pauline » → « Chère Pauline, ». La virgule manque.",
          "Grammaire à montrer : « je suis désolé » sans e — le signataire est Pierre. Mais la salutation est « Chère Pauline » avec un e, parce que l'accord suit la personne concernée, pas l'auteur. Les deux accords dans la même phrase : c'est exactement ce que l'examinateur cherche.",
          "Ajouts : la structure du refus tient en trois temps — remercier, refuser, justifier. Ce message les enchaîne en une seule phrase. C'est bref, mais complet."
        ]
      },

      {
        "id": "msg-ref-theatre",
        "kind": "message",
        "type": "refus",
        "lecon": "Refus",
        "source": "messages.txt",
        "fr": { "title": "Le théâtre, une autre fois" },
        "en": { "title": "The Theatre, Another Time" },
        "prompt": {
          "fr": "Deepti vous invite à regarder une bonne pièce au théâtre avec elle. Mais vous ne pouvez pas y aller. Rédigez le refus.",
          "en": "Deepti invites you to watch a good play at the theatre with her. But you cannot go. Write the refusal."
        },
        "message": {
          "fr": {
            "date": "Delhi, le 30 mai",
            "salutation": "Chère Deepti,",
            "paras": [
              "Merci pour l'invitation. Je voudrais venir pour la pièce mais j'ai un examen le lendemain. Je suis désolé. Nous irons au théâtre après mon examen."
            ],
            "closing": ["Ton ami"],
            "signature": "Paul"
          },
          "en": {
            "date": "Delhi, 30 May",
            "salutation": "Dear Deepti,",
            "paras": [
              "Thank you for the invitation. I would like to come for the play but I have an exam the next day. I am sorry. We will go to the theatre after my exam."
            ],
            "closing": ["Your friend"],
            "signature": "Paul"
          }
        },
        "vocab": [
          ["une pièce (de théâtre)", "a play"],
          ["je voudrais", "I would like"],
          ["le lendemain", "the next day"],
          ["une autre fois", "another time"]
        ],
        "bank": [
          ["Merci pour l'invitation.", "Thank you for the invitation."],
          ["Je voudrais venir mais…", "I would like to come but…"],
          ["Nous irons… après…", "We'll go… after…"]
        ],
        "notes": [
          "Corrections apportées au français d'origine : « j'ai un examen lendemain » → « j'ai un examen le lendemain ». « Lendemain » est un nom : il lui faut son article.",
          "Corrections apportées au français d'origine : « Je suis désolé, Nous irons » → « Je suis désolé. Nous irons ». Une virgule ne peut pas séparer deux phrases complètes, et « Nous » ne prend une majuscule qu'en début de phrase.",
          "Ajouts : « Je voudrais venir, mais… » est la formule de refus la plus utile du programme. Le conditionnel dit que vous en aviez envie — le refus devient poli au lieu d'être sec.",
          "Grammaire à montrer : proposer une solution de rechange (« Nous irons au théâtre après mon examen ») sauve la relation et rapporte le point de communication."
        ]
      },

      {
        "id": "msg-ref-soiree",
        "kind": "message",
        "type": "refus",
        "lecon": "Refus",
        "source": "messages.txt",
        "fr": { "title": "Un travail urgent" },
        "en": { "title": "Urgent Work" },
        "prompt": {
          "fr": "Vous êtes obligé de partir pour un travail urgent et vous ne pouvez pas assister à la soirée organisée par votre camarade de classe. Rédigez un refus.",
          "en": "You have to leave for urgent work and cannot attend the party organised by your classmate. Write a refusal."
        },
        "message": {
          "fr": {
            "date": "Rue Balzac, le 13 mars",
            "salutation": "Chère amie,",
            "paras": [
              "Je suis désolé de ne pas pouvoir assister à la soirée que tu organises. Il faut que j'aille travailler d'urgence. Je serai avec toi par la pensée. Je regrette beaucoup."
            ],
            "closing": [],
            "signature": "Paul"
          },
          "en": {
            "date": "Rue Balzac, 13 March",
            "salutation": "Dear friend,",
            "paras": [
              "I am sorry not to be able to attend the party you are organising. I have to go and work urgently. I will be with you in spirit. I am very sorry."
            ],
            "closing": [],
            "signature": "Paul"
          }
        },
        "vocab": [
          ["assister à", "to attend"],
          ["d'urgence", "urgently"],
          ["par la pensée", "in spirit"],
          ["regretter", "to be sorry / to regret"]
        ],
        "bank": [
          ["Je suis désolé(e) de ne pas pouvoir…", "I'm sorry not to be able to…"],
          ["Il faut que j'aille…", "I have to go…"],
          ["Je serai avec toi par la pensée.", "I'll be with you in spirit."]
        ],
        "notes": [
          "Corrections apportées au français d'origine : « Je suis desolé » → « Je suis désolé ». L'accent aigu sur le e change le mot ; sans lui, ce n'est pas du français.",
          "Corrections apportées au français d'origine : « Il faut que j'aille pour un travail urgent » → « Il faut que j'aille travailler d'urgence ». « Aller pour un travail » est un calque de l'anglais.",
          "Grammaire à montrer : « Il faut que j'aille » est un SUBJONCTIF, et c'est le seul de tous les modèles. Le placer dans un refus est le moyen le plus rapide de montrer à l'examinateur que vous maîtrisez le programme de grammaire.",
          "ATTENTION : ce message n'a pas de formule finale avant la signature. Ajoutez « Amicalement, » ou « Ton ami, » — la formule fait partie du format noté."
        ]
      },

      {
        "id": "msg-visite-cousine",
        "kind": "message",
        "type": "annonce",
        "lecon": "Annonce",
        "source": "messages.txt",
        "fr": { "title": "Je viens te voir" },
        "en": { "title": "I'm Coming to See You" },
        "prompt": {
          "fr": "Rédigez un message à votre cousine pour lui annoncer que vous la visiterez la semaine prochaine.",
          "en": "Write a message to your cousin announcing that you will visit her next week."
        },
        "message": {
          "fr": {
            "date": "Kolkata, le 13 mars",
            "salutation": "Chère Stuthi,",
            "paras": [
              "Ça fait longtemps que nous ne nous sommes pas vues. Alors j'ai décidé de te rendre visite la semaine prochaine. J'arriverai par Air France le 20 mars. Sois à l'aéroport à 14 h. J'espère que tu es libre."
            ],
            "closing": [],
            "signature": "Neha"
          },
          "en": {
            "date": "Kolkata, 13 March",
            "salutation": "Dear Stuthi,",
            "paras": [
              "It's been a long time since we saw each other. So I've decided to come and visit you next week. I'll arrive by Air France on 20 March. Be at the airport at 2 p.m. I hope you're free."
            ],
            "closing": [],
            "signature": "Neha"
          }
        },
        "vocab": [
          ["ça fait longtemps que", "it's been a long time since"],
          ["rendre visite à", "to visit (a person)"],
          ["j'arriverai", "I will arrive"],
          ["être libre", "to be free"]
        ],
        "bank": [
          ["Ça fait longtemps que nous ne nous sommes pas vu(e)s.", "It's been a long time since we saw each other."],
          ["J'ai décidé de te rendre visite.", "I've decided to come and visit you."],
          ["J'espère que tu es libre.", "I hope you're free."]
        ],
        "notes": [
          "Corrections apportées au français d'origine : « Kolkata le 13 mars » → « Kolkata, le 13 mars ». La virgule entre la ville et la date est obligatoire.",
          "Corrections apportées au français d'origine : dans le sujet, « annoncant » → « annonçant ». Sans la cédille, le c se prononce [k].",
          "Grammaire à montrer : « nous ne nous sommes pas vues » — passé composé d'un verbe pronominal, avec accord au féminin pluriel parce que Neha écrit à Stuthi. Deux femmes : deux e et un s.",
          "ATTENTION : « rendre visite à » s'emploie pour les PERSONNES ; « visiter » s'emploie pour les LIEUX. On rend visite à sa cousine, mais on visite un musée."
        ]
      },

      {
        "id": "msg-maman",
        "kind": "message",
        "type": "annonce",
        "lecon": "Annonce",
        "source": "messages.txt",
        "fr": { "title": "Un mot pour maman" },
        "en": { "title": "A Note for Mum" },
        "prompt": {
          "fr": "Paul a invité quelques amis à la maison. Il sort faire des courses et laisse un message pour sa mère.",
          "en": "Paul has invited some friends home. He goes out shopping and leaves a message for his mother."
        },
        "message": {
          "fr": {
            "date": "Paris, 14 h",
            "salutation": "Chère Maman,",
            "paras": [
              "J'ai invité quelques amis chez nous ce soir. Ne t'inquiète pas ! Je vais faire les courses et je préparerai tout ce dont on a besoin. Peux-tu me faire un gâteau au chocolat, s'il te plaît ? Je rentrerai dans une heure."
            ],
            "closing": ["À bientôt", "Ton fils"],
            "signature": "Paul"
          },
          "en": {
            "date": "Paris, 2 p.m.",
            "salutation": "Dear Mum,",
            "paras": [
              "I've invited a few friends to our place this evening. Don't worry! I'm going to do the shopping and I'll prepare everything we need. Can you make me a chocolate cake, please? I'll be back in an hour."
            ],
            "closing": ["See you soon", "Your son"],
            "signature": "Paul"
          }
        },
        "vocab": [
          ["faire les courses", "to do the shopping"],
          ["ne t'inquiète pas", "don't worry"],
          ["tout ce dont on a besoin", "everything we need"],
          ["dans une heure", "in an hour"]
        ],
        "bank": [
          ["Ne t'inquiète pas !", "Don't worry!"],
          ["Peux-tu…, s'il te plaît ?", "Can you…, please?"],
          ["Je rentrerai dans une heure.", "I'll be back in an hour."]
        ],
        "notes": [
          "ATTENTION — c'est le seul modèle SANS date : il porte une HEURE (« Paris, 14 h »). Un mot laissé sur la table se date à l'heure, pas au jour. Si le sujet dit « il sort » ou « elle laisse un mot », mettez l'heure.",
          "Grammaire à montrer : « Ne t'inquiète pas ! » est un impératif pronominal à la forme négative — le ne et le pas encadrent le verbe ET son pronom. C'est une structure difficile, et la placer correctement se remarque.",
          "Ajouts : « tout ce dont on a besoin » utilise « dont », le pronom relatif que presque personne n'ose employer. Il vient de « avoir besoin DE ». Bien placé, il vaut à lui seul le point de grammaire."
        ]
      }

    ]
  },
  {
    "group": "Exam Practice",
    "topics": [
      { "id": "msg-freq",      "kind": "lesson", "en": { "title": "What Gets Asked" },        "fr": { "title": "Ce qui tombe à l'examen" } },
      { "id": "msg-prac-inv",  "kind": "lesson", "en": { "title": "Practice — Invitation" },  "fr": { "title": "Entraînement — l'invitation" } },
      { "id": "msg-prac-acc",  "kind": "lesson", "en": { "title": "Practice — Acceptance" },  "fr": { "title": "Entraînement — l'acceptation" } },
      { "id": "msg-prac-ref",  "kind": "lesson", "en": { "title": "Practice — Refusal" },     "fr": { "title": "Entraînement — le refus" } },
      { "id": "msg-marks",     "kind": "lesson", "en": { "title": "Mark It Yourself" },       "fr": { "title": "Corrigez vous-même" } },
      { "id": "msg-quiz",      "kind": "lesson", "en": { "title": "Graded Quiz" },            "fr": { "title": "Quiz noté" } }
    ]
  },
  {
    "group": "Tips & Traps",
    "topics": [
      { "id": "msg-erreurs",   "kind": "lesson", "en": { "title": "The 8 Costly Mistakes" },  "fr": { "title": "Les erreurs qui coûtent cher" } },
      { "id": "msg-temps",     "kind": "lesson", "en": { "title": "Which Tense, When" },      "fr": { "title": "Quel temps, quand" } },
      { "id": "msg-vocab",     "kind": "lesson", "en": { "title": "The Vocabulary Bank" },    "fr": { "title": "La banque de vocabulaire" } },
      { "id": "msg-astuces",   "kind": "lesson", "en": { "title": "Tricks for the Full 5" },  "fr": { "title": "Astuces pour les 5 points" } },
      { "id": "msg-checklist", "kind": "lesson", "en": { "title": "Before You Hand It In" },  "fr": { "title": "Avant de rendre la copie" } }
    ]
  }
];
