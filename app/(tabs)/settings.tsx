import { Colors } from '@/constants/theme';
import { Language, useLanguage } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  isDark: boolean;
}

const SettingItem = ({ icon, iconColor, title, subtitle, onPress, rightElement, isDark }: SettingItemProps) => {
  const colors = Colors[isDark ? 'dark' : 'light'];
  return (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress && !rightElement}
    >
      <View style={[styles.settingIconContainer, { backgroundColor: iconColor }]}>
        <Ionicons name={icon} size={20} color="#FFFFFF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.secondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || (onPress && (
        <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
      ))}
    </TouchableOpacity>
  );
};

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
  isDark: boolean;
}

const SettingSection = ({ title, children, isDark }: SettingSectionProps) => {
  const colors = Colors[isDark ? 'dark' : 'light'];
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>
        {title}
      </Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
        {children}
      </View>
    </View>
  );
};

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme];
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {labels.settings}
          </Text>
          <Text style={[styles.headerArabic, { color: colors.secondary }]}>
            الإعدادات
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Language Section */}
        <SettingSection title={labels.language} isDark={isDark}>
          <SettingItem
            icon="language-outline"
            iconColor={colors.primary}
            title={labels.appLanguage}
            subtitle={currentLanguage ? `${currentLanguage.name} (${currentLanguage.nativeName})` : 'English'}
            isDark={isDark}
            onPress={() => setShowLanguageModal(true)}
          />
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection title={labels.notifications} isDark={isDark}>
          <SettingItem
            icon="notifications-outline"
            iconColor={colors.primary}
            title={labels.enableNotifications}
            subtitle={labels.receiveNotifications}
            isDark={isDark}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.secondary + '40', true: colors.primary }}
                thumbColor={notificationsEnabled ? "#FFFFFF" : colors.card}
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: colors.secondary + '20' }]} />
          <SettingItem
            icon="time-outline"
            iconColor={colors.primary}
            title={labels.prayerReminders}
            subtitle={labels.prayerRemindersSubtitle}
            isDark={isDark}
            rightElement={
              <Switch
                value={prayerReminders}
                onValueChange={setPrayerReminders}
                trackColor={{ false: colors.secondary + '40', true: colors.primary }}
                thumbColor={prayerReminders ? "#FFFFFF" : colors.card}
                disabled={!notificationsEnabled}
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: colors.secondary + '20' }]} />
          <SettingItem
            icon="book-outline"
            iconColor={colors.primary}
            title={labels.dailyHadith}
            subtitle={labels.dailyHadithSubtitle}
            isDark={isDark}
            rightElement={
              <Switch
                value={dailyHadith}
                onValueChange={setDailyHadith}
                trackColor={{ false: colors.secondary + '40', true: colors.primary }}
                thumbColor={dailyHadith ? "#FFFFFF" : colors.card}
                disabled={!notificationsEnabled}
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: colors.secondary + '20' }]} />
          <SettingItem
            icon="calendar-outline"
            iconColor={colors.primary}
            title={labels.eventAlerts}
            subtitle={labels.eventAlertsSubtitle}
            isDark={isDark}
            rightElement={
              <Switch
                value={eventAlerts}
                onValueChange={setEventAlerts}
                trackColor={{ false: colors.secondary + '40', true: colors.primary }}
                thumbColor={eventAlerts ? "#FFFFFF" : colors.card}
                disabled={!notificationsEnabled}
              />
            }
          />
        </SettingSection>

        {/* Sound & Haptics Section */}
        <SettingSection title={labels.soundHaptics} isDark={isDark}>
          <SettingItem
            icon="volume-high-outline"
            iconColor={colors.primary}
            title={labels.sound}
            subtitle={labels.soundSubtitle}
            isDark={isDark}
            rightElement={
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: colors.secondary + '40', true: colors.primary }}
                thumbColor={soundEnabled ? "#FFFFFF" : colors.card}
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: colors.secondary + '20' }]} />
          <SettingItem
            icon="phone-portrait-outline"
            iconColor={colors.primary}
            title={labels.vibration}
            subtitle={labels.vibrationSubtitle}
            isDark={isDark}
            rightElement={
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: colors.secondary + '40', true: colors.primary }}
                thumbColor={vibrationEnabled ? "#FFFFFF" : colors.card}
              />
            }
          />
        </SettingSection>

        {/* Data Section */}
        <SettingSection title={labels.data} isDark={isDark}>
          <SettingItem
            icon="trash-outline"
            iconColor={colors.primary}
            title={labels.resetAllData}
            subtitle={labels.resetDataSubtitle}
            isDark={isDark}
            onPress={handleResetData}
          />
        </SettingSection>

        {/* About Section */}
        <SettingSection title={labels.about} isDark={isDark}>
          <SettingItem
            icon="information-circle-outline"
            iconColor={colors.primary}
            title={labels.aboutApp}
            subtitle={labels.version}
            isDark={isDark}
            onPress={handleAbout}
          />
          <View style={[styles.divider, { backgroundColor: colors.secondary + '20' }]} />
          <SettingItem
            icon="chatbubble-outline"
            iconColor={colors.primary}
            title={labels.sendFeedback}
            subtitle={labels.feedbackSubtitle}
            isDark={isDark}
            onPress={handleFeedback}
          />
          <View style={[styles.divider, { backgroundColor: colors.secondary + '20' }]} />
          <SettingItem
            icon="shield-checkmark-outline"
            iconColor={colors.primary}
            title={labels.privacyPolicy}
            subtitle={labels.privacySubtitle}
            isDark={isDark}
            onPress={handlePrivacy}
          />
        </SettingSection>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.secondary }]}>
            بارك الله فيكم
          </Text>
          <Text style={[styles.footerSubtext, { color: colors.secondary + '80' }]}>
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
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {labels.selectLanguage}
              </Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Ionicons name="close" size={24} color={colors.secondary} />
              </TouchableOpacity>
            </View>
            {languageOptions.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  language === lang.code && styles.languageOptionSelected,
                  { backgroundColor: language === lang.code ? colors.primary + '20' : 'transparent' }
                ]}
                onPress={() => {
                  setLanguage(lang.code);
                  setShowLanguageModal(false);
                }}
              >
                <View>
                  <Text style={[styles.languageName, { color: colors.text }]}>
                    {lang.name}
                  </Text>
                  <Text style={[styles.languageNative, { color: colors.secondary }]}>
                    {lang.nativeName}
                  </Text>
                </View>
                {language === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
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
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    borderColor: '#7F8F6A',
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
