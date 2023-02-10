declare namespace WindowsInstaller {
  export const enum msiAdvertisementContext {
    msiAdvertiseProductMachine = 0, // Advertises the application for an instalation in the per-machine installation context. This makes the package available for installation by all users of the computer.
    msiAdvertiseProductUser = 1, // Advertises the application for an installation in the per-user installation context.
  }
  export const enum msiAdvertiseOptions {
    msiAdvertiseDefault = 0, //  Standard advertisement
    msiAdvertiseSingleInstance = 1, // Advertises a new instance of the product. Requires that the first transform in the transform list of the transforms parameter be the instance transform that changes the product code. For more information, see Installing Multiple Instances of Products and Patches.
  }
  export const enum msiAdvertiseScriptFlags {
    msiAdvertiseScriptCacheInfo = 0x001, // Include this flag if the icons need to be created or removed.
    msiAdvertiseScriptShortcuts = 0x004, // Include this flag if the shortcuts need to be created or removed.
    msiAdvertiseScriptMachineAssign = 0x008, // Include this flag if the product is to be assigned to a computer.
    msiAdvertiseScriptConfigurationRegistration = 0x020, // Include this flag if the configuration and management information in the registry data needs to be written or removed.
    msiAdvertiseScriptValidateTransformList = 0x040, // Include this flag to force the validation of the transforms listed in the script against previously registered transforms for this product. Note that transform conflicts are detected using a string comparison that is case insensitive and are evaluated between per-user and per-machine installations across all installation contexts.
    msiAdvertiseScriptClassInfoRegistration = 0x080, // Include this flag if advertisement information in the registry related to COM classes needs to be written or removed.
    msiAdvertiseScriptExtensionInfoRegistration = 0x100, // Include this flag if advertisement information in the registry related to an extension needs to be written or removed.
    msiAdvertiseScriptAppInfo = 0x180, // Include this flag if the advertisement information in the registry needs to be written or removed.
    msiAdvertiseScriptRegData = 0x1a0, // Include this flag if the advertisement information in the registry needs to be written or removed.
  }
  export const enum msiInstallState {
    msiInstallStateAdvertised = 1, // The feature is advertised
    msiInstallStateAbsent = 2, // The feature is uninstalled.
    msiInstallStateLocal = 3, // The feature is installed locally.
    msiInstallStateSource = 4, // The feature is installed to run from source.
    msiInstallStateDefault = 5, // The feature is installed to its default location.
    msiInstallStateInvalidArg = -2, //	An invalid parameter was passed to the function.
    msiInstallStateUnknown = -1, // The product is neither advertised nor installed.
    msiInstallStateBadConfig = -6, // The configuration data is corrupt.
    msiInstallStateNotUsed = -7,
    msiInstallStateIncomplete = -5,
    msiInstallStateSourceAbsent = -4,
    msiInstallStateMoreData = -3,
    msiInstallStateBroken = 0,
  }
  export const enum msiInstallType {
    msiInstallTypeDefault = 0, // Searches system for products to patch. In this case, InstallPackage must be an empty string.
    msiInstallTypeNetworkImage = 1, // Indicates a administrative installation. In this case, InstallPackage must be set to a package path. A value of 1 for msiInstallTypeNetworkImage specifies a administrative installation.
    msiInstallSingleInstance = 2, // Patch the product specified by InstallPackage. InstallPackage is the product code of the instance to patch. This type of installation requires the Windows Installer version shipped with Windows Server 2003 or later or Windows Installer XP SP1 or later. For more information see, Installing Multiple Instances of Products and Patches.
  }
  export const enum msiInstallMode {
    msiInstallModeDefault = 0, // Provides the component path, performing any installation, if necessary.
    msiInstallModeExisting = -1, // Provides the component path only if the feature exists; otherwise, returns an empty string. This mode verifies the existence of the component's key file.
    msiInstallModeNoDetection = -2, // Provides the component path only if the feature exists. Otherwise, returns an empty string. This mode checks the component's registration but does not verify the existence of the component's key file.
    msiInstallModeNoSourceResolution = -3, // Provides the component path only if the feature exists with an InstallState parameter of msiInstallStateLocal. This checks the component's registration but does not verify the existence of the component's key file.
  }
  export const enum msiReinstallMode {
    msiReinstallModeRepair = 0x00000001, // Reinstalls only if the file is missing.
    msiReinstallModeFileMissing = 0x00000002, // Reinstalls only if the file is missing.
    msiReinstallModeFileOlderVersion = 0x00000004, // Reinstalls if the file is missing or is an older version.
    msiReinstallModeFileEqualVersion = 0x00000008, // Reinstalls if the file is missing or is an equal or older version.
    msiReinstallModeFileExact = 0x00000010, // Reinstalls if the file is missing or is not an exact version.
    msiReinstallModeFileVerify = 0x00000020, // Checks sum executables, and reinstalls if they are missing or corrupt.
    msiReinstallModeFileReplace = 0x00000040, // Reinstalls all files regardless of version.
    msiReinstallModeUserData = 0x00000100, // Ensures required per=user registry entries.
    msiReinstallModeMachineData = 0x00000080, // Ensures required per=machine registry entries.
    msiReinstallModeShortcut = 0x00000200, // Validates shortcuts.
    msiReinstallModePackage = 0x00000400, // Uses the recache source to install the package.
  }
  export const enum msiAdvertisePlatform {
    msiAdvertiseCurrentPlatform = 0, // Creates a script for the current platform.
    msiAdvertiseX86Platform = 1, // Creates a script for the x86 platform.
    msiAdvertiseIA64Platform = 2, // Creates a script for Itanium-based systems.
    msiAdvertiseX64Platform = 4, // Creates a script for the x64 platform.
  }
  export const enum msiSignatureOption {
    msiSignatureOptionInvalidHashFatal = 1, // With Options set to msiSignatureOptionInvalidHashFatal, FileSignatureInfo always returns a fatal error for an invalid hash.
    // If Options is not set to msiSignatureOptionInvalidHashFatal and Format is set to msiSignatureInfoCertificate, FileSignatureInfo does not return an error for an invalid hash.
  }
  export const enum msiSignatureInfoFormat {
    msiSignatureInfoCertificate = 0, // Returns a SAFEARRAY of bytes that represent the encoded certificate.
    msiSignatureInfoHash = 1, // Returns a SAFEARRAY of bytes that represent the hash.
  }
  export const enum msiReadStreamFormat {
    msiReadStreamInteger = 0, // As a long integer the length must be 1 to 4.
    msiReadStreamBytes = 1, // The data as a BSTRâ€”one byte per character.
    msiReadStreamAnsi = 2, // The ANSI bytes translated to a Unicode BSTR.
    msiReadStreamDirect = 3, // The byte pairs that are returned directly as a BSTR
  }
  export const enum msiOpenDatabaseMode {
    msiOpenDatabaseModeReadOnly = 0, // Opens a database read-only, no persistent changes.
    msiOpenDatabaseModeTransact = 1, // Opens a database read/write in transaction mode.
    msiOpenDatabaseModeDirect = 2, // Opens a database direct read/write without transaction.
    msiOpenDatabaseModeCreate = 3, // Creates a new database, transact mode read/write.
    msiOpenDatabaseModeCreateDirect = 4, // Creates a new database, direct mode read/write.
    msiOpenDatabaseModeListScript = 5, // Opens a database to view advertise script files, such as the files generated by the CreateAdvertiseScript method.
    msiOpenDatabaseModePatchFile = 32, // Adds this flag to indicate a patch file.
  }
  export const enum msiProvideAssemblyInfo {
    msiProvideAssemblyNet = 0, // A .NET assembly.
    msiProvideAssemblyWin32 = 1, // A Win32 side-by-side assembly.
  }
  export const enum msiOpenPackageFlags {
    msiOpenPackageFlagsIgnoreMachineState = 1, // Ignore the computer state when creating the product handle.
  }
  export const enum REGROOT {
    HKEY_CLASSES_ROOT = 0,
    HKEY_CURRENT_USER = 1,
    HKEY_LOCAL_MACHINE = 2,
    HKEY_USERS = 3,
    HKEY_PERFORMANCE_DATA = 4,
    HKEY_CURRENT_CONFIG = 5,
    HKEY_DYN_DATA = 6,
    HKCU = HKEY_CURRENT_USER,
    HKLM = HKEY_LOCAL_MACHINE,
    HKCR = HKEY_CLASSES_ROOT,
  }
  export const enum SummaryPropertyId {
    PID_DICTIONARY = 0, //	Special format, not support by SummaryInfo object
    PID_CODEPAGE = 1, //	VT_I2
    PID_TITLE = 2, //	VT_LPSTR
    PID_SUBJECT = 3, //	VT_LPSTR
    PID_AUTHOR = 4, //	VT_LPSTR
    PID_KEYWORDS = 5, //	VT_LPSTR
    PID_COMMENTS = 6, //	VT_LPSTR
    PID_TEMPLATE = 7, //	VT_LPSTR
    PID_LASTAUTHOR = 8, //	VT_LPSTR
    PID_REVNUMBER = 9, //	VT_LPSTR
    PID_EDITTIME = 10, //	VT_FILETIME
    PID_LASTPRINTED = 11, //	VT_FILETIME
    PID_CREATE_DTM = 12, //	VT_FILETIME
    PID_LASTSAVE_DTM = 13, //	VT_FILETIME
    PID_PAGECOUNT = 14, //	VT_I4
    PID_WORDCOUNT = 15, //	VT_I4
    PID_CHARCOUNT = 16, //	VT_I4
    PID_THUMBNAIL = 17, //	VT_CF (not supported)
    PID_APPNAME = 18, //	VT_LPSTR
    PID_SECURITY = 19, //	VT_I4
    COUNT_OF_PID = 20,
  }

  const enum SummaryPropertySecurityType {
    NO_RESTRICTION = 0,
    READONLY_RECOMMENDED = 2,
    READONLY_ENFORCED = 4,
  }

  interface ISummaryPropertyType {
    [SummaryPropertyId.PID_CODEPAGE]: number;
    [SummaryPropertyId.PID_TITLE]: string;
    [SummaryPropertyId.PID_SUBJECT]: string;
    [SummaryPropertyId.PID_AUTHOR]: string;
    [SummaryPropertyId.PID_KEYWORDS]: string;
    [SummaryPropertyId.PID_COMMENTS]: string;
    [SummaryPropertyId.PID_TEMPLATE]: string;
    [SummaryPropertyId.PID_LASTAUTHOR]: string;
    [SummaryPropertyId.PID_REVNUMBER]: string;
    [SummaryPropertyId.PID_EDITTIME]: VarDate;
    [SummaryPropertyId.PID_LASTPRINTED]: VarDate;
    [SummaryPropertyId.PID_CREATE_DTM]: VarDate;
    [SummaryPropertyId.PID_LASTSAVE_DTM]: VarDate;
    [SummaryPropertyId.PID_PAGECOUNT]: number;
    [SummaryPropertyId.PID_WORDCOUNT]: number;
    [SummaryPropertyId.PID_CHARCOUNT]: number;
    [SummaryPropertyId.PID_APPNAME]: string;
    [SummaryPropertyId.PID_SECURITY]: SummaryPropertySecurityType;
  }

  export const enum msiUILevel {
    msiUILevelNoChange = 0, // Does not change UI level.
    msiUILevelDefault = 1, // Uses default UI level.
    msiUILevelNone = 2, // Silent installation.
    msiUILevelBasic = 3, // Simple progress and error handling.
    msiUILevelReduced = 4, // Authored UI and wizard dialog boxes suppressed.
    msiUILevelFull = 5, // Authored UI with wizards, progress, and errors.
    msiUILevelHideCancel = 32, // If combined with the msiUILevelBasic value, the installer shows progress dialog boxes but does not display a Cancel button on the dialog box to prevent users from canceling the installation.
    msiUILevelProgressOnly = 64, // If combined with the msiUILevelBasic value, the installer displays progress dialog boxes but does not display any modal dialog boxes or error dialog boxes.
    msiUILevelEndDialog = 128, // If combined with any above value, the installer displays a modal dialog box at the end of a successful installation or if there has been an error. No dialog box is displayed if the user cancels.
  }
  export const enum msiDatabaseState {
    msiDatabaseStateRead = 0, // Database opens as read-only. Changes to persistent data are not permitted and temporary data is not saved.
    msiDatabaseStateWrite = 1, // Database is fully operational for read and write.
  }
  export const enum msiEvaluateCondition {
    msiEvaluateConditionFalse = 0, // Table is temporary.
    msiEvaluateConditionTrue = 1, // Table is persistent.
    msiEvaluateConditionNone = 2, // Table is not in the database.
    msiEvaluateConditionError = 3, // Invalid or missing table name.
  }
  export const enum msiTransformError {
    msiTransformErrorNone = 0x0000, // None of the following conditions.
    msiTransformErrorAddExistingRow = 0x0001, // Adds a row that already exists.
    msiTransformErrorDeleteNonExistingRow = 0x0002, // Deletes a row that does not exist.
    msiTransformErrorAddExistingTable = 0x0004, // Adds a table that already exists.
    msiTransformErrorDeleteNonExistingTable = 0x0008, // Deletes a table that does not exist.
    msiTransformErrorUpdateNonExistingRow = 0x0010, // Updates a row that does not exist.
    msiTransformErrorChangeCodePage = 0x0020, // Transform and database code pages do not match and neither has a neutral code page.
    msiTransformErrorViewTransform = 0x0100, // Creates the temporary _TransformView table.
  }
  export const enum msiTransformValidation {
    msiTransformValidationNone = 0, // No validation done.
    msiTransformValidationLanguage = 1, // Default language must match base database.
    msiTransformValidationProduct = 2, // Product must match base database.
    msiTransformValidationMajorVer = 8, // Checks major version only.
    msiTransformValidationMinorVer = 16, // Checks major and minor version only.
    msiTransformValidationUpdateVer = 32, // Checks major, minor, and update versions.
    msiTransformValidationLess = 64, // Applied version < base version
    msiTransformValidationLessOrEqual = 128, // Applied version <= base version
    msiTransformValidationEqual = 256, // Applied version = base version
    msiTransformValidationGreaterOrEqual = 512, // Applied version >= base version
    msiTransformValidationGreater = 1024, // Applied version > base version
    msiTransformValidationUpgradeCode = 2048, // Validates that the transform is the appropriate UpgradeCode.
  }
  export const enum msiViewModify {
    msiViewModifySeek = -1, // Refreshes the information in the supplied record without changing the position in the result set and without affecting subsequent fetch operations. The record may then be used for subsequent Update, Delete, and Refresh. All primary key columns of the table must be in the query and the record must have at least as many fields as the query.Seek cannot be used with multitable queries. See the remarks. This mode cannot be used with a view containing joins.
    msiViewModifyRefresh = 0, // Refreshes the information in the record. Must first call the Fetch method with the same record. Fails for a deleted row. Works with both read-write and read-only records.
    msiViewModifyInsert = 1, // Inserts a record. Fails if a row with the same primary keys exists. Fails with a read-only database. This mode cannot be used with a view containing joins.
    msiViewModifyUpdate = 2, // Updates an existing record. Non-primary keys only. Must first call the Fetch method with the same record. Fails with a deleted record. Works only with read-write records.
    msiViewModifyAssign = 3, // Writes current data in the cursor to a table row. Updates record if the primary keys match an existing row and inserts if they do not match. Fails with a read-only database. This mode cannot be used with a view containing joins.
    msiViewModifyReplace = 4, // Updates or deletes and inserts a record into a table. Must first call the Fetch method with the same record. Updates record if the primary keys are unchanged. Deletes old row and inserts new if primary keys have changed. Fails with a read-only database. This mode cannot be used with a view containing joins.
    msiViewModifyMerge = 5, // Inserts or validates a record in a table. Inserts if primary keys do not match any row and validates if there is a match. Fails if the record does not match the data in the table. Fails if there is a record with a duplicate key that is not identical. Works only with read-write records. This mode cannot be used with a view containing joins.
    msiViewModifyDelete = 6, // Removes a row from the table. Must first call the Fetch method with the same record. Fails if the row has been deleted. Works only with read-write records. This mode cannot be used with a view containing joins.
    msiViewModifyInsertTemporary = 7, // Inserts a temporary record. The information is not persistent. Fails if a row with the same primary key exists. Works only with read-write records. This mode cannot be used with a view containing joins.
    msiViewModifyValidate = 8, // Validates a record. Does not validate across joins. Must first call the Fetch method with the same record. Obtain validation errors with GetError method. Works with read-write and read-only records. This mode cannot be used with a view containing joins.
    msiViewModifyValidateNew = 9, // Validates a new record. Does not validate across joins. Checks for duplicate keys. Obtains validation errors by calling GetError method. Requires calling MsiDatabase.OpenView method with a modify value. Works with read-write and read-only records. This mode cannot be used with a view containing joins.
    msiViewModifyValidateField = 10, // Validates fields of a fetched or new record. Can validate one or more fields of an incomplete record. Obtains validation errors by calling GetError method. Works with read-write and read-only records. This mode cannot be used with a view containing joins.
    msiViewModifyValidateDelete = 11, // Validates a record that will be deleted later. Must first call the Fetch method with the same record. Fails if another row refers to the primary keys of this row. Validation does not check for the existence of the primary keys of this row in properties or strings. Does not check if a column is a foreign key to multiple tables. Obtain validation errors by calling the GetError method. Works with read-write and read-only records. This mode cannot be used with a view containing joins.
  }
  export const enum msiColumnInfo {
    msiColumnInfoNames = 0, // Returns the names of all nonconstant columns in result set.
    msiColumnInfoTypes = 1, // Returns the types of all nonconstant columns in result set.
  }

  export const enum msiDatabaseInteger {
    msiDatabaseNullInteger = -2147483648,
  }
  export const enum msiInstallContext {
    // Include applications installed in the per–user–managed installation context.
    userManaged = 1,
    // Include applications installed in the per–user–unmanaged installation context.
    userUnmanaged = 2,
    // Include applications installed in the per-machine installation context. When dwInstallContext is set to MSIINSTALLCONTEXT_MACHINE only, the szUserSID parameter must be NULL.
    machine = 4,
  }

  const enum msidbComponentAttributes {
    // Component cannot be run from source. Set this bit for all components belonging to a feature to prevent the feature from being run-from-network or run-from-source. Note that if a feature has no components, the feature always shows run-from-source and run-from-my-computer as valid options.
    msidbComponentAttributesLocalOnly = 0x0000,
    // Component can only be run from source. Set this bit for all components belonging to a feature to prevent the feature from being run-from-my-computer. Note that if a feature has no components, the feature always shows run-from-source and run-from-my-computer as valid options.
    msidbComponentAttributesSourceOnly = 0x0001,
    // Component can run locally or from source.
    msidbComponentAttributesOptional = 0x0002,
    // If this bit is set, the value in the KeyPath column is used as a key into the Registry table. If the Value field of the corresponding record in the Registry table is null, the Name field in that record must not contain "+", "-", or "*". For more information, see the description of the Name field in Registry table.
    // Setting this bit is recommended for registry entries written to the HKCU hive. This ensures the installer writes the necessary HKCU registry entries when there are multiple users on the same machine.
    msidbComponentAttributesRegistryKeyPath = 0x0004,
    // If this bit is set, the installer increments the reference count in the shared DLL registry of the component's key file. If this bit is not set, the installer increments the reference count only if the reference count already exists.
    msidbComponentAttributesSharedDllRefCount = 0x0008,
    // If this bit is set, the installer does not remove the component during an uninstall. The installer registers an extra system client for the component in the Windows Installer registry settings.
    msidbComponentAttributesPermanent = 0x0010,
    // If this bit is set, the value in the KeyPath column is a key into the ODBCDataSource table.
    msidbComponentAttributesODBCDataSource = 0x0020,
    // If this bit is set, the installer reevaluates the value of the statement in the Condition column upon a reinstall. If the value was previously False and has changed to True, the installer installs the component. If the value was previously True and has changed to False, the installer removes the component even if the component has other products as clients.
    // This bit should only be set for transitive components. See Using Transitive Components.
    msidbComponentAttributesTransitive = 0x0040,
    // If this bit is set, the installer does not install or reinstall the component if a key path file or a key path registry entry for the component already exists. The application does register itself as a client of the component.
    // Use this flag only for components that are being registered by the Registry table. Do not use this flag for components registered by the AppId, Class, Extension, ProgId, MIME, and Verb tables.
    msidbComponentAttributesNeverOverwrite = 0x0080,
    // Set this bit to mark this as a 64-bit component. This attribute facilitates the installation of packages that include both 32-bit and 64-bit components. If this bit is not set, the component is registered as a 32-bit component.
    // If this is a 64-bit component replacing a 32-bit component, set this bit and assign a new GUID in the ComponentId column.
    msidbComponentAttributes64bit = 0x0100,
    // Set this bit to disable Registry Reflection on all existing and new registry keys affected by this component. If this bit is set, the Windows Installer calls the RegDisableReflectionKey on each key being accessed by the component. This bit is available with Windows Installer version 4.0. This bit is ignored on 32-bit systems. This bit is ignored on the 64-bit versions of Windows XP.
    //     [!Note]
    //     32-bit Windows applications running on the 64-bit Windows emulator (WOW64) refer to a different view of the registry than 64-bit applications. Registry reflection copies some registry values between these two registry views.
    msidbComponentAttributesDisableRegistryReflection = 0x0200,
    // Set this bit for a component in a patch package to prevent leaving orphan components on the computer. If a subsequent patch is installed, marked with the msidbPatchSequenceSupersedeEarlier value in its MsiPatchSequence table to supersede the first patch, Windows Installer 4.5 and later can unregister and uninstall components marked with the msidbComponentAttributesUninstallOnSupersedence value. If the component is not marked with this bit, installation of a superseding patch can leave behind an unused component on the computer.
    // Setting the MSIUNINSTALLSUPERSEDEDCOMPONENTS property has the same effect as setting this bit for all components.
    // Windows Installer 4.0 and earlier: The msidbComponentAttributesUninstallOnSupersedence value is not supported and is ignored.
    msidbComponentAttributesUninstallOnSupersedence = 0x0400,
    // If a component is marked with this attribute value in at least one package installed on the system, the installer treats the component as marked in all packages. If a package that shares the marked component is uninstalled, Windows Installer 4.5 can continue to share the highest version of the component on the system, even if that highest version was installed by the package that is being uninstalled.
    // If the DisableSharedComponent policy is set to 1, no package gets the shared component functionality enabled by this bit.
    // Windows Installer 4.0 and earlier: The msidbComponentAttributesShared value is not supported and is ignored.
    msidbComponentAttributesShared = 0x0800,
  }
  const enum msiComponentRequestState {
    // Item is to be removed.
    msiInstallStateAbsent = 2,
    // Item is to be installed locally.
    msiInstallStateLocal = 3,
    // Item is to be installed and run from the source media.
    msiInstallStateSource = 4,
    // If installed, the item is to be reinstalled in the same state.
    msiInstallStateDefault = 5,
  }
  const enum msiRunMode {
    // Administrative mode install, else product install.
    msiRunModeAdmin = 0,
    // Advertise mode of install.
    msiRunModeAdvertise = 1,
    // 	Maintenance mode database loaded.
    msiRunModeMaintenance = 2,
    // Rollback is enabled.
    msiRunModeRollbackEnabled = 3,
    // Log file is active.
    msiRunModeLogEnabled = 4,
    // Executing or spooling operations.
    msiRunModeOperations = 5,
    // Reboot is needed (settable).
    msiRunModeRebootAtEnd = 6,
    // Reboot is needed to continue installation (settable).
    msiRunModeRebootNow = 7,
    // Installing files from cabinets and files using Media table.
    msiRunModeCabinet = 8,
    // Source files use only short file names.
    msiRunModeSourceShortNames = 9,
    // 	Target files are to use only short file names.
    msiRunModeTargetShortNames = 10,
    // Operating system is Windows 98/95.
    msiRunModeWindows9x = 12,
    // Operating system supports advertising of products.
    msiRunModeZawEnabled = 13,
    // Deferred custom action called from install script execution.
    msiRunModeScheduled = 16,
    // Deferred custom action called from rollback execution script.
    msiRunModeRollback = 17,
    // Deferred custom action called from commit execution script.
    msiRunModeCommit = 18,
  }

  interface ICollection<K, T> {
    Count: number;
    Item(index: K): T;
  }

  interface IRecord {
    FieldCount: number; // Returns the number of fields in the record.
    ClearData(): void; // Clears the data in all fields, setting them to null.
    FormatText(): void; // Formats fields according to the template in field 0.
    ReadStream(field: number, length: number, format: msiReadStreamFormat): any; // Reads a specified number of bytes from a record field holding stream data.
    SetStream(field: number, filepath: string): void; // Copies the content of the specified file into the designated record field as stream data.
    DataSize(field: number): number; // Returns the size of the data for the designated field.
    IntegerData(field: number): number; // Read/write  Transfers 32-bit integer data in to or out of a specified field within the record.
    IsNull(field: number): boolean; // Returns True if the indicated field is null and False if the field contains data.
    StringData(field: number): string; // Read/write Transfers string data in to or out of a specified field within the record.
  }
  type RecordList = ICollection<number, IRecord>;
  type StringList = ICollection<number, string>;
  interface ISession {
    readonly ComponentCosts: unknown; // Returns a RecordList object enumerating the disk space per drive required to install a component.
    readonly Database: IDatabase; // Returns the database for the current installation session.
    readonly FeatureCost: unknown; // Returns the total amount of disk space (in units of 512 bytes) required by the specified feature and its parent features (up to the root of the Feature table).
    readonly Installer: Installer; // Returns the active installer object.
    readonly Language: number; // Represents the numeric language identifier used by the current installation session.
    VerifyDiskSpace: boolean; // Returns true if enough disk space exists, and false if the disk is full.
    // 	Executes the specified action.
    DoAction(...args: unknown[]): unknown;
    // 	Evaluates a logical expression containing symbols and values and returns an integer of the enumeration msiEvaluateConditionErrorEnum.
    EvaluateCondition(...args: unknown[]): unknown;
    // 	Returns a FeatureInfo object containing descriptive information for the specified feature.
    FeatureInfo(...args: unknown[]): unknown;
    // 	Returns a formatted string from template and record data.
    FormatRecord(...args: unknown[]): unknown;
    // 	Performs any enabled logging operations and defers execution to the UI handler object associated with the engine.
    Message(...args: unknown[]): unknown;
    // 	Opens a query on the specified table, ordering the actions by the numbers in the Sequence column. For each row fetched, the DoAction method is called, provided that any supplied condition expression does not evaluate to False.
    Sequence(...args: unknown[]): unknown;
    // 	Sets the install level for the current installation to a specified value and recalculates the Select and Installed states for all features.
    SetInstallLevel(...args: unknown[]): unknown;
    ComponentCurrentState(id: string): msiComponentRequestState; // Returns the current installed state of the designated component.
    ComponentRequestState(id: string): msiComponentRequestState; // Obtains or requests a change in the Action state of a row in the Component table.
    FeatureCurrentState(name: string | 'ALL'): msiInstallState; // Returns the current installed state of the designated feature.
    FeatureRequestState(name: string | 'ALL'): msiInstallState; // Read/write Obtains or requests a change in the Select state of a feature's record and subrecords.
    FeatureValidStates(name: string): msiInstallState; // Returns an integer representing bit flags with each relevant bit representing a valid installation state for the specified feature.
    Mode(flag: msiRunMode): unknown; // This property is a value representing the designated mode flag for the current installation session.
    ProductProperty(name: string): unknown; // Represents the string value of a named installer property.
    Property(name: string): unknown; //  (Session Object) Read/write Retrieves product properties from the product database.
    SourcePath(id: string): string; // Provides the full path to the designated folder on the source media or server image.
    TargetPath(id: string): string; // Read/write Provides the full path to the designated folder on the installation target drive.
  }
  interface ISummaryInfo {
    PropertyCount: number;
    Persist(): void;
    Property<T extends keyof ISummaryPropertyType>(id: T): ISummaryPropertyType[T];
  }
  interface IView {
    Close(): void; // Terminates query execution and releases database resources.
    Execute(params?: IRecord): void; // Uses the question mark token to represent parameters in a SQL query. The values of these parameters are passed in as the corresponding fields of a parameter record.
    Fetch(): IRecord | null; // Returns a Record object containing the requested column data if more rows are available in the result set, otherwise, it returns null.
    GetError(): string; // Returns the Validation error and column name for which the error occurred.
    Modify(action: msiViewModify, record: IRecord): void; // Modifies a database row with a modified Record object obtained by the Fetch method.
    ColumnInfo(info: msiColumnInfo): IRecord;
  }
  interface IDatabase {
    readonly DatabaseState: msiDatabaseState; // Returns the persistence state of the database.
    TablePersistent(tableName: string): msiEvaluateCondition; // Returns the persistence state of the table.
    ApplyTransform(transformFile: string, errorConditions: msiTransformError): void; // Applies the transform to this database.
    Commit(): void; // Finalizes the persistent form of the database.
    CreateTransformSummaryInfo(
      reference: IDatabase,
      storage?: string,
      errorConditions?: msiTransformError,
      validation?: msiTransformValidation,
    ): void; // Creates and populates the summary information stream of an existing transform file.
    EnableUIPreview(): void; // Facilitates the authoring of dialog boxes and billboards by providing the support needed to view user interface dialog boxes stored in the installer database.
    Export(table: string, path: string, file: string): void; // Copies the structure and data from a specified table to a text archive file.
    GenerateTransform(reference: IDatabase, storage?: string): void; // Creates a transform.
    Import(path: string, file: string): void; // Imports a database table from a text archive file.
    Merge(reference: IDatabase, errorTable: string): void; // Merges the reference database with the base database.
    OpenView(sql: string): IView; // Returns a View object representing the query specified by a SQL string.
    PrimaryKeys(tablename: string): IRecord; // Returns a Record object containing the table name and the column names (comprising the primary keys).
    SummaryInformation(max: number): ISummaryInfo; // Returns a SummaryInfo object that can be used to examine, update, and add properties to the summary information stream.
  }

  export interface Installer {
    readonly Client: unknown;
    readonly ComponentClients: unknown;
    readonly ComponentQualifiers: unknown;
    readonly Components: unknown;
    readonly ComponentsEx: unknown;
    readonly FeatureParent: unknown;
    readonly FeatureState: unknown;
    readonly FeatureUsageCount: unknown;
    readonly FeatureUsageDate: unknown;
    readonly PatchesEx: unknown;
    readonly PatchFiles: unknown;
    readonly PatchInfo: unknown;
    readonly PatchTransforms: unknown;
    readonly ProductInfo: unknown;
    readonly ProductInfoFromScript: unknown;
    readonly ProductsEx: unknown;
    readonly Products: StringList;
    readonly QualifierDescription: unknown;
    UILevel: msiUILevel;
    readonly Version: string;
    Environment(name: string): string;
    Features(productCode: string): StringList;
    FileAttributes(path: string): number;
    Patches(product: string): StringList;
    ProductElevated(productCode: string): boolean;
    RelatedProducts(upgradeCode: string): StringList;
    ShortcutTarget(path: string): IRecord;
    SummaryInformation(msipath: string): ISummaryInfo;

    AddSource(Product: string, User: string, Source: string): void;
    AdvertiseProduct(
      packagePath: string,
      context: msiAdvertisementContext,
      transforms?: string,
      language?: string,
      options?: msiAdvertiseOptions,
    ): void;
    AdvertiseScript(scriptPath: string, scriptFlags: msiAdvertiseScriptFlags, removeItems: boolean): void;
    ApplyPatch(PatchPackage: string, InstallPackage?: string, InstallType?: msiInstallType, CommandLine?: string): void;
    ApplyMultiplePatches(PatchPackagesList: string, Product: string, szPropertiesList: string): void;
    ClearSourceList(Product: string, User: string): void;
    CollectUserInfo(Product: string): void;
    ConfigureFeature(Product: string, Feature: string, InstallState: msiInstallState): void;
    ConfigureProduct(Product: string, InstallLevel: number, InstallState: msiInstallState): void;
    CreateAdvertiseScript(
      packagePath: string,
      scriptFilePath: string,
      transforms?: string,
      language?: number,
      platform?: msiAdvertisePlatform,
      options?: msiAdvertiseOptions,
    ): void;
    CreateRecord(count: number): IRecord;
    EnableLog(logMode: string, logFile: string): void;
    ExtractPatchXMLData(PatchPath: string): string;
    FileHash(FilePath: string, Options: 0): IRecord;
    FileSignatureInfo(FilePath: string, Options: msiSignatureOption, Format: msiSignatureInfoFormat): unknown;
    FileSize(Path: string): number;
    FileVersion(Path: string, Language?: boolean): string;
    ForceSourceListResolution(Product: string, User: string): void;
    InstallProduct(packagePath: string, propertyValues: string): void;
    LastErrorRecord(): IRecord;
    OpenPackage(packagePath: string, options: msiOpenPackageFlags): ISession;
    OpenDatabase(name: string, openMode: msiOpenDatabaseMode): IDatabase;
    OpenProduct(productCode: string): ISession;
    ProductState(Product: string): msiInstallState;
    ProvideAssembly(
      assembly: string,
      appContext: string,
      installMode: msiInstallMode,
      assemblyInfo: msiProvideAssemblyInfo,
    ): string;
    ProvideComponent(Product: string, Feature: string, Component: string, InstallMode: msiInstallMode): void;
    ProvideQualifiedComponent(Category: string, Qualifier: string, InstallMode: msiInstallMode): string;
    RegistryValue(root: REGROOT, key: string, value?: string | number): string | number | boolean;
    ReinstallFeature(Product: string, Feature: string, ReinstallMode: msiReinstallMode): void;
    ReinstallProduct(Product: string, ReinstallMode: msiReinstallMode): void;
    RemovePatches(
      PatchList: string,
      ProductCode: string,
      UninstallType: msiInstallType.msiInstallSingleInstance,
      PropertyList?: string,
    ): void;
    UseFeature(Product: string, Feature: string, InstallMode: msiInstallMode): msiInstallState;
    ComponentPath(productCode: string, componentId: string): string;
    ComponentPathEx(productCode: string, componentId: string, userSid: string, context: msiInstallContext): RecordList;
  }
}

interface ActiveXObjectNameMap {
  'WindowsInstaller.Installer': WindowsInstaller.Installer;
}
