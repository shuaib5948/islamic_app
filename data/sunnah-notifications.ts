/**
 * Sunnah Notifications Data
 * Contains all Sunnah fasting and practice notifications
 */

export interface SunnahNotificationData {
  id: string;
  title: string;
  message: string;
  hadith: {
    text: string;
    source: string;
  };
}

export interface SpecialDayNotification {
  month: number;
  day: number;
  title: string;
  message: string;
}

// Monday and Thursday Sunnah fasting notifications
export const MONDAY_THURSDAY_NOTIFICATIONS: SunnahNotificationData[] = [
  {
    id: 'sunnah-monday',
    title: 'Monday Sunnah Fasting',
    message: 'Today is Monday, a blessed day for Sunnah fasting. Tap to read the Hadith.',
    hadith: {
      text: 'Fasting on Monday and Thursday is expiation for the sins of the previous week.',
      source: 'Sunan al-Tirmidhi'
    }
  },
  {
    id: 'sunnah-thursday',
    title: 'Thursday Sunnah Fasting',
    message: 'Today is Thursday, a blessed day for Sunnah fasting. Tap to read the Hadith.',
    hadith: {
      text: 'Fasting on Monday and Thursday is expiation for the sins of the previous week.',
      source: 'Sunan al-Tirmidhi'
    }
  }
];

// Friday Sunnah practices notification
export const FRIDAY_NOTIFICATION: SunnahNotificationData = {
  id: 'sunnah-friday',
  title: 'Friday Sunnah Practices',
  message: 'Prepare for Jumu\'ah with special Friday Sunnah: recite Surah Al-Kahf, perform Ghusl, wear clean clothes. Tap to read the Hadith.',
  hadith: {
    text: 'Whoever performs Ghusl on Friday, applies the best perfume, wears his best clothes, then goes to the mosque and sits without speaking evil, he will have forgiveness between that Friday and the next.',
    source: 'Sunan al-Tirmidhi'
  }
};

// Ramadan notifications
export const RAMADAN_NOTIFICATIONS: SunnahNotificationData[] = [
  {
    id: 'sunnah-ramadan',
    title: 'Ramadan Sunnah Prayers',
    message: 'This blessed month is perfect for extra Sunnah prayers like Taraweeh. Tap to read the Hadith.',
    hadith: {
      text: 'Whoever stands in prayer during Ramadan out of faith and hope for reward, his previous sins will be forgiven.',
      source: 'Sahih al-Bukhari'
    }
  },
  {
    id: 'sunnah-lailatul-qadr',
    title: 'Last 10 Nights of Ramadan',
    message: 'These are the most blessed nights for worship and night prayers. Tap to read the Quranic verse.',
    hadith: {
      text: 'The Night of Decree is better than a thousand months.',
      source: 'Quran 97:3'
    }
  }
];

// Islamic special days notifications
export const ISLAMIC_SPECIAL_DAYS: SpecialDayNotification[] = [
  {
    month: 1,
    day: 1,
    title: 'Islamic New Year',
    message: 'The start of a new Islamic year. Renew your intentions and increase in good deeds.'
  },
  {
    month: 3,
    day: 12,
    title: 'Birthday of Prophet Muhammad ﷺ',
    message: 'Celebrate the birth of the Prophet Muhammad ﷺ. Send blessings upon him and follow his Sunnah.'
  },
  {
    month: 7,
    day: 27,
    title: 'Isra and Mi\'raj',
    message: 'Remember the miraculous journey of the Prophet Muhammad ﷺ. Increase in night prayers and remembrance of Allah.'
  },
  {
    month: 8,
    day: 15,
    title: 'Eid al-Adha',
    message: 'The festival of sacrifice. Perform extra Sunnah prayers and increase in charity and worship.'
  },
  {
    month: 10,
    day: 1,
    title: 'Ashura',
    message: 'A blessed day for fasting and Sunnah prayers. The Prophet Muhammad ﷺ recommended fasting on this day.'
  },
  {
    month: 12,
    day: 10,
    title: 'Day of Arafah',
    message: 'The best day for worship. Fast if able and perform extra Sunnah prayers.'
  }
];

// Prayer notification templates
export const PRAYER_NOTIFICATIONS = {
  missed: {
    title: 'Missed {prayerName} Prayer',
    message: 'You haven\'t completed your {prayerName} prayer yet. Try to make it up as soon as possible. "Indeed, prayer has been decreed upon the believers a decree of specified times." (Quran 4:103)',
  },
  upcoming: {
    title: '{prayerName} Prayer Time',
    message: 'It\'s almost time for {prayerName} prayer at {prayerTime}. Prepare yourself for worship.',
  }
};

// Sample/Test notifications for development
export const SAMPLE_NOTIFICATIONS = [
  {
    id: 'sample-test-notification',
    title: 'Test Islamic Event',
    message: 'This is a sample notification for testing. Ramadan begins tomorrow - prepare for this blessed month with increased worship and recitation of Quran.',
    time: 'Just now',
    read: false,
    type: 'event' as const,
  }
];

// Event notification templates based on event type
export const EVENT_NOTIFICATION_TEMPLATES = {
  wafat: {
    message: 'Remember {eventTitle}. Recite Fatiha for their soul. May Allah grant them the highest place in Jannah. إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ'
  },
  religious: {
    message: '{eventTitle} is today. Increase your worship and seek Allah\'s blessings on this blessed day.'
  },
  birth: {
    message: 'Celebrate {eventTitle} today. May Allah bless their life and teachings.'
  },
  historic: {
    message: '{eventTitle} - reflect on this significant day in Islamic history and increase in good deeds.'
  },
  default: {
    message: '{eventDescription}'
  }
};