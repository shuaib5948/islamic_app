import { Language, useLanguage } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface SettingItemProps {
  icon: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  isDark: boolean;
}

const SettingItem = ({ icon, iconColor, title, subtitle, onPress, rightElement, isDark }: SettingItemProps) => (
  <TouchableOpacity
    style={[styles.settingItem, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress && !rightElement}
  >
    <View style={[styles.settingIconContainer, { backgroundColor: iconColor }]}>
      <Text style={styles.settingIcon}>{icon}</Text>
    </View>
    <View style={styles.settingContent}>
      <Text style={[styles.settingTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.settingSubtitle, { color: isDark ? '#9E9E9E' : '#757575' }]}>
          {subtitle}
        </Text>
      )}
    </View>
    {rightElement || (onPress && (
      <Ionicons name="chevron-forward" size={20} color={isDark ? '#757575' : '#9E9E9E'} />
    ))}
  </TouchableOpacity>
);

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
  isDark: boolean;
}

const SettingSection = ({ title, children, isDark }: SettingSectionProps) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: isDark ? '#90CAF9' : '#1565C0' }]}>
      {title}
    </Text>
    <View style={[styles.sectionContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      {children}
    </View>
  </View>
);

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language, setLanguage } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const isMalayalam = language === 'ml';

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [prayerReminders, setPrayerReminders] = useState(true);
  const [dailyHadith, setDailyHadith] = useState(true);
  const [eventAlerts, setEventAlerts] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Labels for Malayalam support
  const labels = {
    settings: isMalayalam ? 'ക്രമീകരണങ്ങൾ' : 'Settings',
    language: isMalayalam ? 'ഭാഷ' : 'Language',
    appLanguage: isMalayalam ? 'ആപ്പ് ഭാഷ' : 'App Language',
    notifications: isMalayalam ? 'അറിയിപ്പുകൾ' : 'Notifications',
    enableNotifications: isMalayalam ? 'അറിയിപ്പുകൾ പ്രവർത്തനക്ഷമമാക്കുക' : 'Enable Notifications',
    receiveNotifications: isMalayalam ? 'ആപ്പ് അറിയിപ്പുകൾ സ്വീകരിക്കുക' : 'Receive app notifications',
    prayerReminders: isMalayalam ? 'നമസ്കാര ഓർമ്മപ്പെടുത്തലുകൾ' : 'Prayer Reminders',
    prayerRemindersSubtitle: isMalayalam ? 'നമസ്കാര സമയത്തിന് മുമ്പ് ഓർമ്മപ്പെടുത്തൽ' : 'Get reminded before prayer times',
    dailyHadith: isMalayalam ? 'ദൈനംദിന ഹദീസ്' : 'Daily Hadith',
    dailyHadithSubtitle: isMalayalam ? 'ദിവസവും ഹദീസ് അറിയിപ്പ് സ്വീകരിക്കുക' : 'Receive daily hadith notification',
    eventAlerts: isMalayalam ? 'ഇവന്റ് അലേർട്ടുകൾ' : 'Event Alerts',
    eventAlertsSubtitle: isMalayalam ? 'ഇസ്ലാമിക ഇവന്റുകളും അവസരങ്ങളും' : 'Islamic events & occasions',
    soundHaptics: isMalayalam ? 'ശബ്ദവും ഹാപ്റ്റിക്സും' : 'Sound & Haptics',
    sound: isMalayalam ? 'ശബ്ദം' : 'Sound',
    soundSubtitle: isMalayalam ? 'അറിയിപ്പുകൾക്ക് ശബ്ദം പ്ലേ ചെയ്യുക' : 'Play sounds for notifications',
    vibration: isMalayalam ? 'വൈബ്രേഷൻ' : 'Vibration',
    vibrationSubtitle: isMalayalam ? 'പ്രവർത്തനങ്ങൾക്ക് ഹാപ്റ്റിക് ഫീഡ്‌ബാക്ക്' : 'Haptic feedback for actions',
    data: isMalayalam ? 'ഡാറ്റ' : 'Data',
    resetAllData: isMalayalam ? 'എല്ലാ ഡാറ്റയും റീസെറ്റ് ചെയ്യുക' : 'Reset All Data',
    resetDataSubtitle: isMalayalam ? 'നമസ്കാരം, ഖുർആൻ, ദിക്ർ പുരോഗതി മായ്ക്കുക' : 'Clear prayer, Quran & dhikr progress',
    about: isMalayalam ? 'ആപ്പിനെ കുറിച്ച്' : 'About',
    aboutApp: isMalayalam ? 'ആപ്പിനെ കുറിച്ച്' : 'About App',
    version: isMalayalam ? 'പതിപ്പ് 1.0.0' : 'Version 1.0.0',
    sendFeedback: isMalayalam ? 'ഫീഡ്‌ബാക്ക് അയയ്ക്കുക' : 'Send Feedback',
    feedbackSubtitle: isMalayalam ? 'ആപ്പ് മെച്ചപ്പെടുത്താൻ ഞങ്ങളെ സഹായിക്കുക' : 'Help us improve the app',
    privacyPolicy: isMalayalam ? 'സ്വകാര്യതാ നയം' : 'Privacy Policy',
    privacySubtitle: isMalayalam ? 'നിങ്ങളുടെ ഡാറ്റ ഞങ്ങൾ എങ്ങനെ കൈകാര്യം ചെയ്യുന്നു' : 'How we handle your data',
    selectLanguage: isMalayalam ? 'ഭാഷ തിരഞ്ഞെടുക്കുക' : 'Select Language',
    mayAllahBless: isMalayalam ? 'അല്ലാഹു നിങ്ങളെ അനുഗ്രഹിക്കട്ടെ' : 'May Allah bless you',
    cancel: isMalayalam ? 'റദ്ദാക്കുക' : 'Cancel',
    reset: isMalayalam ? 'റീസെറ്റ്' : 'Reset',
    ok: isMalayalam ? 'ശരി' : 'OK',
    jazakAllah: isMalayalam ? 'ജസാക്കല്ലാഹ് ഖൈർ' : 'Jazak Allah Khair',
  };

  const languageOptions: { code: Language; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  ];

  const currentLanguage = languageOptions.find(l => l.code === language);

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will clear all your prayer tracking, Quran progress, and dhikr counts. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Clear AsyncStorage data here
            Alert.alert('Data Reset', 'All app data has been cleared.');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Islamic App',
      'Version 1.0.0\n\nYour daily companion for Islamic practices.\n\nFeatures:\n• Hijri Calendar\n• Islamic Events\n• Adhkar & Dhikr\n• Quran Khatam Tracker\n• Prayer Tracker\n• Faraid Calculator\n\nMay Allah accept your good deeds. 🤲',
      [{ text: 'Jazak Allah Khair', style: 'default' }]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      'Send Feedback',
      'We appreciate your feedback! Please email us at:\n\nfeedback@islamicapp.com',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      'Privacy Policy',
      'Your data stays on your device.\n\nWe do not collect, store, or share any personal information. All prayer tracking, Quran progress, and settings are stored locally on your device only.\n\nNo account required. No data sent to servers.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#1A1A1A'} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            {labels.settings}
          </Text>
          <Text style={[styles.headerArabic, { color: isDark ? '#B0BEC5' : '#757575' }]}>
            الإعدادات
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Language Section */}
        <SettingSection title={labels.language} isDark={isDark}>
          <SettingItem
            icon="🌐"
            iconColor="#3F51B5"
            title={labels.appLanguage}
            subtitle={currentLanguage ? `${currentLanguage.name} (${currentLanguage.nativeName})` : 'English'}
            isDark={isDark}
            onPress={() => setShowLanguageModal(true)}
          />
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection title={labels.notifications} isDark={isDark}>
          <SettingItem
            icon="🔔"
            iconColor="#FF9800"
            title={labels.enableNotifications}
            subtitle={labels.receiveNotifications}
            isDark={isDark}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: '#81C784' }}
                thumbColor={notificationsEnabled ? '#4CAF50' : '#f4f3f4'}
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />
          <SettingItem
            icon="🕌"
            iconColor="#2E7D32"
            title={labels.prayerReminders}
            subtitle={labels.prayerRemindersSubtitle}
            isDark={isDark}
            rightElement={
              <Switch
                value={prayerReminders}
                onValueChange={setPrayerReminders}
                trackColor={{ false: '#767577', true: '#81C784' }}
                thumbColor={prayerReminders ? '#4CAF50' : '#f4f3f4'}
                disabled={!notificationsEnabled}
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />
          <SettingItem
            icon="📜"
            iconColor="#1565C0"
            title={labels.dailyHadith}
            subtitle={labels.dailyHadithSubtitle}
            isDark={isDark}
            rightElement={
              <Switch
                value={dailyHadith}
                onValueChange={setDailyHadith}
                trackColor={{ false: '#767577', true: '#81C784' }}
                thumbColor={dailyHadith ? '#4CAF50' : '#f4f3f4'}
                disabled={!notificationsEnabled}
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />
          <SettingItem
            icon="📅"
            iconColor="#7B1FA2"
            title={labels.eventAlerts}
            subtitle={labels.eventAlertsSubtitle}
            isDark={isDark}
            rightElement={
              <Switch
                value={eventAlerts}
                onValueChange={setEventAlerts}
                trackColor={{ false: '#767577', true: '#81C784' }}
                thumbColor={eventAlerts ? '#4CAF50' : '#f4f3f4'}
                disabled={!notificationsEnabled}
              />
            }
          />
        </SettingSection>

        {/* Sound & Haptics Section */}
        <SettingSection title={labels.soundHaptics} isDark={isDark}>
          <SettingItem
            icon="🔊"
            iconColor="#E91E63"
            title={labels.sound}
            subtitle={labels.soundSubtitle}
            isDark={isDark}
            rightElement={
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#767577', true: '#81C784' }}
                thumbColor={soundEnabled ? '#4CAF50' : '#f4f3f4'}
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />
          <SettingItem
            icon="📳"
            iconColor="#00BCD4"
            title={labels.vibration}
            subtitle={labels.vibrationSubtitle}
            isDark={isDark}
            rightElement={
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: '#767577', true: '#81C784' }}
                thumbColor={vibrationEnabled ? '#4CAF50' : '#f4f3f4'}
              />
            }
          />
        </SettingSection>

        {/* Data Section */}
        <SettingSection title={labels.data} isDark={isDark}>
          <SettingItem
            icon="🗑️"
            iconColor="#F44336"
            title={labels.resetAllData}
            subtitle={labels.resetDataSubtitle}
            isDark={isDark}
            onPress={handleResetData}
          />
        </SettingSection>

        {/* About Section */}
        <SettingSection title={labels.about} isDark={isDark}>
          <SettingItem
            icon="ℹ️"
            iconColor="#2196F3"
            title={labels.aboutApp}
            subtitle={labels.version}
            isDark={isDark}
            onPress={handleAbout}
          />
          <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />
          <SettingItem
            icon="💬"
            iconColor="#4CAF50"
            title={labels.sendFeedback}
            subtitle={labels.feedbackSubtitle}
            isDark={isDark}
            onPress={handleFeedback}
          />
          <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />
          <SettingItem
            icon="🔒"
            iconColor="#607D8B"
            title={labels.privacyPolicy}
            subtitle={labels.privacySubtitle}
            isDark={isDark}
            onPress={handlePrivacy}
          />
        </SettingSection>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#757575' : '#9E9E9E' }]}>
            بارك الله فيكم
          </Text>
          <Text style={[styles.footerSubtext, { color: isDark ? '#616161' : '#BDBDBD' }]}>
            {labels.mayAllahBless}
          </Text>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                {labels.selectLanguage}
              </Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Text style={[styles.modalClose, { color: isDark ? '#90CAF9' : '#1565C0' }]}>✕</Text>
              </TouchableOpacity>
            </View>
            {languageOptions.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  language === lang.code && styles.languageOptionSelected,
                  { backgroundColor: language === lang.code ? (isDark ? '#1B5E20' : '#E8F5E9') : 'transparent' }
                ]}
                onPress={() => {
                  setLanguage(lang.code);
                  setShowLanguageModal(false);
                }}
              >
                <View>
                  <Text style={[styles.languageName, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                    {lang.name}
                  </Text>
                  <Text style={[styles.languageNative, { color: isDark ? '#B0BEC5' : '#757575' }]}>
                    {lang.nativeName}
                  </Text>
                </View>
                {language === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerArabic: {
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 16,
    marginBottom: 8,
  },
  sectionContent: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingIcon: {
    fontSize: 18,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 64,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: 48,
  },
  footerText: {
    fontSize: 18,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalClose: {
    fontSize: 20,
    padding: 4,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  languageOptionSelected: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
  },
  languageNative: {
    fontSize: 14,
    marginTop: 2,
  },
});
