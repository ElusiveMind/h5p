//H5PEditor = window.H5PEditor || {};
//H5PEditor.language = H5PEditor.language || {};
H5PEditor.language.core = {
  missingTranslation: '[Mangler oversettelse :key]',
  loading: 'Laster, vennligst vent...',
  selectLibrary: 'Velg biblioteket du ønsker å bruke for innholdet ditt.',
  unknownFieldPath: 'Kan ikke finne ":path".',
  notImageField: '":path" er ikke et bilde.',
  notImageOrDimensionsField: '":path" er verken et bilde- eller dimensjonsfelt.',
  requiredProperty: '":property" er påkrevd og må ha en verdi.',
  onlyNumbers: '":property" kan bare innholde tall.',
  exceedsMax: '":property" overstiger maksverdien på :max.',
  listExceedsMax: 'Antallet elementer i listen overstiger maksantallet på :max elementer.',
  belowMin: '":property" er mindre enn minimumsverdien på :min.',
  listBelowMin: 'Listen trenger minst :min elementer for at innholdet skal virke.',
  outOfStep: '":property" kan bare endres i steg på :step.',
  add: 'Legg til',
  addFile: 'Legg til fil',
  removeFile: 'Fjern fil',
  confirmRemoval: 'Er du sikker på at du ønsker å fjerne denne :type?',
  removeImage: 'Fjern bilde',
  confirmImageRemoval: 'Er du sikker på at du ønsker å fjerne dette bildet?',
  changeFile: 'Bytt fil',
  changeLibrary: 'Endre innholdstype',
  semanticsError: 'Semantikkfeil: :error',
  missingProperty: 'Feltet :index mangler :property attributten sin.',
  expandCollapse: 'Utvid/Slå sammen',
  addEntity: 'Legg til :entity',
  tooLong: 'Feltets verdi er for lang, den må være på :max tegn eller mindre.',
  invalidFormat: 'Feltets verdi er på et ugyldig format eller bruker ulovlige tegn.',
  confirmChangeLibrary: 'Ved å gjøre dette mister du alt arbeid gjort med nåværende innholdstype. Er du sikker på at du ønsker å bytte innholdstype?',
  commonFields: 'Innstillinger og tekster',
  commonFieldsDescription: 'Her kan du redigere innstillinger eller oversette tekster som brukes i dette innholdet.',
  uploading: 'Laster opp fil, vennligst vent...',
  noFollow: 'Kunne ikke følge feltet ":path".',
  editCopyright: 'Rediger opphavsrett',
  close: 'Lukk',
  tutorial: 'Veiledning',
  example: 'Eksempel',
  editMode: 'Redigeringsmodus',
  listLabel: 'Liste',
  uploadError: 'Filopplasting feilet',
  fileToLarge: 'Filen du prøver å laste opp kan være for stor.',
  unknownFileUploadError: 'Ukjent filopplastingsfeil',
  noSemantics: 'Feil, kunne ikke laste skjemaet for innholdstypen.',
  editImage: 'Rediger bilde',
  saveLabel: 'Lagre',
  cancelLabel: 'Avbryt',
  resetToOriginalLabel: 'Tilbakestill bilde',
  loadingImageEditor: 'Laster inn bilderedigering, vennligst vent...',
  selectFiletoUpload: 'Velg fil som skal lastes opp',
  or: 'eller',
  enterAudioUrl: 'Skriv inn nettadresse til lydkilde',
  enterVideoUrl: 'Skriv inn nettadresse til videokilde eller YouTube-lenke',
  enterAudioTitle: 'Lim inn link eller annen lydkilde URL',
  enterVideoTitle: 'Lim inn YouTube lenke eller annen videokilde URL',
  uploadAudioTitle: 'Last opp lydfil',
  uploadVideoTitle: 'Last opp videofil',
  addVideoDescription: 'H5P støtter alle eksterne videokilder på formatene mp4, webm eller ogv, slik som Vimeo Pro, og har støtte for YouTube-lenker.',
  insert: 'Sett inn',
  cancel: 'Avbryt',
  height: 'Høyde',
  width: 'Bredde',
  textField: 'Tekstfelt',
  numberField: 'Nummerfelt',
  orderItemUp: 'Flytt element opp',
  orderItemDown: 'Flytt element ned',
  removeItem: 'Fjern element',
  hubPanelLabel: 'Select content type',
  importantInstructions: 'Viktige instruksjoner',
  hideImportantInstructions: 'Skjul viktige instruksjoner',
  hide: 'Skjul',
  example: 'Eksempel',
  createContentTabLabel: 'Create Content',
  uploadTabLabel: 'Upload',
  uploadPlaceholder: 'No file chosen',
  uploadInstructionsTitle: 'Upload an H5P file.',
  uploadInstructionsContent: 'You may start with examples from <a href="https://h5p.org/content-types-and-applications" target="blank">H5P.org</a>.',
  uploadFileButtonLabel: 'Upload a file',
  uploadFileButtonChangeLabel: 'Change file',
  uploadingThrobber: 'Now uploading...',
  h5pFileWrongExtensionTitle: '.h5p file not found',
  h5pFileWrongExtensionContent: 'You need to upload a file that ends in .h5p',
  h5pFileValidationFailedTitle: 'Could not validate H5P file.',
  h5pFileValidationFailedContent: 'Make sure the uploaded H5P contains valid H5P content. H5P' +
  ' files containing only libraries should be uploaded through the H5P Libraries page.',
  h5pFileUploadServerErrorTitle: 'The H5P file could not be uploaded',
  h5pFileUploadServerErrorContent: 'An unexpected error occured. Check your server error log for' +
  ' more details.',
  contentTypeSectionAll: 'All',
  contentTypeSectionMine: 'My Content Types',
  contentTypeSectionPopular: 'Most Popular',
  contentTypeSectionTitle: 'Browse content types',
  contentTypeSearchFieldPlaceholder: 'Search for Content Types',
  contentTypeInstallButtonLabel: 'Install',
  contentTypeInstallingButtonLabel: 'Installing',
  contentTypeUseButtonLabel: 'Use',
  contentTypeUpdateButtonLabel: 'Update',
  contentTypeUpdatingButtonLabel: 'Updating',
  contentTypeGetButtonLabel: 'Get',
  contentTypeBackButtonLabel: 'Back',
  contentTypeIconAltText: 'Icon',
  contentTypeInstallSuccess: ':contentType successfully installed!',
  contentTypeUpdateSuccess: ':contentType successfully updated!',
  contentTypeInstallError: ':contentType could not be installed. Contact your administrator.',
  contentTypeLicensePanelTitle: 'License',
  contentTypeDemoButtonLabel: 'Content Demo',
  readMore: 'Read more',
  readLess: 'Read less',
  contentTypeOwner: 'By :owner',
  contentTypeUnsupportedApiVersionTitle: 'This content type requires a newer core version',
  contentTypeUnsupportedApiVersionContent: 'Contact your system administrator to provide you with the necessary updates',
  contentTypeUpdateAvailable: 'Update available',
  contentTypeRestricted: 'Begrenset tilgang til innholdstype',
  contentTypeRestrictedDesc: 'Bruken av denne innholdstypen er begrenset av en administrator.',
  contentTypeNotInstalled: 'Inneholdstype ikke installert',
  contentTypeNotInstalledDesc: 'Du har ikke tilgang til å installere innholdstyper.',
  theContentType: 'the content type',
  currentMenuSelected: 'current selection',
  errorCommunicatingHubTitle: 'Not able to communicate with hub.',
  errorCommunicatingHubContent: 'An error occured. Please try again.',
  warningNoContentTypesInstalled: "You don't have any content types installed.",
  warningChangeBrowsingToSeeResults: 'Click <em>All</em> to get the list of all the content types you can install.',
  warningUpdateAvailableTitle: 'A new version of :contentType is available.',
  warningUpdateAvailableBody: 'Update to the latest version for an improved experience.',
  licenseDescription: 'Some of the features of this license are indicated below. Click the info icon above to read the original license text.',
  licenseModalTitle: 'License Details',
  licenseModalSubtitle: 'Select a license to view information about proper usage',
  licenseUnspecified: 'Unspecified',
  licenseCanUseCommercially: 'Can use commercially',
  licenseCanModify: 'Can modify',
  licenseCanDistribute: 'Can distribute',
  licenseCanSublicense: 'Can sublicense',
  licenseCanHoldLiable: 'Can hold liable',
  licenseMustIncludeCopyright: 'Must include copyright',
  licenseMustIncludeLicense: 'Must include license',
  licenseFetchDetailsFailed: 'Failed fetching license details',
  imageLightboxTitle: 'Images',
  imageLightBoxProgress: ':num of :total',
  nextImage: 'Next image',
  previousImage: 'Previous image',
  screenshots: 'Screenshots',
  reloadButtonLabel: 'Reload'
};
