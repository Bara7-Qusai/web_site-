import { useTranslation } from 'react-i18next';

import { setLanguage } from './i18n';
import { isLanguage, LANGUAGES } from './languages';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <label className="language-switcher">
      <span>{t('language.label')}</span>
      <select
        value={i18n.resolvedLanguage}
        onChange={(event) => {
          const next = event.target.value;
          if (isLanguage(next)) {
            void setLanguage(next);
          }
        }}
      >
        {LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {t(`language.${language}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
