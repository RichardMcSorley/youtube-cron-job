const request = require("request");
const moment = require('moment');
const convert = require('xml-js');
const { sendMessage, startClient} = require('../mq')

const getWord = ()=>{
    return new Promise((resolve, reject)=>{
        request(`https://wotd.transparent.com/rss/${moment().subtract(30, 'days').format("MM-DD-YYYY")}-korean-widget.xml?t=${moment().format('x')}`, function(error, response, body) {
            const fromXML = convert.xml2json(body, {compact: true, spaces: 4, ignoreComment: true});
            try{var json = JSON.parse(fromXML);}catch(error){err(error)}
            let {wordtype, word, wordsound, translation, fnphrase, phrasesound, enphrase} = json.xml.words;
            wordtype = pullText(wordtype);
            word = pullText(word);
            wordsound = pullText(wordsound);
            translation = pullText(translation);
            fnphrase = pullText(fnphrase);
            phrasesound = pullText(phrasesound);
            enphrase = pullText(enphrase);
            const newWord = {
                en: translation,
                ko: word,
                sound: wordsound,
                type: wordtype,
                phrase: {
                    en: enphrase,
                    ko: fnphrase,
                    sound: phrasesound
                }
            }
            startClient().then((client)=>{
                sendMessage({client, topic: 'wod', data: newWord}).then(resolve).catch(reject);
            }).catch(reject);
        });
    })
    
}
const pullText = (obj)=>{
    return obj._text
}
module.exports = {
    getWord
}