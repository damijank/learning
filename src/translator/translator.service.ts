import { Injectable } from '@nestjs/common';

@Injectable()
export class TranslatorService {
    public static translate = (value: string|object): string|object => {
        const locales = {
            en: /\[en](.*?)\[\/en]/,
            es: /\[es](.*?)\[\/es]/,
            de: /\[de](.*?)\[\/de]/,
            fr: /\[fr](.*?)\[\/fr]/,
            uk: /\[uk](.*?)\[\/uk]/,
            eu: /\[eu](.*?)\[\/eu]/,
        };

        let hasMatches = false;
        const matches = {};
        if (typeof value === 'string') {
            for (const localesKey in locales) {
                if (locales.hasOwnProperty(localesKey)) {
                    const current = value.match(locales[localesKey]);
                    if (current && current.length === 2) {
                        matches[localesKey] = current[1];
                        hasMatches = true;
                    }
                }
            }
            if (hasMatches) {
                return matches;
            }
        }

        return value;
    };
}
