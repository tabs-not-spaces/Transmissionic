import {Locale} from "./Locale";
import * as Plurals from 'make-plural/plurals';

import en from "../../public/locales/en.json";

const languages: Record<string,any> = {en};

const list: Array<string> = [
    "en",
    "es-cr",
    "fr",
    "it",
    "nl",
    "ru",
    "zh-cn",
    "zh-tw",
];

const aliases: Record<string,any> = {
    es:'es-cr',
    zh:'zh-cn',
};

export const LocaleController = {
    async setLanguage(language: string): Promise<void> {
        const code = this.getLanguageCode(language);
        if(!languages[code]) {
            await this.loadLanguages(code)
                .then((data) => {
                    languages[code]=data;
                    Locale.setContent(languages);
                })
                .catch(()=> {return})
        }
        Locale.setLanguage(code);
    },
    loadLanguages(code: string): Promise<Record<string,any>> {
        return fetch(`locales/${code}.json`)
            .then((response) => response.json())
    },
    getLanguageCode(language: string, short=false): string {
        const code = language.toLowerCase();
        if(list.includes(code)){
            return code;
        }
        else if(aliases[code]){
            return aliases[code];
        }
        else if(!short) {
            return this.getLanguageCode(code.substr(0,2), true)
        }
        else {
            return "en";
        }
    },
    getPlural(key: string, count: number): string {
        const lang = Locale.getLanguage();
        const form = Object(Plurals)[lang] ? Object(Plurals)[lang](count) : "other";
        return Object(Locale)[key][form];
    }
}