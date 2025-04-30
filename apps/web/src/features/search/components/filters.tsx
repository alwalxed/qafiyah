import { type SelectOption } from '@/components/ui/select';
import { SelectMulti } from '@/components/ui/select-multi';
import { SelectSingle } from '@/components/ui/select-single';
import { BinaryToggleButton } from '@/components/ui/toggle-button';
import { cn } from '@/utils/conversions/cn';
import { type ArabicNounForms } from 'arabic-count-format';
import { Loader2, SearchIcon } from 'lucide-react';

type Props = {
  searchTypeLabelText: string;
  searchTypeOptions: [SelectOption, SelectOption];
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

  handleCustomSearch: () => void;
  inputValue: string;
  isLoading: boolean;
  searchLabel: string;
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

  handleCustomSearch,
  inputValue,
  isLoading,
  searchLabel,
}: Props) {
  const containerClassname = 'flex flex-col items-start justify-start gap-2';
  const labelClassname = 'block text-xs md:text-base font-medium text-zinc-700';
  return (
    <div className="px-8 py-8 gap-8 bg-white rounded-xl border border-zinc-300/40 relative flex flex-between flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full h-full flex-1">
        <div className={containerClassname}>
          <label className={labelClassname}>{searchTypeLabelText}</label>
          <BinaryToggleButton
            currentValue={searchParamsSearchType}
            onToggle={handleCustomSearchTypeChange}
            options={searchTypeOptions}
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
      {/* --------------------------------------- */}
      <div className="pb-6">
        <button
          onClick={handleCustomSearch}
          disabled={isLoading || !inputValue.trim()}
          className={cn(
            'hover:text-white disabled:cursor-not-allowed disabled:pointer-events-none w-full justify-center items-center h-12 rounded-lg flex duration-300',
            isLoading || !inputValue.trim()
              ? 'bg-white text-zinc-600 ring-1 ring-zinc-300/40'
              : 'bg-zinc-800 text-zinc-50 ring-1 ring-zinc-300/40'
          )}
          aria-label={searchLabel}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SearchIcon className="h-4 w-4" />
          )}
        </button>
        <div className="absolute bottom-0 left-0 w-full justify-center px-8 items-center flex text-xs sm:text-sm py-4 text-zinc-600">
          {'فرق بين القطع والوصل والتاء المربوطة والهاء'}
        </div>
      </div>
    </div>
  );
}
