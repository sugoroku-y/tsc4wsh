declare namespace VirtualBox {
  const VBOX_E_OBJECT_NOT_FOUND = 0x80bb0001;
  const VBOX_E_INVALID_VM_STATE = 0x80bb0002;
  const VBOX_E_VM_ERROR = 0x80bb0003;
  const VBOX_E_FILE_ERROR = 0x80bb0004;
  const VBOX_E_IPRT_ERROR = 0x80bb0005;
  const VBOX_E_PDM_ERROR = 0x80bb0006;
  const VBOX_E_INVALID_OBJECT_STATE = 0x80bb0007;
  const VBOX_E_HOST_ERROR = 0x80bb0008;
  const VBOX_E_NOT_SUPPORTED = 0x80bb0009;
  const VBOX_E_XML_ERROR = 0x80bb000a;
  const VBOX_E_INVALID_SESSION_STATE = 0x80bb000b;
  const VBOX_E_OBJECT_IN_USE = 0x80bb000c;
  const VBOX_E_PASSWORD_INCORRECT = 0x80bb000d;
  const VBOX_E_MAXIMUM_REACHED = 0x80bb000e;
  const VBOX_E_GSTCTL_GUEST_ERROR = 0x80bb000f;
  const VBOX_E_TIMEOUT = 0x80bb0010;
  const enum SettingsVersion {
    SettingsVersion_Null = 0,
    SettingsVersion_v1_0 = 1,
    SettingsVersion_v1_1 = 2,
    SettingsVersion_v1_2 = 3,
    SettingsVersion_v1_3pre = 4,
    SettingsVersion_v1_3 = 5,
    SettingsVersion_v1_4 = 6,
    SettingsVersion_v1_5 = 7,
    SettingsVersion_v1_6 = 8,
    SettingsVersion_v1_7 = 9,
    SettingsVersion_v1_8 = 10,
    SettingsVersion_v1_9 = 11,
    SettingsVersion_v1_10 = 12,
    SettingsVersion_v1_11 = 13,
    SettingsVersion_v1_12 = 14,
    SettingsVersion_v1_13 = 15,
    SettingsVersion_v1_14 = 16,
    SettingsVersion_v1_15 = 17,
    SettingsVersion_v1_16 = 18,
    SettingsVersion_v1_17 = 19,
    SettingsVersion_Future = 99999,
  }

  const enum AccessMode {
    AccessMode_ReadOnly = 1,
    AccessMode_ReadWrite = 2,
  }

  const enum MachineState {
    MachineState_Null = 0,
    MachineState_PoweredOff = 1,
    MachineState_Saved = 2,
    MachineState_Teleported = 3,
    MachineState_Aborted = 4,
    MachineState_Running = 5,
    MachineState_Paused = 6,
    MachineState_Stuck = 7,
    MachineState_Teleporting = 8,
    MachineState_LiveSnapshotting = 9,
    MachineState_Starting = 10,
    MachineState_Stopping = 11,
    MachineState_Saving = 12,
    MachineState_Restoring = 13,
    MachineState_TeleportingPausedVM = 14,
    MachineState_TeleportingIn = 15,
    MachineState_FaultTolerantSyncing = 16,
    MachineState_DeletingSnapshotOnline = 17,
    MachineState_DeletingSnapshotPaused = 18,
    MachineState_OnlineSnapshotting = 19,
    MachineState_RestoringSnapshot = 20,
    MachineState_DeletingSnapshot = 21,
    MachineState_SettingUp = 22,
    MachineState_Snapshotting = 23,
    MachineState_FirstOnline = 5,
    MachineState_LastOnline = 19,
    MachineState_FirstTransient = 8,
    MachineState_LastTransient = 23,
  }

  const enum SessionState {
    SessionState_Null = 0,
    SessionState_Unlocked = 1,
    SessionState_Locked = 2,
    SessionState_Spawning = 3,
    SessionState_Unlocking = 4,
  }

  const enum CPUPropertyType {
    CPUPropertyType_Null = 0,
    CPUPropertyType_PAE = 1,
    CPUPropertyType_LongMode = 2,
    CPUPropertyType_TripleFaultReset = 3,
    CPUPropertyType_APIC = 4,
    CPUPropertyType_X2APIC = 5,
    CPUPropertyType_IBPBOnVMExit = 6,
    CPUPropertyType_IBPBOnVMEntry = 7,
    CPUPropertyType_HWVirt = 8,
    CPUPropertyType_SpecCtrl = 9,
    CPUPropertyType_SpecCtrlByHost = 10,
    CPUPropertyType_L1DFlushOnEMTScheduling = 11,
    CPUPropertyType_L1DFlushOnVMEntry = 12,
  }

  const enum HWVirtExPropertyType {
    HWVirtExPropertyType_Null = 0,
    HWVirtExPropertyType_Enabled = 1,
    HWVirtExPropertyType_VPID = 2,
    HWVirtExPropertyType_NestedPaging = 3,
    HWVirtExPropertyType_UnrestrictedExecution = 4,
    HWVirtExPropertyType_LargePages = 5,
    HWVirtExPropertyType_Force = 6,
    HWVirtExPropertyType_UseNativeApi = 7,
  }

  const enum ParavirtProvider {
    ParavirtProvider_None = 0,
    ParavirtProvider_Default = 1,
    ParavirtProvider_Legacy = 2,
    ParavirtProvider_Minimal = 3,
    ParavirtProvider_HyperV = 4,
    ParavirtProvider_KVM = 5,
  }

  const enum FaultToleranceState {
    FaultToleranceState_Inactive = 1,
    FaultToleranceState_Master = 2,
    FaultToleranceState_Standby = 3,
  }

  const enum LockType {
    LockType_Null = 0,
    LockType_Shared = 1,
    LockType_Write = 2,
    LockType_VM = 3,
  }

  const enum SessionType {
    SessionType_Null = 0,
    SessionType_WriteLock = 1,
    SessionType_Remote = 2,
    SessionType_Shared = 3,
  }

  const enum DeviceType {
    DeviceType_Null = 0,
    DeviceType_Floppy = 1,
    DeviceType_DVD = 2,
    DeviceType_HardDisk = 3,
    DeviceType_Network = 4,
    DeviceType_USB = 5,
    DeviceType_SharedFolder = 6,
    DeviceType_Graphics3D = 7,
  }

  const enum DeviceActivity {
    DeviceActivity_Null = 0,
    DeviceActivity_Idle = 1,
    DeviceActivity_Reading = 2,
    DeviceActivity_Writing = 3,
  }

  const enum ClipboardMode {
    ClipboardMode_Disabled = 0,
    ClipboardMode_HostToGuest = 1,
    ClipboardMode_GuestToHost = 2,
    ClipboardMode_Bidirectional = 3,
  }

  const enum DnDMode {
    DnDMode_Disabled = 0,
    DnDMode_HostToGuest = 1,
    DnDMode_GuestToHost = 2,
    DnDMode_Bidirectional = 3,
  }

  const enum Scope {
    Scope_Global = 0,
    Scope_Machine = 1,
    Scope_Session = 2,
  }

  const enum BIOSBootMenuMode {
    BIOSBootMenuMode_Disabled = 0,
    BIOSBootMenuMode_MenuOnly = 1,
    BIOSBootMenuMode_MessageAndMenu = 2,
  }

  const enum APICMode {
    APICMode_Disabled = 0,
    APICMode_APIC = 1,
    APICMode_X2APIC = 2,
  }

  const enum ProcessorFeature {
    ProcessorFeature_HWVirtEx = 0,
    ProcessorFeature_PAE = 1,
    ProcessorFeature_LongMode = 2,
    ProcessorFeature_NestedPaging = 3,
    ProcessorFeature_UnrestrictedGuest = 4,
    ProcessorFeature_NestedHWVirt = 5,
  }

  const enum FirmwareType {
    FirmwareType_BIOS = 1,
    FirmwareType_EFI = 2,
    FirmwareType_EFI32 = 3,
    FirmwareType_EFI64 = 4,
    FirmwareType_EFIDUAL = 5,
  }

  const enum PointingHIDType {
    PointingHIDType_None = 1,
    PointingHIDType_PS2Mouse = 2,
    PointingHIDType_USBMouse = 3,
    PointingHIDType_USBTablet = 4,
    PointingHIDType_ComboMouse = 5,
    PointingHIDType_USBMultiTouch = 6,
  }

  const enum KeyboardHIDType {
    KeyboardHIDType_None = 1,
    KeyboardHIDType_PS2Keyboard = 2,
    KeyboardHIDType_USBKeyboard = 3,
    KeyboardHIDType_ComboKeyboard = 4,
  }

  const enum BitmapFormat {
    BitmapFormat_Opaque = 0,
    BitmapFormat_BGR = 0x20524742,
    BitmapFormat_BGR0 = 0x30524742,
    BitmapFormat_BGRA = 0x41524742,
    BitmapFormat_RGBA = 0x41424752,
    BitmapFormat_PNG = 0x20474e50,
    BitmapFormat_JPEG = 0x4745504a,
  }

  const enum DhcpOpt {
    DhcpOpt_SubnetMask = 1,
    DhcpOpt_TimeOffset = 2,
    DhcpOpt_Router = 3,
    DhcpOpt_TimeServer = 4,
    DhcpOpt_NameServer = 5,
    DhcpOpt_DomainNameServer = 6,
    DhcpOpt_LogServer = 7,
    DhcpOpt_Cookie = 8,
    DhcpOpt_LPRServer = 9,
    DhcpOpt_ImpressServer = 10,
    DhcpOpt_ResourseLocationServer = 11,
    DhcpOpt_HostName = 12,
    DhcpOpt_BootFileSize = 13,
    DhcpOpt_MeritDumpFile = 14,
    DhcpOpt_DomainName = 15,
    DhcpOpt_SwapServer = 16,
    DhcpOpt_RootPath = 17,
    DhcpOpt_ExtensionPath = 18,
    DhcpOpt_IPForwardingEnableDisable = 19,
    DhcpOpt_NonLocalSourceRoutingEnableDisable = 20,
    DhcpOpt_PolicyFilter = 21,
    DhcpOpt_MaximumDatagramReassemblySize = 22,
    DhcpOpt_DefaultIPTime2Live = 23,
    DhcpOpt_PathMTUAgingTimeout = 24,
    DhcpOpt_IPLayerParametersPerInterface = 25,
    DhcpOpt_InterfaceMTU = 26,
    DhcpOpt_AllSubnetsAreLocal = 27,
    DhcpOpt_BroadcastAddress = 28,
    DhcpOpt_PerformMaskDiscovery = 29,
    DhcpOpt_MaskSupplier = 30,
    DhcpOpt_PerformRouteDiscovery = 31,
    DhcpOpt_RouterSolicitationAddress = 32,
    DhcpOpt_StaticRoute = 33,
    DhcpOpt_TrailerEncapsulation = 34,
    DhcpOpt_ARPCacheTimeout = 35,
    DhcpOpt_EthernetEncapsulation = 36,
    DhcpOpt_TCPDefaultTTL = 37,
    DhcpOpt_TCPKeepAliveInterval = 38,
    DhcpOpt_TCPKeepAliveGarbage = 39,
    DhcpOpt_NetworkInformationServiceDomain = 40,
    DhcpOpt_NetworkInformationServiceServers = 41,
    DhcpOpt_NetworkTimeProtocolServers = 42,
    DhcpOpt_VendorSpecificInformation = 43,
    DhcpOpt_Option_44 = 44,
    DhcpOpt_Option_45 = 45,
    DhcpOpt_Option_46 = 46,
    DhcpOpt_Option_47 = 47,
    DhcpOpt_Option_48 = 48,
    DhcpOpt_Option_49 = 49,
    DhcpOpt_IPAddressLeaseTime = 51,
    DhcpOpt_Option_64 = 64,
    DhcpOpt_Option_65 = 65,
    DhcpOpt_TFTPServerName = 66,
    DhcpOpt_BootfileName = 67,
    DhcpOpt_Option_68 = 68,
    DhcpOpt_Option_69 = 69,
    DhcpOpt_Option_70 = 70,
    DhcpOpt_Option_71 = 71,
    DhcpOpt_Option_72 = 72,
    DhcpOpt_Option_73 = 73,
    DhcpOpt_Option_74 = 74,
    DhcpOpt_Option_75 = 75,
    DhcpOpt_Option_119 = 119,
  }

  const enum DhcpOptEncoding {
    DhcpOptEncoding_Legacy = 0,
    DhcpOptEncoding_Hex = 1,
  }

  const enum VFSType {
    VFSType_File = 1,
    VFSType_Cloud = 2,
    VFSType_S3 = 3,
    VFSType_WebDav = 4,
    VFSType_OCI = 5,
  }

  const enum ImportOptions {
    ImportOptions_KeepAllMACs = 1,
    ImportOptions_KeepNATMACs = 2,
    ImportOptions_ImportToVDI = 3,
  }

  const enum ExportOptions {
    ExportOptions_CreateManifest = 1,
    ExportOptions_ExportDVDImages = 2,
    ExportOptions_StripAllMACs = 3,
    ExportOptions_StripAllNonNATMACs = 4,
  }

  const enum CertificateVersion {
    CertificateVersion_V1 = 1,
    CertificateVersion_V2 = 2,
    CertificateVersion_V3 = 3,
    CertificateVersion_Unknown = 99,
  }

  const enum VirtualSystemDescriptionType {
    VirtualSystemDescriptionType_Ignore = 1,
    VirtualSystemDescriptionType_OS = 2,
    VirtualSystemDescriptionType_Name = 3,
    VirtualSystemDescriptionType_Product = 4,
    VirtualSystemDescriptionType_Vendor = 5,
    VirtualSystemDescriptionType_Version = 6,
    VirtualSystemDescriptionType_ProductUrl = 7,
    VirtualSystemDescriptionType_VendorUrl = 8,
    VirtualSystemDescriptionType_Description = 9,
    VirtualSystemDescriptionType_License = 10,
    VirtualSystemDescriptionType_Miscellaneous = 11,
    VirtualSystemDescriptionType_CPU = 12,
    VirtualSystemDescriptionType_Memory = 13,
    VirtualSystemDescriptionType_HardDiskControllerIDE = 14,
    VirtualSystemDescriptionType_HardDiskControllerSATA = 15,
    VirtualSystemDescriptionType_HardDiskControllerSCSI = 16,
    VirtualSystemDescriptionType_HardDiskControllerSAS = 17,
    VirtualSystemDescriptionType_HardDiskImage = 18,
    VirtualSystemDescriptionType_Floppy = 19,
    VirtualSystemDescriptionType_CDROM = 20,
    VirtualSystemDescriptionType_NetworkAdapter = 21,
    VirtualSystemDescriptionType_USBController = 22,
    VirtualSystemDescriptionType_SoundCard = 23,
    VirtualSystemDescriptionType_SettingsFile = 24,
    VirtualSystemDescriptionType_BaseFolder = 25,
    VirtualSystemDescriptionType_PrimaryGroup = 26,
    VirtualSystemDescriptionType_CloudInstanceShape = 27,
    VirtualSystemDescriptionType_CloudDomain = 28,
    VirtualSystemDescriptionType_CloudBootDiskSize = 29,
    VirtualSystemDescriptionType_CloudBucket = 30,
    VirtualSystemDescriptionType_CloudOCIVCN = 31,
    VirtualSystemDescriptionType_CloudPublicIP = 32,
    VirtualSystemDescriptionType_CloudProfileName = 33,
    VirtualSystemDescriptionType_CloudOCISubnet = 34,
    VirtualSystemDescriptionType_CloudKeepObject = 35,
    VirtualSystemDescriptionType_CloudLaunchInstance = 36,
  }

  const enum VirtualSystemDescriptionValueType {
    VirtualSystemDescriptionValueType_Reference = 1,
    VirtualSystemDescriptionValueType_Original = 2,
    VirtualSystemDescriptionValueType_Auto = 3,
    VirtualSystemDescriptionValueType_ExtraConfig = 4,
  }

  const enum RecordingDestination {
    RecordingDestination_None = 0,
    RecordingDestination_File = 1,
  }

  const enum RecordingFeature {
    RecordingFeature_None = 0,
    RecordingFeature_Video = 1,
    RecordingFeature_Audio = 2,
  }

  const enum RecordingAudioCodec {
    RecordingAudioCodec_None = 0,
    RecordingAudioCodec_WavPCM = 1,
    RecordingAudioCodec_Opus = 2,
  }

  const enum RecordingVideoCodec {
    RecordingVideoCodec_None = 0,
    RecordingVideoCodec_VP8 = 1,
    RecordingVideoCodec_VP9 = 2,
    RecordingVideoCodec_AV1 = 3,
  }

  const enum RecordingVideoScalingMethod {
    RecordingVideoScalingMethod_None = 0,
    RecordingVideoScalingMethod_NearestNeighbor = 1,
    RecordingVideoScalingMethod_Bilinear = 2,
    RecordingVideoScalingMethod_Bicubic = 3,
  }

  const enum RecordingVideoRateControlMode {
    RecordingVideoRateControlMode_CBR = 0,
    RecordingVideoRateControlMode_VBR = 1,
  }

  const enum GraphicsControllerType {
    GraphicsControllerType_Null = 0,
    GraphicsControllerType_VBoxVGA = 1,
    GraphicsControllerType_VMSVGA = 2,
    GraphicsControllerType_VBoxSVGA = 3,
  }

  const enum CleanupMode {
    CleanupMode_UnregisterOnly = 1,
    CleanupMode_DetachAllReturnNone = 2,
    CleanupMode_DetachAllReturnHardDisksOnly = 3,
    CleanupMode_Full = 4,
  }

  const enum CloneMode {
    CloneMode_MachineState = 1,
    CloneMode_MachineAndChildStates = 2,
    CloneMode_AllStates = 3,
  }

  const enum CloneOptions {
    CloneOptions_Link = 1,
    CloneOptions_KeepAllMACs = 2,
    CloneOptions_KeepNATMACs = 3,
    CloneOptions_KeepDiskNames = 4,
    CloneOptions_KeepHwUUIDs = 5,
  }

  const enum AutostopType {
    AutostopType_Disabled = 1,
    AutostopType_SaveState = 2,
    AutostopType_PowerOff = 3,
    AutostopType_AcpiShutdown = 4,
  }

  const enum HostNetworkInterfaceMediumType {
    HostNetworkInterfaceMediumType_Unknown = 0,
    HostNetworkInterfaceMediumType_Ethernet = 1,
    HostNetworkInterfaceMediumType_PPP = 2,
    HostNetworkInterfaceMediumType_SLIP = 3,
  }

  const enum HostNetworkInterfaceStatus {
    HostNetworkInterfaceStatus_Unknown = 0,
    HostNetworkInterfaceStatus_Up = 1,
    HostNetworkInterfaceStatus_Down = 2,
  }

  const enum HostNetworkInterfaceType {
    HostNetworkInterfaceType_Bridged = 1,
    HostNetworkInterfaceType_HostOnly = 2,
  }

  const enum ProxyMode {
    ProxyMode_System = 0,
    ProxyMode_NoProxy = 1,
    ProxyMode_Manual = 2,
  }

  const enum AdditionsFacilityType {
    AdditionsFacilityType_None = 0,
    AdditionsFacilityType_VBoxGuestDriver = 20,
    AdditionsFacilityType_AutoLogon = 90,
    AdditionsFacilityType_VBoxService = 100,
    AdditionsFacilityType_VBoxTrayClient = 101,
    AdditionsFacilityType_Seamless = 1000,
    AdditionsFacilityType_Graphics = 1100,
    AdditionsFacilityType_MonitorAttach = 1101,
    AdditionsFacilityType_All = 2147483646,
  }

  const enum AdditionsFacilityClass {
    AdditionsFacilityClass_None = 0,
    AdditionsFacilityClass_Driver = 10,
    AdditionsFacilityClass_Service = 30,
    AdditionsFacilityClass_Program = 50,
    AdditionsFacilityClass_Feature = 100,
    AdditionsFacilityClass_ThirdParty = 999,
    AdditionsFacilityClass_All = 2147483646,
  }

  const enum AdditionsFacilityStatus {
    AdditionsFacilityStatus_Inactive = 0,
    AdditionsFacilityStatus_Paused = 1,
    AdditionsFacilityStatus_PreInit = 20,
    AdditionsFacilityStatus_Init = 30,
    AdditionsFacilityStatus_Active = 50,
    AdditionsFacilityStatus_Terminating = 100,
    AdditionsFacilityStatus_Terminated = 101,
    AdditionsFacilityStatus_Failed = 800,
    AdditionsFacilityStatus_Unknown = 999,
  }

  const enum AdditionsRunLevelType {
    AdditionsRunLevelType_None = 0,
    AdditionsRunLevelType_System = 1,
    AdditionsRunLevelType_Userland = 2,
    AdditionsRunLevelType_Desktop = 3,
  }

  const enum AdditionsUpdateFlag {
    AdditionsUpdateFlag_None = 0,
    AdditionsUpdateFlag_WaitForUpdateStartOnly = 1,
  }

  const enum GuestSessionStatus {
    GuestSessionStatus_Undefined = 0,
    GuestSessionStatus_Starting = 10,
    GuestSessionStatus_Started = 100,
    GuestSessionStatus_Terminating = 480,
    GuestSessionStatus_Terminated = 500,
    GuestSessionStatus_TimedOutKilled = 512,
    GuestSessionStatus_TimedOutAbnormally = 513,
    GuestSessionStatus_Down = 600,
    GuestSessionStatus_Error = 800,
  }

  const enum GuestSessionWaitForFlag {
    GuestSessionWaitForFlag_None = 0,
    GuestSessionWaitForFlag_Start = 1,
    GuestSessionWaitForFlag_Terminate = 2,
    GuestSessionWaitForFlag_Status = 4,
  }

  const enum GuestSessionWaitResult {
    GuestSessionWaitResult_None = 0,
    GuestSessionWaitResult_Start = 1,
    GuestSessionWaitResult_Terminate = 2,
    GuestSessionWaitResult_Status = 3,
    GuestSessionWaitResult_Error = 4,
    GuestSessionWaitResult_Timeout = 5,
    GuestSessionWaitResult_WaitFlagNotSupported = 6,
  }

  const enum GuestUserState {
    GuestUserState_Unknown = 0,
    GuestUserState_LoggedIn = 1,
    GuestUserState_LoggedOut = 2,
    GuestUserState_Locked = 3,
    GuestUserState_Unlocked = 4,
    GuestUserState_Disabled = 5,
    GuestUserState_Idle = 6,
    GuestUserState_InUse = 7,
    GuestUserState_Created = 8,
    GuestUserState_Deleted = 9,
    GuestUserState_SessionChanged = 10,
    GuestUserState_CredentialsChanged = 11,
    GuestUserState_RoleChanged = 12,
    GuestUserState_GroupAdded = 13,
    GuestUserState_GroupRemoved = 14,
    GuestUserState_Elevated = 15,
  }

  const enum FileSeekOrigin {
    FileSeekOrigin_Begin = 0,
    FileSeekOrigin_Current = 1,
    FileSeekOrigin_End = 2,
  }

  const enum ProcessInputFlag {
    ProcessInputFlag_None = 0,
    ProcessInputFlag_EndOfFile = 1,
  }

  const enum ProcessOutputFlag {
    ProcessOutputFlag_None = 0,
    ProcessOutputFlag_StdErr = 1,
  }

  const enum ProcessWaitForFlag {
    ProcessWaitForFlag_None = 0,
    ProcessWaitForFlag_Start = 1,
    ProcessWaitForFlag_Terminate = 2,
    ProcessWaitForFlag_StdIn = 4,
    ProcessWaitForFlag_StdOut = 8,
    ProcessWaitForFlag_StdErr = 16,
  }

  const enum ProcessWaitResult {
    ProcessWaitResult_None = 0,
    ProcessWaitResult_Start = 1,
    ProcessWaitResult_Terminate = 2,
    ProcessWaitResult_Status = 3,
    ProcessWaitResult_Error = 4,
    ProcessWaitResult_Timeout = 5,
    ProcessWaitResult_StdIn = 6,
    ProcessWaitResult_StdOut = 7,
    ProcessWaitResult_StdErr = 8,
    ProcessWaitResult_WaitFlagNotSupported = 9,
  }

  const enum FileCopyFlag {
    FileCopyFlag_None = 0,
    FileCopyFlag_NoReplace = 1,
    FileCopyFlag_FollowLinks = 2,
    FileCopyFlag_Update = 4,
  }

  const enum FsObjMoveFlag {
    FsObjMoveFlag_None = 0,
    FsObjMoveFlag_Replace = 1,
    FsObjMoveFlag_FollowLinks = 2,
    FsObjMoveFlag_AllowDirectoryMoves = 4,
  }

  const enum DirectoryCreateFlag {
    DirectoryCreateFlag_None = 0,
    DirectoryCreateFlag_Parents = 1,
  }

  const enum DirectoryCopyFlag {
    DirectoryCopyFlag_None = 0,
    DirectoryCopyFlag_CopyIntoExisting = 1,
  }

  const enum DirectoryRemoveRecFlag {
    DirectoryRemoveRecFlag_None = 0,
    DirectoryRemoveRecFlag_ContentAndDir = 1,
    DirectoryRemoveRecFlag_ContentOnly = 2,
  }

  const enum FsObjRenameFlag {
    FsObjRenameFlag_NoReplace = 0,
    FsObjRenameFlag_Replace = 1,
  }

  const enum ProcessCreateFlag {
    ProcessCreateFlag_None = 0,
    ProcessCreateFlag_WaitForProcessStartOnly = 1,
    ProcessCreateFlag_IgnoreOrphanedProcesses = 2,
    ProcessCreateFlag_Hidden = 4,
    ProcessCreateFlag_Profile = 8,
    ProcessCreateFlag_WaitForStdOut = 16,
    ProcessCreateFlag_WaitForStdErr = 32,
    ProcessCreateFlag_ExpandArguments = 64,
    ProcessCreateFlag_UnquotedArguments = 128,
  }

  const enum ProcessPriority {
    ProcessPriority_Invalid = 0,
    ProcessPriority_Default = 1,
  }

  const enum SymlinkType {
    SymlinkType_Unknown = 0,
    SymlinkType_Directory = 1,
    SymlinkType_File = 2,
  }

  const enum SymlinkReadFlag {
    SymlinkReadFlag_None = 0,
    SymlinkReadFlag_NoSymlinks = 1,
  }

  const enum ProcessStatus {
    ProcessStatus_Undefined = 0,
    ProcessStatus_Starting = 10,
    ProcessStatus_Started = 100,
    ProcessStatus_Paused = 110,
    ProcessStatus_Terminating = 480,
    ProcessStatus_TerminatedNormally = 500,
    ProcessStatus_TerminatedSignal = 510,
    ProcessStatus_TerminatedAbnormally = 511,
    ProcessStatus_TimedOutKilled = 512,
    ProcessStatus_TimedOutAbnormally = 513,
    ProcessStatus_Down = 600,
    ProcessStatus_Error = 800,
  }

  const enum ProcessInputStatus {
    ProcessInputStatus_Undefined = 0,
    ProcessInputStatus_Broken = 1,
    ProcessInputStatus_Available = 10,
    ProcessInputStatus_Written = 50,
    ProcessInputStatus_Overflow = 100,
  }

  const enum PathStyle {
    PathStyle_DOS = 1,
    PathStyle_UNIX = 2,
    PathStyle_Unknown = 8,
  }

  const enum FileAccessMode {
    FileAccessMode_ReadOnly = 1,
    FileAccessMode_WriteOnly = 2,
    FileAccessMode_ReadWrite = 3,
    FileAccessMode_AppendOnly = 4,
    FileAccessMode_AppendRead = 5,
  }

  const enum FileOpenAction {
    FileOpenAction_OpenExisting = 1,
    FileOpenAction_OpenOrCreate = 2,
    FileOpenAction_CreateNew = 3,
    FileOpenAction_CreateOrReplace = 4,
    FileOpenAction_OpenExistingTruncated = 5,
    FileOpenAction_AppendOrCreate = 99,
  }

  const enum FileSharingMode {
    FileSharingMode_Read = 1,
    FileSharingMode_Write = 2,
    FileSharingMode_ReadWrite = 3,
    FileSharingMode_Delete = 4,
    FileSharingMode_ReadDelete = 5,
    FileSharingMode_WriteDelete = 6,
    FileSharingMode_All = 7,
  }

  const enum FileOpenExFlag {
    FileOpenExFlag_None = 0,
  }

  const enum FileStatus {
    FileStatus_Undefined = 0,
    FileStatus_Opening = 10,
    FileStatus_Open = 100,
    FileStatus_Closing = 150,
    FileStatus_Closed = 200,
    FileStatus_Down = 600,
    FileStatus_Error = 800,
  }

  const enum FsObjType {
    FsObjType_Unknown = 1,
    FsObjType_Fifo = 2,
    FsObjType_DevChar = 3,
    FsObjType_Directory = 4,
    FsObjType_DevBlock = 5,
    FsObjType_File = 6,
    FsObjType_Symlink = 7,
    FsObjType_Socket = 8,
    FsObjType_WhiteOut = 9,
  }

  const enum DnDAction {
    DnDAction_Ignore = 0,
    DnDAction_Copy = 1,
    DnDAction_Move = 2,
    DnDAction_Link = 3,
  }

  const enum DirectoryOpenFlag {
    DirectoryOpenFlag_None = 0,
    DirectoryOpenFlag_NoSymlinks = 1,
  }

  const enum MediumState {
    MediumState_NotCreated = 0,
    MediumState_Created = 1,
    MediumState_LockedRead = 2,
    MediumState_LockedWrite = 3,
    MediumState_Inaccessible = 4,
    MediumState_Creating = 5,
    MediumState_Deleting = 6,
  }

  const enum MediumType {
    MediumType_Normal = 0,
    MediumType_Immutable = 1,
    MediumType_Writethrough = 2,
    MediumType_Shareable = 3,
    MediumType_Readonly = 4,
    MediumType_MultiAttach = 5,
  }

  const enum MediumVariant {
    MediumVariant_Standard = 0,
    MediumVariant_VmdkSplit2G = 0x01,
    MediumVariant_VmdkRawDisk = 0x02,
    MediumVariant_VmdkStreamOptimized = 0x04,
    MediumVariant_VmdkESX = 0x08,
    MediumVariant_VdiZeroExpand = 0x100,
    MediumVariant_Fixed = 0x10000,
    MediumVariant_Diff = 0x20000,
    MediumVariant_Formatted = 0x20000000,
    MediumVariant_NoCreateDir = 0x40000000,
  }

  const enum DataType {
    DataType_Int32 = 0,
    DataType_Int8 = 1,
    DataType_String = 2,
  }

  const enum DataFlags {
    DataFlags_None = 0x00,
    DataFlags_Mandatory = 0x01,
    DataFlags_Expert = 0x02,
    DataFlags_Array = 0x04,
    DataFlags_FlagMask = 0x07,
  }

  const enum MediumFormatCapabilities {
    MediumFormatCapabilities_Uuid = 0x01,
    MediumFormatCapabilities_CreateFixed = 0x02,
    MediumFormatCapabilities_CreateDynamic = 0x04,
    MediumFormatCapabilities_CreateSplit2G = 0x08,
    MediumFormatCapabilities_Differencing = 0x10,
    MediumFormatCapabilities_Asynchronous = 0x20,
    MediumFormatCapabilities_File = 0x40,
    MediumFormatCapabilities_Properties = 0x80,
    MediumFormatCapabilities_TcpNetworking = 0x100,
    MediumFormatCapabilities_VFS = 0x200,
    MediumFormatCapabilities_Discard = 0x400,
    MediumFormatCapabilities_Preferred = 0x800,
    MediumFormatCapabilities_CapabilityMask = 0xfff,
  }

  const enum PartitionTableType {
    PartitionTableType_MBR = 1,
    PartitionTableType_GPT = 2,
  }

  const enum KeyboardLED {
    KeyboardLED_NumLock = 0x01,
    KeyboardLED_CapsLock = 0x02,
    KeyboardLED_ScrollLock = 0x04,
  }

  const enum MouseButtonState {
    MouseButtonState_LeftButton = 0x01,
    MouseButtonState_RightButton = 0x02,
    MouseButtonState_MiddleButton = 0x04,
    MouseButtonState_WheelUp = 0x08,
    MouseButtonState_WheelDown = 0x10,
    MouseButtonState_XButton1 = 0x20,
    MouseButtonState_XButton2 = 0x40,
    MouseButtonState_MouseStateMask = 0x7f,
  }

  const enum TouchContactState {
    TouchContactState_None = 0x00,
    TouchContactState_InContact = 0x01,
    TouchContactState_InRange = 0x02,
    TouchContactState_ContactStateMask = 0x03,
  }

  const enum FramebufferCapabilities {
    FramebufferCapabilities_UpdateImage = 0x01,
    FramebufferCapabilities_VHWA = 0x02,
    FramebufferCapabilities_VisibleRegion = 0x04,
  }

  const enum GuestMonitorStatus {
    GuestMonitorStatus_Disabled = 0,
    GuestMonitorStatus_Enabled = 1,
    GuestMonitorStatus_Blank = 2,
  }

  const enum ScreenLayoutMode {
    ScreenLayoutMode_Apply = 0,
    ScreenLayoutMode_Reset = 1,
    ScreenLayoutMode_Attach = 2,
  }

  const enum NetworkAttachmentType {
    NetworkAttachmentType_Null = 0,
    NetworkAttachmentType_NAT = 1,
    NetworkAttachmentType_Bridged = 2,
    NetworkAttachmentType_Internal = 3,
    NetworkAttachmentType_HostOnly = 4,
    NetworkAttachmentType_Generic = 5,
    NetworkAttachmentType_NATNetwork = 6,
  }

  const enum NetworkAdapterType {
    NetworkAdapterType_Null = 0,
    NetworkAdapterType_Am79C970A = 1,
    NetworkAdapterType_Am79C973 = 2,
    NetworkAdapterType_I82540EM = 3,
    NetworkAdapterType_I82543GC = 4,
    NetworkAdapterType_I82545EM = 5,
    NetworkAdapterType_Virtio = 6,
  }

  const enum NetworkAdapterPromiscModePolicy {
    NetworkAdapterPromiscModePolicy_Deny = 1,
    NetworkAdapterPromiscModePolicy_AllowNetwork = 2,
    NetworkAdapterPromiscModePolicy_AllowAll = 3,
  }

  const enum PortMode {
    PortMode_Disconnected = 0,
    PortMode_HostPipe = 1,
    PortMode_HostDevice = 2,
    PortMode_RawFile = 3,
    PortMode_TCP = 4,
  }

  const enum UartType {
    UartType_U16450 = 0,
    UartType_U16550A = 1,
    UartType_U16750 = 2,
  }

  const enum VMExecutionEngine {
    VMExecutionEngine_NotSet = 0,
    VMExecutionEngine_RawMode = 1,
    VMExecutionEngine_HwVirt = 2,
    VMExecutionEngine_NativeApi = 3,
  }

  const enum USBControllerType {
    USBControllerType_Null = 0,
    USBControllerType_OHCI = 1,
    USBControllerType_EHCI = 2,
    USBControllerType_XHCI = 3,
    USBControllerType_Last = 4,
  }

  const enum USBConnectionSpeed {
    USBConnectionSpeed_Null = 0,
    USBConnectionSpeed_Low = 1,
    USBConnectionSpeed_Full = 2,
    USBConnectionSpeed_High = 3,
    USBConnectionSpeed_Super = 4,
    USBConnectionSpeed_SuperPlus = 5,
  }

  const enum USBDeviceState {
    USBDeviceState_NotSupported = 0,
    USBDeviceState_Unavailable = 1,
    USBDeviceState_Busy = 2,
    USBDeviceState_Available = 3,
    USBDeviceState_Held = 4,
    USBDeviceState_Captured = 5,
  }

  const enum USBDeviceFilterAction {
    USBDeviceFilterAction_Null = 0,
    USBDeviceFilterAction_Ignore = 1,
    USBDeviceFilterAction_Hold = 2,
  }

  const enum AudioDriverType {
    AudioDriverType_Null = 0,
    AudioDriverType_WinMM = 1,
    AudioDriverType_OSS = 2,
    AudioDriverType_ALSA = 3,
    AudioDriverType_DirectSound = 4,
    AudioDriverType_CoreAudio = 5,
    AudioDriverType_MMPM = 6,
    AudioDriverType_Pulse = 7,
    AudioDriverType_SolAudio = 8,
  }

  const enum AudioControllerType {
    AudioControllerType_AC97 = 0,
    AudioControllerType_SB16 = 1,
    AudioControllerType_HDA = 2,
  }

  const enum AudioCodecType {
    AudioCodecType_Null = 0,
    AudioCodecType_SB16 = 1,
    AudioCodecType_STAC9700 = 2,
    AudioCodecType_AD1980 = 3,
    AudioCodecType_STAC9221 = 4,
  }

  const enum AuthType {
    AuthType_Null = 0,
    AuthType_External = 1,
    AuthType_Guest = 2,
  }

  const enum Reason {
    Reason_Unspecified = 0,
    Reason_HostSuspend = 1,
    Reason_HostResume = 2,
    Reason_HostBatteryLow = 3,
    Reason_Snapshot = 4,
  }

  const enum StorageBus {
    StorageBus_Null = 0,
    StorageBus_IDE = 1,
    StorageBus_SATA = 2,
    StorageBus_SCSI = 3,
    StorageBus_Floppy = 4,
    StorageBus_SAS = 5,
    StorageBus_USB = 6,
    StorageBus_PCIe = 7,
  }

  const enum StorageControllerType {
    StorageControllerType_Null = 0,
    StorageControllerType_LsiLogic = 1,
    StorageControllerType_BusLogic = 2,
    StorageControllerType_IntelAhci = 3,
    StorageControllerType_PIIX3 = 4,
    StorageControllerType_PIIX4 = 5,
    StorageControllerType_ICH6 = 6,
    StorageControllerType_I82078 = 7,
    StorageControllerType_LsiLogicSas = 8,
    StorageControllerType_USB = 9,
    StorageControllerType_NVMe = 10,
  }

  const enum ChipsetType {
    ChipsetType_Null = 0,
    ChipsetType_PIIX3 = 1,
    ChipsetType_ICH9 = 2,
  }

  const enum NATAliasMode {
    NATAliasMode_AliasLog = 0x1,
    NATAliasMode_AliasProxyOnly = 0x02,
    NATAliasMode_AliasUseSamePorts = 0x04,
  }

  const enum NATProtocol {
    NATProtocol_UDP = 0,
    NATProtocol_TCP = 1,
  }

  const enum BandwidthGroupType {
    BandwidthGroupType_Null = 0,
    BandwidthGroupType_Disk = 1,
    BandwidthGroupType_Network = 2,
  }

  const enum VBoxEventType {
    VBoxEventType_Invalid = 0,
    VBoxEventType_Any = 1,
    VBoxEventType_Vetoable = 2,
    VBoxEventType_MachineEvent = 3,
    VBoxEventType_SnapshotEvent = 4,
    VBoxEventType_InputEvent = 5,
    VBoxEventType_LastWildcard = 31,
    VBoxEventType_OnMachineStateChanged = 32,
    VBoxEventType_OnMachineDataChanged = 33,
    VBoxEventType_OnExtraDataChanged = 34,
    VBoxEventType_OnExtraDataCanChange = 35,
    VBoxEventType_OnMediumRegistered = 36,
    VBoxEventType_OnMachineRegistered = 37,
    VBoxEventType_OnSessionStateChanged = 38,
    VBoxEventType_OnSnapshotTaken = 39,
    VBoxEventType_OnSnapshotDeleted = 40,
    VBoxEventType_OnSnapshotChanged = 41,
    VBoxEventType_OnGuestPropertyChanged = 42,
    VBoxEventType_OnMousePointerShapeChanged = 43,
    VBoxEventType_OnMouseCapabilityChanged = 44,
    VBoxEventType_OnKeyboardLedsChanged = 45,
    VBoxEventType_OnStateChanged = 46,
    VBoxEventType_OnAdditionsStateChanged = 47,
    VBoxEventType_OnNetworkAdapterChanged = 48,
    VBoxEventType_OnSerialPortChanged = 49,
    VBoxEventType_OnParallelPortChanged = 50,
    VBoxEventType_OnStorageControllerChanged = 51,
    VBoxEventType_OnMediumChanged = 52,
    VBoxEventType_OnVRDEServerChanged = 53,
    VBoxEventType_OnUSBControllerChanged = 54,
    VBoxEventType_OnUSBDeviceStateChanged = 55,
    VBoxEventType_OnSharedFolderChanged = 56,
    VBoxEventType_OnRuntimeError = 57,
    VBoxEventType_OnCanShowWindow = 58,
    VBoxEventType_OnShowWindow = 59,
    VBoxEventType_OnCPUChanged = 60,
    VBoxEventType_OnVRDEServerInfoChanged = 61,
    VBoxEventType_OnEventSourceChanged = 62,
    VBoxEventType_OnCPUExecutionCapChanged = 63,
    VBoxEventType_OnGuestKeyboard = 64,
    VBoxEventType_OnGuestMouse = 65,
    VBoxEventType_OnNATRedirect = 66,
    VBoxEventType_OnHostPCIDevicePlug = 67,
    VBoxEventType_OnVBoxSVCAvailabilityChanged = 68,
    VBoxEventType_OnBandwidthGroupChanged = 69,
    VBoxEventType_OnGuestMonitorChanged = 70,
    VBoxEventType_OnStorageDeviceChanged = 71,
    VBoxEventType_OnClipboardModeChanged = 72,
    VBoxEventType_OnDnDModeChanged = 73,
    VBoxEventType_OnNATNetworkChanged = 74,
    VBoxEventType_OnNATNetworkStartStop = 75,
    VBoxEventType_OnNATNetworkAlter = 76,
    VBoxEventType_OnNATNetworkCreationDeletion = 77,
    VBoxEventType_OnNATNetworkSetting = 78,
    VBoxEventType_OnNATNetworkPortForward = 79,
    VBoxEventType_OnGuestSessionStateChanged = 80,
    VBoxEventType_OnGuestSessionRegistered = 81,
    VBoxEventType_OnGuestProcessRegistered = 82,
    VBoxEventType_OnGuestProcessStateChanged = 83,
    VBoxEventType_OnGuestProcessInputNotify = 84,
    VBoxEventType_OnGuestProcessOutput = 85,
    VBoxEventType_OnGuestFileRegistered = 86,
    VBoxEventType_OnGuestFileStateChanged = 87,
    VBoxEventType_OnGuestFileOffsetChanged = 88,
    VBoxEventType_OnGuestFileRead = 89,
    VBoxEventType_OnGuestFileWrite = 90,
    VBoxEventType_OnRecordingChanged = 91,
    VBoxEventType_OnGuestUserStateChanged = 92,
    VBoxEventType_OnGuestMultiTouch = 93,
    VBoxEventType_OnHostNameResolutionConfigurationChange = 94,
    VBoxEventType_OnSnapshotRestored = 95,
    VBoxEventType_OnMediumConfigChanged = 96,
    VBoxEventType_OnAudioAdapterChanged = 97,
    VBoxEventType_OnProgressPercentageChanged = 98,
    VBoxEventType_OnProgressTaskCompleted = 99,
    VBoxEventType_OnCursorPositionChanged = 100,
    VBoxEventType_Last = 101,
  }

  const enum GuestMouseEventMode {
    GuestMouseEventMode_Relative = 0,
    GuestMouseEventMode_Absolute = 1,
  }

  const enum GuestMonitorChangedEventType {
    GuestMonitorChangedEventType_Enabled = 0,
    GuestMonitorChangedEventType_Disabled = 1,
    GuestMonitorChangedEventType_NewOrigin = 2,
  }

  export interface IVirtualBoxErrorInfo {
    readonly resultCode: number;
    readonly resultDetail: number;
    readonly interfaceID: string;
    readonly component: string;
    readonly text: string;
    readonly next: IVirtualBoxErrorInfo;
  } /* interface IVirtualBoxErrorInfo */

  interface INATNetwork {
    networkName: string;
    enabled: boolean;
    network: string;
    readonly gateway: string;
    IPv6Enabled: boolean;
    IPv6Prefix: string;
    advertiseDefaultIPv6RouteEnabled: boolean;
    needDhcpServer: boolean;
    readonly eventSource: IEventSource;
    readonly portForwardRules4: SafeArray<string>;
    readonly localMappings: SafeArray<string>;
    loopbackIp6: number;
    readonly portForwardRules6: SafeArray<string>;
    addLocalMapping(hostid: string, offset: number): void;
    addPortForwardRule(
      isIpv6: boolean,
      ruleName: string,
      proto: NATProtocol,
      hostIP: string,
      hostPort: number,
      guestIP: string,
      guestPort: number
    ): void;
    removePortForwardRule(iSipv6: boolean, ruleName: string): void;
    start(trunkType: string): void;
    stop(): void;
  } /* interface INATNetwork */

  interface IDHCPServer {
    readonly eventSource: IEventSource;
    enabled: boolean;
    readonly IPAddress: string;
    readonly networkMask: string;
    readonly networkName: string;
    readonly lowerIP: string;
    readonly upperIP: string;
    readonly globalOptions: SafeArray<string>;
    readonly vmConfigs: SafeArray<string>;
    addGlobalOption(option: DhcpOpt, value: string): void;
    removeGlobalOption(option: DhcpOpt): void;
    removeGlobalOptions(): void;
    addVmSlotOption(
      vmname: string,
      slot: number,
      option: DhcpOpt,
      value: string
    ): void;
    removeVmSlotOption(vmname: string, slot: number, option: DhcpOpt): void;
    removeVmSlotOptions(vmname: string, slot: number): void;
    getVmSlotOptions(vmname: string, slot: number): SafeArray<string>;
    getMacOptions(mac: string): SafeArray<string>;
    setConfiguration(
      IPAddress: string,
      networkMask: string,
      FromIPAddress: string,
      ToIPAddress: string
    ): void;
    start(networkName: string, trunkName: string, trunkType: string): void;
    stop(): void;
    restart(): void;
  } /* interface IDHCPServer */

  interface IVirtualBox {
    readonly version: string;
    readonly versionNormalized: string;
    readonly revision: number;
    readonly packageType: string;
    readonly APIVersion: string;
    readonly APIRevision: number;
    readonly homeFolder: string;
    readonly settingsFilePath: string;
    readonly host: IHost;
    readonly systemProperties: ISystemProperties;
    readonly machines: SafeArray<IMachine>;
    readonly machineGroups: SafeArray<string>;
    readonly hardDisks: SafeArray<IMedium>;
    readonly DVDImages: SafeArray<IMedium>;
    readonly floppyImages: SafeArray<IMedium>;
    readonly progressOperations: SafeArray<IProgress>;
    readonly guestOSTypes: SafeArray<IGuestOSType>;
    readonly sharedFolders: SafeArray<ISharedFolder>;
    readonly performanceCollector: IPerformanceCollector;
    readonly DHCPServers: SafeArray<IDHCPServer>;
    readonly NATNetworks: SafeArray<INATNetwork>;
    readonly eventSource: IEventSource;
    readonly extensionPackManager: IExtPackManager;
    readonly internalNetworks: SafeArray<string>;
    readonly genericNetworkDrivers: SafeArray<string>;
    readonly cloudProviderManager: ICloudProviderManager;
    composeMachineFilename(
      name: string,
      group: string,
      createFlags: string,
      baseFolder: string
    ): string;
    createMachine(
      settingsFile: string,
      name: string,
      groups: SafeArray<string>,
      osTypeId: string,
      flags: string
    ): IMachine;
    openMachine(settingsFile: string): IMachine;
    registerMachine(machine: IMachine): void;
    /**
     * Attempts to find a virtual machine given its name or UUID.
     * @param nameOrId What to search for. This can either be the UUID or the name of a virtual machine.
     * @return Machine object, if found.
     */
    findMachine(nameOrId: string): IMachine;
    getMachinesByGroups(groups: SafeArray<string>): SafeArray<IMachine>;
    getMachineStates(machines: SafeArray<IMachine>): SafeArray<MachineState>;
    createAppliance(): IAppliance;
    createUnattendedInstaller(): IUnattended;
    createMedium(
      format: string,
      location: string,
      accessMode: AccessMode,
      aDeviceTypeType: DeviceType
    ): IMedium;
    openMedium(
      location: string,
      deviceType: DeviceType,
      accessMode: AccessMode,
      forceNewUuid: boolean
    ): IMedium;
    getGuestOSType(id: string): IGuestOSType;
    createSharedFolder(
      name: string,
      hostPath: string,
      writable: boolean,
      automount: boolean,
      autoMountPoint: string
    ): void;
    removeSharedFolder(name: string): void;
    getExtraDataKeys(): SafeArray<string>;
    getExtraData(key: string): string;
    setExtraData(key: string, value: string): void;
    setSettingsSecret(password: string): void;
    createDHCPServer(name: string): IDHCPServer;
    findDHCPServerByNetworkName(name: string): IDHCPServer;
    removeDHCPServer(server: IDHCPServer): void;
    createNATNetwork(networkName: string): INATNetwork;
    findNATNetworkByName(networkName: string): INATNetwork;
    removeNATNetwork(network: INATNetwork): void;
    checkFirmwarePresent(
      firmwareType: FirmwareType,
      version: string,
      url: string /* 本来は参照渡しする必要があるがJScriptでは値渡ししかできないので無意味 */,
      file: string /* 同上 */
    ): boolean;
  } /* interface IVirtualBox */

  interface IVFSExplorer {
    readonly path: string;
    readonly type: VFSType;
    update(): IProgress;
    cd(dir: string): IProgress;
    cdUp(): IProgress;
    entryList(
      /* out */ names: SafeArray<string>,
      /* out */ types: SafeArray<number>,
      /* out */ sizes: SafeArray<number>,
      /* out */ modes: SafeArray<number>
    ): void;
    exists(names: SafeArray<string>): SafeArray<string>;
    remove(names: SafeArray<string>): IProgress;
  } /* interface IVFSExplorer */

  interface ICertificate {
    readonly versionNumber: CertificateVersion;
    readonly serialNumber: string;
    readonly signatureAlgorithmOID: string;
    readonly signatureAlgorithmName: string;
    readonly issuerName: SafeArray<string>;
    readonly subjectName: SafeArray<string>;
    readonly friendlyName: string;
    readonly validityPeriodNotBefore: string;
    readonly validityPeriodNotAfter: string;
    readonly publicKeyAlgorithmOID: string;
    readonly publicKeyAlgorithm: string;
    readonly subjectPublicKey: SafeArray<number>;
    readonly issuerUniqueIdentifier: string;
    readonly subjectUniqueIdentifier: string;
    readonly certificateAuthority: boolean;
    readonly keyUsage: number;
    readonly extendedKeyUsage: SafeArray<string>;
    readonly rawCertData: SafeArray<number>;
    readonly selfSigned: boolean;
    readonly trusted: boolean;
    readonly expired: boolean;
    isCurrentlyExpired(): boolean;
    queryInfo(what: number): string;
  } /* interface ICertificate */

  interface IAppliance {
    readonly path: string;
    readonly disks: SafeArray<string>;
    readonly virtualSystemDescriptions: SafeArray<IVirtualSystemDescription>;
    readonly machines: SafeArray<string>;
    readonly certificate: ICertificate;
    read(file: string): IProgress;
    interpret(): void;
    importMachines(options: SafeArray<ImportOptions>): IProgress;
    createVFSExplorer(URI: string): IVFSExplorer;
    write(
      format: string,
      options: SafeArray<ExportOptions>,
      path: string
    ): IProgress;
    getWarnings(): SafeArray<string>;
    getPasswordIds(): SafeArray<string>;
    getMediumIdsForPasswordId(passwordId: string): SafeArray<string>;
    addPasswords(
      identifiers: SafeArray<string>,
      passwords: SafeArray<string>
    ): void;
  } /* interface IAppliance */

  interface IVirtualSystemDescription {
    readonly count: number;
    getDescription(
      /* out */ types: SafeArray<VirtualSystemDescriptionType>,
      /* out */ refs: SafeArray<string>,
      /* out */ OVFValues: SafeArray<string>,
      /* out */ VBoxValues: SafeArray<string>,
      /* out */ extraConfigValues: SafeArray<string>
    ): void;
    getDescriptionByType(
      type: VirtualSystemDescriptionType,
      /* out */ types: SafeArray<VirtualSystemDescriptionType>,
      /* out */ refs: SafeArray<string>,
      /* out */ OVFValues: SafeArray<string>,
      /* out */ VBoxValues: SafeArray<string>,
      /* out */ extraConfigValues: SafeArray<string>
    ): void;
    removeDescriptionByType(type: VirtualSystemDescriptionType): void;
    getValuesByType(
      type: VirtualSystemDescriptionType,
      which: VirtualSystemDescriptionValueType
    ): SafeArray<string>;
    setFinalValues(
      enabled: SafeArray<boolean>,
      VBoxValues: SafeArray<string>,
      extraConfigValues: SafeArray<string>
    ): void;
    addDescription(
      type: VirtualSystemDescriptionType,
      VBoxValue: string,
      extraConfigValue: string
    ): void;
  } /* interface IVirtualSystemDescription */

  interface IUnattended {
    isoPath: string;
    machine: IMachine;
    user: string;
    password: string;
    fullUserName: string;
    productKey: string;
    additionsIsoPath: string;
    installGuestAdditions: boolean;
    validationKitIsoPath: string;
    installTestExecService: boolean;
    timeZone: string;
    locale: string;
    language: string;
    country: string;
    proxy: string;
    packageSelectionAdjustments: string;
    hostname: string;
    auxiliaryBasePath: string;
    imageIndex: number;
    scriptTemplatePath: string;
    postInstallScriptTemplatePath: string;
    postInstallCommand: string;
    extraInstallKernelParameters: string;
    readonly detectedOSTypeId: string;
    readonly detectedOSVersion: string;
    readonly detectedOSFlavor: string;
    readonly detectedOSLanguages: string;
    readonly detectedOSHints: string;
    detectIsoOS(): void;
    prepare(): void;
    constructMedia(): void;
    reconfigureVM(): void;
    done(): void;
  } /* interface IUnattended */

  interface IInternalMachineControl {
    updateState(state: MachineState): void;
    beginPowerUp(progress: IProgress): void;
    endPowerUp(result: number): void;
    beginPoweringDown(/* out */ progress: IProgress): void;
    endPoweringDown(result: number, errMsg: string): void;
    runUSBDeviceFilters(
      device: IUSBDevice,
      /* out */ matched: boolean,
      /* out */ maskedInterfaces: number
    ): void;
    captureUSBDevice(id: string, captureFilename: string): void;
    detachUSBDevice(id: string, done: boolean): void;
    autoCaptureUSBDevices(): void;
    detachAllUSBDevices(done: boolean): void;
    onSessionEnd(session: ISession): IProgress;
    finishOnlineMergeMedium(): void;
    pullGuestProperties(
      /* out */ names: SafeArray<string>,
      /* out */ values: SafeArray<string>,
      /* out */ timestamps: SafeArray<number>,
      /* out */ flags: SafeArray<string>
    ): void;
    pushGuestProperty(
      name: string,
      value: string,
      timestamp: number,
      flags: string
    ): void;
    lockMedia(): void;
    unlockMedia(): void;
    ejectMedium(attachment: IMediumAttachment): IMediumAttachment;
    reportVmStatistics(
      validStats: number,
      cpuUser: number,
      cpuKernel: number,
      cpuIdle: number,
      memTotal: number,
      memFree: number,
      memBalloon: number,
      memShared: number,
      memCache: number,
      pagedTotal: number,
      memAllocTotal: number,
      memFreeTotal: number,
      memBalloonTotal: number,
      memSharedTotal: number,
      vmNetRx: number,
      vmNetTx: number
    ): void;
    authenticateExternal(
      authParams: SafeArray<string>,
      /* out */ result: string
    ): void;
  } /* interface IInternalMachineControl */

  interface IBIOSSettings {
    logoFadeIn: boolean;
    logoFadeOut: boolean;
    logoDisplayTime: number;
    logoImagePath: string;
    bootMenuMode: BIOSBootMenuMode;
    ACPIEnabled: boolean;
    IOAPICEnabled: boolean;
    APICMode: APICMode;
    timeOffset: number;
    PXEDebugEnabled: boolean;
    readonly nonVolatileStorageFile: string;
  } /* interface IBIOSSettings */

  interface IRecordingScreenSettings {
    readonly id: number;
    enabled: boolean;
    features: number;
    destination: RecordingDestination;
    filename: string;
    maxTime: number;
    maxFileSize: number;
    options: string;
    audioCodec: RecordingAudioCodec;
    audioHz: number;
    audioBits: number;
    audioChannels: number;
    videoCodec: RecordingVideoCodec;
    videoWidth: number;
    videoHeight: number;
    videoRate: number;
    videoRateControlMode: RecordingVideoRateControlMode;
    videoFPS: number;
    videoScalingMethod: RecordingVideoScalingMethod;
    isFeatureEnabled(feature: RecordingFeature): boolean;
  } /* interface IRecordingScreenSettings */

  interface IRecordingSettings {
    enabled: boolean;
    readonly screens: SafeArray<IRecordingScreenSettings>;
    getScreenSettings(screenId: number): IRecordingScreenSettings;
  } /* interface IRecordingSettings */

  interface IPCIAddress {
    bus: number;
    device: number;
    devFunction: number;
    asLong(): number;
    fromLong(num: number): void;
  } /* interface IPCIAddress */

  interface IPCIDeviceAttachment {
    readonly name: string;
    readonly isPhysicalDevice: boolean;
    readonly hostAddress: number;
    readonly guestAddress: number;
  } /* interface IPCIDeviceAttachment */

  interface IMachine {
    readonly parent: IVirtualBox;
    icon: SafeArray<number>;
    readonly accessible: boolean;
    readonly accessError: IVirtualBoxErrorInfo;
    name: string;
    description: string;
    readonly id: string;
    groups: SafeArray<string>;
    OSTypeId: string;
    hardwareVersion: string;
    hardwareUUID: string;
    CPUCount: number;
    CPUHotPlugEnabled: boolean;
    CPUExecutionCap: number;
    CPUIDPortabilityLevel: number;
    memorySize: number;
    memoryBalloonSize: number;
    pageFusionEnabled: boolean;
    graphicsControllerType: GraphicsControllerType;
    VRAMSize: number;
    accelerate3DEnabled: boolean;
    accelerate2DVideoEnabled: boolean;
    monitorCount: number;
    readonly BIOSSettings: IBIOSSettings;
    readonly recordingSettings: IRecordingSettings;
    firmwareType: FirmwareType;
    pointingHIDType: PointingHIDType;
    keyboardHIDType: KeyboardHIDType;
    HPETEnabled: boolean;
    chipsetType: ChipsetType;
    snapshotFolder: string;
    readonly VRDEServer: IVRDEServer;
    emulatedUSBCardReaderEnabled: boolean;
    readonly mediumAttachments: SafeArray<IMediumAttachment>;
    readonly USBControllers: SafeArray<IUSBController>;
    readonly USBDeviceFilters: IUSBDeviceFilters;
    readonly audioAdapter: IAudioAdapter;
    readonly storageControllers: SafeArray<IStorageController>;
    readonly settingsFilePath: string;
    readonly settingsAuxFilePath: string;
    readonly settingsModified: boolean;
    readonly sessionState: SessionState;
    readonly sessionName: string;
    readonly sessionPID: number;
    readonly state: MachineState;
    readonly lastStateChange: number;
    readonly stateFilePath: string;
    readonly logFolder: string;
    readonly currentSnapshot: ISnapshot;
    readonly snapshotCount: number;
    readonly currentStateModified: boolean;
    readonly sharedFolders: SafeArray<ISharedFolder>;
    clipboardMode: ClipboardMode;
    dnDMode: DnDMode;
    teleporterEnabled: boolean;
    teleporterPort: number;
    teleporterAddress: string;
    teleporterPassword: string;
    paravirtProvider: ParavirtProvider;
    faultToleranceState: FaultToleranceState;
    faultTolerancePort: number;
    faultToleranceAddress: string;
    faultTolerancePassword: string;
    faultToleranceSyncInterval: number;
    RTCUseUTC: boolean;
    IOCacheEnabled: boolean;
    IOCacheSize: number;
    readonly PCIDeviceAssignments: SafeArray<IPCIDeviceAttachment>;
    readonly bandwidthControl: IBandwidthControl;
    tracingEnabled: boolean;
    tracingConfig: string;
    allowTracingToAccessVM: boolean;
    autostartEnabled: boolean;
    autostartDelay: number;
    autostopType: AutostopType;
    defaultFrontend: string;
    readonly USBProxyAvailable: boolean;
    VMProcessPriority: string;
    paravirtDebug: string;
    CPUProfile: string;
    lockMachine(session: ISession, lockType: LockType): void;
    /**
     * Spawns a new process that will execute the virtual machine and obtains a shared lock on the machine for the calling session.
     *
     * If launching the VM succeeds, the new VM process will create its own session and write-lock the machine for it, preventing conflicting changes from other processes. If the machine is already locked (because it is already running or because another session has a write lock), launching the VM process will therefore fail. Reversely, future attempts to obtain a write lock will also fail while the machine is running.
     *
     * The caller's session object remains separate from the session opened by the new VM process. It receives its own IConsole object which can be used to control machine execution, but it cannot be used to change all VM settings which would be available after a lockMachine call.
     *
     * The caller must eventually release the session's shared lock by calling ISession::unlockMachine on the local session object once this call has returned. However, the session's state (see ISession::state) will not return to "Unlocked" until the remote session has also unlocked the machine (i.e. the machine has stopped running).
     *
     * Launching a VM process can take some time (a new VM is started in a new process, for which memory and other resources need to be set up). Because of this, an IProgress object is returned to allow the caller to wait for this asynchronous operation to be completed. Until then, the caller's session object remains in the "Unlocked" state, and its ISession::machine and ISession::console attributes cannot be accessed. It is recommended to use IProgress::waitForCompletion or similar calls to wait for completion. Completion is signalled when the VM is powered on. If launching the VM fails, error messages can be queried via the progress object, if available.
     *
     * The progress object will have at least 2 sub-operations. The first operation covers the period up to the new VM process calls powerUp. The subsequent operations mirror the IConsole::powerUp progress object. Because IConsole::powerUp may require some extra sub-operations, the IProgress::operationCount may change at the completion of operation.
     *
     * For details on the teleportation progress operation, see IConsole::powerUp.
     *
     * > The @a environment argument is a string containing definitions of
     * > environment variables in the following format:
     * ```
     * NAME[=VALUE]
     * NAME[=VALUE]
     * ...
     * ```
     *
     * where \n is the new line character. These environment variables will be appended to the environment of the VirtualBox server process. If an environment variable exists both in the server process and in this list, the value from this list takes precedence over the server's variable. If the value of the environment variable is omitted, this variable will be removed from the resulting environment. If the environment string is null or empty, the server environment is inherited by the started process as is.
     * @param session Client session object to which the VM process will be connected (this must be in "Unlocked" state).
     * @param name Front-end to use for the new VM process. The following are currently supported:
     * - "gui": VirtualBox Qt GUI front-end
     * - "headless": VBoxHeadless (VRDE Server) front-end
     * - "sdl": VirtualBox SDL front-end
     * - "emergencystop": reserved value, used for aborting the currently running VM or session owner. In this case the session parameter may be null (if it is non-null it isn't used in any way), and the progress return value will be always null. The operation completes immediately.
     * - "": use the per-VM default frontend if set, otherwise the global default defined in the system properties. If neither are set, the API will launch a "gui" session, which may fail if there is no windowing environment available. See IMachine::defaultFrontend and ISystemProperties::defaultFrontend.
     * @param environment Environment to pass to the VM process.
     * @return Progress object to track the operation completion.
     */
    launchVMProcess(
      session: ISession,
      name: 'gui' | 'headless' | 'sdl' | 'emergencystop' | '',
      environment: string
    ): IProgress;
    setBootOrder(position: number, device: DeviceType): void;
    getBootOrder(position: number): DeviceType;
    attachDevice(
      name: string,
      controllerPort: number,
      device: number,
      type: DeviceType,
      medium: IMedium
    ): void;
    attachDeviceWithoutMedium(
      name: string,
      controllerPort: number,
      device: number,
      type: DeviceType
    ): void;
    detachDevice(name: string, controllerPort: number, device: number): void;
    passthroughDevice(
      name: string,
      controllerPort: number,
      device: number,
      passthrough: boolean
    ): void;
    temporaryEjectDevice(
      name: string,
      controllerPort: number,
      device: number,
      temporaryEject: boolean
    ): void;
    nonRotationalDevice(
      name: string,
      controllerPort: number,
      device: number,
      nonRotational: boolean
    ): void;
    setAutoDiscardForDevice(
      name: string,
      controllerPort: number,
      device: number,
      discard: boolean
    ): void;
    setHotPluggableForDevice(
      name: string,
      controllerPort: number,
      device: number,
      hotPluggable: boolean
    ): void;
    setBandwidthGroupForDevice(
      name: string,
      controllerPort: number,
      device: number,
      bandwidthGroup: IBandwidthGroup
    ): void;
    setNoBandwidthGroupForDevice(
      name: string,
      controllerPort: number,
      device: number
    ): void;
    unmountMedium(
      name: string,
      controllerPort: number,
      device: number,
      force: boolean
    ): void;
    mountMedium(
      name: string,
      controllerPort: number,
      device: number,
      medium: IMedium,
      force: boolean
    ): void;
    getMedium(name: string, controllerPort: number, device: number): IMedium;
    getMediumAttachmentsOfController(
      name: string
    ): SafeArray<IMediumAttachment>;
    getMediumAttachment(
      name: string,
      controllerPort: number,
      device: number
    ): IMediumAttachment;
    attachHostPCIDevice(
      hostAddress: number,
      desiredGuestAddress: number,
      tryToUnbind: boolean
    ): void;
    detachHostPCIDevice(hostAddress: number): void;
    getNetworkAdapter(slot: number): INetworkAdapter;
    addStorageController(
      name: string,
      connectionType: StorageBus
    ): IStorageController;
    getStorageControllerByName(name: string): IStorageController;
    getStorageControllerByInstance(
      connectionType: StorageBus,
      instance: number
    ): IStorageController;
    removeStorageController(name: string): void;
    setStorageControllerBootable(name: string, bootable: boolean): void;
    addUSBController(name: string, type: USBControllerType): IUSBController;
    removeUSBController(name: string): void;
    getUSBControllerByName(name: string): IUSBController;
    getUSBControllerCountByType(type: USBControllerType): number;
    getSerialPort(slot: number): ISerialPort;
    getParallelPort(slot: number): IParallelPort;
    getExtraDataKeys(): SafeArray<string>;
    getExtraData(key: string): string;
    setExtraData(key: string, value: string): void;
    getCPUProperty(property: CPUPropertyType): boolean;
    setCPUProperty(property: CPUPropertyType, value: boolean): void;
    getCPUIDLeafByOrdinal(
      ordinal: number,
      /* out */ idx: number,
      /* out */ idxSub: number,
      /* out */ valEax: number,
      /* out */ valEbx: number,
      /* out */ valEcx: number,
      /* out */ valEdx: number
    ): void;
    getCPUIDLeaf(
      idx: number,
      idxSub: number,
      /* out */ valEax: number,
      /* out */ valEbx: number,
      /* out */ valEcx: number,
      /* out */ valEdx: number
    ): void;
    setCPUIDLeaf(
      idx: number,
      idxSub: number,
      valEax: number,
      valEbx: number,
      valEcx: number,
      valEdx: number
    ): void;
    removeCPUIDLeaf(idx: number, idxSub: number): void;
    removeAllCPUIDLeaves(): void;
    getHWVirtExProperty(property: HWVirtExPropertyType): boolean;
    setHWVirtExProperty(property: HWVirtExPropertyType, value: boolean): void;
    setSettingsFilePath(settingsFilePath: string): IProgress;
    saveSettings(): void;
    discardSettings(): void;
    unregister(cleanupMode: CleanupMode): SafeArray<IMedium>;
    deleteConfig(media: SafeArray<IMedium>): IProgress;
    exportTo(
      appliance: IAppliance,
      location: string
    ): IVirtualSystemDescription;
    findSnapshot(nameOrId: string): ISnapshot;
    createSharedFolder(
      name: string,
      hostPath: string,
      writable: boolean,
      automount: boolean,
      autoMountPoint: string
    ): void;
    removeSharedFolder(name: string): void;
    canShowConsoleWindow(): boolean;
    showConsoleWindow(): number;
    getGuestProperty(
      name: string,
      /* out */ value: string,
      /* out */ timestamp: number,
      /* out */ flags: string
    ): void;
    getGuestPropertyValue(property: string): string;
    getGuestPropertyTimestamp(property: string): number;
    setGuestProperty(property: string, value: string, flags: string): void;
    setGuestPropertyValue(property: string, value: string): void;
    deleteGuestProperty(name: string): void;
    enumerateGuestProperties(
      patterns: string,
      /* out */ names: SafeArray<string>,
      /* out */ values: SafeArray<string>,
      /* out */ timestamps: SafeArray<number>,
      /* out */ flags: SafeArray<string>
    ): void;
    querySavedGuestScreenInfo(
      screenId: number,
      /* out */ originX: number,
      /* out */ originY: number,
      /* out */ width: number,
      /* out */ height: number,
      /* out */ enabled: boolean
    ): void;
    readSavedThumbnailToArray(
      screenId: number,
      bitmapFormat: BitmapFormat,
      /* out */ width: number,
      /* out */ height: number
    ): SafeArray<number>;
    querySavedScreenshotInfo(
      screenId: number,
      /* out */ width: number,
      /* out */ height: number
    ): SafeArray<BitmapFormat>;
    readSavedScreenshotToArray(
      screenId: number,
      bitmapFormat: BitmapFormat,
      /* out */ width: number,
      /* out */ height: number
    ): SafeArray<number>;
    hotPlugCPU(cpu: number): void;
    hotUnplugCPU(cpu: number): void;
    getCPUStatus(cpu: number): boolean;
    getEffectiveParavirtProvider(): ParavirtProvider;
    queryLogFilename(idx: number): string;
    readLog(idx: number, offset: number, size: number): SafeArray<number>;
    cloneTo(
      target: IMachine,
      mode: CloneMode,
      options: SafeArray<CloneOptions>
    ): IProgress;
    moveTo(folder: string, type: string): IProgress;
    saveState(): IProgress;
    adoptSavedState(savedStateFile: string): void;
    discardSavedState(fRemoveFile: boolean): void;
    takeSnapshot(
      name: string,
      description: string,
      pause: boolean,
      /* out */ id: string
    ): IProgress;
    deleteSnapshot(id: string): IProgress;
    deleteSnapshotAndAllChildren(id: string): IProgress;
    deleteSnapshotRange(startId: string, endId: string): IProgress;
    restoreSnapshot(snapshot: ISnapshot): IProgress;
    applyDefaults(flags: string): void;
  } /* interface IMachine */

  interface IEmulatedUSB {
    readonly webcams: SafeArray<string>;
    webcamAttach(path: string, settings: string): void;
    webcamDetach(path: string): void;
  } /* interface IEmulatedUSB */

  interface IVRDEServerInfo {
    readonly active: boolean;
    readonly port: number;
    readonly numberOfClients: number;
    readonly beginTime: number;
    readonly endTime: number;
    readonly bytesSent: number;
    readonly bytesSentTotal: number;
    readonly bytesReceived: number;
    readonly bytesReceivedTotal: number;
    readonly user: string;
    readonly domain: string;
    readonly clientName: string;
    readonly clientIP: string;
    readonly clientVersion: number;
    readonly encryptionStyle: number;
  } /* interface IVRDEServerInfo */

  interface IConsole {
    readonly machine: IMachine;
    readonly state: MachineState;
    readonly guest: IGuest;
    readonly keyboard: IKeyboard;
    readonly mouse: IMouse;
    readonly display: IDisplay;
    readonly debugger: IMachineDebugger;
    readonly USBDevices: SafeArray<IUSBDevice>;
    readonly remoteUSBDevices: SafeArray<IHostUSBDevice>;
    readonly sharedFolders: SafeArray<ISharedFolder>;
    readonly VRDEServerInfo: IVRDEServerInfo;
    readonly eventSource: IEventSource;
    readonly attachedPCIDevices: SafeArray<IPCIDeviceAttachment>;
    useHostClipboard: boolean;
    readonly emulatedUSB: IEmulatedUSB;
    powerUp(): IProgress;
    powerUpPaused(): IProgress;
    powerDown(): IProgress;
    reset(): void;
    pause(): void;
    resume(): void;
    powerButton(): void;
    sleepButton(): void;
    getPowerButtonHandled(): boolean;
    getGuestEnteredACPIMode(): boolean;
    getDeviceActivity(type: SafeArray<DeviceType>): SafeArray<DeviceActivity>;
    attachUSBDevice(id: string, captureFilename: string): void;
    detachUSBDevice(id: string): IUSBDevice;
    findUSBDeviceByAddress(name: string): IUSBDevice;
    findUSBDeviceById(id: string): IUSBDevice;
    createSharedFolder(
      name: string,
      hostPath: string,
      writable: boolean,
      automount: boolean,
      autoMountPoint: string
    ): void;
    removeSharedFolder(name: string): void;
    teleport(
      hostname: string,
      tcpport: number,
      password: string,
      maxDowntime: number
    ): IProgress;
    addDiskEncryptionPassword(
      id: string,
      password: string,
      clearOnSuspend: boolean
    ): void;
    addDiskEncryptionPasswords(
      ids: SafeArray<string>,
      passwords: SafeArray<string>,
      clearOnSuspend: boolean
    ): void;
    removeDiskEncryptionPassword(id: string): void;
    clearAllDiskEncryptionPasswords(): void;
  } /* interface IConsole */

  interface IHostNetworkInterface {
    readonly name: string;
    readonly shortName: string;
    readonly id: string;
    readonly networkName: string;
    readonly DHCPEnabled: boolean;
    readonly IPAddress: string;
    readonly networkMask: string;
    readonly IPV6Supported: boolean;
    readonly IPV6Address: string;
    readonly IPV6NetworkMaskPrefixLength: number;
    readonly hardwareAddress: string;
    readonly mediumType: HostNetworkInterfaceMediumType;
    readonly status: HostNetworkInterfaceStatus;
    readonly interfaceType: HostNetworkInterfaceType;
    readonly wireless: boolean;
    enableStaticIPConfig(IPAddress: string, networkMask: string): void;
    enableStaticIPConfigV6(
      IPV6Address: string,
      IPV6NetworkMaskPrefixLength: number
    ): void;
    enableDynamicIPConfig(): void;
    DHCPRediscover(): void;
  } /* interface IHostNetworkInterface */

  interface IHostVideoInputDevice {
    readonly name: string;
    readonly path: string;
    readonly alias: string;
  } /* interface IHostVideoInputDevice */

  interface IHost {
    readonly DVDDrives: SafeArray<IMedium>;
    readonly floppyDrives: SafeArray<IMedium>;
    readonly USBDevices: SafeArray<IHostUSBDevice>;
    readonly USBDeviceFilters: SafeArray<IHostUSBDeviceFilter>;
    readonly networkInterfaces: SafeArray<IHostNetworkInterface>;
    readonly nameServers: SafeArray<string>;
    readonly domainName: string;
    readonly searchStrings: SafeArray<string>;
    readonly processorCount: number;
    readonly processorOnlineCount: number;
    readonly processorCoreCount: number;
    readonly processorOnlineCoreCount: number;
    readonly memorySize: number;
    readonly memoryAvailable: number;
    readonly operatingSystem: string;
    readonly OSVersion: string;
    readonly UTCTime: number;
    readonly acceleration3DAvailable: boolean;
    readonly videoInputDevices: SafeArray<IHostVideoInputDevice>;
    getProcessorSpeed(cpuId: number): number;
    getProcessorFeature(feature: ProcessorFeature): boolean;
    getProcessorDescription(cpuId: number): string;
    getProcessorCPUIDLeaf(
      cpuId: number,
      leaf: number,
      subLeaf: number,
      /* out */ valEax: number,
      /* out */ valEbx: number,
      /* out */ valEcx: number,
      /* out */ valEdx: number
    ): void;
    createHostOnlyNetworkInterface(
      /* out */ hostInterface: IHostNetworkInterface
    ): IProgress;
    removeHostOnlyNetworkInterface(id: string): IProgress;
    createUSBDeviceFilter(name: string): IHostUSBDeviceFilter;
    insertUSBDeviceFilter(position: number, filter: IHostUSBDeviceFilter): void;
    removeUSBDeviceFilter(position: number): void;
    findHostDVDDrive(name: string): IMedium;
    findHostFloppyDrive(name: string): IMedium;
    findHostNetworkInterfaceByName(name: string): IHostNetworkInterface;
    findHostNetworkInterfaceById(id: string): IHostNetworkInterface;
    findHostNetworkInterfacesOfType(
      type: HostNetworkInterfaceType
    ): SafeArray<IHostNetworkInterface>;
    findUSBDeviceById(id: string): IHostUSBDevice;
    findUSBDeviceByAddress(name: string): IHostUSBDevice;
    generateMACAddress(): string;
    addUSBDeviceSource(
      backend: string,
      id: string,
      address: string,
      propertyNames: SafeArray<string>,
      propertyValues: SafeArray<string>
    ): void;
    removeUSBDeviceSource(id: string): void;
  } /* interface IHost */

  interface ISystemProperties {
    readonly minGuestRAM: number;
    readonly maxGuestRAM: number;
    readonly minGuestVRAM: number;
    readonly maxGuestVRAM: number;
    readonly minGuestCPUCount: number;
    readonly maxGuestCPUCount: number;
    readonly maxGuestMonitors: number;
    readonly infoVDSize: number;
    readonly serialPortCount: number;
    readonly parallelPortCount: number;
    readonly maxBootPosition: number;
    readonly rawModeSupported: boolean;
    exclusiveHwVirt: boolean;
    defaultMachineFolder: string;
    loggingLevel: string;
    readonly mediumFormats: SafeArray<IMediumFormat>;
    defaultHardDiskFormat: string;
    freeDiskSpaceWarning: number;
    freeDiskSpacePercentWarning: number;
    freeDiskSpaceError: number;
    freeDiskSpacePercentError: number;
    VRDEAuthLibrary: string;
    webServiceAuthLibrary: string;
    defaultVRDEExtPack: string;
    logHistoryCount: number;
    readonly defaultAudioDriver: AudioDriverType;
    autostartDatabasePath: string;
    defaultAdditionsISO: string;
    defaultFrontend: string;
    readonly screenShotFormats: SafeArray<BitmapFormat>;
    proxyMode: ProxyMode;
    proxyURL: string;
    getMaxNetworkAdapters(chipset: ChipsetType): number;
    getMaxNetworkAdaptersOfType(
      chipset: ChipsetType,
      type: NetworkAttachmentType
    ): number;
    getMaxDevicesPerPortForStorageBus(bus: StorageBus): number;
    getMinPortCountForStorageBus(bus: StorageBus): number;
    getMaxPortCountForStorageBus(bus: StorageBus): number;
    getMaxInstancesOfStorageBus(chipset: ChipsetType, bus: StorageBus): number;
    getDeviceTypesForStorageBus(bus: StorageBus): SafeArray<DeviceType>;
    getDefaultIoCacheSettingForStorageController(
      controllerType: StorageControllerType
    ): boolean;
    getStorageControllerHotplugCapable(
      controllerType: StorageControllerType
    ): boolean;
    getMaxInstancesOfUSBControllerType(
      chipset: ChipsetType,
      type: USBControllerType
    ): number;
  } /* interface ISystemProperties */

  interface IGuestOSType {
    readonly familyId: string;
    readonly familyDescription: string;
    readonly id: string;
    readonly description: string;
    readonly is64Bit: boolean;
    readonly recommendedIOAPIC: boolean;
    readonly recommendedVirtEx: boolean;
    readonly recommendedRAM: number;
    readonly recommendedGraphicsController: GraphicsControllerType;
    readonly recommendedVRAM: number;
    readonly recommended2DVideoAcceleration: boolean;
    readonly recommended3DAcceleration: boolean;
    readonly recommendedHDD: number;
    readonly adapterType: NetworkAdapterType;
    readonly recommendedPAE: boolean;
    readonly recommendedDVDStorageController: StorageControllerType;
    readonly recommendedDVDStorageBus: StorageBus;
    readonly recommendedHDStorageController: StorageControllerType;
    readonly recommendedHDStorageBus: StorageBus;
    readonly recommendedFirmware: FirmwareType;
    readonly recommendedUSBHID: boolean;
    readonly recommendedHPET: boolean;
    readonly recommendedUSBTablet: boolean;
    readonly recommendedRTCUseUTC: boolean;
    readonly recommendedChipset: ChipsetType;
    readonly recommendedAudioController: AudioControllerType;
    readonly recommendedAudioCodec: AudioCodecType;
    readonly recommendedFloppy: boolean;
    readonly recommendedUSB: boolean;
    readonly recommendedUSB3: boolean;
    readonly recommendedTFReset: boolean;
    readonly recommendedX2APIC: boolean;
  } /* interface IGuestOSType */

  interface IAdditionsFacility {
    readonly classType: AdditionsFacilityClass;
    readonly lastUpdated: number;
    readonly name: string;
    readonly status: AdditionsFacilityStatus;
    readonly type: AdditionsFacilityType;
  } /* interface IAdditionsFacility */

  interface IDnDBase {
    readonly formats: SafeArray<string>;
    readonly protocolVersion: number;
    isFormatSupported(format: string): boolean;
    addFormats(formats: SafeArray<string>): void;
    removeFormats(formats: SafeArray<string>): void;
  } /* interface IDnDBase */

  interface IDnDSource extends IDnDBase {
    dragIsPending(
      screenId: number,
      /* out */ formats: SafeArray<string>,
      /* out */ allowedActions: SafeArray<DnDAction>
    ): DnDAction;
    drop(format: string, action: DnDAction): IProgress;
    receiveData(): SafeArray<number>;
  } /* interface IDnDSource */

  interface IGuestDnDSource extends IDnDSource {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IGuestDnDSource */

  interface IDnDTarget extends IDnDBase {
    enter(
      screenId: number,
      y: number,
      x: number,
      defaultAction: DnDAction,
      allowedActions: SafeArray<DnDAction>,
      formats: SafeArray<string>
    ): DnDAction;
    move(
      screenId: number,
      x: number,
      y: number,
      defaultAction: DnDAction,
      allowedActions: SafeArray<DnDAction>,
      formats: SafeArray<string>
    ): DnDAction;
    leave(screenId: number): void;
    drop(
      screenId: number,
      x: number,
      y: number,
      defaultAction: DnDAction,
      allowedActions: SafeArray<DnDAction>,
      formats: SafeArray<string>,
      /* out */ format: string
    ): DnDAction;
    sendData(
      screenId: number,
      format: string,
      data: SafeArray<number>
    ): IProgress;
    cancel(): boolean;
  } /* interface IDnDTarget */

  interface IGuestDnDTarget extends IDnDTarget {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IGuestDnDTarget */

  interface IGuestSession {
    readonly user: string;
    readonly domain: string;
    readonly name: string;
    readonly id: number;
    timeout: number;
    readonly protocolVersion: number;
    readonly status: GuestSessionStatus;
    environmentChanges: SafeArray<string>;
    readonly environmentBase: SafeArray<string>;
    readonly processes: SafeArray<IGuestProcess>;
    readonly pathStyle: PathStyle;
    currentDirectory: string;
    readonly userHome: string;
    readonly userDocuments: string;
    readonly directories: SafeArray<IGuestDirectory>;
    readonly files: SafeArray<IGuestFile>;
    readonly eventSource: IEventSource;
    close(): void;
    copyFromGuest(
      sources: SafeArray<string>,
      filters: SafeArray<string>,
      flags: SafeArray<string>,
      destination: string
    ): IProgress;
    copyToGuest(
      sources: SafeArray<string>,
      filters: SafeArray<string>,
      flags: SafeArray<string>,
      destination: string
    ): IProgress;
    directoryCopy(
      source: string,
      destination: string,
      flags: SafeArray<DirectoryCopyFlag>
    ): IProgress;
    directoryCopyFromGuest(
      source: string,
      destination: string,
      flags: SafeArray<DirectoryCopyFlag>
    ): IProgress;
    directoryCopyToGuest(
      source: string,
      destination: string,
      flags: SafeArray<DirectoryCopyFlag>
    ): IProgress;
    directoryCreate(
      path: string,
      mode: number,
      flags: SafeArray<DirectoryCreateFlag>
    ): void;
    directoryCreateTemp(
      templateName: string,
      mode: number,
      path: string,
      secure: boolean
    ): string;
    directoryExists(path: string, followSymlinks: boolean): boolean;
    directoryOpen(
      path: string,
      filter: string,
      flags: SafeArray<DirectoryOpenFlag>
    ): IGuestDirectory;
    directoryRemove(path: string): void;
    directoryRemoveRecursive(
      path: string,
      flags: SafeArray<DirectoryRemoveRecFlag>
    ): IProgress;
    environmentScheduleSet(name: string, value: string): void;
    environmentScheduleUnset(name: string): void;
    environmentGetBaseVariable(name: string): string;
    environmentDoesBaseVariableExist(name: string): boolean;
    fileCopy(
      source: string,
      destination: string,
      flags: SafeArray<FileCopyFlag>
    ): IProgress;
    fileCopyFromGuest(
      source: string,
      destination: string,
      flags: SafeArray<FileCopyFlag>
    ): IProgress;
    fileCopyToGuest(
      source: string,
      destination: string,
      flags: SafeArray<FileCopyFlag>
    ): IProgress;
    fileCreateTemp(
      templateName: string,
      mode: number,
      path: string,
      secure: boolean
    ): IGuestFile;
    fileExists(path: string, followSymlinks: boolean): boolean;
    fileOpen(
      path: string,
      accessMode: FileAccessMode,
      openAction: FileOpenAction,
      creationMode: number
    ): IGuestFile;
    fileOpenEx(
      path: string,
      accessMode: FileAccessMode,
      openAction: FileOpenAction,
      sharingMode: FileSharingMode,
      creationMode: number,
      flags: SafeArray<FileOpenExFlag>
    ): IGuestFile;
    fileQuerySize(path: string, followSymlinks: boolean): number;
    fsObjExists(path: string, followSymlinks: boolean): boolean;
    fsObjQueryInfo(path: string, followSymlinks: boolean): IGuestFsObjInfo;
    fsObjRemove(path: string): void;
    fsObjRemoveArray(path: SafeArray<string>): IProgress;
    fsObjRename(
      oldPath: string,
      newPath: string,
      flags: SafeArray<FsObjRenameFlag>
    ): void;
    fsObjMove(
      source: string,
      destination: string,
      flags: SafeArray<FsObjMoveFlag>
    ): IProgress;
    fsObjMoveArray(
      source: SafeArray<string>,
      destination: string,
      flags: SafeArray<FsObjMoveFlag>
    ): IProgress;
    fsObjCopyArray(
      source: SafeArray<string>,
      destination: string,
      flags: SafeArray<FileCopyFlag>
    ): IProgress;
    fsObjSetACL(
      path: string,
      followSymlinks: boolean,
      acl: string,
      mode: number
    ): void;
    processCreate(
      executable: string,
      arguments: SafeArray<string>,
      environmentChanges: SafeArray<string>,
      flags: SafeArray<ProcessCreateFlag>,
      timeoutMS: number
    ): IGuestProcess;
    processCreateEx(
      executable: string,
      arguments: SafeArray<string>,
      environmentChanges: SafeArray<string>,
      flags: SafeArray<ProcessCreateFlag>,
      timeoutMS: number,
      priority: ProcessPriority,
      affinity: SafeArray<number>
    ): IGuestProcess;
    processGet(pid: number): IGuestProcess;
    symlinkCreate(symlink: string, target: string, type: SymlinkType): void;
    symlinkExists(symlink: string): boolean;
    symlinkRead(symlink: string, flags: SafeArray<SymlinkReadFlag>): string;
    waitFor(waitFor: number, timeoutMS: number): GuestSessionWaitResult;
    waitForArray(
      waitFor: SafeArray<GuestSessionWaitForFlag>,
      timeoutMS: number
    ): GuestSessionWaitResult;
  } /* interface IGuestSession */

  interface IProcess {
    readonly arguments: SafeArray<string>;
    readonly environment: SafeArray<string>;
    readonly eventSource: IEventSource;
    readonly executablePath: string;
    readonly exitCode: number;
    readonly name: string;
    readonly PID: number;
    readonly status: ProcessStatus;
    waitFor(waitFor: ProcessWaitForFlag, timeoutMS: number): ProcessWaitResult;
    waitForArray(
      waitFor: SafeArray<ProcessWaitForFlag>,
      timeoutMS: number
    ): ProcessWaitResult;
    read(handle: number, toRead: number, timeoutMS: number): SafeArray<number>;
    write(
      handle: number,
      flags: number,
      data: SafeArray<number>,
      timeoutMS: number
    ): number;
    writeArray(
      handle: number,
      flags: SafeArray<ProcessInputFlag>,
      data: SafeArray<number>,
      timeoutMS: number
    ): number;
    terminate(): void;
  } /* interface IProcess */

  interface IGuestProcess extends IProcess {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IGuestProcess */

  interface IDirectory {
    readonly directoryName: string;
    readonly filter: string;
    close(): void;
    read(): IFsObjInfo;
  } /* interface IDirectory */

  interface IGuestDirectory extends IDirectory {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IGuestDirectory */

  interface IFile {
    readonly eventSource: IEventSource;
    readonly id: number;
    readonly initialSize: number;
    readonly offset: number;
    readonly status: FileStatus;
    readonly filename: string;
    readonly creationMode: number;
    readonly openAction: FileOpenAction;
    readonly accessMode: FileAccessMode;
    close(): void;
    queryInfo(): IFsObjInfo;
    querySize(): number;
    read(toRead: number, timeoutMS: number): SafeArray<number>;
    readAt(
      offset: number,
      toRead: number,
      timeoutMS: number
    ): SafeArray<number>;
    seek(offset: number, whence: FileSeekOrigin): number;
    setACL(acl: string, mode: number): void;
    setSize(size: number): void;
    write(data: SafeArray<number>, timeoutMS: number): number;
    writeAt(offset: number, data: SafeArray<number>, timeoutMS: number): number;
  } /* interface IFile */

  interface IGuestFile extends IFile {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IGuestFile */

  interface IFsObjInfo {
    readonly name: string;
    readonly type: FsObjType;
    readonly fileAttributes: string;
    readonly objectSize: number;
    readonly allocatedSize: number;
    readonly accessTime: number;
    readonly birthTime: number;
    readonly changeTime: number;
    readonly modificationTime: number;
    readonly UID: number;
    readonly userName: string;
    readonly GID: number;
    readonly groupName: string;
    readonly nodeId: number;
    readonly nodeIdDevice: number;
    readonly hardLinks: number;
    readonly deviceNumber: number;
    readonly generationId: number;
    readonly userFlags: number;
  } /* interface IFsObjInfo */

  interface IGuestFsObjInfo extends IFsObjInfo {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IGuestFsObjInfo */

  interface IGuest {
    readonly OSTypeId: string;
    readonly additionsRunLevel: AdditionsRunLevelType;
    readonly additionsVersion: string;
    readonly additionsRevision: number;
    readonly dnDSource: IGuestDnDSource;
    readonly dnDTarget: IGuestDnDTarget;
    readonly eventSource: IEventSource;
    readonly facilities: SafeArray<IAdditionsFacility>;
    readonly sessions: SafeArray<IGuestSession>;
    memoryBalloonSize: number;
    statisticsUpdateInterval: number;
    internalGetStatistics(
      /* out */ cpuUser: number,
      /* out */ cpuKernel: number,
      /* out */ cpuIdle: number,
      /* out */ memTotal: number,
      /* out */ memFree: number,
      /* out */ memBalloon: number,
      /* out */ memShared: number,
      /* out */ memCache: number,
      /* out */ pagedTotal: number,
      /* out */ memAllocTotal: number,
      /* out */ memFreeTotal: number,
      /* out */ memBalloonTotal: number,
      /* out */ memSharedTotal: number
    ): void;
    getFacilityStatus(
      facility: AdditionsFacilityType,
      /* out */ timestamp: number
    ): AdditionsFacilityStatus;
    getAdditionsStatus(level: AdditionsRunLevelType): boolean;
    setCredentials(
      userName: string,
      password: string,
      domain: string,
      allowInteractiveLogon: boolean
    ): void;
    createSession(
      user: string,
      password: string,
      domain: string,
      sessionName: string
    ): IGuestSession;
    findSession(sessionName: string): SafeArray<IGuestSession>;
    updateGuestAdditions(
      source: string,
      arguments: SafeArray<string>,
      flags: SafeArray<AdditionsUpdateFlag>
    ): IProgress;
  } /* interface IGuest */

  interface IProgress {
    readonly id: string;
    readonly description: string;
    readonly initiator: any;
    readonly cancelable: boolean;
    readonly percent: number;
    readonly timeRemaining: number;
    readonly completed: boolean;
    readonly canceled: boolean;
    readonly resultCode: number;
    readonly errorInfo: IVirtualBoxErrorInfo;
    readonly operationCount: number;
    readonly operation: number;
    readonly operationDescription: string;
    readonly operationPercent: number;
    readonly operationWeight: number;
    timeout: number;
    readonly eventSource: IEventSource;
    waitForCompletion(timeout: number): void;
    waitForOperationCompletion(operation: number, timeout: number): void;
    cancel(): void;
  } /* interface IProgress */

  interface IInternalProgressControl {
    setCurrentOperationProgress(percent: number): void;
    waitForOtherProgressCompletion(
      progressOther: IProgress,
      timeoutMS: number
    ): void;
    setNextOperation(
      nextOperationDescription: string,
      nextOperationsWeight: number
    ): void;
    notifyPointOfNoReturn(): void;
    notifyComplete(resultCode: number, errorInfo: IVirtualBoxErrorInfo): void;
  } /* interface IInternalProgressControl */

  interface ISnapshot {
    readonly id: string;
    name: string;
    description: string;
    readonly timeStamp: number;
    readonly online: boolean;
    readonly machine: IMachine;
    readonly parent: ISnapshot;
    readonly children: SafeArray<ISnapshot>;
    readonly childrenCount: number;
  } /* interface ISnapshot */

  interface IMediumAttachment {
    readonly medium: IMedium;
    readonly controller: string;
    readonly port: number;
    readonly device: number;
    readonly type: DeviceType;
    readonly passthrough: boolean;
    readonly temporaryEject: boolean;
    readonly isEjected: boolean;
    readonly nonRotational: boolean;
    readonly discard: boolean;
    readonly hotPluggable: boolean;
    readonly bandwidthGroup: IBandwidthGroup;
  } /* interface IMediumAttachment */

  interface IMedium {
    readonly id: string;
    description: string;
    readonly state: MediumState;
    readonly variant: SafeArray<MediumVariant>;
    location: string;
    readonly name: string;
    readonly deviceType: DeviceType;
    readonly hostDrive: boolean;
    readonly size: number;
    readonly format: string;
    readonly mediumFormat: IMediumFormat;
    type: MediumType;
    readonly allowedTypes: SafeArray<MediumType>;
    readonly parent: IMedium;
    readonly children: SafeArray<IMedium>;
    readonly base: IMedium;
    readonly readOnly: boolean;
    readonly logicalSize: number;
    autoReset: boolean;
    readonly lastAccessError: string;
    readonly machineIds: SafeArray<string>;
    setIds(
      setImageId: boolean,
      imageId: string,
      setParentId: boolean,
      parentId: string
    ): void;
    refreshState(): MediumState;
    getSnapshotIds(machineId: string): SafeArray<string>;
    lockRead(): IToken;
    lockWrite(): IToken;
    close(): void;
    getProperty(name: string): string;
    setProperty(name: string, value: string): void;
    getProperties(
      names: string,
      /* out */ returnNames: SafeArray<string>
    ): SafeArray<string>;
    setProperties(names: SafeArray<string>, values: SafeArray<string>): void;
    createBaseStorage(
      logicalSize: number,
      variant: SafeArray<MediumVariant>
    ): IProgress;
    deleteStorage(): IProgress;
    createDiffStorage(
      target: IMedium,
      variant: SafeArray<MediumVariant>
    ): IProgress;
    mergeTo(target: IMedium): IProgress;
    cloneTo(
      target: IMedium,
      variant: SafeArray<MediumVariant>,
      parent: IMedium
    ): IProgress;
    cloneToBase(target: IMedium, variant: SafeArray<MediumVariant>): IProgress;
    moveTo(location: string): IProgress;
    compact(): IProgress;
    resize(logicalSize: number): IProgress;
    reset(): IProgress;
    changeEncryption(
      currentPassword: string,
      cipher: string,
      newPassword: string,
      newPasswordId: string
    ): IProgress;
    getEncryptionSettings(/* out */ cipher: string): string;
    checkEncryptionPassword(password: string): void;
    openForIO(writable: boolean, password: string): IMediumIO;
  } /* interface IMedium */

  interface IMediumFormat {
    readonly id: string;
    readonly name: string;
    readonly capabilities: SafeArray<MediumFormatCapabilities>;
    describeFileExtensions(
      /* out */ extensions: SafeArray<string>,
      /* out */ types: SafeArray<DeviceType>
    ): void;
    describeProperties(
      /* out */ names: SafeArray<string>,
      /* out */ descriptions: SafeArray<string>,
      /* out */ types: SafeArray<DataType>,
      /* out */ flags: SafeArray<number>,
      /* out */ defaults: SafeArray<string>
    ): void;
  } /* interface IMediumFormat */

  interface IDataStream {
    readonly readSize: number;
    read(size: number, timeoutMS: number): SafeArray<number>;
  } /* interface IDataStream */

  interface IMediumIO {
    readonly medium: IMedium;
    readonly writable: boolean;
    readonly explorer: IVFSExplorer;
    read(offset: number, size: number): SafeArray<number>;
    write(offset: number, data: SafeArray<number>): number;
    formatFAT(quick: boolean): void;
    initializePartitionTable(
      format: PartitionTableType,
      wholeDiskInOneEntry: boolean
    ): void;
    convertToStream(
      format: string,
      variant: SafeArray<MediumVariant>,
      bufferSize: number,
      /* out */ stream: IDataStream
    ): IProgress;
    close(): void;
  } /* interface IMediumIO */

  interface IToken {
    abandon(): void;
    dummy(): void;
  } /* interface IToken */

  interface IKeyboard {
    readonly keyboardLEDs: SafeArray<KeyboardLED>;
    readonly eventSource: IEventSource;
    putScancode(scancode: number): void;
    putScancodes(scancodes: SafeArray<number>): number;
    putCAD(): void;
    releaseKeys(): void;
  } /* interface IKeyboard */

  interface IMousePointerShape {
    readonly visible: boolean;
    readonly alpha: boolean;
    readonly hotX: number;
    readonly hotY: number;
    readonly width: number;
    readonly height: number;
    readonly shape: SafeArray<number>;
  } /* interface IMousePointerShape */

  interface IMouse {
    readonly absoluteSupported: boolean;
    readonly relativeSupported: boolean;
    readonly multiTouchSupported: boolean;
    readonly needsHostCursor: boolean;
    readonly pointerShape: IMousePointerShape;
    readonly eventSource: IEventSource;
    putMouseEvent(
      dx: number,
      dy: number,
      dz: number,
      dw: number,
      buttonState: number
    ): void;
    putMouseEventAbsolute(
      x: number,
      y: number,
      dz: number,
      dw: number,
      buttonState: number
    ): void;
    putEventMultiTouch(
      count: number,
      contacts: SafeArray<number>,
      scanTime: number
    ): void;
    putEventMultiTouchString(
      count: number,
      contacts: string,
      scanTime: number
    ): void;
  } /* interface IMouse */

  interface IDisplaySourceBitmap {
    readonly screenId: number;
    queryBitmapInfo(
      /* out */ address: any,
      /* out */ width: number,
      /* out */ height: number,
      /* out */ bitsPerPixel: number,
      /* out */ bytesPerLine: number,
      /* out */ bitmapFormat: BitmapFormat
    ): void;
  } /* interface IDisplaySourceBitmap */

  interface IFramebuffer {
    readonly width: number;
    readonly height: number;
    readonly bitsPerPixel: number;
    readonly bytesPerLine: number;
    readonly pixelFormat: BitmapFormat;
    readonly heightReduction: number;
    readonly overlay: IFramebufferOverlay;
    readonly winId: number;
    readonly capabilities: SafeArray<FramebufferCapabilities>;
    notifyUpdate(x: number, y: number, width: number, height: number): void;
    notifyUpdateImage(
      x: number,
      y: number,
      width: number,
      height: number,
      image: SafeArray<number>
    ): void;
    notifyChange(
      screenId: number,
      xOrigin: number,
      yOrigin: number,
      width: number,
      height: number
    ): void;
    videoModeSupported(width: number, height: number, bpp: number): boolean;
    getVisibleRegion(rectangles: any, count: number): number;
    setVisibleRegion(rectangles: any, count: number): void;
    processVHWACommand(command: any, enmCmd: number, fromGuest: boolean): void;
    notify3DEvent(type: number, data: SafeArray<number>): void;
  } /* interface IFramebuffer */

  interface IFramebufferOverlay extends IFramebuffer {
    readonly x: number;
    readonly y: number;
    visible: boolean;
    alpha: number;
    move(x: number, y: number): void;
  } /* interface IFramebufferOverlay */

  interface IGuestScreenInfo {
    readonly screenId: number;
    readonly guestMonitorStatus: GuestMonitorStatus;
    readonly primary: boolean;
    readonly origin: boolean;
    readonly originX: number;
    readonly originY: number;
    readonly width: number;
    readonly height: number;
    readonly bitsPerPixel: number;
    readonly extendedInfo: string;
  } /* interface IGuestScreenInfo */

  interface IDisplay {
    readonly guestScreenLayout: SafeArray<IGuestScreenInfo>;
    getScreenResolution(
      screenId: number,
      /* out */ width: number,
      /* out */ height: number,
      /* out */ bitsPerPixel: number,
      /* out */ xOrigin: number,
      /* out */ yOrigin: number,
      /* out */ guestMonitorStatus: GuestMonitorStatus
    ): void;
    attachFramebuffer(screenId: number, framebuffer: IFramebuffer): string;
    detachFramebuffer(screenId: number, id: string): void;
    queryFramebuffer(screenId: number): IFramebuffer;
    setVideoModeHint(
      display: number,
      enabled: boolean,
      changeOrigin: boolean,
      originX: number,
      originY: number,
      width: number,
      height: number,
      bitsPerPixel: number
    ): void;
    setSeamlessMode(enabled: boolean): void;
    takeScreenShot(
      screenId: number,
      address: any,
      width: number,
      height: number,
      bitmapFormat: BitmapFormat
    ): void;
    takeScreenShotToArray(
      screenId: number,
      width: number,
      height: number,
      bitmapFormat: BitmapFormat
    ): SafeArray<number>;
    drawToScreen(
      screenId: number,
      address: any,
      x: number,
      y: number,
      width: number,
      height: number
    ): void;
    invalidateAndUpdate(): void;
    invalidateAndUpdateScreen(screenId: number): void;
    completeVHWACommand(command: any): void;
    viewportChanged(
      screenId: number,
      x: number,
      y: number,
      width: number,
      height: number
    ): void;
    querySourceBitmap(
      screenId: number,
      /* out */ displaySourceBitmap: IDisplaySourceBitmap
    ): void;
    notifyScaleFactorChange(
      screenId: number,
      u32ScaleFactorWMultiplied: number,
      u32ScaleFactorHMultiplied: number
    ): void;
    notifyHiDPIOutputPolicyChange(fUnscaledHiDPI: boolean): void;
    setScreenLayout(
      screenLayoutMode: ScreenLayoutMode,
      guestScreenInfo: SafeArray<IGuestScreenInfo>
    ): void;
    detachScreens(screenIds: SafeArray<number>): void;
    createGuestScreenInfo(
      display: number,
      status: GuestMonitorStatus,
      primary: boolean,
      changeOrigin: boolean,
      originX: number,
      originY: number,
      width: number,
      height: number,
      bitsPerPixel: number
    ): IGuestScreenInfo;
  } /* interface IDisplay */

  interface INetworkAdapter {
    adapterType: NetworkAdapterType;
    readonly slot: number;
    enabled: boolean;
    MACAddress: string;
    attachmentType: NetworkAttachmentType;
    bridgedInterface: string;
    hostOnlyInterface: string;
    internalNetwork: string;
    NATNetwork: string;
    genericDriver: string;
    cableConnected: boolean;
    lineSpeed: number;
    promiscModePolicy: NetworkAdapterPromiscModePolicy;
    traceEnabled: boolean;
    traceFile: string;
    readonly NATEngine: INATEngine;
    bootPriority: number;
    bandwidthGroup: IBandwidthGroup;
    getProperty(key: string): string;
    setProperty(key: string, value: string): void;
    getProperties(
      names: string,
      /* out */ returnNames: SafeArray<string>
    ): SafeArray<string>;
  } /* interface INetworkAdapter */

  interface ISerialPort {
    readonly slot: number;
    enabled: boolean;
    IOBase: number;
    IRQ: number;
    hostMode: PortMode;
    server: boolean;
    path: string;
    uartType: UartType;
  } /* interface ISerialPort */

  interface IParallelPort {
    readonly slot: number;
    enabled: boolean;
    IOBase: number;
    IRQ: number;
    path: string;
  } /* interface IParallelPort */

  interface IMachineDebugger {
    singleStep: boolean;
    recompileUser: boolean;
    recompileSupervisor: boolean;
    executeAllInIEM: boolean;
    PATMEnabled: boolean;
    CSAMEnabled: boolean;
    logEnabled: boolean;
    readonly logDbgFlags: string;
    readonly logDbgGroups: string;
    readonly logDbgDestinations: string;
    readonly logRelFlags: string;
    readonly logRelGroups: string;
    readonly logRelDestinations: string;
    readonly executionEngine: VMExecutionEngine;
    readonly HWVirtExEnabled: boolean;
    readonly HWVirtExNestedPagingEnabled: boolean;
    readonly HWVirtExVPIDEnabled: boolean;
    readonly HWVirtExUXEnabled: boolean;
    readonly OSName: string;
    readonly OSVersion: string;
    readonly PAEEnabled: boolean;
    virtualTimeRate: number;
    readonly VM: number;
    readonly uptime: number;
    dumpGuestCore(filename: string, compression: string): void;
    dumpHostProcessCore(filename: string, compression: string): void;
    info(name: string, args: string): string;
    injectNMI(): void;
    modifyLogGroups(settings: string): void;
    modifyLogFlags(settings: string): void;
    modifyLogDestinations(settings: string): void;
    readPhysicalMemory(address: number, size: number): SafeArray<number>;
    writePhysicalMemory(
      address: number,
      size: number,
      bytes: SafeArray<number>
    ): void;
    readVirtualMemory(
      cpuId: number,
      address: number,
      size: number
    ): SafeArray<number>;
    writeVirtualMemory(
      cpuId: number,
      address: number,
      size: number,
      bytes: SafeArray<number>
    ): void;
    loadPlugIn(name: string): string;
    unloadPlugIn(name: string): void;
    detectOS(): string;
    queryOSKernelLog(maxMessages: number): string;
    getRegister(cpuId: number, name: string): string;
    getRegisters(
      cpuId: number,
      /* out */ names: SafeArray<string>,
      /* out */ values: SafeArray<string>
    ): void;
    setRegister(cpuId: number, name: string, value: string): void;
    setRegisters(
      cpuId: number,
      names: SafeArray<string>,
      values: SafeArray<string>
    ): void;
    dumpGuestStack(cpuId: number): string;
    resetStats(pattern: string): void;
    dumpStats(pattern: string): void;
    getStats(pattern: string, withDescriptions: boolean): string;
  } /* interface IMachineDebugger */

  interface IUSBDeviceFilters {
    readonly deviceFilters: SafeArray<IUSBDeviceFilter>;
    createDeviceFilter(name: string): IUSBDeviceFilter;
    insertDeviceFilter(position: number, filter: IUSBDeviceFilter): void;
    removeDeviceFilter(position: number): IUSBDeviceFilter;
  } /* interface IUSBDeviceFilters */

  interface IUSBController {
    name: string;
    type: USBControllerType;
    readonly USBStandard: number;
  } /* interface IUSBController */

  interface IUSBDevice {
    readonly id: string;
    readonly vendorId: number;
    readonly productId: number;
    readonly revision: number;
    readonly manufacturer: string;
    readonly product: string;
    readonly serialNumber: string;
    readonly address: string;
    readonly port: number;
    readonly version: number;
    readonly portVersion: number;
    readonly speed: USBConnectionSpeed;
    readonly remote: boolean;
    readonly deviceInfo: SafeArray<string>;
    readonly backend: string;
  } /* interface IUSBDevice */

  interface IUSBDeviceFilter {
    name: string;
    active: boolean;
    vendorId: string;
    productId: string;
    revision: string;
    manufacturer: string;
    product: string;
    serialNumber: string;
    port: string;
    remote: string;
    maskedInterfaces: number;
  } /* interface IUSBDeviceFilter */

  interface IHostUSBDevice extends IUSBDevice {
    readonly state: USBDeviceState;
  } /* interface IHostUSBDevice */

  interface IHostUSBDeviceFilter extends IUSBDeviceFilter {
    action: USBDeviceFilterAction;
  } /* interface IHostUSBDeviceFilter */

  interface IUSBProxyBackend {
    readonly name: string;
    readonly type: string;
  } /* interface IUSBProxyBackend */

  interface IAudioAdapter {
    enabled: boolean;
    enabledIn: boolean;
    enabledOut: boolean;
    audioController: AudioControllerType;
    audioCodec: AudioCodecType;
    audioDriver: AudioDriverType;
    readonly propertiesList: SafeArray<string>;
    setProperty(key: string, value: string): void;
    getProperty(key: string): string;
  } /* interface IAudioAdapter */

  interface IVRDEServer {
    enabled: boolean;
    authType: AuthType;
    authTimeout: number;
    allowMultiConnection: boolean;
    reuseSingleConnection: boolean;
    VRDEExtPack: string;
    authLibrary: string;
    readonly VRDEProperties: SafeArray<string>;
    setVRDEProperty(key: string, value: string): void;
    getVRDEProperty(key: string): string;
  } /* interface IVRDEServer */

  interface ISharedFolder {
    readonly name: string;
    readonly hostPath: string;
    readonly accessible: boolean;
    writable: boolean;
    autoMount: boolean;
    autoMountPoint: string;
    readonly lastAccessError: string;
  } /* interface ISharedFolder */

  interface IInternalSessionControl {
    readonly PID: number;
    readonly remoteConsole: IConsole;
    readonly nominalState: MachineState;
    assignRemoteMachine(machine: IMachine, console: IConsole): void;
    updateMachineState(machineState: MachineState): void;
    uninitialize(): void;
    onNetworkAdapterChange(
      networkAdapter: INetworkAdapter,
      changeAdapter: boolean
    ): void;
    onAudioAdapterChange(audioAdapter: IAudioAdapter): void;
    onSerialPortChange(serialPort: ISerialPort): void;
    onParallelPortChange(parallelPort: IParallelPort): void;
    onStorageControllerChange(): void;
    onMediumChange(mediumAttachment: IMediumAttachment, force: boolean): void;
    onStorageDeviceChange(
      mediumAttachment: IMediumAttachment,
      remove: boolean,
      silent: boolean
    ): void;
    onClipboardModeChange(clipboardMode: ClipboardMode): void;
    onDnDModeChange(dndMode: DnDMode): void;
    onCPUChange(cpu: number, add: boolean): void;
    onCPUExecutionCapChange(executionCap: number): void;
    onVRDEServerChange(restart: boolean): void;
    onRecordingChange(enable: boolean): void;
    onUSBControllerChange(): void;
    onSharedFolderChange(global: boolean): void;
    onUSBDeviceAttach(
      device: IUSBDevice,
      error: IVirtualBoxErrorInfo,
      maskedInterfaces: number,
      captureFilename: string
    ): void;
    onUSBDeviceDetach(id: string, error: IVirtualBoxErrorInfo): void;
    onShowWindow(
      check: boolean,
      /* out */ canShow: boolean,
      /* out */ winId: number
    ): void;
    onBandwidthGroupChange(bandwidthGroup: IBandwidthGroup): void;
    accessGuestProperty(
      name: string,
      value: string,
      flags: string,
      accessMode: number,
      /* out */ retValue: string,
      /* out */ retTimestamp: number,
      /* out */ retFlags: string
    ): void;
    enumerateGuestProperties(
      patterns: string,
      /* out */ keys: SafeArray<string>,
      /* out */ values: SafeArray<string>,
      /* out */ timestamps: SafeArray<number>,
      /* out */ flags: SafeArray<string>
    ): void;
    onlineMergeMedium(
      mediumAttachment: IMediumAttachment,
      sourceIdx: number,
      targetIdx: number,
      progress: IProgress
    ): void;
    reconfigureMediumAttachments(
      attachments: SafeArray<IMediumAttachment>
    ): void;
    enableVMMStatistics(enable: boolean): void;
    pauseWithReason(reason: Reason): void;
    resumeWithReason(reason: Reason): void;
    saveStateWithReason(
      reason: Reason,
      progress: IProgress,
      snapshot: ISnapshot,
      stateFilePath: string,
      pauseVM: boolean
    ): boolean;
    cancelSaveStateWithReason(): void;
    assignMachine(
      machine: IMachine,
      lockType: LockType,
      tokenId: string | IToken
    ): void;
  } /* interface IInternalSessionControl */

  interface ISession {
    readonly state: SessionState;
    readonly type: SessionType;
    name: string;
    readonly machine: IMachine;
    readonly console: IConsole;
    unlockMachine(): void;
  } /* interface ISession */

  interface IStorageController {
    name: string;
    readonly maxDevicesPerPortCount: number;
    readonly minPortCount: number;
    readonly maxPortCount: number;
    instance: number;
    portCount: number;
    readonly bus: StorageBus;
    controllerType: StorageControllerType;
    useHostIOCache: boolean;
    readonly bootable: boolean;
  } /* interface IStorageController */

  interface IManagedObjectRef {
    getInterfaceName(): string;
    release(): void;
  } /* interface IManagedObjectRef */

  interface IWebsessionManager {
    logon(username: string, password: string): IVirtualBox;
    getSessionObject(refIVirtualBox: IVirtualBox): ISession;
    logoff(refIVirtualBox: IVirtualBox): void;
  } /* interface IWebsessionManager */

  interface IPerformanceMetric {
    readonly metricName: string;
    readonly object: any;
    readonly description: string;
    readonly period: number;
    readonly count: number;
    readonly unit: string;
    readonly minimumValue: number;
    readonly maximumValue: number;
  } /* interface IPerformanceMetric */

  interface IPerformanceCollector {
    readonly metricNames: SafeArray<string>;
    getMetrics(
      metricNames: SafeArray<string>,
      objects: SafeArray<any>
    ): SafeArray<IPerformanceMetric>;
    setupMetrics(
      metricNames: SafeArray<string>,
      objects: SafeArray<any>,
      period: number,
      count: number
    ): SafeArray<IPerformanceMetric>;
    enableMetrics(
      metricNames: SafeArray<string>,
      objects: SafeArray<any>
    ): SafeArray<IPerformanceMetric>;
    disableMetrics(
      metricNames: SafeArray<string>,
      objects: SafeArray<any>
    ): SafeArray<IPerformanceMetric>;
    queryMetricsData(
      metricNames: SafeArray<string>,
      objects: SafeArray<any>,
      /* out */ returnMetricNames: SafeArray<string>,
      /* out */ returnObjects: SafeArray<any>,
      /* out */ returnUnits: SafeArray<string>,
      /* out */ returnScales: SafeArray<number>,
      /* out */ returnSequenceNumbers: SafeArray<number>,
      /* out */ returnDataIndices: SafeArray<number>,
      /* out */ returnDataLengths: SafeArray<number>
    ): SafeArray<number>;
  } /* interface IPerformanceCollector */

  interface INATEngine {
    network: string;
    hostIP: string;
    TFTPPrefix: string;
    TFTPBootFile: string;
    TFTPNextServer: string;
    aliasMode: number;
    DNSPassDomain: boolean;
    DNSProxy: boolean;
    DNSUseHostResolver: boolean;
    readonly redirects: SafeArray<string>;
    setNetworkSettings(
      mtu: number,
      sockSnd: number,
      sockRcv: number,
      TcpWndSnd: number,
      TcpWndRcv: number
    ): void;
    getNetworkSettings(
      /* out */ mtu: number,
      /* out */ sockSnd: number,
      /* out */ sockRcv: number,
      /* out */ TcpWndSnd: number,
      /* out */ TcpWndRcv: number
    ): void;
    addRedirect(
      name: string,
      proto: NATProtocol,
      hostIP: string,
      hostPort: number,
      guestIP: string,
      guestPort: number
    ): void;
    removeRedirect(name: string): void;
  } /* interface INATEngine */

  interface IExtPackPlugIn {
    readonly name: string;
    readonly description: string;
    readonly frontend: string;
    readonly modulePath: string;
  } /* interface IExtPackPlugIn */

  interface IExtPackBase {
    readonly name: string;
    readonly description: string;
    readonly version: string;
    readonly revision: number;
    readonly edition: string;
    readonly VRDEModule: string;
    readonly plugIns: SafeArray<IExtPackPlugIn>;
    readonly usable: boolean;
    readonly whyUnusable: string;
    readonly showLicense: boolean;
    readonly license: string;
    queryLicense(
      preferredLocale: string,
      preferredLanguage: string,
      format: string
    ): string;
  } /* interface IExtPackBase */

  interface IExtPack extends IExtPackBase {
    queryObject(objUuid: string): void;
  } /* interface IExtPack */

  interface IExtPackFile extends IExtPackBase {
    readonly filePath: string;
    install(replace: boolean, displayInfo: string): IProgress;
  } /* interface IExtPackFile */

  interface IExtPackManager {
    readonly installedExtPacks: SafeArray<IExtPack>;
    find(name: string): IExtPack;
    openExtPackFile(path: string): IExtPackFile;
    uninstall(
      name: string,
      forcedRemoval: boolean,
      displayInfo: string
    ): IProgress;
    cleanup(): void;
    queryAllPlugInsForFrontend(frontendName: string): SafeArray<string>;
    isExtPackUsable(name: string): boolean;
  } /* interface IExtPackManager */

  interface IBandwidthGroup {
    readonly name: string;
    readonly type: BandwidthGroupType;
    readonly reference: number;
    maxBytesPerSec: number;
  } /* interface IBandwidthGroup */

  interface IBandwidthControl {
    readonly numGroups: number;
    createBandwidthGroup(
      name: string,
      type: BandwidthGroupType,
      maxBytesPerSec: number
    ): void;
    deleteBandwidthGroup(name: string): void;
    getBandwidthGroup(name: string): IBandwidthGroup;
    getAllBandwidthGroups(): SafeArray<IBandwidthGroup>;
  } /* interface IBandwidthControl */

  interface IVirtualBoxClient {
    readonly virtualBox: IVirtualBox;
    readonly session: ISession;
    readonly eventSource: IEventSource;
    checkMachineError(machine: IMachine): void;
  } /* interface IVirtualBoxClient */

  interface IEventSource {
    createListener(): IEventListener;
    createAggregator(subordinates: SafeArray<IEventSource>): IEventSource;
    registerListener(
      listener: IEventListener,
      interesting: SafeArray<VBoxEventType>,
      active: boolean
    ): void;
    unregisterListener(listener: IEventListener): void;
    fireEvent(event: IEvent, timeout: number): boolean;
    getEvent(listener: IEventListener, timeout: number): IEvent;
    eventProcessed(listener: IEventListener, event: IEvent): void;
  } /* interface IEventSource */

  interface IEventListener {
    handleEvent(event: IEvent): void;
  } /* interface IEventListener */

  interface IEvent {
    readonly type: VBoxEventType;
    readonly source: IEventSource;
    readonly waitable: boolean;
    setProcessed(): void;
    waitProcessed(timeout: number): boolean;
  } /* interface IEvent */

  interface IReusableEvent extends IEvent {
    readonly generation: number;
    reuse(): void;
  } /* interface IReusableEvent */

  interface IMachineEvent extends IEvent {
    readonly machineId: string;
  } /* interface IMachineEvent */

  interface IMachineStateChangedEvent extends IMachineEvent {
    readonly state: MachineState;
  } /* interface IMachineStateChangedEvent */

  interface IMachineDataChangedEvent extends IMachineEvent {
    readonly temporary: boolean;
  } /* interface IMachineDataChangedEvent */

  interface IMediumRegisteredEvent extends IEvent {
    readonly mediumId: string;
    readonly mediumType: DeviceType;
    readonly registered: boolean;
  } /* interface IMediumRegisteredEvent */

  interface IMediumConfigChangedEvent extends IEvent {
    readonly medium: IMedium;
  } /* interface IMediumConfigChangedEvent */

  interface IMachineRegisteredEvent extends IMachineEvent {
    readonly registered: boolean;
  } /* interface IMachineRegisteredEvent */

  interface ISessionStateChangedEvent extends IMachineEvent {
    readonly state: SessionState;
  } /* interface ISessionStateChangedEvent */

  interface IGuestPropertyChangedEvent extends IMachineEvent {
    readonly name: string;
    readonly value: string;
    readonly flags: string;
  } /* interface IGuestPropertyChangedEvent */

  interface ISnapshotEvent extends IMachineEvent {
    readonly snapshotId: string;
  } /* interface ISnapshotEvent */

  interface ISnapshotTakenEvent extends ISnapshotEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface ISnapshotTakenEvent */

  interface ISnapshotDeletedEvent extends ISnapshotEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface ISnapshotDeletedEvent */

  interface ISnapshotRestoredEvent extends ISnapshotEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface ISnapshotRestoredEvent */

  interface ISnapshotChangedEvent extends ISnapshotEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface ISnapshotChangedEvent */

  interface IMousePointerShapeChangedEvent extends IEvent {
    readonly visible: boolean;
    readonly alpha: boolean;
    readonly xhot: number;
    readonly yhot: number;
    readonly width: number;
    readonly height: number;
    readonly shape: SafeArray<number>;
  } /* interface IMousePointerShapeChangedEvent */

  interface IMouseCapabilityChangedEvent extends IEvent {
    readonly supportsAbsolute: boolean;
    readonly supportsRelative: boolean;
    readonly supportsMultiTouch: boolean;
    readonly needsHostCursor: boolean;
  } /* interface IMouseCapabilityChangedEvent */

  interface IKeyboardLedsChangedEvent extends IEvent {
    readonly numLock: boolean;
    readonly capsLock: boolean;
    readonly scrollLock: boolean;
  } /* interface IKeyboardLedsChangedEvent */

  interface IStateChangedEvent extends IEvent {
    readonly state: MachineState;
  } /* interface IStateChangedEvent */

  interface IAdditionsStateChangedEvent extends IEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IAdditionsStateChangedEvent */

  interface INetworkAdapterChangedEvent extends IEvent {
    readonly networkAdapter: INetworkAdapter;
  } /* interface INetworkAdapterChangedEvent */

  interface IAudioAdapterChangedEvent extends IEvent {
    readonly audioAdapter: IAudioAdapter;
  } /* interface IAudioAdapterChangedEvent */

  interface ISerialPortChangedEvent extends IEvent {
    readonly serialPort: ISerialPort;
  } /* interface ISerialPortChangedEvent */

  interface IParallelPortChangedEvent extends IEvent {
    readonly parallelPort: IParallelPort;
  } /* interface IParallelPortChangedEvent */

  interface IStorageControllerChangedEvent extends IEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IStorageControllerChangedEvent */

  interface IMediumChangedEvent extends IEvent {
    readonly mediumAttachment: IMediumAttachment;
  } /* interface IMediumChangedEvent */

  interface IClipboardModeChangedEvent extends IEvent {
    readonly clipboardMode: ClipboardMode;
  } /* interface IClipboardModeChangedEvent */

  interface IDnDModeChangedEvent extends IEvent {
    readonly dndMode: DnDMode;
  } /* interface IDnDModeChangedEvent */

  interface ICPUChangedEvent extends IEvent {
    readonly CPU: number;
    readonly add: boolean;
  } /* interface ICPUChangedEvent */

  interface ICPUExecutionCapChangedEvent extends IEvent {
    readonly executionCap: number;
  } /* interface ICPUExecutionCapChangedEvent */

  interface IGuestKeyboardEvent extends IEvent {
    readonly scancodes: SafeArray<number>;
  } /* interface IGuestKeyboardEvent */

  interface IGuestMouseEvent extends IReusableEvent {
    readonly mode: GuestMouseEventMode;
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly w: number;
    readonly buttons: number;
  } /* interface IGuestMouseEvent */

  interface IGuestMultiTouchEvent extends IEvent {
    readonly contactCount: number;
    readonly xPositions: SafeArray<number>;
    readonly yPositions: SafeArray<number>;
    readonly contactIds: SafeArray<number>;
    readonly contactFlags: SafeArray<number>;
    readonly scanTime: number;
  } /* interface IGuestMultiTouchEvent */

  interface IGuestSessionEvent extends IEvent {
    readonly session: IGuestSession;
  } /* interface IGuestSessionEvent */

  interface IGuestSessionStateChangedEvent extends IGuestSessionEvent {
    readonly id: number;
    readonly status: GuestSessionStatus;
    readonly error: IVirtualBoxErrorInfo;
  } /* interface IGuestSessionStateChangedEvent */

  interface IGuestSessionRegisteredEvent extends IGuestSessionEvent {
    readonly registered: boolean;
  } /* interface IGuestSessionRegisteredEvent */

  interface IGuestProcessEvent extends IGuestSessionEvent {
    readonly process: IGuestProcess;
    readonly pid: number;
  } /* interface IGuestProcessEvent */

  interface IGuestProcessRegisteredEvent extends IGuestProcessEvent {
    readonly registered: boolean;
  } /* interface IGuestProcessRegisteredEvent */

  interface IGuestProcessStateChangedEvent extends IGuestProcessEvent {
    readonly status: ProcessStatus;
    readonly error: IVirtualBoxErrorInfo;
  } /* interface IGuestProcessStateChangedEvent */

  interface IGuestProcessIOEvent extends IGuestProcessEvent {
    readonly handle: number;
    readonly processed: number;
  } /* interface IGuestProcessIOEvent */

  interface IGuestProcessInputNotifyEvent extends IGuestProcessIOEvent {
    readonly status: ProcessInputStatus;
  } /* interface IGuestProcessInputNotifyEvent */

  interface IGuestProcessOutputEvent extends IGuestProcessIOEvent {
    readonly data: SafeArray<number>;
  } /* interface IGuestProcessOutputEvent */

  interface IGuestFileEvent extends IGuestSessionEvent {
    readonly file: IGuestFile;
  } /* interface IGuestFileEvent */

  interface IGuestFileRegisteredEvent extends IGuestFileEvent {
    readonly registered: boolean;
  } /* interface IGuestFileRegisteredEvent */

  interface IGuestFileStateChangedEvent extends IGuestFileEvent {
    readonly status: FileStatus;
    readonly error: IVirtualBoxErrorInfo;
  } /* interface IGuestFileStateChangedEvent */

  interface IGuestFileIOEvent extends IGuestFileEvent {
    readonly offset: number;
    readonly processed: number;
  } /* interface IGuestFileIOEvent */

  interface IGuestFileOffsetChangedEvent extends IGuestFileIOEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IGuestFileOffsetChangedEvent */

  interface IGuestFileReadEvent extends IGuestFileIOEvent {
    readonly data: SafeArray<number>;
  } /* interface IGuestFileReadEvent */

  interface IGuestFileWriteEvent extends IGuestFileIOEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IGuestFileWriteEvent */

  interface IVRDEServerChangedEvent extends IEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IVRDEServerChangedEvent */

  interface IVRDEServerInfoChangedEvent extends IEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IVRDEServerInfoChangedEvent */

  interface IRecordingChangedEvent extends IEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IRecordingChangedEvent */

  interface IUSBControllerChangedEvent extends IEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IUSBControllerChangedEvent */

  interface IUSBDeviceStateChangedEvent extends IEvent {
    readonly device: IUSBDevice;
    readonly attached: boolean;
    readonly error: IVirtualBoxErrorInfo;
  } /* interface IUSBDeviceStateChangedEvent */

  interface ISharedFolderChangedEvent extends IEvent {
    readonly scope: Scope;
  } /* interface ISharedFolderChangedEvent */

  interface IRuntimeErrorEvent extends IEvent {
    readonly fatal: boolean;
    readonly id: string;
    readonly message: string;
  } /* interface IRuntimeErrorEvent */

  interface IEventSourceChangedEvent extends IEvent {
    readonly listener: IEventListener;
    readonly add: boolean;
  } /* interface IEventSourceChangedEvent */

  interface IExtraDataChangedEvent extends IEvent {
    readonly machineId: string;
    readonly key: string;
    readonly value: string;
  } /* interface IExtraDataChangedEvent */

  interface IVetoEvent extends IEvent {
    addVeto(reason: string): void;
    isVetoed(): boolean;
    getVetos(): SafeArray<string>;
    addApproval(reason: string): void;
    isApproved(): boolean;
    getApprovals(): SafeArray<string>;
  } /* interface IVetoEvent */

  interface IExtraDataCanChangeEvent extends IVetoEvent {
    readonly machineId: string;
    readonly key: string;
    readonly value: string;
  } /* interface IExtraDataCanChangeEvent */

  interface ICanShowWindowEvent extends IVetoEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface ICanShowWindowEvent */

  interface IShowWindowEvent extends IEvent {
    winId: number;
  } /* interface IShowWindowEvent */

  interface INATRedirectEvent extends IMachineEvent {
    readonly slot: number;
    readonly remove: boolean;
    readonly name: string;
    readonly proto: NATProtocol;
    readonly hostIP: string;
    readonly hostPort: number;
    readonly guestIP: string;
    readonly guestPort: number;
  } /* interface INATRedirectEvent */

  interface IHostPCIDevicePlugEvent extends IMachineEvent {
    readonly plugged: boolean;
    readonly success: boolean;
    readonly attachment: IPCIDeviceAttachment;
    readonly message: string;
  } /* interface IHostPCIDevicePlugEvent */

  interface IVBoxSVCAvailabilityChangedEvent extends IEvent {
    readonly available: boolean;
  } /* interface IVBoxSVCAvailabilityChangedEvent */

  interface IBandwidthGroupChangedEvent extends IEvent {
    readonly bandwidthGroup: IBandwidthGroup;
  } /* interface IBandwidthGroupChangedEvent */

  interface IGuestMonitorChangedEvent extends IEvent {
    readonly changeType: GuestMonitorChangedEventType;
    readonly screenId: number;
    readonly originX: number;
    readonly originY: number;
    readonly width: number;
    readonly height: number;
  } /* interface IGuestMonitorChangedEvent */

  interface IGuestUserStateChangedEvent extends IEvent {
    readonly name: string;
    readonly domain: string;
    readonly state: GuestUserState;
    readonly stateDetails: string;
  } /* interface IGuestUserStateChangedEvent */

  interface IStorageDeviceChangedEvent extends IEvent {
    readonly storageDevice: IMediumAttachment;
    readonly removed: boolean;
    readonly silent: boolean;
  } /* interface IStorageDeviceChangedEvent */

  interface INATNetworkChangedEvent extends IEvent {
    readonly networkName: string;
  } /* interface INATNetworkChangedEvent */

  interface INATNetworkStartStopEvent extends INATNetworkChangedEvent {
    readonly startEvent: boolean;
  } /* interface INATNetworkStartStopEvent */

  interface INATNetworkAlterEvent extends INATNetworkChangedEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface INATNetworkAlterEvent */

  interface INATNetworkCreationDeletionEvent extends INATNetworkAlterEvent {
    readonly creationEvent: boolean;
  } /* interface INATNetworkCreationDeletionEvent */

  interface INATNetworkSettingEvent extends INATNetworkAlterEvent {
    readonly enabled: boolean;
    readonly network: string;
    readonly gateway: string;
    readonly advertiseDefaultIPv6RouteEnabled: boolean;
    readonly needDhcpServer: boolean;
  } /* interface INATNetworkSettingEvent */

  interface INATNetworkPortForwardEvent extends INATNetworkAlterEvent {
    readonly create: boolean;
    readonly ipv6: boolean;
    readonly name: string;
    readonly proto: NATProtocol;
    readonly hostIp: string;
    readonly hostPort: number;
    readonly guestIp: string;
    readonly guestPort: number;
  } /* interface INATNetworkPortForwardEvent */

  interface IHostNameResolutionConfigurationChangeEvent extends IEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IHostNameResolutionConfigurationChangeEvent */

  interface IProgressEvent extends IEvent {
    readonly progressId: string;
  } /* interface IProgressEvent */

  interface IProgressPercentageChangedEvent extends IProgressEvent {
    readonly percent: number;
  } /* interface IProgressPercentageChangedEvent */

  interface IProgressTaskCompletedEvent extends IProgressEvent {
    readonly midlDoesNotLikeEmptyInterfaces: boolean;
  } /* interface IProgressTaskCompletedEvent */

  interface ICursorPositionChangedEvent extends IEvent {
    readonly hasData: boolean;
    readonly x: number;
    readonly y: number;
  } /* interface ICursorPositionChangedEvent */

  interface ICloudClient {
    getExportLaunchParameters(): string;
    exportLaunchVM(
      description: IVirtualSystemDescription,
      progress: IProgress,
      virtualBox: IVirtualBox
    ): void;
  } /* interface ICloudClient */

  interface ICloudProfile {
    name: string;
    readonly providerId: string;
    getProperty(name: string): string;
    setProperty(name: string, value: string): void;
    getProperties(
      names: string,
      /* out */ returnNames: SafeArray<string>
    ): SafeArray<string>;
    setProperties(names: SafeArray<string>, values: SafeArray<string>): void;
    remove(): void;
    createCloudClient(): ICloudClient;
  } /* interface ICloudProfile */

  interface ICloudProvider {
    readonly name: string;
    readonly shortName: string;
    readonly id: string;
    readonly profiles: SafeArray<ICloudProfile>;
    readonly profileNames: SafeArray<string>;
    readonly supportedPropertyNames: SafeArray<string>;
    getPropertyDescription(name: string): string;
    createProfile(
      profileName: string,
      names: SafeArray<string>,
      values: SafeArray<string>
    ): void;
    importProfiles(): void;
    restoreProfiles(): void;
    saveProfiles(): void;
    getProfileByName(profileName: string): ICloudProfile;
    prepareUninstall(): void;
  } /* interface ICloudProvider */

  interface ICloudProviderManager {
    readonly providers: SafeArray<ICloudProvider>;
    getProviderById(providerId: string): ICloudProvider;
    getProviderByShortName(providerName: string): ICloudProvider;
    getProviderByName(providerName: string): ICloudProvider;
  } /* interface ICloudProviderManager */

  interface IVBoxSVCRegistration {
    getVirtualBox(): void;
  } /* interface IVBoxSVCRegistration */

  interface IVirtualBoxSDS {
    registerVBoxSVC(vboxSVC: IVBoxSVCRegistration, pid: number): void;
    deregisterVBoxSVC(vboxSVC: IVBoxSVCRegistration, pid: number): void;
  } /* interface IVirtualBoxSDS */
}
interface ActiveXObjectNameMap {
  'VirtualBox.VirtualBox': VirtualBox.IVirtualBox;
  'VirtualBox.Session': VirtualBox.ISession;
}
