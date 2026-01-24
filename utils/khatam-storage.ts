import { JuzAssignment, KhatamGroup, generateId } from '@/data/quran-khatam';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'khatam_groups';

// Load all khatam groups from storage
export const loadKhatamGroups = async (): Promise<KhatamGroup[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading khatam groups:', error);
    return [];
  }
};

// Save all khatam groups to storage
export const saveKhatamGroups = async (groups: KhatamGroup[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch (error) {
    console.error('Error saving khatam groups:', error);
  }
};

// Create a new khatam group
export const createKhatamGroup = async (
  name: string,
  description: string,
  targetDate: string,
  dedication?: string
): Promise<KhatamGroup> => {
  const groups = await loadKhatamGroups();
  
  // Generate unique 4-digit join code
  let joinCode: string;
  do {
    joinCode = Math.floor(1000 + Math.random() * 9000).toString();
  } while (groups.some(g => g.joinCode === joinCode));
  
  const newGroup: KhatamGroup = {
    id: generateId(),
    name,
    description,
    createdDate: new Date().toISOString(),
    targetDate,
    assignments: [],
    isCompleted: false,
    dedication,
    joinCode,
  };
  
  groups.push(newGroup);
  await saveKhatamGroups(groups);
  
  return newGroup;
};

// Delete a khatam group
export const deleteKhatamGroup = async (groupId: string): Promise<void> => {
  const groups = await loadKhatamGroups();
  const filteredGroups = groups.filter(g => g.id !== groupId);
  await saveKhatamGroups(filteredGroups);
};

// Assign a Juz to a participant
export const assignJuz = async (
  groupId: string,
  juzNumber: number,
  participantName: string
): Promise<JuzAssignment | null> => {
  const groups = await loadKhatamGroups();
  const groupIndex = groups.findIndex(g => g.id === groupId);
  
  if (groupIndex === -1) return null;
  
  // Check if Juz is already assigned
  const existingAssignment = groups[groupIndex].assignments.find(
    a => a.juzNumber === juzNumber
  );
  if (existingAssignment) return null;
  
  const assignment: JuzAssignment = {
    juzNumber,
    participantName,
    participantId: generateId(),
    isCompleted: false,
    assignedDate: new Date().toISOString(),
  };
  
  groups[groupIndex].assignments.push(assignment);
  await saveKhatamGroups(groups);
  
  return assignment;
};

// Remove a Juz assignment
export const removeAssignment = async (
  groupId: string,
  juzNumber: number
): Promise<void> => {
  const groups = await loadKhatamGroups();
  const groupIndex = groups.findIndex(g => g.id === groupId);
  
  if (groupIndex === -1) return;
  
  groups[groupIndex].assignments = groups[groupIndex].assignments.filter(
    a => a.juzNumber !== juzNumber
  );
  await saveKhatamGroups(groups);
};

// Mark a Juz as completed
export const markJuzCompleted = async (
  groupId: string,
  juzNumber: number
): Promise<void> => {
  const groups = await loadKhatamGroups();
  const groupIndex = groups.findIndex(g => g.id === groupId);
  
  if (groupIndex === -1) return;
  
  const assignmentIndex = groups[groupIndex].assignments.findIndex(
    a => a.juzNumber === juzNumber
  );
  
  if (assignmentIndex === -1) return;
  
  groups[groupIndex].assignments[assignmentIndex].isCompleted = true;
  groups[groupIndex].assignments[assignmentIndex].completedDate = new Date().toISOString();
  
  // Check if all 30 Juz are completed
  const completedCount = groups[groupIndex].assignments.filter(a => a.isCompleted).length;
  if (completedCount === 30) {
    groups[groupIndex].isCompleted = true;
    groups[groupIndex].completedDate = new Date().toISOString();
  }
  
  await saveKhatamGroups(groups);
};

// Mark a Juz as incomplete
export const markJuzIncomplete = async (
  groupId: string,
  juzNumber: number
): Promise<void> => {
  const groups = await loadKhatamGroups();
  const groupIndex = groups.findIndex(g => g.id === groupId);
  
  if (groupIndex === -1) return;
  
  const assignmentIndex = groups[groupIndex].assignments.findIndex(
    a => a.juzNumber === juzNumber
  );
  
  if (assignmentIndex === -1) return;
  
  groups[groupIndex].assignments[assignmentIndex].isCompleted = false;
  groups[groupIndex].assignments[assignmentIndex].completedDate = undefined;
  groups[groupIndex].isCompleted = false;
  groups[groupIndex].completedDate = undefined;
  
  await saveKhatamGroups(groups);
};

// Get a specific khatam group
export const getKhatamGroup = async (groupId: string): Promise<KhatamGroup | null> => {
  const groups = await loadKhatamGroups();
  return groups.find(g => g.id === groupId) || null;
};

// Update khatam group details
export const updateKhatamGroup = async (
  groupId: string,
  updates: Partial<Pick<KhatamGroup, 'name' | 'description' | 'targetDate' | 'dedication'>>
): Promise<void> => {
  const groups = await loadKhatamGroups();
  const groupIndex = groups.findIndex(g => g.id === groupId);
  
  if (groupIndex === -1) return;
  
  groups[groupIndex] = { ...groups[groupIndex], ...updates };
  await saveKhatamGroups(groups);
};

// Check for reminders (groups approaching deadline with incomplete assignments)
export const getReminders = async (): Promise<{ group: KhatamGroup; daysLeft: number; incompleteCount: number }[]> => {
  const groups = await loadKhatamGroups();
  const reminders: { group: KhatamGroup; daysLeft: number; incompleteCount: number }[] = [];
  
  const today = new Date();
  
  for (const group of groups) {
    if (group.isCompleted) continue;
    
    const targetDate = new Date(group.targetDate);
    const daysLeft = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const incompleteCount = 30 - group.assignments.filter(a => a.isCompleted).length;
    
    // Remind if less than 7 days left and there are incomplete assignments
    if (daysLeft <= 7 && incompleteCount > 0) {
      reminders.push({ group, daysLeft, incompleteCount });
    }
  }
  
  return reminders;
};
