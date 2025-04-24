import { Select, type SelectOption } from '@/components/ui/select';
import { CheckboxSelect } from '@/components/ui/select-multi';
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
  const labelClassname = 'block text-xs md:text-sm font-medium text-zinc-700';
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-6 px-6 bg-zinc-50 rounded-md border border-zinc-300/30">
      <div className={containerClassname}>
        <label className={labelClassname}>{searchTypeLabelText}</label>
        <Select
          options={searchTypeOptions}
          value={searchParamsSearchType}
          onChange={handleCustomSearchTypeChange}
          placeholder={searchTypePlaceholderText}
        />
      </div>

      <div className={containerClassname}>
        <label className={labelClassname}>{matchTypeLabelText}</label>
        <Select
          options={matchTypeOptions}
          value={searchParamsMatchType}
          onChange={handleMatchTypeChange}
          placeholder={searchTypePlaceholderText}
        />
      </div>

      <div className={containerClassname}>
        <label className={labelClassname}>{erasLabelText}</label>
        <CheckboxSelect
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
            <CheckboxSelect
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
            <CheckboxSelect
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
            <CheckboxSelect
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
