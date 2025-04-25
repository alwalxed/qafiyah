import { type SelectOption } from '@/components/ui/select';
import { SelectMulti } from '@/components/ui/select-multi';
import { SelectSingle } from '@/components/ui/select-single';
import { type ArabicNounForms } from 'arabic-count-format';

type Props = {
  searchTypeLabelText: string;
  searchTypeOptions: SelectOption[];
  searchParamsSearchType: string;
  handleCustomSearchTypeChange: (value: string) => void;
  searchTypePlaceholderText: string;

  matchTypeLabelText: string;
  matchTypeOptions: SelectOption[];
  searchParamsMatchType: string;
  handleMatchTypeChange: (value: string) => void;

  erasLabelText: string;
  erasOptions: SelectOption[];
  selectedEras: string[];
  erasPlaceholderNounFormsText: ArabicNounForms;
  handleErasChange: (value: string | string[]) => void;
  erasPlaceholderText: string;

  searchType: string;
  metersLabelText: string;
  metersOptions: SelectOption[];
  selectedMeters: string[];
  metersPlaceholderNounFormsText: ArabicNounForms;
  handleMetersChange: (value: string | string[]) => void;
  metersPlaceholderText: string;

  themesLabelText: string;
  themesOptions: SelectOption[];
  selectedThemes: string[];
  themesPlaceholderNounFormsText: ArabicNounForms;
  handleThemesChange: (value: string | string[]) => void;
  themesPlaceholderText: string;

  rhymesLabelText: string;
  rhymesOptions: SelectOption[];
  selectedRhymes: string[];
  rhymesPlaceholderNounFormsText: ArabicNounForms;
  handleRhymesChange: (value: string | string[]) => void;
  rhymesPlaceholderText: string;
};

export function Filters({
  searchTypeLabelText,
  searchTypeOptions,
  searchParamsSearchType,
  handleCustomSearchTypeChange,
  searchTypePlaceholderText,

  matchTypeLabelText,
  matchTypeOptions,
  searchParamsMatchType,
  handleMatchTypeChange,

  erasLabelText,
  erasOptions,
  selectedEras,
  erasPlaceholderNounFormsText,
  handleErasChange,
  erasPlaceholderText,

  searchType,
  metersLabelText,
  metersOptions,
  selectedMeters,
  metersPlaceholderNounFormsText,
  handleMetersChange,
  metersPlaceholderText,

  themesLabelText,
  themesOptions,
  selectedThemes,
  themesPlaceholderNounFormsText,
  handleThemesChange,
  themesPlaceholderText,
  rhymesLabelText,
  rhymesOptions,
  selectedRhymes,
  rhymesPlaceholderNounFormsText,
  handleRhymesChange,
  rhymesPlaceholderText,
}: Props) {
  const containerClassname = 'flex flex-col items-start justify-start gap-2';
  const labelClassname = 'block text-xs md:text-base font-medium text-zinc-700';
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-6 px-6 bg-white rounded-xl border border-zinc-300/40">
      <div className={containerClassname}>
        <label className={labelClassname}>{searchTypeLabelText}</label>
        <SelectSingle
          options={searchTypeOptions}
          value={searchParamsSearchType}
          onChange={handleCustomSearchTypeChange}
          placeholder={searchTypePlaceholderText}
        />
      </div>

      <div className={containerClassname}>
        <label className={labelClassname}>{matchTypeLabelText}</label>
        <SelectSingle
          options={matchTypeOptions}
          value={searchParamsMatchType}
          onChange={handleMatchTypeChange}
          placeholder={searchTypePlaceholderText}
        />
      </div>

      <div className={containerClassname}>
        <label className={labelClassname}>{erasLabelText}</label>
        <SelectMulti
          options={erasOptions}
          value={selectedEras}
          placeholderNounForms={erasPlaceholderNounFormsText}
          onChange={handleErasChange}
          placeholder={erasPlaceholderText}
          multiple={true}
        />
      </div>

      {searchType === 'poems' && (
        <>
          <div className={containerClassname}>
            <label className={labelClassname}>{metersLabelText}</label>
            <SelectMulti
              options={metersOptions}
              value={selectedMeters}
              placeholderNounForms={metersPlaceholderNounFormsText}
              onChange={handleMetersChange}
              placeholder={metersPlaceholderText}
              multiple={true}
            />
          </div>

          <div className={containerClassname}>
            <label className={labelClassname}>{themesLabelText}</label>
            <SelectMulti
              options={themesOptions}
              value={selectedThemes}
              placeholderNounForms={themesPlaceholderNounFormsText}
              onChange={handleThemesChange}
              placeholder={themesPlaceholderText}
              multiple={true}
            />
          </div>

          <div className={containerClassname}>
            <label className={labelClassname}>{rhymesLabelText}</label>
            <SelectMulti
              options={rhymesOptions}
              value={selectedRhymes}
              placeholderNounForms={rhymesPlaceholderNounFormsText}
              onChange={handleRhymesChange}
              placeholder={rhymesPlaceholderText}
              multiple={true}
            />
          </div>
        </>
      )}
    </div>
  );
}
