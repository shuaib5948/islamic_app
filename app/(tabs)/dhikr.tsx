

import { useLanguage } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ADHKAR_COLLECTIONS, SECTIONS } from '../../data/adhkar-collections';

// Type for AdhkarCollection
type AdhkarCollection = {
  id: string;
  sectionId: string;
  icon?: string;
  color: string;
  title: string;
  titleMl: string;
  titleArabic: string;
  content: string[];
  meaningMl?: string;
  virtuesMl?: string[];
  sourceMl?: string;
};


const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Adhkar List Item Component
interface AdhkarListItemProps {
  adhkar: AdhkarCollection;
  onPress: () => void;
  isDark: boolean;
  isMalayalam: boolean;
}

function AdhkarListItem({ adhkar, onPress, isDark, isMalayalam }: AdhkarListItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.listItem, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}
    >
      <View style={[styles.iconContainer, { backgroundColor: adhkar.color + '20' }]}> 
        <Text style={styles.adhkarIcon}>{adhkar.icon}</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={[styles.adhkarTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}> 
          {isMalayalam ? adhkar.titleMl : adhkar.title}
        </Text>
        <Text style={[styles.adhkarTitleArabic, { color: isDark ? '#B0BEC5' : '#757575' }]}> 
          {adhkar.titleArabic}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={isDark ? '#B0BEC5' : '#757575'} />
    </TouchableOpacity>
  );
}

// Section Card Component
interface SectionCardProps {
  section: typeof SECTIONS[number];
  isDark: boolean;
  isMalayalam: boolean;
  onPress: () => void;
}

function SectionCard({ section, isDark, isMalayalam, onPress }: SectionCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.sectionBox, { backgroundColor: isDark ? '#23272F' : '#FFF8E1', borderColor: isDark ? '#FFD60033' : '#FFD600' }]}
    >
      <Text style={[styles.sectionBoxTitle, { color: isDark ? '#FFD600' : '#4E342E' }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {isMalayalam ? section.titleMl : section.title}
      </Text>
      <View style={styles.sectionBoxIconWrap}>
        <Ionicons name="chevron-forward" size={24} color={isDark ? '#FFD600' : '#4E342E'} />
      </View>
    </TouchableOpacity>
  );
}

// Modal Content Component
interface AdhkarModalProps {
  visible: boolean;
  adhkar: AdhkarCollection | null;
  onClose: () => void;
  isDark: boolean;
  isMalayalam: boolean;
}


function AdhkarModal({ visible, adhkar, onClose, isDark, isMalayalam }: AdhkarModalProps) {
  const [infoVisible, setInfoVisible] = useState(false);
  if (!adhkar) return null;

  const hasInfo = adhkar.meaningMl || adhkar.virtuesMl || adhkar.sourceMl;

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}> 
          {/* Modal Header - Single Line */}
          <View style={[styles.modalHeader, { backgroundColor: adhkar.color }]}> 
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {isMalayalam ? adhkar.titleMl : adhkar.title}
            </Text>
            {hasInfo ? (
              <TouchableOpacity onPress={() => setInfoVisible(true)} style={styles.infoIconButton}>
                <Ionicons name="information-circle-outline" size={26} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <View style={styles.closeButton} />
            )}
          </View>

          {/* Arabic Content */}
          <ScrollView 
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={true}
          >
            {adhkar.content.map((line, index) => (
              <Text 
                key={index} 
                style={[styles.arabicLine, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
              >
                {line}
              </Text>
            ))}
            <View style={{ height: 50 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Info Modal */}
      <Modal
        visible={infoVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setInfoVisible(false)}
      >
        <View style={styles.infoModalOverlay}>
          <View style={[styles.infoModalBox, { backgroundColor: isDark ? '#23272F' : '#FFFDE7' }]}> 
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={[styles.infoModalTitle, { color: isDark ? '#FFD600' : '#4E342E' }]}> 
                {isMalayalam ? adhkar.titleMl : adhkar.title}
              </Text>
              <TouchableOpacity onPress={() => setInfoVisible(false)}>
                <Ionicons name="close" size={26} color={isDark ? '#FFD600' : '#4E342E'} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: SCREEN_HEIGHT * 0.5 }}>
              {adhkar.meaningMl && (
                <View style={{ marginBottom: 14 }}>
                  <Text style={[styles.infoLabel, { color: isDark ? '#FFD600' : '#4E342E' }]}>{isMalayalam ? 'അർത്ഥം' : 'Meaning'}</Text>
                  <Text style={[styles.infoTextBlock, { color: isDark ? '#FFFFFF' : '#333' }]}>{adhkar.meaningMl}</Text>
                </View>
              )}
              {adhkar.virtuesMl && adhkar.virtuesMl.length > 0 && (
                <View style={{ marginBottom: 14 }}>
                  <Text style={[styles.infoLabel, { color: isDark ? '#FFD600' : '#4E342E' }]}>{isMalayalam ? 'ഫലങ്ങൾ' : 'Virtues'}</Text>
                  {adhkar.virtuesMl.map((v, i) => (
                    <Text key={i} style={[styles.infoTextBlock, { color: isDark ? '#FFFFFF' : '#333', marginLeft: 8 }]}>• {v}</Text>
                  ))}
                </View>
              )}
              {adhkar.sourceMl && (
                <View style={{ marginBottom: 6 }}>
                  <Text style={[styles.infoLabel, { color: isDark ? '#FFD600' : '#4E342E' }]}>{isMalayalam ? 'ഉറവിടം' : 'Source'}</Text>
                  <Text style={[styles.infoTextBlock, { color: isDark ? '#FFFFFF' : '#333' }]}>{adhkar.sourceMl}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default function DhikrScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language } = useLanguage();
  const isMalayalam = language === 'ml';


  // State for selected adhkar (for adhkar modal)
  const [selectedAdhkar, setSelectedAdhkar] = useState<AdhkarCollection | null>(null);
  const [adhkarModalVisible, setAdhkarModalVisible] = useState(false);

  // State for selected section (for section modal)
  const [selectedSection, setSelectedSection] = useState<typeof SECTIONS[number] | null>(null);
  const [sectionModalVisible, setSectionModalVisible] = useState(false);

  const labels = {
    title: isMalayalam ? 'അദ്കാർ & അവ്‌റാദ്' : 'Adhkar & Awrad',
    subtitle: 'الأذكار والأوراد',
    selectToRead: isMalayalam ? 'വായിക്കാൻ ടാപ്പ് ചെയ്യുക' : 'Tap to read',
  };


  const handleOpenAdhkarModal = (adhkar: AdhkarCollection) => {
    setSelectedAdhkar(adhkar);
    setAdhkarModalVisible(true);
  };

  const handleCloseAdhkarModal = () => {
    setAdhkarModalVisible(false);
    setSelectedAdhkar(null);
  };

  const handleOpenSectionModal = (section: typeof SECTIONS[number]) => {
    setSelectedSection(section);
    setSectionModalVisible(true);
  };

  const handleCloseSectionModal = () => {
    setSectionModalVisible(false);
    setSelectedSection(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#1A1A1A'} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            📿 {labels.title}
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>
            {labels.subtitle}
          </Text>
        </View>
      </View>

      {/* Info Card */}
      <View style={[styles.infoCard, { backgroundColor: isDark ? '#1B5E20' : '#E8F5E9' }]}>
        <Ionicons name="information-circle" size={20} color={isDark ? '#81C784' : '#2E7D32'} />
        <Text style={[styles.infoText, { color: isDark ? '#81C784' : '#2E7D32' }]}>
          {labels.selectToRead}
        </Text>
      </View>


      {/* Section Cards List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionBoxGrid}>
          {SECTIONS.filter(section => section.itemIds.length > 0).map(section => (
            <SectionCard
              key={section.id}
              section={section}
              isDark={isDark}
              isMalayalam={isMalayalam}
              onPress={() => handleOpenSectionModal(section)}
            />
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Section Modal: List of Adhkar in Section */}
      <Modal
        visible={sectionModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseSectionModal}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}> 
          <View style={[styles.modalHeader, { backgroundColor: isDark ? '#263238' : '#FFD600' }]}> 
            <TouchableOpacity onPress={handleCloseSectionModal} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={isDark ? '#FFD600' : '#4E342E'} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFD600' : '#4E342E' }]}> 
              {selectedSection ? (isMalayalam ? selectedSection.titleMl : selectedSection.title) : ''}
            </Text>
            <View style={styles.closeButton} />
          </View>
          <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalScrollContent}>
            {selectedSection && selectedSection.itemIds
              .map(id => ADHKAR_COLLECTIONS.find(a => a.id === id))
              .filter(a => a !== undefined)
              .map((adhkar) => (
                <AdhkarListItem
                  key={adhkar.id}
                  adhkar={adhkar}
                  onPress={() => {
                    handleCloseSectionModal();
                    setTimeout(() => handleOpenAdhkarModal(adhkar), 300);
                  }}
                  isDark={isDark}
                  isMalayalam={isMalayalam}
                />
              ))}
            <View style={{ height: 50 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Adhkar Modal */}
      <AdhkarModal
        visible={adhkarModalVisible}
        adhkar={selectedAdhkar}
        onClose={handleCloseAdhkarModal}
        isDark={isDark}
        isMalayalam={isMalayalam}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  infoIconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  infoModalBox: {
    width: '100%',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  infoModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  infoTextBlock: {
    fontSize: 15,
    marginBottom: 4,
    lineHeight: 22,
  },
  sectionBoxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionBox: {
    flexBasis: '48%',
    maxWidth: '48%',
    aspectRatio: 1.1,
    minHeight: 110,
    marginBottom: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    padding: 12,
  },
  sectionBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.1,
    flexShrink: 1,
  },
  sectionBoxIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    marginLeft: 2,
    marginTop: 16,
    letterSpacing: 0.2,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  // List Item Styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adhkarIcon: {
    fontSize: 24,
  },
  titleContainer: {
    flex: 1,
  },
  adhkarTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  adhkarTitleArabic: {
    fontSize: 14,
    marginTop: 2,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
  },
  arabicLine: {
    fontSize: 26,
    lineHeight: 52,
    textAlign: 'center',
    marginBottom: 16,
  },
});
