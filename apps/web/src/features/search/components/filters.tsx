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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2 p-0 bg-zinc-50 rounded-md border border-zinc-100">
      <div>
        <label className="block text-xs font-medium mb-1 text-zinc-600">
          {searchTypeLabelText}
        </label>
        <Select
          options={searchTypeOptions}
          value={searchParamsSearchType}
          onChange={handleCustomSearchTypeChange}
          placeholder={searchTypePlaceholderText}
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1 text-zinc-600">{matchTypeLabelText}</label>
        <Select
          options={matchTypeOptions}
          value={searchParamsMatchType}
          onChange={handleMatchTypeChange}
          placeholder={searchTypePlaceholderText}
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1 text-zinc-600">{erasLabelText}</label>
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
          <div>
            <label className="block text-xs font-medium mb-1 text-zinc-600">
              {metersLabelText}
            </label>
            <CheckboxSelect
              options={metersOptions}
              value={selectedMeters}
              placeholderNounForms={metersPlaceholderNounFormsText}
              onChange={handleMetersChange}
              placeholder={metersPlaceholderText}
              multiple={true}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-zinc-600">
              {themesLabelText}
            </label>
            <CheckboxSelect
              options={themesOptions}
              value={selectedThemes}
              placeholderNounForms={themesPlaceholderNounFormsText}
              onChange={handleThemesChange}
              placeholder={themesPlaceholderText}
              multiple={true}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-zinc-600">
              {rhymesLabelText}
            </label>
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
